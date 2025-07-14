// frontend/src/services/blockchainService.ts

// TypeScript interfaces for blockchain data
export interface BlockchainTransaction {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  explorerUrl: string;
}

export interface VendorBlockchainData {
  vendorId: number;
  name: string;
  email: string;
  walletAddress: string;
  complianceScore: number;
  complianceLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  registrationDate: string;
  isActive: boolean;
  blockchainTx: BlockchainTransaction;
}

export interface DeliveryBlockchainData {
  deliveryId: number;
  vendorId: number;
  trackingNumber: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
  createdDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  blockchainTx: BlockchainTransaction;
}

export interface ComplianceHistory {
  id: number;
  vendorId: number;
  score: number;
  level: string;
  reason: string;
  timestamp: string;
  updatedBy: string;
  blockchainTx: BlockchainTransaction;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  balance: string;
  gasPrice: string;
  connected: boolean;
}

export interface BlockchainEvent {
  type: 'vendorRegistered' | 'complianceUpdated' | 'deliveryCreated' | 'deliveryStatusUpdated';
  data: any;
  timestamp: string;
  transactionHash: string;
}

// Simple API service interface for blockchain calls
interface ApiService {
  get: (url: string) => Promise<{ data: any }>;
  post: (url: string, data: any) => Promise<{ data: any }>;
}

