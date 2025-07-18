// Vendor-related types and interfaces

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  documents: VendorDocument[];
  contacts: VendorContact[];
  createdAt: string;
  updatedAt: string;
  industry: string;
  notes?: string;
  website?: string;
  contactPerson?: string;
  taxId?: string;
  totalDeliveries?: number;
  successfulDeliveries?: number;
  lastDelivery?: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  type: 'license' | 'certificate' | 'insurance' | 'tax' | 'other';
  size: number; 
  name: string;
  url: string;
  expiryDate?: string;
  verified: boolean;
  uploadedAt: string;
    status: string;
}

export interface VendorContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
}

export interface VendorMetrics {
  totalVendors: number;

  activeVendors: number;
  inactiveVendors: number; // Add this line
  suspendedVendors: number;
  pendingApproval: number;
  highRiskVendors: number;
  averageComplianceScore: number;
  complianceRate: number;
  monthlyGrowth: number;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
     blockchainMetrics?: {
    totalTransactions: number;
    verifiedRecords: number;
    immutableRecords: number;
    lastBlockNumber: number;
  };
}

export interface VendorPerformance {
  vendorId: string;
  onTimeDeliveryRate: number;
  qualityScore: number;
  complianceScore: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  period: string;
  successRate: number;
  averageDeliveryTime: number;
    riskLevel: string;
  monthlyTrend: Array<{
    month: string;
    orders: number;
    successRate: number;
  }>;
}

// In src/types/vendor.ts

export interface VendorFormData {
  // Fields from your original master type
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  documents?: File[];
  notes?: string;
  
  // New fields from your form component (added as optional)
city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  taxId?: string;
  businessType?: string;
  complianceLevel?: string;
  certifications?: string[];
  primaryContact?: string;
  secondaryContact?: string;
  paymentTerms?: string;
  logo?: File | null;
  complianceDocument?: File | null;
}

export interface VendorFilters {
  status?: string;
  category?: string;
  riskLevel?: string;
  complianceScore?: {
    min: number;
    max: number;
  };
  search?: string;
    sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VendorApiResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VendorAnalytics {
   totalVendors: number;
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
  complianceDistribution: Array<{
    range: string;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  riskAssessment: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
}