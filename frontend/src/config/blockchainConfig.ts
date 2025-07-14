// Frontend blockchain configuration with TypeScript types

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  gasPrice: {
    slow: number;
    standard: number;
    fast: number;
  };
  blockConfirmations: number;
  isTestnet: boolean;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  deployedAt: number;
  version: string;
}

export interface ContractAddresses {
  VendorCompliance: string;
  DeliveryLog: string;
  ComplianceToken: string;
}

export interface BlockchainConfig {
  isDemoMode: boolean;
  defaultNetwork: string;
  networks: Record<string, NetworkConfig>;
  contracts: Record<string, ContractAddresses>;
  features: {
    enableRealTimeUpdates: boolean;
    enableGasOptimization: boolean;
    enableTransactionRetry: boolean;
    maxRetryAttempts: number;
    retryDelay: number;
  };
  demo: {
    mockTransactionDelay: number;
    mockGasPrice: number;
    simulateNetworkLatency: boolean;
    generateRealisticHashes: boolean;
  };
}

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  localhost: {
    name: "Localhost",
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:8545",
    explorerUrl: "http://localhost:8545",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    gasPrice: {
      slow: 1,
      standard: 2,
      fast: 3,
    },
    blockConfirmations: 1,
    isTestnet: true,
  },
  
  sepolia: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    gasPrice: {
      slow: 8,
      standard: 10,
      fast: 15,
    },
    blockConfirmations: 3,
    isTestnet: true,
  },
  
  mumbai: {
    name: "Polygon Mumbai",
    chainId: 80001,
    rpcUrl: "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://mumbai.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    gasPrice: {
      slow: 1,
      standard: 2,
      fast: 3,
    },
    blockConfirmations: 2,
    isTestnet: true,
  },
  
  bscTestnet: {
    name: "BSC Testnet",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorerUrl: "https://testnet.bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    gasPrice: {
      slow: 5,
      standard: 10,
      fast: 15,
    },
    blockConfirmations: 3,
    isTestnet: true,
  },
  
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    gasPrice: {
      slow: 20,
      standard: 30,
      fast: 40,
    },
    blockConfirmations: 12,
    isTestnet: false,
  },
  
  polygon: {
    name: "Polygon Mainnet",
    chainId: 137,
    rpcUrl: "https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    gasPrice: {
      slow: 30,
      standard: 35,
      fast: 45,
    },
    blockConfirmations: 128,
    isTestnet: false,
  },
};

// Contract addresses for different networks
export const CONTRACT_ADDRESSES: Record<string, ContractAddresses> = {
  localhost: {
    VendorCompliance: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    DeliveryLog: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ComplianceToken: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  },
  
  sepolia: {
    VendorCompliance: "0x0000000000000000000000000000000000000000", // To be updated after deployment
    DeliveryLog: "0x0000000000000000000000000000000000000000",
    ComplianceToken: "0x0000000000000000000000000000000000000000",
  },
  
  mumbai: {
    VendorCompliance: "0x0000000000000000000000000000000000000000",
    DeliveryLog: "0x0000000000000000000000000000000000000000",
    ComplianceToken: "0x0000000000000000000000000000000000000000",
  },
  
  bscTestnet: {
    VendorCompliance: "0x0000000000000000000000000000000000000000",
    DeliveryLog: "0x0000000000000000000000000000000000000000",
    ComplianceToken: "0x0000000000000000000000000000000000000000",
  },
  
  mainnet: {
    VendorCompliance: "0x0000000000000000000000000000000000000000",
    DeliveryLog: "0x0000000000000000000000000000000000000000",
    ComplianceToken: "0x0000000000000000000000000000000000000000",
  },
  
  polygon: {
    VendorCompliance: "0x0000000000000000000000000000000000000000",
    DeliveryLog: "0x0000000000000000000000000000000000000000",
    ComplianceToken: "0x0000000000000000000000000000000000000000",
  },
};

// Main blockchain configuration
export const BLOCKCHAIN_CONFIG: BlockchainConfig = {
  isDemoMode: process.env.NODE_ENV !== "production",
  defaultNetwork: process.env.REACT_APP_DEFAULT_NETWORK || "localhost",
  networks: NETWORKS,
  contracts: CONTRACT_ADDRESSES,
  features: {
    enableRealTimeUpdates: true,
    enableGasOptimization: true,
    enableTransactionRetry: true,
    maxRetryAttempts: 3,
    retryDelay: 2000, // 2 seconds
  },
  demo: {
    mockTransactionDelay: 1500, // 1.5 seconds
    mockGasPrice: 20, // gwei
    simulateNetworkLatency: true,
    generateRealisticHashes: true,
  },
};

