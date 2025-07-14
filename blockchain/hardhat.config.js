require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable the IR-based code generator for better optimization
    },
  },
  
  networks: {
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
    
    // Hardhat Network (default)
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 1000, // Mine a block every 1 second
      },
      accounts: {
        count: 20,
        initialBalance: "10000000000000000000000", // 10,000 ETH
      },
      forking: process.env.FORK_URL ? {
        url: process.env.FORK_URL,
        enabled: true,
      } : undefined,
    },
    
    // Ethereum Sepolia Testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: 2100000,
      gasPrice: 8000000000, // 8 gwei
      timeout: 60000,
    },
    
    // Polygon Mumbai Testnet
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gas: 2100000,
      gasPrice: 8000000000,
      timeout: 60000,
    },
    
    // Binance Smart Chain Testnet
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
      gas: 2100000,
      gasPrice: 10000000000,
      timeout: 60000,
    },
    
    // Ethereum Mainnet (Production)
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : [],
      chainId: 1,
      gas: 2100000,
      gasPrice: 20000000000, // 20 gwei
      timeout: 60000,
    },
    
    // Polygon Mainnet (Production)
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.MAINNET_PRIVATE_KEY ? [process.env.MAINNET_PRIVATE_KEY] : [],
      chainId: 137,
      gas: 2100000,
      gasPrice: 30000000000, // 30 gwei
      timeout: 60000,
    },
  },
  
  // Etherscan verification configuration
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
    },
  },
  
  // Gas reporter configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20, // gwei
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    outputFile: "gas-report.txt",
    noColors: true,
  },
  
  // Mocha test configuration
  mocha: {
    timeout: 60000,
    reporter: "spec",
  },
  
  // Paths configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  
  // TypeChain configuration for generating TypeScript types
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
  
  // Contract verification settings
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  
  // Deployment configuration
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0, // mainnet
      4: 0, // rinkeby
      137: 0, // polygon
      80001: 0, // mumbai
      31337: 0, // hardhat
    },
    admin: {
      default: 1,
      1: 1,
      4: 1,
      137: 1,
      80001: 1,
      31337: 1,
    },
  },
  
  // Custom tasks
  tasks: {
    accounts: {
      description: "Prints the list of accounts",
      action: async (taskArgs, hre) => {
        const accounts = await hre.ethers.getSigners();
        for (const account of accounts) {
          console.log(account.address);
        }
      },
    },
    balance: {
      description: "Prints an account's balance",
      params: {
        account: {
          name: "account",
          description: "The account's address",
        },
      },
      action: async (taskArgs, hre) => {
        const account = hre.ethers.utils.getAddress(taskArgs.account);
        const balance = await hre.ethers.provider.getBalance(account);
        console.log(hre.ethers.utils.formatEther(balance), "ETH");
      },
    },
  },
};