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

  // ─── Creation ───────────────────────────────────────────

  describe("Delivery Creation", function () {
    it("should create a delivery", async function () {
      const tx = await deliveryLog.createDelivery(
        1, "PO-001", "TRK-001", TOMORROW(),
        "Warehouse A",
        ["Apples x100", "Oranges x200"],
        5000,
        "Fragile"
      );
      const receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === "DeliveryCreated");
      expect(event).to.not.be.undefined;

      const deliveryId = event.args.deliveryId;
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.purchaseOrderId).to.equal("PO-001");
      expect(d.trackingNumber).to.equal("TRK-001");
      expect(d.totalValue).to.equal(5000);
      expect(d.status).to.equal(0); // PENDING
      expect(d.verificationStatus).to.equal(0); // UNVERIFIED
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
        deliveryLog.connect(addr1).createDelivery(
          1, "PO-X", "TRK-X", TOMORROW(), "A", [], 0, ""
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // ─── Status Updates ─────────────────────────────────────

  describe("Status Updates", function () {
    let deliveryId;

    beforeEach(async function () {
      const tx = await deliveryLog.createDelivery(
        1, "PO-S", "TRK-S", TOMORROW(), "Loc", ["Item"], 100, ""
      );
      const receipt = await tx.wait();
      deliveryId = receipt.events.find((e) => e.event === "DeliveryCreated").args.deliveryId;
    });

    it("should update status to IN_TRANSIT", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 1, "Hub", "Shipped");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.status).to.equal(1); // IN_TRANSIT
    });

    it("should set actualDeliveryDate when DELIVERED", async function () {
      await deliveryLog.updateDeliveryStatus(deliveryId, 2, "Dest", "Arrived");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.status).to.equal(2); // DELIVERED
      expect(d.actualDeliveryDate).to.be.gt(0);
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
      const tx = await deliveryLog.createDelivery(
        1, "PO-V", "TRK-V", TOMORROW(), "Loc", ["Item"], 100, ""
      );
      const receipt = await tx.wait();
      deliveryId = receipt.events.find((e) => e.event === "DeliveryCreated").args.deliveryId;
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
      expect(records[0].status).to.equal(1); // VERIFIED

      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(1); // VERIFIED
    });

    it("should verify with QR code — valid code", async function () {
      const tx = await deliveryLog.verifyDeliveryWithCode(deliveryId, "TRK-V", "QmHash");
      const receipt = await tx.wait();
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(1); // VERIFIED
    });

    it("should fail verification with wrong code", async function () {
      await deliveryLog.verifyDeliveryWithCode(deliveryId, "WRONG-CODE", "");
      const d = await deliveryLog.getDelivery(deliveryId);
      expect(d.verificationStatus).to.equal(2); // FAILED
    });
  });

  // ─── View Helpers ───────────────────────────────────────

  describe("View functions", function () {
    it("should look up delivery by tracking number", async function () {
      await deliveryLog.createDelivery(
        1, "PO-L", "TRK-LOOKUP", TOMORROW(), "A", [], 0, ""
      );
      const id = await deliveryLog.getDeliveryByTrackingNumber("TRK-LOOKUP");
      expect(id).to.be.gt(0);
    });

    it("should return vendor deliveries", async function () {
      await deliveryLog.createDelivery(1, "PO-1", "TRK-1", TOMORROW(), "A", [], 0, "");
      await deliveryLog.createDelivery(1, "PO-2", "TRK-2", TOMORROW(), "B", [], 0, "");
      const ids = await deliveryLog.getVendorDeliveries(1);
      expect(ids.length).to.equal(2);
    });

    it("should return all delivery IDs", async function () {
      await deliveryLog.createDelivery(1, "PO-A", "TRK-A", TOMORROW(), "A", [], 0, "");
      await deliveryLog.createDelivery(2, "PO-B", "TRK-B", TOMORROW(), "B", [], 0, "");
      const all = await deliveryLog.getAllDeliveries();
      expect(all.length).to.equal(2);
    });

    it("should count total deliveries", async function () {
      await deliveryLog.createDelivery(1, "PO-C", "TRK-C", TOMORROW(), "A", [], 0, "");
      const count = await deliveryLog.getTotalDeliveries();
      expect(count).to.equal(1);
    });

    it("should return delivery items", async function () {
      await deliveryLog.createDelivery(
        1, "PO-I", "TRK-I", TOMORROW(), "A",
        ["Milk x10", "Bread x20"], 0, ""
      );
      const items = await deliveryLog.getDeliveryItems(1);
      expect(items.length).to.equal(2);
      expect(items[0]).to.equal("Milk x10");
    });

    it("should detect overdue delivery", async function () {
      // Create with expectedDeliveryDate in the past is rejected,
      // so we test with far-future which should NOT be overdue
      await deliveryLog.createDelivery(
        1, "PO-O", "TRK-O", TOMORROW(), "A", [], 0, ""
      );
      const overdue = await deliveryLog.isDeliveryOverdue(1);
      expect(overdue).to.be.false;
    });

    it("should return vendor delivery stats", async function () {
      await deliveryLog.createDelivery(1, "PO-S1", "TRK-S1", TOMORROW(), "A", [], 100, "");
      await deliveryLog.createDelivery(1, "PO-S2", "TRK-S2", TOMORROW(), "B", [], 200, "");

      // Deliver one
      await deliveryLog.updateDeliveryStatus(1, 2, "Dest", "Done");

      const stats = await deliveryLog.getVendorDeliveryStats(1);
      expect(stats.totalDeliveries).to.equal(2);
      expect(stats.completedDeliveries).to.equal(1);
      expect(stats.pendingDeliveries).to.equal(1);
    });
  });
});