// Demo mode utilities
export const DEMO_UTILS = {
  // Generate realistic transaction hash
  generateTxHash: (): string => {
    const chars = "0123456789abcdef";
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  },
  
  // Generate realistic block number
  generateBlockNumber: (): number => {
    return Math.floor(Math.random() * 1000000) + 18000000;
  },
  
  // Generate realistic timestamp
  generateTimestamp: (): number => {
    const now = Date.now();
    return Math.floor(now / 1000) - Math.floor(Math.random() * 3600); // Within last hour
  },
  
  // Generate realistic gas used
  generateGasUsed: (): number => {
    return Math.floor(Math.random() * 500000) + 21000;
  },
  
  // Generate realistic gas price
  generateGasPrice: (): number => {
    return Math.floor(Math.random() * 50) + 10; // 10-60 gwei
  },
  
  // Simulate network delay
  simulateNetworkDelay: async (ms: number = 1000): Promise<void> => {
    if (BLOCKCHAIN_CONFIG.demo.simulateNetworkLatency) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  
  // Generate mock compliance record
  generateMockComplianceRecord: (vendorId: number) => ({
    id: Math.floor(Math.random() * 10000),
    vendorId,
    score: Math.floor(Math.random() * 40) + 60, // 60-100
    level: Math.floor(Math.random() * 4), // 0-3
    reason: "Automated assessment",
    timestamp: DEMO_UTILS.generateTimestamp(),
    txHash: DEMO_UTILS.generateTxHash(),
    blockNumber: DEMO_UTILS.generateBlockNumber(),
    gasUsed: DEMO_UTILS.generateGasUsed(),
  }),
  
  // Generate mock delivery record
  generateMockDeliveryRecord: (vendorId: number) => ({
    id: Math.floor(Math.random() * 10000),
    vendorId,
    trackingNumber: `TN${Math.floor(Math.random() * 1000000)}`,
    status: Math.floor(Math.random() * 5), // 0-4
    verificationStatus: Math.floor(Math.random() * 4), // 0-3
    timestamp: DEMO_UTILS.generateTimestamp(),
    txHash: DEMO_UTILS.generateTxHash(),
    blockNumber: DEMO_UTILS.generateBlockNumber(),
    gasUsed: DEMO_UTILS.generateGasUsed(),
  }),
};

// Web3 provider configuration
export const WEB3_CONFIG = {
  // Connection settings
  connection: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Transaction settings
  transaction: {
    gasLimit: 2000000,
    gasPrice: "auto", // Auto-calculate gas price
    confirmations: 1, // Number of confirmations to wait for
    timeout: 300000, // 5 minutes timeout
  },
  
  // Polling settings
  polling: {
    blockTime: 13000, // 13 seconds for Ethereum
    interval: 4000, // 4 seconds polling interval
  },
};

// Contract ABI imports (placeholder - to be updated with actual ABIs)
export const CONTRACT_ABIS = {
  VendorCompliance: [], // Import from artifacts/contracts/VendorCompliance.sol/VendorCompliance.json
  DeliveryLog: [], // Import from artifacts/contracts/DeliveryLog.sol/DeliveryLog.json
  ComplianceToken: [], // Import from artifacts/contracts/ComplianceToken.sol/ComplianceToken.json
};

// Environment-specific configuration
export const getNetworkConfig = (networkName?: string): NetworkConfig => {
  const network = networkName || BLOCKCHAIN_CONFIG.defaultNetwork;
  const config = BLOCKCHAIN_CONFIG.networks[network];
  
  if (!config) {
    throw new Error(`Network configuration not found for: ${network}`);
  }
  
  return config;
};

// Get contract addresses for current network
export const getContractAddresses = (networkName?: string): ContractAddresses => {
  const network = networkName || BLOCKCHAIN_CONFIG.defaultNetwork;
  const addresses = BLOCKCHAIN_CONFIG.contracts[network];
  
  if (!addresses) {
    throw new Error(`Contract addresses not found for network: ${network}`);
  }
  
  return addresses;
};

// Helper function to get explorer URL for transaction
export const getExplorerUrl = (txHash: string, networkName?: string): string => {
  const network = getNetworkConfig(networkName);
  return `${network.explorerUrl}/tx/${txHash}`;
};

// Helper function to get explorer URL for address
export const getAddressExplorerUrl = (address: string, networkName?: string): string => {
  const network = getNetworkConfig(networkName);
  return `${network.explorerUrl}/address/${address}`;
};

// Helper function to format gas price
export const formatGasPrice = (gasPrice: number): string => {
  return `${gasPrice.toFixed(2)} gwei`;
};

// Helper function to format Ether amount
export const formatEther = (amount: number): string => {
  return `${amount.toFixed(6)} ETH`;
};

// Export default configuration
export default BLOCKCHAIN_CONFIG;