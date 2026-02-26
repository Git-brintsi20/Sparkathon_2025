// frontend/src/services/vendorService.ts
import type {
  Vendor,
  VendorFormData,
  VendorFilters,
  VendorMetrics,
  VendorPerformance,
  VendorAnalytics,
  VendorDocument,
} from '../types/vendor';
import type { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common';

import apiService from './api';

class VendorService {
  private readonly BASE_ENDPOINT = '/vendors';

  // Get all vendors with pagination and filtering
  async getVendors(
    params: PaginationParams & VendorFilters = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> {
    const queryParams = this.buildQueryParams(params);
    return apiService.get<PaginatedResponse<Vendor>>(this.BASE_ENDPOINT, queryParams);
  }

  // Get vendor by ID
  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    return apiService.get<Vendor>(`${this.BASE_ENDPOINT}/${id}`);
  }

  // Create new vendor
  async createVendor(vendorData: VendorFormData): Promise<ApiResponse<Vendor>> {
    return apiService.post<Vendor>(this.BASE_ENDPOINT, vendorData);
  }

  // Update vendor
  async updateVendor(id: string, vendorData: Partial<VendorFormData>): Promise<ApiResponse<Vendor>> {
    return apiService.put<Vendor>(`${this.BASE_ENDPOINT}/${id}`, vendorData);
  }

  // Delete vendor
  async deleteVendor(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.BASE_ENDPOINT}/${id}`);
  }

  // Bulk delete vendors
  async bulkDeleteVendors(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiService.post<{ deletedCount: number }>(`${this.BASE_ENDPOINT}/bulk-delete`, { ids });
  }

  // Update vendor status
  async updateVendorStatus(
    id: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<ApiResponse<Vendor>> {
    return apiService.put<Vendor>(`${this.BASE_ENDPOINT}/${id}`, { status });
  }

  // Get vendor detailed metrics
  async getVendorDetailedMetrics(vendorId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${this.BASE_ENDPOINT}/${vendorId}/metrics`);
  }

  // Get vendor metrics (aggregate)
  async getVendorMetrics(): Promise<ApiResponse<VendorMetrics>> {
    return apiService.get<VendorMetrics>('/analytics/vendors');
  }

  // Get vendor performance data
  async getVendorPerformance(
    vendorId: string,
    period: string = '30d'
  ): Promise<ApiResponse<VendorPerformance>> {
    return apiService.get<VendorPerformance>(`${this.BASE_ENDPOINT}/${vendorId}/performance`, { period });
  }

  // Get vendor analytics
  async getVendorAnalytics(
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<VendorAnalytics>> {
    return apiService.get<VendorAnalytics>('/analytics/vendors', dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : undefined);
  }

  // Search vendors
  async searchVendors(
    query: string,
    filters?: VendorFilters
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> {
    return this.getVendors({ search: query, ...filters, page: 1, limit: 20 });
  }

  // Get vendors by category
  async getVendorsByCategory(category: string): Promise<ApiResponse<Vendor[]>> {
    return apiService.get<Vendor[]>(this.BASE_ENDPOINT, { category });
  }

  // Get high-risk vendors
  async getHighRiskVendors(): Promise<ApiResponse<Vendor[]>> {
    return apiService.get<Vendor[]>(this.BASE_ENDPOINT, { riskLevel: 'high' });
  }

  // Update compliance score
  async updateComplianceScore(
    vendorId: string,
    score: number,
    notes?: string
  ): Promise<ApiResponse<Vendor>> {
    return apiService.put<Vendor>(`${this.BASE_ENDPOINT}/${vendorId}`, { complianceScore: score, notes });
  }

  // Upload vendor documents
  async uploadVendorDocuments(
    vendorId: string,
    documents: File[],
    documentType: string
  ): Promise<ApiResponse<VendorDocument[]>> {
    return apiService.uploadFile<VendorDocument[]>(
      `${this.BASE_ENDPOINT}/${vendorId}/documents`,
      documents,
      { type: documentType }
    );
  }

  // Delete vendor document
  async deleteVendorDocument(
    vendorId: string,
    documentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`${this.BASE_ENDPOINT}/${vendorId}/documents/${documentId}`);
  }

  // Verify vendor document
  async verifyVendorDocument(
    vendorId: string,
    documentId: string,
    verified: boolean
  ): Promise<ApiResponse<VendorDocument>> {
    return apiService.put<VendorDocument>(`${this.BASE_ENDPOINT}/${vendorId}/documents/${documentId}`, { verified });
  }

  // Get vendor compliance history
  async getVendorComplianceHistory(
    vendorId: string,
    limit: number = 10
  ): Promise<ApiResponse<Array<{
    id: string;
    score: number;
    date: string;
    notes: string;
    changedBy: string;
  }>>> {
    return apiService.get(`/blockchain/compliance-history/${vendorId}`, { limit });
  }

  // Export vendors data
  async exportVendors(
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: VendorFilters
  ): Promise<void> {
    await apiService.downloadFile('/analytics/export', `vendors-${new Date().toISOString().split('T')[0]}.${format}`, { type: 'vendors', format, ...filters });
  }

  // Import vendors from file
  async importVendors(
    file: File,
    onUploadProgress?: (progress: number) => void
  ): Promise<ApiResponse<{
    imported: number;
    failed: number;
    errors: string[];
  }>> {
    return apiService.uploadFile<{ imported: number; failed: number; errors: string[] }>(
      `${this.BASE_ENDPOINT}/import`,
      [file],
      {},
      onUploadProgress
    );
  }

  // Get vendor categories
  async getVendorCategories(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    count: number;
  }>>> {
    return apiService.get(`${this.BASE_ENDPOINT}/categories`);
  }

  // Validate vendor data (client-side)
  async validateVendorData(vendorData: VendorFormData): Promise<ApiResponse<{
    valid: boolean;
    errors: Record<string, string>;
  }>> {
    const errors: Record<string, string> = {};

    if (!vendorData.name?.trim()) errors.name = 'Name is required';
    if (!vendorData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorData.email)) {
      errors.email = 'Invalid email format';
    }

    const valid = Object.keys(errors).length === 0;
    return { success: true, data: { valid, errors }, message: valid ? 'Vendor data is valid' : 'Validation failed' };
  }

  // Check vendor email uniqueness
  async checkEmailUniqueness(email: string, excludeId?: string): Promise<ApiResponse<{
    available: boolean;
  }>> {
    return apiService.get(`${this.BASE_ENDPOINT}/check-email`, { email, excludeId });
  }

  // Get vendor activity log
  async getVendorActivityLog(
    vendorId: string,
    limit: number = 20
  ): Promise<ApiResponse<Array<{
    id: string;
    action: string;
    details: string;
    performedBy: string;
    timestamp: string;
  }>>> {
    return apiService.get(`${this.BASE_ENDPOINT}/${vendorId}/activity`, { limit });
  }

  // Helper method to build query parameters
  private buildQueryParams(params: PaginationParams & VendorFilters): PaginationParams & Record<string, any> {
    const queryParams: PaginationParams & Record<string, any> = {
      page: params.page,
      limit: params.limit,
    };

    if (params.sortBy !== undefined) queryParams.sortBy = params.sortBy;
    if (params.sortOrder !== undefined) queryParams.sortOrder = params.sortOrder;
    if (params.search !== undefined) queryParams.search = params.search;
    if (params.status !== undefined) queryParams.status = params.status;
    if (params.category !== undefined) queryParams.category = params.category;
    if (params.riskLevel !== undefined) queryParams.riskLevel = params.riskLevel;

    if (params.complianceScore !== undefined) {
      queryParams.complianceScoreMin = params.complianceScore.min;
      queryParams.complianceScoreMax = params.complianceScore.max;
    }

    return queryParams;
  }
}

// Create singleton instance
const vendorService = new VendorService();

export default vendorService;
