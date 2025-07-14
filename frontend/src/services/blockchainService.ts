// frontend/src/services/blockchainService.ts
import apiService from './api';
import type { ApiResponse } from '../types/common';

export interface BlockchainTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  confirmations: number;
}

export interface SmartContractCall {
  contractAddress: string;
  functionName: string;
  parameters: any[];
  gasLimit?: number;
  gasPrice?: string;
}

export interface ComplianceRecord {
  id: string;
  vendorId: string;
  deliveryId: string;
  transactionHash: string;
  timestamp: string;
  data: {
    complianceScore: number;
    verificationStatus: 'verified' | 'pending' | 'rejected';
    documentHashes: string[];
    auditTrail: any[];
  };
  blockNumber: number;
  gasUsed: number;
}

export interface VendorOnChain {
  id: string;
  walletAddress: string;
  registrationHash: string;
  complianceScore: number;
  totalDeliveries: number;
  lastUpdate: string;
  verified: boolean;
  reputation: number;
}

export interface DeliveryOnChain {
  id: string;
  vendorId: string;
  transactionHash: string;
  proofOfDelivery: string;
  timestamp: string;
  verified: boolean;
  fraudScore: number;
  documentHashes: string[];
}

export interface BlockchainStats {
  totalTransactions: number;
  totalVendors: number;
  totalDeliveries: number;
  averageGasPrice: string;
  networkStatus: 'healthy' | 'congested' | 'offline';
  lastBlockNumber: number;
  contractsDeployed: number;
}

class BlockchainService {
  private static instance: BlockchainService;
  private contractAddresses: Record<string, string> = {};
  private networkId: string | null = null;

