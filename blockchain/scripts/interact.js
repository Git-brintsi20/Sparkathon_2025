/**
 * interact.js — Helper script to interact with deployed contracts.
 *
 * Usage:
 *   npx hardhat run scripts/interact.js --network localhost
 *   npx hardhat run scripts/interact.js --network sepolia
 *
 * Reads contract addresses from ../deployments/<network>-deployment.json
 */
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

function loadDeployment(networkName) {
  const filePath = path.join(
    __dirname,
    `../deployments/${networkName}-deployment.json`
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `No deployment file found for network "${networkName}". Deploy first with:\n  npx hardhat run scripts/deploy.js --network ${networkName}`
    );
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function getContracts(networkName) {
  const deployment = loadDeployment(networkName);

  const VendorCompliance = await ethers.getContractFactory("VendorCompliance");
  const vendorCompliance = VendorCompliance.attach(
    deployment.contracts.VendorCompliance.address
  );

  const DeliveryLog = await ethers.getContractFactory("DeliveryLog");
  const deliveryLog = DeliveryLog.attach(
    deployment.contracts.DeliveryLog.address
  );

  // ComplianceToken may not be deployed yet — handle gracefully
  let complianceToken = null;
  if (deployment.contracts.ComplianceToken) {
    const ComplianceToken = await ethers.getContractFactory("ComplianceToken");
    complianceToken = ComplianceToken.attach(
      deployment.contracts.ComplianceToken.address
    );
  }

  return { vendorCompliance, deliveryLog, complianceToken, deployment };
}

// ---------------------------------------------------------------------------
//  Interaction commands
// ---------------------------------------------------------------------------

async function registerVendor(vendorCompliance, name, email, wallet, certs) {
  console.log(`\n📝  Registering vendor "${name}"...`);
  const tx = await vendorCompliance.registerVendor(name, email, wallet, certs);
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log) => { try { return vendorCompliance.interface.parseLog(log); } catch { return null; } })
    .find((e) => e?.name === "VendorRegistered");
  const vendorId = event?.args?.vendorId?.toString();
  console.log(`✅  Vendor registered — ID: ${vendorId}, tx: ${tx.hash}`);
  return vendorId;
}

async function createDelivery(
  deliveryLog,
  vendorId,
  poId,
  tracking,
  expectedTs,
  location,
  items,
  totalValue,
  notes
) {
  console.log(`\n📦  Creating delivery PO:${poId}...`);
  const tx = await deliveryLog.createDelivery(
    vendorId,
    poId,
    tracking,
    expectedTs,
    location,
    items,
    totalValue,
    notes
  );
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log) => { try { return deliveryLog.interface.parseLog(log); } catch { return null; } })
    .find((e) => e?.name === "DeliveryCreated");
  const deliveryId = event?.args?.deliveryId?.toString();
  console.log(`✅  Delivery created — ID: ${deliveryId}, tx: ${tx.hash}`);
  return deliveryId;
}

async function verifyDelivery(deliveryLog, deliveryId, code, imageHash) {
  console.log(`\n🔍  Verifying delivery #${deliveryId}...`);
  const tx = await deliveryLog.verifyDeliveryWithCode(
    deliveryId,
    code,
    imageHash
  );
  const receipt = await tx.wait();
  console.log(`✅  Verification recorded, tx: ${tx.hash}`);
  return receipt;
}

async function updateComplianceScore(vendorCompliance, vendorId, score, reason) {
  console.log(`\n📊  Updating compliance score for vendor #${vendorId}...`);
  const tx = await vendorCompliance.updateComplianceScore(vendorId, score, reason);
  await tx.wait();
  console.log(`✅  Score updated to ${score}, tx: ${tx.hash}`);
}

async function rewardVendor(complianceToken, vendorAddr, amount, reason) {
  if (!complianceToken) {
    console.log("⚠️  ComplianceToken not deployed — skipping reward.");
    return;
  }
  console.log(`\n🎁  Rewarding vendor ${vendorAddr}...`);
  const tx = await complianceToken.rewardVendor(vendorAddr, amount, reason);
  await tx.wait();
  console.log(`✅  Rewarded ${ethers.formatEther(amount)} CMPL, tx: ${tx.hash}`);
}

// ---------------------------------------------------------------------------
//  View helpers
// ---------------------------------------------------------------------------

