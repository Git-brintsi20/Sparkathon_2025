// backend/src/services/blockchainService.js
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class BlockchainService extends EventEmitter {
  constructor() {
    super();
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.isInitialized = false;
    this.networkId = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true';
    
    // Load contract ABIs
    this.loadContractABIs();
  }

  /**
   * Initialize blockchain service
   */
  async initialize() {
    try {
      console.log('🔗 Initializing blockchain service...');

      if (this.isDemoMode) {
        return this.initializeDemoMode();
      }

      // Setup provider with fallback
      await this.setupProvider();

      // Setup signer
      await this.setupSigner();

      // Load blockchain config
      const config = await this.loadBlockchainConfig();
      
      // Initialize contracts
      await this.initializeContracts(config);

      // Test connection
      await this.testConnection();

      // Setup event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('✅ Blockchain service initialized successfully');

      return { success: true, networkId: this.networkId };

    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Initialize demo mode
   */
  initializeDemoMode() {
    console.log('🎭 Running in demo mode - using mock blockchain data');
    this.isInitialized = true;
    this.networkId = 1337; // Local network ID
    return { success: true, networkId: this.networkId, demoMode: true };
  }

  /**
   * Setup provider with fallback URLs
   */
  async setupProvider() {
    const rpcUrls = [
      process.env.RPC_URL,
      process.env.RPC_URL_BACKUP,
      'http://localhost:8545'
    ].filter(Boolean);

    for (const url of rpcUrls) {
      try {
        console.log(`🔄 Trying RPC URL: ${url}`);
        this.provider = new ethers.providers.JsonRpcProvider(url);
        
        // Test connection
        const network = await this.provider.getNetwork();
        this.networkId = network.chainId;
        console.log(`✅ Connected to ${network.name} (${network.chainId})`);
        return;
      } catch (error) {
        console.warn(`⚠️  Failed to connect to ${url}:`, error.message);
        continue;
      }
    }

    throw new Error('Failed to connect to any RPC provider');
  }

  /**
   * Setup signer
   */
  async setupSigner() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }

    this.signer = new ethers.Wallet(privateKey, this.provider);
    console.log(`🔑 Signer address: ${this.signer.address}`);
  }

  /**
   * Initialize contracts
   */
  async initializeContracts(config) {
    try {
      this.contracts.VendorCompliance = new ethers.Contract(
        config.contracts.VendorCompliance.address,
        this.vendorComplianceABI,
        this.signer
      );

      this.contracts.DeliveryLog = new ethers.Contract(
        config.contracts.DeliveryLog.address,
        this.deliveryLogABI,
        this.signer
      );

      console.log('📄 Contracts initialized');
    } catch (error) {
      console.error('❌ Failed to initialize contracts:', error);
      throw error;
    }
  }

  /**
   * Test blockchain connection
   */
  async testConnection() {
    try {
      const network = await this.provider.getNetwork();
      const balance = await this.signer.getBalance();
      const gasPrice = await this.provider.getGasPrice();
      
      console.log(`📡 Network: ${network.name} (${network.chainId})`);
      console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
      console.log(`⛽ Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`);
      
      return {
        network: network.name,
        chainId: network.chainId,
        balance: ethers.utils.formatEther(balance),
        gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei')
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for contract events
   */
  setupEventListeners() {
    try {
      // Listen for vendor registration events
      this.contracts.VendorCompliance.on('VendorRegistered', (vendorId, name, walletAddress, event) => {
        console.log(`📝 Vendor registered: ${name} (ID: ${vendorId})`);
        this.emit('vendorRegistered', {
          vendorId: vendorId.toString(),
          name,
          walletAddress,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      });

      // Listen for compliance updates
      this.contracts.VendorCompliance.on('ComplianceUpdated', (vendorId, score, level, event) => {
        console.log(`📊 Compliance updated: Vendor ${vendorId} -> Score: ${score}`);
        this.emit('complianceUpdated', {
          vendorId: vendorId.toString(),
          score: score.toString(),
          level: level.toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      });

      // Listen for delivery events
      this.contracts.DeliveryLog.on('DeliveryCreated', (deliveryId, vendorId, trackingNumber, event) => {
        console.log(`📦 Delivery created: ${trackingNumber} (ID: ${deliveryId})`);
        this.emit('deliveryCreated', {
          deliveryId: deliveryId.toString(),
          vendorId: vendorId.toString(),
          trackingNumber,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      });

      console.log('👂 Event listeners set up');
    } catch (error) {
      console.error('❌ Failed to setup event listeners:', error);
    }
  }

  /**
   * Execute transaction with retry logic
   */
  async executeTransaction(contractMethod, params = [], options = {}) {
    this.ensureInitialized();

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Executing transaction (attempt ${attempt}/${this.retryAttempts})`);

        // Estimate gas
        const gasEstimate = await contractMethod.estimateGas(...params);
        const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

        // Get current gas price
        const gasPrice = await this.provider.getGasPrice();

        // Execute transaction
        const tx = await contractMethod(...params, {
          gasLimit,
          gasPrice,
          ...options
        });

        console.log(`⏳ Transaction sent: ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        console.log(`✅ Transaction confirmed: ${receipt.transactionHash}`);

        return {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          status: receipt.status,
          events: receipt.events
        };

      } catch (error) {
        console.error(`❌ Transaction attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.retryAttempts) {
          throw new Error(`Transaction failed after ${this.retryAttempts} attempts: ${error.message}`);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  /**
   * Register a new vendor on blockchain
   */
  async registerVendor(vendorData) {
    try {
      const { name, email, walletAddress, certifications } = vendorData;

      console.log(`📝 Registering vendor: ${name} on blockchain...`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('registerVendor', { name, email });
      }

      const result = await this.executeTransaction(
        this.contracts.VendorCompliance.registerVendor,
        [
          name,
          email,
          walletAddress || this.signer.address,
          certifications || []
        ]
      );

      // Extract vendor ID from events
      const vendorRegisteredEvent = result.events.find(
        event => event.event === 'VendorRegistered'
      );
      
      const vendorId = vendorRegisteredEvent?.args?.vendorId?.toNumber();

      console.log(`✅ Vendor registered on blockchain with ID: ${vendorId}`);

      return {
        vendorId,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      };

    } catch (error) {
      console.error('❌ Failed to register vendor on blockchain:', error);
      throw new Error(`Blockchain registration failed: ${error.message}`);
    }
  }

  /**
   * Update vendor compliance score
   */
  async updateVendorCompliance(vendorId, score, reason) {
    try {
      console.log(`📊 Updating compliance score for vendor ${vendorId}: ${score}`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('updateCompliance', { vendorId, score });
      }

      const result = await this.executeTransaction(
        this.contracts.VendorCompliance.updateComplianceScore,
        [vendorId, score, reason || 'Automated compliance update']
      );

      console.log(`✅ Compliance score updated on blockchain`);

      return {
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      };

    } catch (error) {
      console.error('❌ Failed to update vendor compliance:', error);
      throw new Error(`Compliance update failed: ${error.message}`);
    }
  }

  /**
   * Create a delivery record on blockchain
   */
  async createDelivery(deliveryData) {
    try {
      const { vendorId, purchaseOrderId, trackingNumber } = deliveryData;

      console.log(`📦 Creating delivery record: ${trackingNumber} on blockchain...`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('createDelivery', { trackingNumber });
      }

      const result = await this.executeTransaction(
        this.contracts.DeliveryLog.createDelivery,
        [
          vendorId,
          purchaseOrderId,
          trackingNumber,
          Math.floor(new Date(deliveryData.expectedDeliveryDate).getTime() / 1000),
          deliveryData.deliveryLocation,
          deliveryData.items || [],
          deliveryData.totalValue || 0,
          deliveryData.notes || ''
        ]
      );

      // Extract delivery ID from events
      const deliveryCreatedEvent = result.events.find(
        event => event.event === 'DeliveryCreated'
      );
      
      const deliveryId = deliveryCreatedEvent?.args?.deliveryId?.toNumber();

      console.log(`✅ Delivery created on blockchain with ID: ${deliveryId}`);

      return {
        deliveryId,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      };

    } catch (error) {
      console.error('❌ Failed to create delivery on blockchain:', error);
      throw new Error(`Delivery creation failed: ${error.message}`);
    }
  }

  /**
   * Generate mock transaction for demo mode
   */
  generateMockTransaction(action, data) {
    const mockHash = '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const mockBlockNumber = Math.floor(Math.random() * 1000000) + 15000000;
    const mockGasUsed = Math.floor(Math.random() * 100000) + 50000;

    console.log(`🎭 Mock transaction generated: ${mockHash}`);

    return {
      transactionHash: mockHash,
      blockNumber: mockBlockNumber,
      gasUsed: mockGasUsed.toString(),
      vendorId: data.vendorId || Math.floor(Math.random() * 1000) + 1,
      deliveryId: data.deliveryId || Math.floor(Math.random() * 1000) + 1,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get blockchain explorer URL
   */
  getExplorerUrl(txHash) {
    const explorerUrls = {
      1: 'https://etherscan.io/tx/',
      3: 'https://ropsten.etherscan.io/tx/',
      4: 'https://rinkeby.etherscan.io/tx/',
      5: 'https://goerli.etherscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      80001: 'https://mumbai.polygonscan.com/tx/',
      1337: 'http://localhost:8545/tx/' // Local development
    };

    const baseUrl = explorerUrls[this.networkId] || explorerUrls[1];
    return `${baseUrl}${txHash}`;
  }

  /**
   * Utility methods
   */
  ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized. Call initialize() first.');
    }
  }

  loadBlockchainConfig() {
    try {
      const configPath = path.join(__dirname, '../config/blockchain.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config;
    } catch (error) {
      console.error('❌ Failed to load blockchain config:', error);
      // Return mock config for demo mode
      return {
        contracts: {
          VendorCompliance: { address: '0x' + '0'.repeat(40) },
          DeliveryLog: { address: '0x' + '1'.repeat(40) }
        }
      };
    }
  }

  loadContractABIs() {
    // Simplified ABIs for the essential functions
    this.vendorComplianceABI = [
      "function registerVendor(string memory _name, string memory _email, address _walletAddress, string[] memory _certifications) external returns (uint256)",
      "function updateComplianceScore(uint256 _vendorId, uint256 _score, string memory _reason) external",
      "function getVendor(uint256 _vendorId) external view returns (uint256 id, string memory name, string memory email, address walletAddress, uint256 complianceScore, uint8 complianceLevel, uint256 registrationDate, bool isActive, uint256 totalDeliveries, uint256 successfulDeliveries, string[] memory certifications)",
      "event VendorRegistered(uint256 indexed vendorId, string name, address walletAddress)",
      "event ComplianceUpdated(uint256 indexed vendorId, uint256 score, uint8 level)"
    ];

    this.deliveryLogABI = [
      "function createDelivery(uint256 _vendorId, string memory _purchaseOrderId, string memory _trackingNumber, uint256 _expectedDeliveryDate, string memory _deliveryLocation, string[] memory _itemsDelivered, uint256 _totalValue, string memory _notes) external returns (uint256)",
      "function updateDeliveryStatus(uint256 _deliveryId, uint8 _newStatus, string memory _location, string memory _notes) external",
      "function verifyDeliveryWithCode(uint256 _deliveryId, string memory _scannedCode, string memory _imageHash) external returns (bool)",
      "event DeliveryCreated(uint256 indexed deliveryId, uint256 indexed vendorId, string trackingNumber)",
      "event DeliveryStatusUpdated(uint256 indexed deliveryId, uint8 previousStatus, uint8 newStatus)"
    ];
  }
}

// Export singleton instance
const blockchainService = new BlockchainService();

module.exports = blockchainService;