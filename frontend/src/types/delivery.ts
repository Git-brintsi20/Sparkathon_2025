// Delivery-related types and interfaces

export interface Delivery {
  id: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  deliveryDate: string;
  expectedDate: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'verified' | 'rejected';
  items: DeliveryItem[];
  totalAmount: number;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationDetails?: VerificationDetails;
  photos: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  expectedQuantity: number;
  unit: string;
  price: number;
  verified: boolean;
  condition: 'good' | 'damaged' | 'expired';
  notes?: string;
}

export interface VerificationDetails {
  verifiedBy: string;
  verifiedAt: string;
  qrCodeScanned: boolean;
  photosUploaded: number;
  quantityVerified: boolean;
  qualityVerified: boolean;
  discrepancies: string[];
  verificationScore: number;
}

export interface DeliveryFormData {
  orderId: string;
  vendorId: string;
  expectedDate: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }>;
  notes?: string;
}

export interface DeliveryVerificationData {
  deliveryId: string;
  items: Array<{
    id: string;
    actualQuantity: number;
    condition: 'good' | 'damaged' | 'expired';
    notes?: string;
  }>;
  photos: File[];
  qrCode?: string;
  overallNotes?: string;
}

export interface DeliveryMetrics {
  totalDeliveries: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  verifiedDeliveries: number;
  onTimeDeliveryRate: number;
  averageVerificationScore: number;
  fraudDetected: number;
}

export interface DeliveryFilters {
  status?: string;
  verificationStatus?: string;
  vendorId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Fixed: Changed from 'data' to 'deliveries' property
export interface DeliveryApiResponse {
  deliveries: Delivery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeliveryAnalytics {
  deliveryTrend: Array<{
    date: string;
    count: number;
    verified: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  vendorPerformance: Array<{
    vendorId: string;
    vendorName: string;
    totalDeliveries: number;
    onTimeRate: number;
    verificationScore: number;
  }>;
  fraudAlerts: Array<{
    id: string;
    deliveryId: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    detectedAt: string;
  }>;
}