async function printVendorInfo(vendorCompliance, vendorId) {
  const v = await vendorCompliance.getVendor(vendorId);
  console.log("\n── Vendor Info ──────────────────────");
  console.log(`  ID             : ${v.id}`);
  console.log(`  Name           : ${v.name}`);
  console.log(`  Email          : ${v.email}`);
  console.log(`  Wallet         : ${v.walletAddress}`);
  console.log(`  Compliance     : ${v.complianceScore}%  (level ${v.complianceLevel})`);
  console.log(`  Active         : ${v.isActive}`);
  console.log(`  Deliveries     : ${v.totalDeliveries} total / ${v.successfulDeliveries} successful`);
  console.log(`  Certifications : ${v.certifications.join(", ") || "none"}`);
  console.log("─────────────────────────────────────\n");
}

async function printDeliveryInfo(deliveryLog, deliveryId) {
  const d = await deliveryLog.getDelivery(deliveryId);
  const statusNames = ["PENDING", "IN_TRANSIT", "DELIVERED", "REJECTED", "CANCELLED"];
  const verifyNames = ["UNVERIFIED", "VERIFIED", "FAILED", "DISPUTED"];
  console.log("\n── Delivery Info ────────────────────");
  console.log(`  ID              : ${d.id}`);
  console.log(`  Vendor          : ${d.vendorId}`);
  console.log(`  PO              : ${d.purchaseOrderId}`);
  console.log(`  Tracking        : ${d.trackingNumber}`);
  console.log(`  Status          : ${statusNames[d.status] || d.status}`);
  console.log(`  Verification    : ${verifyNames[d.verificationStatus] || d.verificationStatus}`);
  console.log(`  Value           : ${d.totalValue}`);
  console.log(`  Items           : ${d.itemsDelivered.join(", ")}`);
  console.log("─────────────────────────────────────\n");
}

async function printStats(vendorCompliance, deliveryLog, complianceToken) {
  const vendorCount = await vendorCompliance.getTotalVendors();
  const deliveryCount = await deliveryLog.getTotalDeliveries();

  console.log("\n══════════════════════════════════════");
  console.log("  📊  CONTRACT STATISTICS");
  console.log("══════════════════════════════════════");
  console.log(`  Vendors       : ${vendorCount}`);
  console.log(`  Deliveries    : ${deliveryCount}`);

  if (complianceToken) {
    const supply = await complianceToken.totalSupply();
    const remaining = await complianceToken.remainingMintableSupply();
    console.log(`  CMPL Supply   : ${ethers.formatEther(supply)}`);
    console.log(`  Mintable Left : ${ethers.formatEther(remaining)}`);
  }
  console.log("══════════════════════════════════════\n");
}

// ---------------------------------------------------------------------------
//  Main
// ---------------------------------------------------------------------------

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "localhost" : network.name;

  console.log("═══════════════════════════════════════");
  console.log("  Smart Vendor Compliance — Interact");
  console.log(`  Network  : ${networkName} (${network.chainId})`);
  console.log(`  Account  : ${deployer.address}`);
  console.log("═══════════════════════════════════════");

  const { vendorCompliance, deliveryLog, complianceToken } =
    await getContracts(networkName);

  // ── Demo interaction flow ──
  // 1. Register a vendor
  const vendorId = await registerVendor(
    vendorCompliance,
    "Acme Supplies",
    "acme@supplier.com",
    deployer.address,
    ["ISO9001", "HACCP"]
  );

  // 2. Create a delivery
  const tomorrow = Math.floor(Date.now() / 1000) + 86400;
  const deliveryId = await createDelivery(
    deliveryLog,
    vendorId,
    "PO-2025-100",
    "TRK-ACME-001",
    tomorrow,
    "Walmart DC #42, Bentonville AR",
    ["Organic Bananas x500", "Fair Trade Coffee x200"],
    12500,
    "Monthly replenishment"
  );

  // 3. Verify the delivery
  await verifyDelivery(deliveryLog, deliveryId, "TRK-ACME-001", "QmFakeIpfsHash123");

  // 4. Update compliance score
  await updateComplianceScore(vendorCompliance, vendorId, 95, "Q1 audit passed with minor notes");

  // 5. Reward vendor (if ComplianceToken deployed)
  await rewardVendor(
    complianceToken,
    deployer.address,
    ethers.parseEther("50"),
    "On-time delivery reward"
  );

  // 6. Print summaries
  await printVendorInfo(vendorCompliance, vendorId);
  await printDeliveryInfo(deliveryLog, deliveryId);
  await printStats(vendorCompliance, deliveryLog, complianceToken);

  console.log("✅  Interaction script finished.");
}

// ---------------------------------------------------------------------------
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌  Error:", err);
      process.exit(1);
    });
}

module.exports = {
  main,
  getContracts,
  registerVendor,
  createDelivery,
  verifyDelivery,
  updateComplianceScore,
  rewardVendor,
  printStats,
};
