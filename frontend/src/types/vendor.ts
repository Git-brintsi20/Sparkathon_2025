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
  name: string;
  url: string;
  expiryDate?: string;
  verified: boolean;
  uploadedAt: string;
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
  pendingApproval: number;
  highRiskVendors: number;
  averageComplianceScore: number;
  complianceRate: number;
  
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
}

export interface VendorApiResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VendorAnalytics {
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