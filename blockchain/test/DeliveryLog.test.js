const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeliveryLog", function () {
  let deliveryLog;
  let owner, addr1;
  const TOMORROW = () => Math.floor(Date.now() / 1000) + 86400;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DeliveryLog = await ethers.getContractFactory("DeliveryLog");
    deliveryLog = await DeliveryLog.deploy();
    await deliveryLog.waitForDeployment();
  });

  // Helper: create delivery and return its ID
  async function createAndGetId(vendorId, poId, tracking, extras = {}) {
    const tx = await deliveryLog.createDelivery(
      vendorId,
      poId,
      tracking,
      extras.expected || TOMORROW(),
      extras.location || "Warehouse A",
      extras.items || ["Item x1"],
      extras.value || 100,
      extras.notes || ""
    );
    const receipt = await tx.wait();
    const log = receipt.logs.find((l) => {
      try { return deliveryLog.interface.parseLog(l)?.name === "DeliveryCreated"; } catch { return false; }
    });
    return deliveryLog.interface.parseLog(log).args.deliveryId;
  }

  // ─── Creation ───────────────────────────────────────────

  describe("Delivery Creation", function () {
    it("should create a delivery", async function () {
      const deliveryId = await createAndGetId(1, "PO-001", "TRK-001", {
        items: ["Apples x100", "Oranges x200"],
        value: 5000,
        notes: "Fragile",
      });

      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.purchaseOrderId).to.equal("PO-001");
      expect(d.trackingNumber).to.equal("TRK-001");
      expect(d.totalValue).to.equal(5000n);
      expect(d.status).to.equal(0n); // PENDING
      expect(d.verificationStatus).to.equal(0n); // UNVERIFIED
    });

    it("should reject empty PO ID", async function () {
      await expect(
        deliveryLog.createDelivery(1, "", "TRK-X", TOMORROW(), "A", [], 0, "")
      ).to.be.revertedWith("Purchase Order ID cannot be empty");
    });

    it("should reject empty tracking number", async function () {
      await expect(
        deliveryLog.createDelivery(1, "PO-X", "", TOMORROW(), "A", [], 0, "")
      ).to.be.revertedWith("Tracking number cannot be empty");
    });

    it("should reject duplicate tracking number", async function () {
      await deliveryLog.createDelivery(1, "PO-A", "TRK-DUP", TOMORROW(), "A", [], 0, "");
      await expect(
        deliveryLog.createDelivery(1, "PO-B", "TRK-DUP", TOMORROW(), "B", [], 0, "")
      ).to.be.revertedWith("Tracking number already exists");
    });

    it("should only allow owner to create", async function () {
      await expect(
        deliveryLog.connect(addr1).createDelivery(1, "PO-X", "TRK-X", TOMORROW(), "A", [], 0, "")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // ─── Status Updates ─────────────────────────────────────

  describe("Status Updates", function () {
    let deliveryId;

    beforeEach(async function () {
      deliveryId = await createAndGetId(1, "PO-S", "TRK-S");
    });

    it("should update status to IN_TRANSIT", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 1, "Hub", "Shipped");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.status).to.equal(1n); // IN_TRANSIT
    });

    it("should set actualDeliveryDate when DELIVERED", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 2, "Dest", "Arrived");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.status).to.equal(2n); // DELIVERED
      expect(d.actualDeliveryDate).to.be.gt(0n);
    });

    it("should reject same-status update", async function () {
      await expect(
        deliveryLog.updateDeliveryStatus(deliveryId, 0, "", "")
      ).to.be.revertedWith("Status is already set to this value");
    });

    it("should reject update on delivered order", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 2, "Dest", "Done");
      await expect(
        deliveryLog.updateDeliveryStatus(deliveryId, 3, "", "")
      ).to.be.revertedWith("Cannot update completed delivery");
    });

    it("should record update history", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 1, "Hub", "In transit");
      await deliveryLog.updateDeliveryStatus(deliveryId, 2, "Dest", "Delivered");

      const updates = await deliveryLog.getDeliveryUpdates(deliveryId);
      // initial create + 2 updates
      expect(updates.length).to.equal(3);
    });
  });

  // ─── Verification ───────────────────────────────────────

  describe("Verification", function () {
    let deliveryId;

    beforeEach(async function () {
      deliveryId = await createAndGetId(1, "PO-V", "TRK-V");
    });

    it("should add a verification record", async function () {
      await deliveryLog.addVerificationRecord(
        deliveryId,
        1, // VERIFIED
        "MANUAL",
        "inspector signed off",
        "All items OK",
        ""
      );

      const records = await deliveryLog.getDeliveryVerifications(deliveryId);
      expect(records.length).to.equal(1);
      expect(records[0].status).to.equal(1n); // VERIFIED

      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(1n); // VERIFIED
    });

    it("should verify with QR code — valid code", async function () {
      await deliveryLog.verifyDeliveryWithCode(deliveryId, "TRK-V", "QmHash");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(1n); // VERIFIED
    });

    it("should fail verification with wrong code", async function () {
      await deliveryLog.verifyDeliveryWithCode(deliveryId, "WRONG-CODE", "");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(2n); // FAILED
    });
  });

  // ─── View Helpers ───────────────────────────────────────

  describe("View functions", function () {
    it("should look up delivery by tracking number", async function () {
      await createAndGetId(1, "PO-L", "TRK-LOOKUP");
      const id = await deliveryLog.getDeliveryByTrackingNumber("TRK-LOOKUP");
      expect(id).to.be.gt(0n);
    });

    it("should return vendor deliveries", async function () {
      await createAndGetId(1, "PO-1", "TRK-1");
      await createAndGetId(1, "PO-2", "TRK-2");
      const ids = await deliveryLog.getVendorDeliveries(1);
      expect(ids.length).to.equal(2);
    });

    it("should return all delivery IDs", async function () {
      await createAndGetId(1, "PO-A", "TRK-A");
      await createAndGetId(2, "PO-B", "TRK-B");
      const all = await deliveryLog.getAllDeliveries();
      expect(all.length).to.equal(2);
    });

    it("should count total deliveries", async function () {
      await createAndGetId(1, "PO-C", "TRK-C");
      const count = await deliveryLog.getTotalDeliveries();
      expect(count).to.equal(1n);
    });

    it("should return delivery items", async function () {
      await createAndGetId(1, "PO-I", "TRK-I", { items: ["Milk x10", "Bread x20"] });
      const items = await deliveryLog.getDeliveryItems(1);
      expect(items.length).to.equal(2);
      expect(items[0]).to.equal("Milk x10");
    });

    it("should detect overdue delivery", async function () {
      await createAndGetId(1, "PO-O", "TRK-O");
      const overdue = await deliveryLog.isDeliveryOverdue(1);
      expect(overdue).to.be.false;
    });

    it("should return vendor delivery stats", async function () {
      await createAndGetId(1, "PO-S1", "TRK-S1", { value: 100 });
      await createAndGetId(1, "PO-S2", "TRK-S2", { value: 200 });

      // Deliver one
      await deliveryLog.updateDeliveryStatus(1, 2, "Dest", "Done");

      const stats = await deliveryLog.getVendorDeliveryStats(1);
      expect(stats.totalDeliveries).to.equal(2n);
      expect(stats.completedDeliveries).to.equal(1n);
      expect(stats.pendingDeliveries).to.equal(1n);
    });
  });
});
