// frontend/src/services/vendorService.ts
import apiService from './api';
import type {
  Vendor,
  VendorFormData,
  VendorFilters,
  // VendorApiResponse, // No longer directly used as return type for getVendors
  VendorMetrics,
  VendorPerformance,
  VendorAnalytics,
  VendorDocument,
} from '../types/vendor';
import type { ApiResponse, PaginationParams, PaginatedResponse } from '../types/common'; // Import PaginatedResponse

class VendorService {
  private readonly BASE_ENDPOINT = '/vendors';

  // Get all vendors with pagination and filtering
  async getVendors(
    params: PaginationParams & VendorFilters = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> { // FIX: Changed return type to match apiService.getPaginated
    const queryParams = this.buildQueryParams(params);
    return apiService.getPaginated<Vendor>(this.BASE_ENDPOINT, queryParams);
  }

  // Get vendor by ID
  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    return apiService.get<Vendor>(`${this.BASE_ENDPOINT}/${id}`);
  }

  // Create new vendor
  async createVendor(vendorData: VendorFormData): Promise<ApiResponse<Vendor>> {
    const formData = this.prepareVendorData(vendorData);

    if (vendorData.documents && vendorData.documents.length > 0) {
      return apiService.uploadFile<Vendor>(
        this.BASE_ENDPOINT,
        vendorData.documents,
        formData
      );
    }

    return apiService.post<Vendor>(this.BASE_ENDPOINT, formData);
  }

  // Update vendor
  async updateVendor(id: string, vendorData: Partial<VendorFormData>): Promise<ApiResponse<Vendor>> {
    const formData = this.prepareVendorData(vendorData);

    if (vendorData.documents && vendorData.documents.length > 0) {
      return apiService.uploadFile<Vendor>(
        `${this.BASE_ENDPOINT}/${id}`,
        vendorData.documents,
        formData
      );
    }

    return apiService.put<Vendor>(`${this.BASE_ENDPOINT}/${id}`, formData);
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
    return apiService.patch<Vendor>(`${this.BASE_ENDPOINT}/${id}/status`, { status });
  }

  // Get vendor metrics
  async getVendorMetrics(): Promise<ApiResponse<VendorMetrics>> {
    return apiService.get<VendorMetrics>(`${this.BASE_ENDPOINT}/metrics`);
  }

  // Get vendor performance data
  async getVendorPerformance(
    vendorId: string,
    period: string = '30d'
  ): Promise<ApiResponse<VendorPerformance>> {
    return apiService.get<VendorPerformance>(
      `${this.BASE_ENDPOINT}/${vendorId}/performance`,
      { period }
    );
  }

  // Get vendor analytics
  async getVendorAnalytics(
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<VendorAnalytics>> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {};
    return apiService.get<VendorAnalytics>(`${this.BASE_ENDPOINT}/analytics`, params);
  }

  // Search vendors
  async searchVendors(
    query: string,
    filters?: VendorFilters
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> { // FIX: Changed return type to match getVendors
    const params = {
      search: query,
      ...filters,
      page: 1,
      limit: 20,
    };

    return this.getVendors(params);
  }

  // Get vendors by category
  async getVendorsByCategory(category: string): Promise<ApiResponse<Vendor[]>> {
    return apiService.get<Vendor[]>(`${this.BASE_ENDPOINT}/category/${category}`);
  }

  // Get high-risk vendors
  async getHighRiskVendors(): Promise<ApiResponse<Vendor[]>> {
    return apiService.get<Vendor[]>(`${this.BASE_ENDPOINT}/high-risk`);
  }

  // Update compliance score
  async updateComplianceScore(
    vendorId: string,
    score: number,
    notes?: string
  ): Promise<ApiResponse<Vendor>> {
    return apiService.patch<Vendor>(`${this.BASE_ENDPOINT}/${vendorId}/compliance`, {
      score,
      notes,
    });
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
      { documentType }
    );
  }

  // Delete vendor document
  async deleteVendorDocument(
    vendorId: string,
    documentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(
      `${this.BASE_ENDPOINT}/${vendorId}/documents/${documentId}`
    );
  }

  // Verify vendor document
  async verifyVendorDocument(
    vendorId: string,
    documentId: string,
    verified: boolean
  ): Promise<ApiResponse<VendorDocument>> {
    return apiService.patch<VendorDocument>(
      `${this.BASE_ENDPOINT}/${vendorId}/documents/${documentId}/verify`,
      { verified }
    );
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
    return apiService.get(
      `${this.BASE_ENDPOINT}/${vendorId}/compliance-history`,
      { limit }
    );
  }

  // Export vendors data
  async exportVendors(
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: VendorFilters
  ): Promise<void> {
    const params = { format, ...filters };
    await apiService.downloadFile(
      `${this.BASE_ENDPOINT}/export`,
      `vendors-${new Date().toISOString().split('T')[0]}.${format}`,
      params
    );
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
    return apiService.uploadFile(
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

  // Validate vendor data
  async validateVendorData(vendorData: VendorFormData): Promise<ApiResponse<{
    valid: boolean;
    errors: Record<string, string>;
  }>> {
    return apiService.post(`${this.BASE_ENDPOINT}/validate`, vendorData);
  }

  // Check vendor email uniqueness
  async checkEmailUniqueness(email: string, excludeId?: string): Promise<ApiResponse<{
    available: boolean;
  }>> {
    const params = excludeId ? { email, excludeId } : { email };
    return apiService.get(`${this.BASE_ENDPOINT}/check-email`, params);
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
    return apiService.get(
      `${this.BASE_ENDPOINT}/${vendorId}/activity`,
      { limit }
    );
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

  // Helper method to prepare vendor data for API
  private prepareVendorData(vendorData: Partial<VendorFormData>): Record<string, any> {
    const formData: Record<string, any> = {};

    // FIX: Use explicit !== undefined checks for all properties
    if (vendorData.name !== undefined) formData.name = vendorData.name;
    if (vendorData.email !== undefined) formData.email = vendorData.email;
    if (vendorData.phone !== undefined) formData.phone = vendorData.phone;
    if (vendorData.address !== undefined) formData.address = vendorData.address;
    if (vendorData.category !== undefined) formData.category = vendorData.category;
    if (vendorData.contactName !== undefined) formData.contactName = vendorData.contactName;
    if (vendorData.contactEmail !== undefined) formData.contactEmail = vendorData.contactEmail;
    if (vendorData.contactPhone !== undefined) formData.contactPhone = vendorData.contactPhone;
    if (vendorData.notes !== undefined) formData.notes = vendorData.notes;

    return formData;
  }
}

// Create singleton instance
const vendorService = new VendorService();

export default vendorService;
