// frontend/src/services/deliveryService.ts
import apiService from './api';
import type { 
  Delivery, 
  DeliveryFormData, 
  DeliveryVerificationData, 
  DeliveryMetrics, 
  DeliveryFilters, 
  DeliveryApiResponse,
  DeliveryAnalytics 
} from '../types/delivery';
import type { ApiResponse, PaginationParams } from '../types/common';

class DeliveryService {
  private readonly endpoint = '/deliveries';
  private mockDeliveries: Delivery[] = [
    {
      id: '1',
      orderId: 'PO-2024-001',
      vendorId: 'vendor-1',
      vendorName: 'ABC Suppliers Ltd',
      deliveryDate: '2024-01-15T10:30:00Z',
      expectedDate: '2024-01-15T10:00:00Z',
      status: 'verified',
      items: [
        {
          id: 'item-1',
          name: 'Office Supplies',
          quantity: 10,
          expectedQuantity: 10,
          unit: 'pieces',
          price: 25.50,
          verified: true,
          condition: 'good'
        }
      ],
      totalAmount: 255.00,
      verificationStatus: 'verified',
      photos: [],
      notes: 'All items in perfect condition',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '2',
      orderId: 'PO-2024-002',
      vendorId: 'vendor-2',
      vendorName: 'XYZ Manufacturing',
      deliveryDate: '2024-01-15T14:20:00Z',
      expectedDate: '2024-01-15T14:00:00Z',
      status: 'pending',
      items: [
        {
          id: 'item-2',
          name: 'Raw Materials',
          quantity: 5,
          expectedQuantity: 5,
          unit: 'boxes',
          price: 45.00,
          verified: false,
          condition: 'good'
        }
      ],
      totalAmount: 225.00,
      verificationStatus: 'pending',
      photos: [],
      notes: 'Awaiting verification',
      createdAt: '2024-01-15T14:20:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    }
  ];

  // Get all deliveries with pagination and filters
async getDeliveries(
    params: PaginationParams & DeliveryFilters = { page: 1, limit: 10 }
  ): Promise<ApiResponse<DeliveryApiResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        deliveries: this.mockDeliveries,
        page: 1,
        limit: 10,
        total: this.mockDeliveries.length,
        totalPages: 1
      },
      message: 'Success'
    };
  }


  // Get delivery by ID
   async getDeliveryById(id: string): Promise<ApiResponse<Delivery>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const delivery = this.mockDeliveries.find(d => d.id === id);
    
    return {
      success: !!delivery,
      data: delivery,
      message: delivery ? 'Success' : 'Delivery not found'
    };
  }

  // Create new delivery
  async createDelivery(data: DeliveryFormData): Promise<ApiResponse<Delivery>> {
    return apiService.post<Delivery>(this.endpoint, data);
  }

  // Update delivery
  async updateDelivery(id: string, data: Partial<DeliveryFormData>): Promise<ApiResponse<Delivery>> {
    return apiService.put<Delivery>(`${this.endpoint}/${id}`, data);
  }

  // Delete delivery
  async deleteDelivery(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Verify delivery with photos and QR code
  async verifyDelivery(data: DeliveryVerificationData): Promise<ApiResponse<Delivery>> {
    const formData = new FormData();
    
    // Add photos to form data
    data.photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    // Add other verification data
    formData.append('deliveryId', data.deliveryId);
    formData.append('items', JSON.stringify(data.items));
    if (data.qrCode) formData.append('qrCode', data.qrCode);
    if (data.overallNotes) formData.append('overallNotes', data.overallNotes);

    return apiService.post<Delivery>(`${this.endpoint}/verify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Update delivery status
  async updateDeliveryStatus(
    id: string, 
    status: 'pending' | 'in_transit' | 'delivered' | 'verified' | 'rejected'
  ): Promise<ApiResponse<Delivery>> {
    return apiService.patch<Delivery>(`${this.endpoint}/${id}/status`, { status });
  }

  // Track delivery in real-time
  async trackDelivery(id: string): Promise<ApiResponse<{
    location: { lat: number; lng: number };
    estimatedArrival: string;
    status: string;
    lastUpdate: string;
  }>> {
    return apiService.get(`${this.endpoint}/${id}/track`);
  }

  // Validate QR code
  async validateQRCode(qrCode: string): Promise<ApiResponse<{
    valid: boolean;
    deliveryId?: string;
    message: string;
  }>> {
    return apiService.post(`${this.endpoint}/validate-qr`, { qrCode });
  }

  // Upload delivery photos
  async uploadPhotos(
    deliveryId: string, 
    photos: File[],
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ urls: string[] }>> {
    return apiService.uploadFile(`${this.endpoint}/${deliveryId}/photos`, photos, {}, onProgress);
  }

  // Get delivery metrics
  async getDeliveryMetrics(period?: string): Promise<ApiResponse<DeliveryMetrics>> {
    return apiService.get<DeliveryMetrics>(`${this.endpoint}/metrics`, { period });
  }

  // Get delivery analytics
  async getDeliveryAnalytics(
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<DeliveryAnalytics>> {
    return apiService.get<DeliveryAnalytics>(`${this.endpoint}/analytics`, dateRange);
  }

  // Get pending deliveries
  async getPendingDeliveries(): Promise<ApiResponse<Delivery[]>> {
    return apiService.get<Delivery[]>(`${this.endpoint}/pending`);
  }

  // Get deliveries for specific vendor
  async getVendorDeliveries(vendorId: string, params?: PaginationParams): Promise<ApiResponse<DeliveryApiResponse>> {
    return apiService.get<DeliveryApiResponse>(`${this.endpoint}/vendor/${vendorId}`, params);
  }

  // Search deliveries
  async searchDeliveries(query: string, filters?: DeliveryFilters): Promise<ApiResponse<Delivery[]>> {
    return apiService.get<Delivery[]>(`${this.endpoint}/search`, { query, ...filters });
  }

  // Get delivery notifications
  async getDeliveryNotifications(): Promise<ApiResponse<Array<{
    id: string;
    type: 'delay' | 'fraud' | 'quality' | 'verification';
    message: string;
    deliveryId: string;
    severity: 'low' | 'medium' | 'high';
    createdAt: string;
  }>>> {
    return apiService.get(`${this.endpoint}/notifications`);
  }

  // Mark delivery as fraudulent
  async reportFraud(deliveryId: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`${this.endpoint}/${deliveryId}/fraud`, { reason });
  }

  // Generate delivery report
  async generateReport(
    filters: DeliveryFilters & { format: 'pdf' | 'excel' | 'csv' }
  ): Promise<void> {
    const filename = `delivery-report-${new Date().toISOString().split('T')[0]}.${filters.format}`;
    return apiService.downloadFile(`${this.endpoint}/report`, filename, filters);
  }

  // Bulk update deliveries
  async bulkUpdateDeliveries(
    deliveryIds: string[], 
    updates: { status?: string; notes?: string }
  ): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return apiService.put(`${this.endpoint}/bulk`, { deliveryIds, updates });
  }

  // Get delivery timeline
  async getDeliveryTimeline(deliveryId: string): Promise<ApiResponse<Array<{
    id: string;
    event: string;
    description: string;
    timestamp: string;
    user?: string;
    metadata?: Record<string, any>;
  }>>> {
    return apiService.get(`${this.endpoint}/${deliveryId}/timeline`);
  }

  // Real-time delivery updates via WebSocket
  subscribeToDeliveryUpdates(
    deliveryId: string, 
    callback: (update: any) => void
  ): () => void {
    // This would integrate with WebSocket service
    const eventSource = new EventSource(`${apiService['baseURL']}/deliveries/${deliveryId}/events`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    eventSource.onerror = (error) => {
      console.error('Delivery updates error:', error);
    };

    return () => eventSource.close();
  }

  // Retry failed verification
  async retryVerification(deliveryId: string): Promise<ApiResponse<Delivery>> {
    return apiService.post<Delivery>(`${this.endpoint}/${deliveryId}/retry-verification`);
  }

  // Get delivery statistics for dashboard
  async getDeliveryStats(): Promise<ApiResponse<{
    todayDeliveries: number;
    pendingVerifications: number;
    fraudAlerts: number;
    onTimeRate: number;
    qualityScore: number;
    recentActivity: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/stats`);
  }
}



// Export singleton instance
export const deliveryService = new DeliveryService();
export default deliveryService;