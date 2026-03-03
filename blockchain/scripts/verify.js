/**
 * verify.js — Verify deployed contracts on Etherscan / Polygonscan / etc.
 *
 * Usage:
 *   npx hardhat run scripts/verify.js --network sepolia
 *   npx hardhat run scripts/verify.js --network polygon
 *
 * Requires ETHERSCAN_API_KEY (or POLYGONSCAN_API_KEY) in .env
 */
const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

function loadDeployment(networkName) {
  const filePath = path.join(
    __dirname,
    `../deployments/${networkName}-deployment.json`
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `No deployment found for "${networkName}". Deploy first:\n  npx hardhat run scripts/deploy.js --network ${networkName}`
    );
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function verifyContract(address, constructorArgs, contractName) {
  console.log(`\n🔍 Verifying ${contractName} at ${address}...`);
  try {
    await run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
    });
    console.log(`✅ ${contractName} verified successfully!`);
    return true;
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log(`ℹ️  ${contractName} is already verified.`);
      return true;
    }
    console.error(`❌ Failed to verify ${contractName}:`, error.message);
    return false;
  }
}

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? "localhost" : network.name;

  console.log("═══════════════════════════════════════════");
  console.log("  Smart Vendor Compliance — Contract Verification");
  console.log(`  Network : ${networkName} (chain ${network.chainId})`);
  console.log("═══════════════════════════════════════════");

  if (network.chainId === 31337) {
    console.log("⚠️  Skipping verification on local Hardhat network.");
    return;
  }

  const deployment = loadDeployment(networkName);
  const results = [];

  // VendorCompliance (no constructor args)
  if (deployment.contracts.VendorCompliance) {
    const ok = await verifyContract(
      deployment.contracts.VendorCompliance.address,
      [],
      "VendorCompliance"
    );
    results.push({ contract: "VendorCompliance", verified: ok });
  }

  // DeliveryLog (no constructor args)
  if (deployment.contracts.DeliveryLog) {
    const ok = await verifyContract(
      deployment.contracts.DeliveryLog.address,
      [],
      "DeliveryLog"
    );
    results.push({ contract: "DeliveryLog", verified: ok });
  }

  // ComplianceToken (no constructor args — initial mint is inside constructor)
  if (deployment.contracts.ComplianceToken) {
    const ok = await verifyContract(
      deployment.contracts.ComplianceToken.address,
      [],
      "ComplianceToken"
    );
    results.push({ contract: "ComplianceToken", verified: ok });
  }

  // Summary
  console.log("\n══════════════════════════════════════");
  console.log("  VERIFICATION SUMMARY");
  console.log("══════════════════════════════════════");
  results.forEach(({ contract, verified }) => {
    const icon = verified ? "✅" : "❌";
    console.log(`  ${icon}  ${contract}`);
  });
  console.log("══════════════════════════════════════\n");

  const allOk = results.every((r) => r.verified);
  if (!allOk) {
    console.log("⚠️  Some contracts failed verification. Check API keys and network config.");
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌  Error:", err);
      process.exit(1);
    });
}

module.exports = { main };
