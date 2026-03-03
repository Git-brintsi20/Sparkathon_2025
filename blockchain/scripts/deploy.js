const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Smart Vendor Compliance System deployment...");

  // Get the contract deployer
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);

  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log(`💰 Account balance: ${ethers.utils.formatEther(balance)} ETH`);

  try {
    // Deploy VendorCompliance contract
    console.log("\n📦 Deploying VendorCompliance contract...");
    const VendorCompliance = await ethers.getContractFactory("VendorCompliance");
    const vendorCompliance = await VendorCompliance.deploy();
    await vendorCompliance.deployed();
    
    console.log(`✅ VendorCompliance deployed to: ${vendorCompliance.address}`);
    console.log(`📄 Transaction hash: ${vendorCompliance.deployTransaction.hash}`);

    // Deploy DeliveryLog contract
    console.log("\n📦 Deploying DeliveryLog contract...");
    const DeliveryLog = await ethers.getContractFactory("DeliveryLog");
    const deliveryLog = await DeliveryLog.deploy();
    await deliveryLog.deployed();
    
    console.log(`✅ DeliveryLog deployed to: ${deliveryLog.address}`);
    console.log(`📄 Transaction hash: ${deliveryLog.deployTransaction.hash}`);

    // Deploy ComplianceToken contract
    console.log("\n📦 Deploying ComplianceToken contract...");
    const ComplianceToken = await ethers.getContractFactory("ComplianceToken");
    const complianceToken = await ComplianceToken.deploy();
    await complianceToken.deployed();

    console.log(`✅ ComplianceToken deployed to: ${complianceToken.address}`);
    console.log(`📄 Transaction hash: ${complianceToken.deployTransaction.hash}`);

    // Wait for confirmations
    console.log("\n⏳ Waiting for confirmations...");
    await vendorCompliance.deployTransaction.wait(2);
    await deliveryLog.deployTransaction.wait(2);
    await complianceToken.deployTransaction.wait(2);

    // Create deployment info object
    const deploymentInfo = {
      network: await ethers.provider.getNetwork(),
      deployer: deployer.address,
      deploymentDate: new Date().toISOString(),
      contracts: {
        VendorCompliance: {
          address: vendorCompliance.address,
          transactionHash: vendorCompliance.deployTransaction.hash,
          blockNumber: vendorCompliance.deployTransaction.blockNumber
        },
        DeliveryLog: {
          address: deliveryLog.address,
          transactionHash: deliveryLog.deployTransaction.hash,
          blockNumber: deliveryLog.deployTransaction.blockNumber
        },
        ComplianceToken: {
          address: complianceToken.address,
          transactionHash: complianceToken.deployTransaction.hash,
          blockNumber: complianceToken.deployTransaction.blockNumber
        }
      }
    };

    // Save deployment addresses to file
    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const networkName = deploymentInfo.network.name || "unknown";
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
          address: vendorCompliance.address,
          abi: "VendorCompliance"
        },
        DeliveryLog: {
          address: deliveryLog.address,
          abi: "DeliveryLog"
        },
        ComplianceToken: {
          address: complianceToken.address,
          abi: "ComplianceToken"
        }
      },
      network: {
        name: networkName,
        chainId: deploymentInfo.network.chainId,
        rpcUrl: process.env.RPC_URL || "http://localhost:8545"
      }
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

    // Display summary
    console.log("\n🎉 DEPLOYMENT SUMMARY");
    console.log("=====================");
    console.log(`Network: ${networkName} (Chain ID: ${deploymentInfo.network.chainId})`);
    console.log(`Deployer: ${deployer.address}`);
    console.log(`VendorCompliance: ${vendorCompliance.address}`);
    console.log(`DeliveryLog: ${deliveryLog.address}`);
    console.log(`ComplianceToken: ${complianceToken.address}`);
    console.log(`Gas used: ${await getGasUsed(vendorCompliance, deliveryLog, complianceToken)}`);
    console.log("=====================");

    // Environment variables reminder
    console.log("\n📝 ENVIRONMENT VARIABLES NEEDED:");
    console.log("Add these to your backend .env file:");
    console.log(`VENDOR_COMPLIANCE_ADDRESS=${vendorCompliance.address}`);
    console.log(`DELIVERY_LOG_ADDRESS=${deliveryLog.address}`);
    console.log(`COMPLIANCE_TOKEN_ADDRESS=${complianceToken.address}`);
    console.log(`BLOCKCHAIN_NETWORK=${networkName}`);
    console.log(`RPC_URL=${process.env.RPC_URL || "http://localhost:8545"}`);
    console.log(`PRIVATE_KEY=${process.env.PRIVATE_KEY || "your-private-key"}`);

    console.log("\n✅ Deployment completed successfully!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

async function getGasUsed(vendorCompliance, deliveryLog, complianceToken) {
  try {
    const vendorReceipt = await ethers.provider.getTransactionReceipt(
      vendorCompliance.deployTransaction.hash
    );
    const deliveryReceipt = await ethers.provider.getTransactionReceipt(
      deliveryLog.deployTransaction.hash
    );
    const tokenReceipt = await ethers.provider.getTransactionReceipt(
      complianceToken.deployTransaction.hash
    );
    
    const totalGas = vendorReceipt.gasUsed.add(deliveryReceipt.gasUsed).add(tokenReceipt.gasUsed);
    return totalGas.toString();
  } catch (error) {
    return "Unable to calculate";
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