// Mock API service for demo mode
const createMockApiService = (): ApiService => ({
  get: async (url: string) => {
    console.log(`🎭 Mock API GET: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { data: {} };
  },
  post: async (url: string, data: any) => {
    console.log(`🎭 Mock API POST: ${url}`, data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { data: {} };
  }
});

class BlockchainService {
  private isDemoMode: boolean;
  private networkInfo: NetworkInfo | null = null;
  private eventListeners: Map<string, ((event: BlockchainEvent) => void)[]> = new Map();
  private mockTransactionCounter = 0;
  private apiService: ApiService;

  constructor() {
    this.isDemoMode = import.meta.env.MODE === 'development' || import.meta.env.VITE_DEMO_MODE === 'true';
    this.apiService = createMockApiService();
    this.initializeDemoData();
  }

  /**
   * Initialize blockchain service
   */
  async initialize(): Promise<NetworkInfo> {
    try {
      console.log('🔗 Initializing blockchain service...');

      if (this.isDemoMode) {
        return this.initializeDemoMode();
      }

      // For production, this would connect to actual blockchain via backend
      try {
        const response = await fetch('/api/blockchain/init');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.networkInfo = data;
      } catch (error) {
        console.warn('Failed to connect to backend, falling back to demo mode:', error);
        return this.initializeDemoMode();
      }

      console.log('✅ Blockchain service initialized');
      return this.networkInfo!;

    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      // Fallback to demo mode on error
      return this.initializeDemoMode();
    }
  }

  /**
   * Initialize demo mode with mock data
   */
  private initializeDemoMode(): NetworkInfo {
    console.log('🎭 Running in demo mode - using mock blockchain data');
    
    this.networkInfo = {
      chainId: 1337,
      name: 'Localhost Development',
      balance: '10.0',
      gasPrice: '20.0',
      connected: true
    };

    // Simulate some blockchain events for demo
    this.simulateBlockchainEvents();

    return this.networkInfo;
  }

  /**
   * Initialize demo data simulation
   */
  private initializeDemoData(): void {
    // This runs in constructor, no async operations
    if (this.isDemoMode) {
      console.log('🎭 Demo mode initialized');
    }
  }

  /**
   * Simulate blockchain events for demo
   */
  private simulateBlockchainEvents(): void {
    setTimeout(() => {
      this.emitEvent({
        type: 'vendorRegistered',
        data: { vendorId: 1, name: 'Demo Vendor' },
        timestamp: new Date().toISOString(),
        transactionHash: this.generateMockHash()
      });
    }, 2000);

    setTimeout(() => {
      this.emitEvent({
        type: 'deliveryCreated',
        data: { deliveryId: 1, trackingNumber: 'TRK001' },
        timestamp: new Date().toISOString(),
        transactionHash: this.generateMockHash()
      });
    }, 4000);
  }

  /**
   * Register vendor on blockchain
   */
  async registerVendor(vendorData: {
    name: string;
    email: string;
    walletAddress?: string;
    certifications?: string[];
  }): Promise<VendorBlockchainData> {
    try {
      console.log(`📝 Registering vendor: ${vendorData.name} on blockchain...`);

      if (this.isDemoMode) {
        return this.generateMockVendorRegistration(vendorData);
      }

      const response = await fetch('/api/blockchain/vendor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to register vendor on blockchain:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Blockchain registration failed: ${errorMessage}`);
    }
  }

  /**
   * Update vendor compliance score
   */
  async updateVendorCompliance(
    vendorId: number, 
    score: number, 
    reason: string
  ): Promise<BlockchainTransaction> {
    try {
      console.log(`📊 Updating compliance score for vendor ${vendorId}: ${score}`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('updateCompliance', { vendorId, score });
      }

      const response = await fetch('/api/blockchain/vendor/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorId,
          score,
          reason
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to update vendor compliance:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Compliance update failed: ${errorMessage}`);
    }
  }

  /**
   * Create delivery record on blockchain
   */
  async createDelivery(deliveryData: {
    vendorId: number;
    purchaseOrderId: string;
    trackingNumber: string;
    expectedDeliveryDate: string;
    deliveryLocation: string;
    items?: string[];
    totalValue?: number;
    notes?: string;
  }): Promise<DeliveryBlockchainData> {
    try {
      console.log(`📦 Creating delivery record: ${deliveryData.trackingNumber} on blockchain...`);

      if (this.isDemoMode) {
        return this.generateMockDeliveryCreation(deliveryData);
      }

      const response = await fetch('/api/blockchain/delivery/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to create delivery on blockchain:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Delivery creation failed: ${errorMessage}`);
    }
  }

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(
    deliveryId: number,
    status: string,
    location?: string,
    notes?: string
  ): Promise<BlockchainTransaction> {
    try {
      console.log(`📊 Updating delivery status: ${deliveryId} -> ${status}`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('updateDeliveryStatus', { deliveryId, status });
      }

      const response = await fetch('/api/blockchain/delivery/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryId,
          status,
          location,
          notes
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to update delivery status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Status update failed: ${errorMessage}`);
    }
  }

  /**
   * Verify delivery with QR code
   */
  async verifyDelivery(
    deliveryId: number,
    scannedCode: string,
    imageHash?: string
  ): Promise<BlockchainTransaction> {
    try {
      console.log(`🔍 Verifying delivery ${deliveryId} with QR code...`);

      if (this.isDemoMode) {
        return this.generateMockTransaction('verifyDelivery', { deliveryId, scannedCode });
      }

      const response = await fetch('/api/blockchain/delivery/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryId,
          scannedCode,
          imageHash
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to verify delivery:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Delivery verification failed: ${errorMessage}`);
    }
  }

  /**
   * Get vendor compliance history
   */
  async getVendorComplianceHistory(vendorId: number): Promise<ComplianceHistory[]> {
    try {
      if (this.isDemoMode) {
        return this.generateMockComplianceHistory(vendorId);
      }

      const response = await fetch(`/api/blockchain/vendor/${vendorId}/compliance-history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Failed to get compliance history:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch compliance history: ${errorMessage}`);
    }
  }

  /**
   * Get blockchain explorer URL
   */
  getExplorerUrl(txHash: string): string {
    const explorerUrls: { [key: number]: string } = {
      1: 'https://etherscan.io/tx/',
      3: 'https://ropsten.etherscan.io/tx/',
      4: 'https://rinkeby.etherscan.io/tx/',
      5: 'https://goerli.etherscan.io/tx/',
      137: 'https://polygonscan.com/tx/',
      80001: 'https://mumbai.polygonscan.com/tx/',
      1337: 'http://localhost:8545/tx/' // Local development
    };

    const chainId = this.networkInfo?.chainId || 1;
    const baseUrl = explorerUrls[chainId] || explorerUrls[1];
    return `${baseUrl}${txHash}`;
  }

  /**
   * Event listener management
   */
  addEventListener(eventType: string, callback: (event: BlockchainEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: (event: BlockchainEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: BlockchainEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach(callback => callback(event));
  }

  /**
   * Generate mock transaction for demo
   */
  private generateMockTransaction(action: string, data?: any): BlockchainTransaction {
    this.mockTransactionCounter++;
    
    const mockHash = this.generateMockHash();
    const mockBlockNumber = Math.floor(Math.random() * 1000000) + 15000000;
    const mockGasUsed = Math.floor(Math.random() * 100000) + 50000;
    const timestamp = new Date().toISOString();

    const transaction: BlockchainTransaction = {
      transactionHash: mockHash,
      blockNumber: mockBlockNumber,
      gasUsed: mockGasUsed.toString(),
      timestamp,
      status: 'confirmed',
      explorerUrl: this.getExplorerUrl(mockHash)
    };

    console.log(`🎭 Mock transaction generated: ${mockHash}`);

    // Emit event for listeners
    this.emitEvent({
      type: this.getEventTypeFromAction(action),
      data: { ...data, transaction },
      timestamp,
      transactionHash: mockHash
    });

    return transaction;
  }

  /**
   * Generate mock hash
   */
  private generateMockHash(): string {
    return '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  /**
   * Generate mock wallet address
   */
  private generateMockWalletAddress(): string {
    return '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  /**
   * Generate mock vendor registration
   */
  private generateMockVendorRegistration(vendorData: any): VendorBlockchainData {
    const vendorId = Math.floor(Math.random() * 1000) + 1;
    const transaction = this.generateMockTransaction('registerVendor', { vendorId });

    return {
      vendorId,
      name: vendorData.name,
      email: vendorData.email,
      walletAddress: vendorData.walletAddress || this.generateMockWalletAddress(),
      complianceScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      complianceLevel: 'HIGH',
      registrationDate: new Date().toISOString(),
      isActive: true,
      blockchainTx: transaction
    };
  }

  /**
   * Generate mock delivery creation
   */
  private generateMockDeliveryCreation(deliveryData: any): DeliveryBlockchainData {
    const deliveryId = Math.floor(Math.random() * 1000) + 1;
    const transaction = this.generateMockTransaction('createDelivery', { deliveryId });

    return {
      deliveryId,
      vendorId: deliveryData.vendorId,
      trackingNumber: deliveryData.trackingNumber,
      status: 'PENDING',
      verificationStatus: 'PENDING',
      createdDate: new Date().toISOString(),
      expectedDeliveryDate: deliveryData.expectedDeliveryDate,
      blockchainTx: transaction
    };
  }

  /**
   * Generate mock compliance history
   */
  private generateMockComplianceHistory(vendorId: number): ComplianceHistory[] {
    const history: ComplianceHistory[] = [];
    
    for (let i = 0; i < 5; i++) {
      const score = Math.floor(Math.random() * 40) + 60;
      const transaction = this.generateMockTransaction('updateCompliance', { vendorId, score });
      
      history.push({
        id: i + 1,
        vendorId,
        score,
        level: this.getComplianceLevelFromScore(score),
        reason: `Compliance review ${i + 1}`,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedBy: this.generateMockWalletAddress(),
        blockchainTx: transaction
      });
    }

    return history;
  }

  /**
   * Get compliance level from score
   */
  private getComplianceLevelFromScore(score: number): string {
    if (score >= 90) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    if (score >= 50) return 'LOW';
    return 'CRITICAL';
  }

  /**
   * Get event type from action
   */
  private getEventTypeFromAction(action: string): BlockchainEvent['type'] {
    switch (action) {
      case 'registerVendor':
        return 'vendorRegistered';
      case 'updateCompliance':
        return 'complianceUpdated';
      case 'createDelivery':
        return 'deliveryCreated';
      case 'updateDeliveryStatus':
      case 'verifyDelivery':
        return 'deliveryStatusUpdated';
      default:
        return 'vendorRegistered';
    }
  }

  /**
   * Get network info
   */
  getNetworkInfo(): NetworkInfo | null {
    return this.networkInfo;
  }

  /**
   * Check if service is in demo mode
   */
  isDemoModeEnabled(): boolean {
    return this.isDemoMode;
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;