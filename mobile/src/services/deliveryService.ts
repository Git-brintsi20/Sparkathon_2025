import api from './api';

export interface Delivery {
  _id: string;
  orderId: string;
  vendorId: string;
  vendorName?: string;
  status: string;
  verificationStatus: string;
  deliveryDate?: string;
  expectedDate?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  fraudFlag?: boolean;
  notes?: string;
  createdAt: string;
}

export const deliveryService = {
  async fetchDeliveries(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get('/deliveries', { params });
    return response.data.data;
  },

  async fetchDeliveryById(id: string) {
    const response = await api.get(`/deliveries/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await api.put(`/deliveries/${id}/status`, { status });
    return response.data.data;
  },

  async verifyDelivery(id: string, data: {
    qrCodeScanned?: boolean;
    quantityVerified?: boolean;
    qualityVerified?: boolean;
    discrepancies?: string[];
  }) {
    const response = await api.put(`/deliveries/${id}/verify`, data);
    return response.data.data;
  },

  async getMetrics() {
    const response = await api.get('/deliveries/metrics');
    return response.data.data;
  },

  async trackDelivery(id: string) {
    const response = await api.get(`/deliveries/${id}/track`);
    return response.data.data;
  },
};

export default deliveryService;