  private constructor() {
    this.initializeContracts();
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Initialize contract addresses
  private async initializeContracts(): Promise<void> {
    try {
      const response = await apiService.get<Record<string, string>>('/blockchain/contracts');
      if (response.success && response.data) {
        this.contractAddresses = response.data;
      }
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
    }
  }

  // Get network status
  public async getNetworkStatus(): Promise<ApiResponse<BlockchainStats>> {
    try {
      const response = await apiService.get<BlockchainStats>('/blockchain/status');
      return response;
    } catch (error) {
      console.error('Failed to get network status:', error);
      throw error;
    }
  }

  // Register vendor on blockchain
  public async registerVendor(vendorData: {
    id: string;
    walletAddress: string;
    complianceDocuments: string[];
  }): Promise<ApiResponse<{ transactionHash: string }>> {
    try {
      const response = await apiService.post<{ transactionHash: string }>('/blockchain/vendor/register', vendorData);
      return response;
    } catch (error) {
      console.error('Failed to register vendor:', error);
      throw error;
    }
  }

  // Get vendor from blockchain
  public async getVendor(vendorId: string): Promise<ApiResponse<VendorOnChain>> {
    try {
      const response = await apiService.get<VendorOnChain>(`/blockchain/vendor/${vendorId}`);
      return response;
    } catch (error) {
      console.error('Failed to get vendor:', error);
      throw error;
    }
  }

  // Update vendor compliance score
  public async updateVendorCompliance(
    vendorId: string,
    complianceScore: number,
    auditData: any
  ): Promise<ApiResponse<{ transactionHash: string }>> {
    try {
      const response = await apiService.patch<{ transactionHash: string }>(`/blockchain/vendor/${vendorId}/compliance`, {
        complianceScore,
        auditData,
      });
      return response;
    } catch (error) {
      console.error('Failed to update vendor compliance:', error);
      throw error;
    }
  }

  // Record delivery on blockchain
  public async recordDelivery(deliveryData: {
    id: string;
    vendorId: string;
    proofOfDelivery: string;
    documentHashes: string[];
    gpsCoordinates?: { lat: number; lng: number };
    timestamp: string;
  }): Promise<ApiResponse<{ transactionHash: string }>> {
    try {
      const response = await apiService.post<{ transactionHash: string }>('/blockchain/delivery/record', deliveryData);
      return response;
    } catch (error) {
      console.error('Failed to record delivery:', error);
      throw error;
    }
  }

  // Get delivery from blockchain
  public async getDelivery(deliveryId: string): Promise<ApiResponse<DeliveryOnChain>> {
    try {
      const response = await apiService.get<DeliveryOnChain>(`/blockchain/delivery/${deliveryId}`);
      return response;
    } catch (error) {
      console.error('Failed to get delivery:', error);
      throw error;
    }
  }

  // Verify delivery authenticity
  public async verifyDelivery(deliveryId: string): Promise<ApiResponse<{ 
    verified: boolean; 
    fraudScore: number; 
    verificationDetails: any 
  }>> {
    try {
      const response = await apiService.post<{ 
        verified: boolean; 
        fraudScore: number; 
        verificationDetails: any 
      }>(`/blockchain/delivery/${deliveryId}/verify`);
      return response;
    } catch (error) {
      console.error('Failed to verify delivery:', error);
      throw error;
    }
  }

  // Get compliance records
  public async getComplianceRecords(params?: {
    vendorId?: string;
    deliveryId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ComplianceRecord[]>> {
    try {
      const response = await apiService.get<ComplianceRecord[]>('/blockchain/compliance', params);
      return response;
    } catch (error) {
      console.error('Failed to get compliance records:', error);
      throw error;
    }
  }

  // Get transaction details
  public async getTransaction(txHash: string): Promise<ApiResponse<BlockchainTransaction>> {
    try {
      const response = await apiService.get<BlockchainTransaction>(`/blockchain/transaction/${txHash}`);
      return response;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw error;
    }
  }

  // Get vendor transaction history
  public async getVendorTransactions(vendorId: string, params?: {
    page?: number;
    limit?: number;
    type?: 'registration' | 'delivery' | 'compliance';
  }): Promise<ApiResponse<BlockchainTransaction[]>> {
    try {
      const response = await apiService.get<BlockchainTransaction[]>(`/blockchain/vendor/${vendorId}/transactions`, params);
      return response;
    } catch (error) {
      console.error('Failed to get vendor transactions:', error);
      throw error;
    }
  }

  // Call smart contract function
  public async callContract(contractCall: SmartContractCall): Promise<ApiResponse<{ 
    result: any; 
    transactionHash?: string; 
    gasUsed?: number 
  }>> {
    try {
      const response = await apiService.post<{ 
        result: any; 
        transactionHash?: string; 
        gasUsed?: number 
      }>('/blockchain/contract/call', contractCall);
      return response;
    } catch (error) {
      console.error('Failed to call contract:', error);
      throw error;
    }
  }

  // Get contract ABI
  public async getContractABI(contractName: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/blockchain/contract/${contractName}/abi`);
      return response;
    } catch (error) {
      console.error('Failed to get contract ABI:', error);
      throw error;
    }
  }

  // Estimate gas for transaction
  public async estimateGas(transactionData: {
    to: string;
    data: string;
    value?: string;
  }): Promise<ApiResponse<{ gasEstimate: number; gasPrice: string }>> {
    try {
      const response = await apiService.post<{ gasEstimate: number; gasPrice: string }>('/blockchain/gas/estimate', transactionData);
      return response;
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  // Get gas prices
  public async getGasPrices(): Promise<ApiResponse<{
    slow: string;
    standard: string;
    fast: string;
    instant: string;
  }>> {
    try {
      const response = await apiService.get<{
        slow: string;
        standard: string;
        fast: string;
        instant: string;
      }>('/blockchain/gas/prices');
      return response;
    } catch (error) {
      console.error('Failed to get gas prices:', error);
      throw error;
    }
  }

  // Generate proof of compliance
  public async generateComplianceProof(vendorId: string, deliveryId: string): Promise<ApiResponse<{
    proofHash: string;
    merkleRoot: string;
    signature: string;
  }>> {
    try {
      const response = await apiService.post<{
        proofHash: string;
        merkleRoot: string;
        signature: string;
      }>('/blockchain/compliance/proof', { vendorId, deliveryId });
      return response;
    } catch (error) {
      console.error('Failed to generate compliance proof:', error);
      throw error;
    }
  }

  // Verify compliance proof
  public async verifyComplianceProof(proofData: {
    proofHash: string;
    merkleRoot: string;
    signature: string;
    vendorId: string;
    deliveryId: string;
  }): Promise<ApiResponse<{ valid: boolean; details: any }>> {
    try {
      const response = await apiService.post<{ valid: boolean; details: any }>('/blockchain/compliance/verify', proofData);
      return response;
    } catch (error) {
      console.error('Failed to verify compliance proof:', error);
      throw error;
    }
  }

  // Get audit trail
  public async getAuditTrail(entityId: string, entityType: 'vendor' | 'delivery'): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(`/blockchain/audit/${entityType}/${entityId}`);
      return response;
    } catch (error) {
      console.error('Failed to get audit trail:', error);
      throw error;
    }
  }

  // Batch process transactions
  public async batchProcess(transactions: any[]): Promise<ApiResponse<{ 
    processed: number; 
    failed: number; 
    results: any[] 
  }>> {
    try {
      const response = await apiService.post<{ 
        processed: number; 
        failed: number; 
        results: any[] 
      }>('/blockchain/batch', { transactions });
      return response;
    } catch (error) {
      console.error('Failed to batch process:', error);
      throw error;
    }
  }

  // Monitor transaction status
  public async monitorTransaction(txHash: string): Promise<ApiResponse<{
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
    blockNumber?: number;
  }>> {
    try {
      const response = await apiService.get<{
        status: 'pending' | 'confirmed' | 'failed';
        confirmations: number;
        blockNumber?: number;
      }>(`/blockchain/monitor/${txHash}`);
      return response;
    } catch (error) {
      console.error('Failed to monitor transaction:', error);
      throw error;
    }
  }

  // Get blockchain analytics
  public async getBlockchainAnalytics(params?: {
    timeRange?: string;
    vendorId?: string;
    type?: string;
  }): Promise<ApiResponse<{
    totalTransactions: number;
    totalGasUsed: string;
    averageTransactionTime: number;
    successRate: number;
    topVendors: any[];
    timeSeriesData: any[];
  }>> {
    try {
      const response = await apiService.get<{
        totalTransactions: number;
        totalGasUsed: string;
        averageTransactionTime: number;
        successRate: number;
        topVendors: any[];
        timeSeriesData: any[];
      }>('/blockchain/analytics', params);
      return response;
    } catch (error) {
      console.error('Failed to get blockchain analytics:', error);
      throw error;
    }
  }

  // Get contract addresses
  public getContractAddresses(): Record<string, string> {
    return { ...this.contractAddresses };
  }

  // Get network ID
  public getNetworkId(): string | null {
    return this.networkId;
  }
}

// Export singleton instance
const blockchainService = BlockchainService.getInstance();
export default blockchainService;