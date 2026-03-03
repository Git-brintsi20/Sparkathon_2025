const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VendorCompliance", function () {
  let vendorCompliance;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const VendorCompliance = await ethers.getContractFactory("VendorCompliance");
    vendorCompliance = await VendorCompliance.deploy();
    await vendorCompliance.waitForDeployment();
  });

  // ─── Registration ───────────────────────────────────────

  describe("Vendor Registration", function () {
    it("should register a new vendor", async function () {
      const tx = await vendorCompliance.registerVendor(
        "Acme Supplies",
        "acme@supplier.com",
        addr1.address,
        ["ISO9001"]
      );

      const receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === "VendorRegistered");
      expect(event).to.not.be.undefined;

      const vendorId = event.args.vendorId;
      const vendor = await vendorCompliance.getVendor(vendorId);
      expect(vendor.name).to.equal("Acme Supplies");
      expect(vendor.email).to.equal("acme@supplier.com");
      expect(vendor.walletAddress).to.equal(addr1.address);
      expect(vendor.complianceScore).to.equal(100);
      expect(vendor.isActive).to.be.true;
    });

    it("should reject empty name", async function () {
      await expect(
        vendorCompliance.registerVendor("", "e@e.com", addr1.address, [])
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("should reject empty email", async function () {
      await expect(
        vendorCompliance.registerVendor("X", "", addr1.address, [])
      ).to.be.revertedWith("Email cannot be empty");
    });

    it("should reject zero address", async function () {
      await expect(
        vendorCompliance.registerVendor("X", "e@e.com", ethers.constants.AddressZero, [])
      ).to.be.revertedWith("Invalid wallet address");
    });

    it("should reject duplicate wallet address", async function () {
      await vendorCompliance.registerVendor("A", "a@a.com", addr1.address, []);
      await expect(
        vendorCompliance.registerVendor("B", "b@b.com", addr1.address, [])
      ).to.be.revertedWith("Vendor already exists");
    });

    it("should only allow owner to register", async function () {
      await expect(
        vendorCompliance.connect(addr1).registerVendor("X", "x@x.com", addr2.address, [])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // ─── Compliance Score ───────────────────────────────────

  describe("Compliance Score", function () {
    let vendorId;

    beforeEach(async function () {
      const tx = await vendorCompliance.registerVendor(
        "TestCo",
        "test@co.com",
        addr1.address,
        []
      );
      const receipt = await tx.wait();
      vendorId = receipt.events.find((e) => e.event === "VendorRegistered").args.vendorId;
    });

    it("should update compliance score", async function () {
      await vendorCompliance.updateComplianceScore(vendorId, 75, "Quality audit");
      const vendor = await vendorCompliance.getVendor(vendorId);
      expect(vendor.complianceScore).to.equal(75);
    });

    it("should reject score > 100", async function () {
      await expect(
        vendorCompliance.updateComplianceScore(vendorId, 101, "bad")
      ).to.be.revertedWith("Score cannot exceed 100");
    });

    it("should reject empty reason", async function () {
      await expect(
        vendorCompliance.updateComplianceScore(vendorId, 50, "")
      ).to.be.revertedWith("Reason cannot be empty");
    });

    it("should set correct compliance level", async function () {
      // HIGH >= 90
      await vendorCompliance.updateComplianceScore(vendorId, 95, "excellent");
      let v = await vendorCompliance.getVendor(vendorId);
      expect(v.complianceLevel).to.equal(3); // HIGH

      // MEDIUM >= 70
      await vendorCompliance.updateComplianceScore(vendorId, 75, "ok");
      v = await vendorCompliance.getVendor(vendorId);
      expect(v.complianceLevel).to.equal(2); // MEDIUM

      // LOW >= 50
      await vendorCompliance.updateComplianceScore(vendorId, 55, "needs work");
      v = await vendorCompliance.getVendor(vendorId);
      expect(v.complianceLevel).to.equal(1); // LOW

      // CRITICAL < 50
      await vendorCompliance.updateComplianceScore(vendorId, 30, "critical failure");
      v = await vendorCompliance.getVendor(vendorId);
      expect(v.complianceLevel).to.equal(4); // CRITICAL
    });

    it("should record compliance history", async function () {
      await vendorCompliance.updateComplianceScore(vendorId, 80, "review 1");
      await vendorCompliance.updateComplianceScore(vendorId, 60, "review 2");

      const history = await vendorCompliance.getVendorComplianceHistory(vendorId);
      // initial + 2 updates
      expect(history.length).to.equal(3);
      expect(history[1].score).to.equal(80);
      expect(history[2].score).to.equal(60);
    });
  });

  // ─── Disputes ───────────────────────────────────────────

  describe("Disputes", function () {
    let vendorId;

    beforeEach(async function () {
      const tx = await vendorCompliance.registerVendor("D", "d@d.com", addr1.address, []);
      const receipt = await tx.wait();
      vendorId = receipt.events.find((e) => e.event === "VendorRegistered").args.vendorId;
    });

    it("should create a dispute", async function () {
      const tx = await vendorCompliance.connect(addr1).createDispute(
        vendorId,
        "Late delivery",
        "Order PO-100 was 3 days late"
      );
      const receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === "DisputeCreated");
      expect(event).to.not.be.undefined;
    });

    it("should resolve a dispute", async function () {
      const createTx = await vendorCompliance.createDispute(
        vendorId,
        "Quality issue",
        "Received damaged goods"
      );
      const createReceipt = await createTx.wait();
      const disputeId = createReceipt.events.find((e) => e.event === "DisputeCreated").args.disputeId;

      await vendorCompliance.resolveDispute(
        disputeId,
        2, // RESOLVED
        "Vendor agreed to 10% credit"
      );

      const disputes = await vendorCompliance.getVendorDisputes(vendorId);
      const resolved = disputes.find((d) => d.id.eq(disputeId));
      expect(resolved.status).to.equal(2); // RESOLVED
    });
  });

  // ─── Activation / Deactivation ──────────────────────────

  describe("Vendor Activation", function () {
    let vendorId;

    beforeEach(async function () {
      const tx = await vendorCompliance.registerVendor("E", "e@e.com", addr1.address, []);
      const receipt = await tx.wait();
      vendorId = receipt.events.find((e) => e.event === "VendorRegistered").args.vendorId;
    });

    it("should deactivate a vendor", async function () {
      await vendorCompliance.deactivateVendor(vendorId);
      const v = await vendorCompliance.getVendor(vendorId);
      expect(v.isActive).to.be.false;
    });

    it("should reactivate a vendor", async function () {
      await vendorCompliance.deactivateVendor(vendorId);
      await vendorCompliance.reactivateVendor(vendorId);
      const v = await vendorCompliance.getVendor(vendorId);
      expect(v.isActive).to.be.true;
    });

    it("should reject compliance update on deactivated vendor", async function () {
      await vendorCompliance.deactivateVendor(vendorId);
      await expect(
        vendorCompliance.updateComplianceScore(vendorId, 50, "test")
      ).to.be.revertedWith("Vendor is not active");
    });
  });

  // ─── View helpers ───────────────────────────────────────

  describe("View functions", function () {
    it("should return all vendor IDs", async function () {
      await vendorCompliance.registerVendor("A", "a@a.com", addr1.address, []);
      await vendorCompliance.registerVendor("B", "b@b.com", addr2.address, []);

      const ids = await vendorCompliance.getAllVendorIds();
      expect(ids.length).to.equal(2);
    });

    it("should look up vendor by address", async function () {
      await vendorCompliance.registerVendor("A", "a@a.com", addr1.address, []);
      const id = await vendorCompliance.getVendorByAddress(addr1.address);
      expect(id).to.be.gt(0);
    });

    it("should return total vendor count", async function () {
      await vendorCompliance.registerVendor("A", "a@a.com", addr1.address, []);
      const count = await vendorCompliance.getTotalVendors();
      expect(count).to.equal(1);
    });
  });
});
