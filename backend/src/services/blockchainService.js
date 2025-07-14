const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.vendorComplianceContract = null;
    this.deliveryLogContract = null;
    this.isInitialized = false;
    
    // Load contract ABIs
    this.loadContractABIs();
  }

  /**
   * Initialize blockchain service
   */
  async initialize() {
    try {
      console.log('🔗 Initializing blockchain service...');

      // Setup provider
      const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      // Setup signer
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required');
      }
      this.signer = new ethers.Wallet(privateKey, this.provider);

      // Load blockchain config
      const config = this.loadBlockchainConfig();
      
      // Initialize contracts
      this.vendorComplianceContract = new ethers.Contract(
        config.contracts.VendorCompliance.address,
        this.vendorComplianceABI,
        this.signer
      );

      this.deliveryLogContract = new ethers.Contract(
        config.contracts.DeliveryLog.address,
        this.deliveryLogABI,
        this.signer
      );

      // Test connection
      await this.testConnection();

      this.isInitialized = true;
      console.log('✅ Blockchain service initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
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
      
      console.log(`📡 Connected to network: ${network.name} (${network.chainId})`);
      console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
      
      return true;
    } catch (error) {
      console.error('❌ Blockchain connection test failed:', error);
      throw error;
    }
  }

  /**
   * Register a new vendor on blockchain
   */
  async registerVendor(vendorData) {
    try {
      this.ensureInitialized();

      const { name, email, walletAddress, certifications } = vendorData;

      console.log(`📝 Registering vendor: ${name} on blockchain...`);

      const tx = await this.vendorComplianceContract.registerVendor(
        name,
        email,
        walletAddress || this.signer.address,
        certifications || []
      );

      const receipt = await tx.wait();
      
      // Extract vendor ID from events
      const vendorRegisteredEvent = receipt.events.find(
        event => event.event === 'VendorRegistered'
      );
      
      const vendorId = vendorRegisteredEvent?.args?.vendorId?.toNumber();

      console.log(`✅ Vendor registered on blockchain with ID: ${vendorId}`);

      return {
        vendorId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
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
      this.ensureInitialized();

      console.log(`📊 Updating compliance score for vendor ${vendorId}: ${score}`);

      const tx = await this.vendorComplianceContract.updateComplianceScore(
        vendorId,
        score,
        reason || 'Automated compliance update'
      );

      const receipt = await tx.wait();

      console.log(`✅ Compliance score updated on blockchain`);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('❌ Failed to update vendor compliance:', error);
      throw new Error(`Compliance update failed: ${error.message}`);
    }
  }

  /**
   * Get vendor information from blockchain
   */
  async getVendor(vendorId) {
    try {
      this.ensureInitialized();

      const vendor = await this.vendorComplianceContract.getVendor(vendorId);
      
      return {
        id: vendor.id.toNumber(),
        name: vendor.name,
        email: vendor.email,
        walletAddress: vendor.walletAddress,
        complianceScore: vendor.complianceScore.toNumber(),
        complianceLevel: vendor.complianceLevel,
        registrationDate: new Date(vendor.registrationDate.toNumber() * 1000),
        isActive: vendor.isActive,
        totalDeliveries: vendor.totalDeliveries.toNumber(),
        successfulDeliveries: vendor.successfulDeliveries.toNumber(),
        certifications: vendor.certifications
      };

    } catch (error) {
      console.error(`❌ Failed to get vendor ${vendorId}:`, error);
      throw new Error(`Failed to fetch vendor: ${error.message}`);
    }
  }

  /**
   * Get vendor compliance history
   */
  async getVendorComplianceHistory(vendorId) {
    try {
      this.ensureInitialized();

      const history = await this.vendorComplianceContract.getVendorComplianceHistory(vendorId);
      
      return history.map(record => ({
        id: record.id.toNumber(),
        vendorId: record.vendorId.toNumber(),
        score: record.score.toNumber(),
        level: record.level,
        reason: record.reason,
        timestamp: new Date(record.timestamp.toNumber() * 1000),
        updatedBy: record.updatedBy
      }));

    } catch (error) {
      console.error(`❌ Failed to get compliance history for vendor ${vendorId}:`, error);
      throw new Error(`Failed to fetch compliance history: ${error.message}`);
    }
  }

  /**
   * Create a delivery record on blockchain
   */
  async createDelivery(deliveryData) {
    try {
      this.ensureInitialized();

      const {
        vendorId,
        purchaseOrderId,
        trackingNumber,
        expectedDeliveryDate,
        deliveryLocation,
        items,
        totalValue,
        notes
      } = deliveryData;

      console.log(`📦 Creating delivery record: ${trackingNumber} on blockchain...`);

      const tx = await this.deliveryLogContract.createDelivery(
        vendorId,
        purchaseOrderId,
        trackingNumber,
        Math.floor(new Date(expectedDeliveryDate).getTime() / 1000),
        deliveryLocation,
        items || [],
        totalValue || 0,
        notes || ''
      );

      const receipt = await tx.wait();
      
      // Extract delivery ID from events
      const deliveryCreatedEvent = receipt.events.find(
        event => event.event === 'DeliveryCreated'
      );
      
      const deliveryId = deliveryCreatedEvent?.args?.deliveryId?.toNumber();

      console.log(`✅ Delivery created on blockchain with ID: ${deliveryId}`);

      return {
        deliveryId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('❌ Failed to create delivery on blockchain:', error);
      throw new Error(`Delivery creation failed: ${error.message}`);
    }
  }

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(deliveryId, status, location, notes) {
    try {
      this.ensureInitialized();

      console.log(`📊 Updating delivery status: ${deliveryId} -> ${status}`);

      // Convert status string to enum value
      const statusEnum = this.getDeliveryStatusEnum(status);

      const tx = await this.deliveryLogContract.updateDeliveryStatus(
        deliveryId,
        statusEnum,
        location || '',
        notes || 'Status updated'
      );

      const receipt = await tx.wait();

      console.log(`✅ Delivery status updated on blockchain`);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('❌ Failed to update delivery status:', error);
      throw new Error(`Status update failed: ${error.message}`);
    }
  }

  /**
   * Verify delivery with QR code
   */
  async verifyDelivery(deliveryId, scannedCode, imageHash) {
    try {
      this.ensureInitialized();

      console.log(`🔍 Verifying delivery ${deliveryId} with QR code...`);

      const tx = await this.deliveryLogContract.verifyDeliveryWithCode(
        deliveryId,
        scannedCode,
        imageHash || ''
      );

      const receipt = await tx.wait();

      console.log(`✅ Delivery verification completed`);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('❌ Failed to verify delivery:', error);
      throw new Error(`Delivery verification failed: ${error.message}`);
    }
  }

  /**
   * Get delivery information
   */
  async getDelivery(deliveryId) {
    try {
      this.ensureInitialized();

      const delivery = await this.deliveryLogContract.getDelivery(deliveryId);
      
      return {
        id: delivery.id.toNumber(),
        vendorId: delivery.vendorId.toNumber(),
        purchaseOrderId: delivery.purchaseOrderId,
        trackingNumber: delivery.trackingNumber,
        status: delivery.status,
        verificationStatus: delivery.verificationStatus,
        createdDate: new Date(delivery.createdDate.toNumber() * 1000),
        expectedDeliveryDate: new Date(delivery.expectedDeliveryDate.toNumber() * 1000),
        actualDeliveryDate: delivery.actualDeliveryDate.toNumber() > 0 
          ? new Date(delivery.actualDeliveryDate.toNumber() * 1000) 
          : null,
        createdBy: delivery.createdBy,
        verifiedBy: delivery.verifiedBy,
        deliveryLocation: delivery.deliveryLocation,
        itemsDelivered: delivery.itemsDelivered,
        totalValue: delivery.totalValue.toNumber(),
        notes: delivery.notes
      };

    } catch (error) {
      console.error(`❌ Failed to get delivery ${deliveryId}:`, error);
      throw new Error(`Failed to fetch delivery: ${error.message}`);
    }
  }

  /**
   * Get delivery by tracking number
   */
  async getDeliveryByTrackingNumber(trackingNumber) {
    try {
      this.ensureInitialized();

      const deliveryId = await this.deliveryLogContract.getDeliveryByTrackingNumber(trackingNumber);
      
      if (deliveryId.toNumber() === 0) {
        return null;
      }

      return await this.getDelivery(deliveryId.toNumber());

    } catch (error) {
      console.error(`❌ Failed to get delivery by tracking number:`, error);
      throw new Error(`Failed to fetch delivery: ${error.message}`);
    }
  }

  /**
   * Get vendor delivery statistics
   */
  async getVendorDeliveryStats(vendorId) {
    try {
      this.ensureInitialized();

      const stats = await this.deliveryLogContract.getVendorDeliveryStats(vendorId);
      
      return {
        totalDeliveries: stats.totalDeliveries.toNumber(),
        completedDeliveries: stats.completedDeliveries.toNumber(),
        pendingDeliveries: stats.pendingDeliveries.toNumber(),
        overdueDeliveries: stats.overdueDeliveries.toNumber()
      };

    } catch (error) {
      console.error(`❌ Failed to get vendor delivery stats:`, error);
      throw new Error(`Failed to fetch delivery stats: ${error.message}`);
    }
  }

  /**
   * Utility methods
   */
  ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized. Call initialize() first.');
    }
  }

  getDeliveryStatusEnum(status) {
    const statusMap = {
      'PENDING': 0,
      'IN_TRANSIT': 1,
      'DELIVERED': 2,
      'REJECTED': 3,
      'CANCELLED': 4
    };
    return statusMap[status] || 0;
  }

  loadBlockchainConfig() {
    try {
      const configPath = path.join(__dirname, '../config/blockchain.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config;
    } catch (error) {
      console.error('❌ Failed to load blockchain config:', error);
      throw new Error('Blockchain configuration not found. Run deployment script first.');
    }
  }

  loadContractABIs() {
    // Simplified ABIs for the essential functions
    this.vendorComplianceABI = [
      "function registerVendor(string memory _name, string memory _email, address _walletAddress, string[] memory _certifications) external returns (uint256)",
      "function updateComplianceScore(uint256 _vendorId, uint256 _score, string memory _reason) external",
      "function getVendor(uint256 _vendorId) external view returns (uint256 id, string memory name, string memory email, address walletAddress, uint256 complianceScore, uint8 complianceLevel, uint256 registrationDate, bool isActive, uint256 totalDeliveries, uint256 successfulDeliveries, string[] memory certifications)",
      "function getVendorComplianceHistory(uint256 _vendorId) external view returns (tuple(uint256 id, uint256 vendorId, uint256 score, uint8 level, string reason, uint256 timestamp, address updatedBy)[])",
      "function getTotalVendors() external view returns (uint256)",
      "event VendorRegistered(uint256 indexed vendorId, string name, address walletAddress)",
      "event ComplianceUpdated(uint256 indexed vendorId, uint256 score, uint8 level)"
    ];

    this.deliveryLogABI = [
      "function createDelivery(uint256 _vendorId, string memory _purchaseOrderId, string memory _trackingNumber, uint256 _expectedDeliveryDate, string memory _deliveryLocation, string[] memory _itemsDelivered, uint256 _totalValue, string memory _notes) external returns (uint256)",
      "function updateDeliveryStatus(uint256 _deliveryId, uint8 _newStatus, string memory _location, string memory _notes) external",
      "function verifyDeliveryWithCode(uint256 _deliveryId, string memory _scannedCode, string memory _imageHash) external returns (bool)",
      "function getDelivery(uint256 _deliveryId) external view returns (tuple(uint256 id, uint256 vendorId, string purchaseOrderId, string trackingNumber, uint8 status, uint8 verificationStatus, uint256 createdDate, uint256 expectedDeliveryDate, uint256 actualDeliveryDate, address createdBy, address verifiedBy, string deliveryLocation, string[] itemsDelivered, uint256 totalValue, string notes))",
      "function getDeliveryByTrackingNumber(string memory _trackingNumber) external view returns (uint256)",
      "function getVendorDeliveryStats(uint256 _vendorId) external view returns (uint256 totalDeliveries, uint256 completedDeliveries, uint256 pendingDeliveries, uint256 overdueDeliveries)",
      "function getTotalDeliveries() external view returns (uint256)",
      "event DeliveryCreated(uint256 indexed deliveryId, uint256 indexed vendorId, string trackingNumber)",
      "event DeliveryStatusUpdated(uint256 indexed deliveryId, uint8 previousStatus, uint8 newStatus)"
    ];
  }
}

// Export singleton instance
const blockchainService = new BlockchainService();

module.exports = blockchainService;