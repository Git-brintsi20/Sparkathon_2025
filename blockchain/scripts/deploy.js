const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Smart Vendor Compliance System deployment...");

  // Get the contract deployer
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);

  // Check deployer balance (ethers v6)
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);

  try {
    // Deploy VendorCompliance contract
    console.log("\n📦 Deploying VendorCompliance contract...");
    const VendorCompliance = await ethers.getContractFactory("VendorCompliance");
    const vendorCompliance = await VendorCompliance.deploy();
    await vendorCompliance.waitForDeployment();
    const vendorComplianceAddress = await vendorCompliance.getAddress();
    const vendorComplianceTxHash = vendorCompliance.deploymentTransaction()?.hash;

    console.log(`✅ VendorCompliance deployed to: ${vendorComplianceAddress}`);
    console.log(`📄 Transaction hash: ${vendorComplianceTxHash}`);

    // Deploy DeliveryLog contract
    console.log("\n📦 Deploying DeliveryLog contract...");
    const DeliveryLog = await ethers.getContractFactory("DeliveryLog");
    const deliveryLog = await DeliveryLog.deploy();
    await deliveryLog.waitForDeployment();
    const deliveryLogAddress = await deliveryLog.getAddress();
    const deliveryLogTxHash = deliveryLog.deploymentTransaction()?.hash;

    console.log(`✅ DeliveryLog deployed to: ${deliveryLogAddress}`);
    console.log(`📄 Transaction hash: ${deliveryLogTxHash}`);

    // Deploy ComplianceToken contract
    console.log("\n📦 Deploying ComplianceToken contract...");
    const ComplianceToken = await ethers.getContractFactory("ComplianceToken");
    const complianceToken = await ComplianceToken.deploy();
    await complianceToken.waitForDeployment();
    const complianceTokenAddress = await complianceToken.getAddress();
    const complianceTokenTxHash = complianceToken.deploymentTransaction()?.hash;

    console.log(`✅ ComplianceToken deployed to: ${complianceTokenAddress}`);
    console.log(`📄 Transaction hash: ${complianceTokenTxHash}`);

    // Get deployment block numbers from receipts
    const vendorReceipt = vendorComplianceTxHash
      ? await ethers.provider.getTransactionReceipt(vendorComplianceTxHash)
      : null;
    const deliveryReceipt = deliveryLogTxHash
      ? await ethers.provider.getTransactionReceipt(deliveryLogTxHash)
      : null;
    const tokenReceipt = complianceTokenTxHash
      ? await ethers.provider.getTransactionReceipt(complianceTokenTxHash)
      : null;

    // Get network info (ethers v6 returns { name, chainId })
    const network = await ethers.provider.getNetwork();

    // Create deployment info object
    const deploymentInfo = {
      network: { name: network.name, chainId: Number(network.chainId) },
      deployer: deployer.address,
      deploymentDate: new Date().toISOString(),
      contracts: {
        VendorCompliance: {
          address: vendorComplianceAddress,
          transactionHash: vendorComplianceTxHash,
          blockNumber: vendorReceipt?.blockNumber ?? null,
        },
        DeliveryLog: {
          address: deliveryLogAddress,
          transactionHash: deliveryLogTxHash,
          blockNumber: deliveryReceipt?.blockNumber ?? null,
        },
        ComplianceToken: {
          address: complianceTokenAddress,
          transactionHash: complianceTokenTxHash,
          blockNumber: tokenReceipt?.blockNumber ?? null,
        },
      },
    };

    // Save deployment addresses to file
    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const networkName = network.name || "unknown";
    const deploymentFile = path.join(deploymentPath, `${networkName}-deployment.json`);

    fs.writeFileSync(
      deploymentFile,
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`💾 Deployment info saved to: ${deploymentFile}`);

    // Test basic functionality
    console.log("\n🧪 Testing basic contract functionality...");

    // Test VendorCompliance
    console.log("Testing VendorCompliance...");
    const testVendorTx = await vendorCompliance.registerVendor(
      "Test Vendor",
      "test@vendor.com",
      deployer.address,
      ["ISO9001", "FDA"]
    );
    await testVendorTx.wait();

    const vendorCount = await vendorCompliance.getTotalVendors();
    console.log(`✅ Vendor registered successfully. Total vendors: ${vendorCount}`);

    // Test DeliveryLog
    console.log("Testing DeliveryLog...");
    const testDeliveryTx = await deliveryLog.createDelivery(
      1, // vendorId
      "PO-TEST-001",
      "TRK-TEST-001",
      Math.floor(Date.now() / 1000) + 86400, // tomorrow
      "Test Location",
      ["Test Item 1", "Test Item 2"],
      1000,
      "Test delivery"
    );
    await testDeliveryTx.wait();

    const deliveryCount = await deliveryLog.getTotalDeliveries();
    console.log(`✅ Delivery created successfully. Total deliveries: ${deliveryCount}`);

    // Create backend config file
    const backendConfig = {
      contracts: {
        VendorCompliance: {
          address: vendorComplianceAddress,
          abi: "VendorCompliance",
        },
        DeliveryLog: {
          address: deliveryLogAddress,
          abi: "DeliveryLog",
        },
        ComplianceToken: {
          address: complianceTokenAddress,
          abi: "ComplianceToken",
        },
      },
      network: {
        name: networkName,
        chainId: Number(network.chainId),
        rpcUrl: process.env.RPC_URL || "http://localhost:8545",
      },
    };

    const backendConfigPath = path.join(__dirname, "../../backend/src/config/blockchain.json");
    const backendConfigDir = path.dirname(backendConfigPath);

    if (!fs.existsSync(backendConfigDir)) {
      fs.mkdirSync(backendConfigDir, { recursive: true });
    }

    fs.writeFileSync(
      backendConfigPath,
      JSON.stringify(backendConfig, null, 2)
    );

    console.log(`🔧 Backend config saved to: ${backendConfigPath}`);

    // Calculate total gas
    const totalGas = (vendorReceipt?.gasUsed ?? 0n)
      + (deliveryReceipt?.gasUsed ?? 0n)
      + (tokenReceipt?.gasUsed ?? 0n);

    // Display summary
    console.log("\n🎉 DEPLOYMENT SUMMARY");
    console.log("=====================");
    console.log(`Network: ${networkName} (Chain ID: ${network.chainId})`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`VendorCompliance: ${vendorComplianceAddress}`);
    console.log(`DeliveryLog: ${deliveryLogAddress}`);
    console.log(`ComplianceToken: ${complianceTokenAddress}`);
    console.log(`Gas used: ${totalGas.toString()}`);
    console.log("=====================");

    // Environment variables reminder
    console.log("\n📝 ENVIRONMENT VARIABLES NEEDED:");
    console.log("Add these to your backend .env file:");
    console.log(`VENDOR_COMPLIANCE_ADDRESS=${vendorComplianceAddress}`);
    console.log(`DELIVERY_LOG_ADDRESS=${deliveryLogAddress}`);
    console.log(`COMPLIANCE_TOKEN_ADDRESS=${complianceTokenAddress}`);
    console.log(`BLOCKCHAIN_NETWORK=${networkName}`);
    console.log(`RPC_URL=${process.env.RPC_URL || "http://localhost:8545"}`);
    console.log(`PRIVATE_KEY=<your-deployer-private-key>`);

    console.log("\n✅ Deployment completed successfully!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Script execution failed:", error);
      process.exit(1);
    });
}

module.exports = { main };