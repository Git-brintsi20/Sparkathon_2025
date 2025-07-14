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
  // Fields from the form component
  barcode: string;
  purchaseOrderId: string;
  vendorId: string;
  weight: string; // Keep as string as the form handles it this way
  quantity: string; // Keep as string
  condition: string;
  notes?: string; // Optional
  deliveryPhoto?: File | null; // Optional
  packagingPhoto?: File | null; // Optional

  // Fields that were in your original master type
  status?: 'pending' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled'; // Optional
  orderId?: string; // Optional
  expectedDate?: string; // Optional
  actualDate?: string; // Optional
  items?: DeliveryItem[]; // Optional
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

