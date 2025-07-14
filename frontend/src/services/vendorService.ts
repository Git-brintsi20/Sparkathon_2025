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

// Mock data array
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    email: 'contact@techsolutions.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94105',
    category: 'Technology',
    registrationDate: '2023-01-15',
    status: 'active',
    complianceScore: 95,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    industry: 'Software',
    website: 'https://techsolutions.com',
    contactPerson: 'John Doe',
    taxId: 'TAX123456',
    totalDeliveries: 150,
    successfulDeliveries: 147,
    lastDelivery: '2024-01-10'
  },
  {
    id: '2',
    name: 'Global Manufacturing Corp',
    email: 'info@globalmanufacturing.com',
    phone: '+1-555-0124',
    address: '456 Industrial Ave, Detroit, MI 48201',
    category: 'Manufacturing',
    registrationDate: '2023-02-20',
    status: 'active',
    complianceScore: 88,
    riskLevel: 'medium',
    documents: [],
    contacts: [],
    createdAt: '2023-02-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    industry: 'Manufacturing',
    website: 'https://globalmanufacturing.com',
    contactPerson: 'Jane Smith',
    taxId: 'TAX789012',
    totalDeliveries: 89,
    successfulDeliveries: 85,
    lastDelivery: '2024-01-08'
  },
  {
    id: '3',
    name: 'Swift Logistics Ltd',
    email: 'dispatch@swiftlogistics.com',
    phone: '+1-555-0125',
    address: '789 Warehouse Blvd, Chicago, IL 60601',
    category: 'Logistics',
    registrationDate: '2023-03-10',
    status: 'active',
    complianceScore: 92,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-03-10T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
    industry: 'Transportation',
    website: 'https://swiftlogistics.com',
    contactPerson: 'Mike Johnson',
    taxId: 'TAX345678',
    totalDeliveries: 203,
    successfulDeliveries: 198,
    lastDelivery: '2024-01-12'
  },
  {
    id: '4',
    name: 'Premium Catering Services',
    email: 'orders@premiumcatering.com',
    phone: '+1-555-0126',
    address: '321 Culinary Way, New York, NY 10001',
    category: 'Food & Beverage',
    registrationDate: '2023-04-05',
    status: 'suspended',
    complianceScore: 65,
    riskLevel: 'high',
    documents: [],
    contacts: [],
    createdAt: '2023-04-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    industry: 'Food Service',
    website: 'https://premiumcatering.com',
    contactPerson: 'Sarah Wilson',
    taxId: 'TAX901234',
    totalDeliveries: 45,
    successfulDeliveries: 38,
    lastDelivery: '2023-12-15'
  },
  {
    id: '5',
    name: 'Green Energy Solutions',
    email: 'info@greenenergy.com',
    phone: '+1-555-0127',
    address: '654 Solar Drive, Austin, TX 78701',
    category: 'Energy',
    registrationDate: '2023-05-12',
    status: 'active',
    complianceScore: 98,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z',
    industry: 'Renewable Energy',
    website: 'https://greenenergy.com',
    contactPerson: 'David Brown',
    taxId: 'TAX567890',
    totalDeliveries: 76,
    successfulDeliveries: 76,
    lastDelivery: '2024-01-15'
  },
  {
    id: '6',
    name: 'Office Supplies Plus',
    email: 'sales@officesupplies.com',
    phone: '+1-555-0128',
    address: '987 Business Park, Denver, CO 80201',
    category: 'Office Supplies',
    registrationDate: '2023-06-18',
    status: 'active',
    complianceScore: 83,
    riskLevel: 'medium',
    documents: [],
    contacts: [],
    createdAt: '2023-06-18T13:00:00Z',
    updatedAt: '2024-01-14T13:00:00Z',
    industry: 'Retail',
    website: 'https://officesupplies.com',
    contactPerson: 'Lisa Garcia',
    taxId: 'TAX234567',
    totalDeliveries: 112,
    successfulDeliveries: 108,
    lastDelivery: '2024-01-11'
  },
  {
    id: '7',
    name: 'Digital Marketing Pro',
    email: 'hello@digitalmarketing.com',
    phone: '+1-555-0129',
    address: '147 Creative Avenue, Los Angeles, CA 90210',
    category: 'Marketing',
    registrationDate: '2023-07-25',
    status: 'active',
    complianceScore: 91,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-07-25T16:00:00Z',
    updatedAt: '2024-01-16T16:00:00Z',
    industry: 'Digital Services',
    website: 'https://digitalmarketing.com',
    contactPerson: 'Alex Thompson',
    taxId: 'TAX678901',
    totalDeliveries: 67,
    successfulDeliveries: 65,
    lastDelivery: '2024-01-09'
  },
  {
    id: '8',
    name: 'Healthcare Supplies Inc',
    email: 'orders@healthcaresupplies.com',
    phone: '+1-555-0130',
    address: '258 Medical Center Dr, Boston, MA 02101',
    category: 'Healthcare',
    registrationDate: '2023-08-30',
    status: 'active',
    complianceScore: 97,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-08-30T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
    industry: 'Healthcare',
    website: 'https://healthcaresupplies.com',
    contactPerson: 'Dr. Emily Davis',
    taxId: 'TAX789123',
    totalDeliveries: 134,
    successfulDeliveries: 132,
    lastDelivery: '2024-01-13'
  },
  {
    id: '9',
    name: 'Construction Materials Ltd',
    email: 'quotes@constructionmaterials.com',
    phone: '+1-555-0131',
    address: '369 Builder Street, Phoenix, AZ 85001',
    category: 'Construction',
    registrationDate: '2023-09-15',
    status: 'inactive',
    complianceScore: 79,
    riskLevel: 'medium',
    documents: [],
    contacts: [],
    createdAt: '2023-09-15T07:00:00Z',
    updatedAt: '2023-12-01T07:00:00Z',
    industry: 'Construction',
    website: 'https://constructionmaterials.com',
    contactPerson: 'Robert Martinez',
    taxId: 'TAX890234',
    totalDeliveries: 23,
    successfulDeliveries: 21,
    lastDelivery: '2023-11-28'
  },
  {
    id: '10',
    name: 'Financial Consulting Group',
    email: 'contact@financialconsulting.com',
    phone: '+1-555-0132',
    address: '741 Finance Plaza, Miami, FL 33101',
    category: 'Financial Services',
    registrationDate: '2023-10-22',
    status: 'active',
    complianceScore: 94,
    riskLevel: 'low',
    documents: [],
    contacts: [],
    createdAt: '2023-10-22T15:00:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
    industry: 'Financial Services',
    website: 'https://financialconsulting.com',
    contactPerson: 'Patricia Lee',
    taxId: 'TAX345789',
    totalDeliveries: 58,
    successfulDeliveries: 56,
    lastDelivery: '2024-01-14'
  },
  {
    id: '11',
    name: 'Security Systems Pro',
    email: 'support@securitysystems.com',
    phone: '+1-555-0133',
    address: '852 Security Blvd, Las Vegas, NV 89101',
    category: 'Security',
    registrationDate: '2023-11-08',
    status: 'active',
    complianceScore: 89,
    riskLevel: 'medium',
    documents: [],
    contacts: [],
    createdAt: '2023-11-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
    industry: 'Security Services',
    website: 'https://securitysystems.com',
    contactPerson: 'Kevin Anderson',
    taxId: 'TAX456890',
    totalDeliveries: 34,
    successfulDeliveries: 32,
    lastDelivery: '2024-01-07'
  },
  {
    id: '12',
    name: 'Event Planning Excellence',
    email: 'events@eventplanning.com',
    phone: '+1-555-0134',
    address: '963 Celebration Way, Orlando, FL 32801',
    category: 'Event Services',
    registrationDate: '2023-12-03',
    status: 'active',
    complianceScore: 86,
    riskLevel: 'medium',
    documents: [],
    contacts: [],
    createdAt: '2023-12-03T09:00:00Z',
    updatedAt: '2024-01-03T09:00:00Z',
    industry: 'Event Management',
    website: 'https://eventplanning.com',
    contactPerson: 'Michelle Taylor',
    taxId: 'TAX567901',
    totalDeliveries: 19,
    successfulDeliveries: 18,
    lastDelivery: '2024-01-02'
  }
];

// Mock metrics data
const mockMetrics: VendorMetrics = {
  totalVendors: mockVendors.length,
  activeVendors: mockVendors.filter(v => v.status === 'active').length,
  inactiveVendors: mockVendors.filter(v => v.status === 'inactive').length,
  suspendedVendors: mockVendors.filter(v => v.status === 'suspended').length,
  pendingApproval: mockVendors.filter(v => v.status === 'pending').length, // Add this
  averageComplianceScore: Math.round(mockVendors.reduce((sum, v) => sum + v.complianceScore, 0) / mockVendors.length),
  highRiskVendors: mockVendors.filter(v => v.riskLevel === 'high').length,
  complianceRate: 0.85, // Add this
  monthlyGrowth: 12.5, // Add this
  categoryDistribution: Object.entries(mockVendors.reduce((acc, vendor) => {
    acc[vendor.category] = (acc[vendor.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([category, count]) => ({
    category,
    count,
    percentage: (count / mockVendors.length) * 100
  }))
};

class VendorService {
  private readonly BASE_ENDPOINT = '/vendors';

  // Get all vendors with pagination and filtering
  async getVendors(
    params: PaginationParams & VendorFilters = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredVendors = [...mockVendors];
    
    // Apply filters
    if (params.search) {
      filteredVendors = filteredVendors.filter(vendor => 
        vendor.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        vendor.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params.status) {
      filteredVendors = filteredVendors.filter(vendor => vendor.status === params.status);
    }
    
    if (params.category) {
      filteredVendors = filteredVendors.filter(vendor => vendor.category === params.category);
    }

    if (params.riskLevel) {
      filteredVendors = filteredVendors.filter(vendor => vendor.riskLevel === params.riskLevel);
    }

    if (params.complianceScore) {
      filteredVendors = filteredVendors.filter(vendor => 
        vendor.complianceScore >= (params.complianceScore!.min || 0) &&
        vendor.complianceScore <= (params.complianceScore!.max || 100)
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredVendors.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Vendor];
        const bValue = b[params.sortBy as keyof Vendor];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return params.sortOrder === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
        
        return 0;
      });
    }
    
    // Apply pagination
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedVendors = filteredVendors.slice(startIndex, endIndex);
    
    return {
      success: true,
     data: {
    data: paginatedVendors,
    page: params.page,
    limit: params.limit,
    total: filteredVendors.length,
    totalPages: Math.ceil(filteredVendors.length / params.limit),
    hasNext: params.page < Math.ceil(filteredVendors.length / params.limit),
    hasPrevious: params.page > 1
  },
      message: 'Vendors fetched successfully'
    };
  }

  // Get vendor by ID
  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vendor = mockVendors.find(v => v.id === id);
    
    if (!vendor) {
      return {
        success: false,
        data: null as any,
        message: 'Vendor not found'
      };
    }
    
    return {
      success: true,
      data: vendor,
      message: 'Vendor fetched successfully'
    };
  }

  // Create new vendor
  async createVendor(vendorData: VendorFormData): Promise<ApiResponse<Vendor>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
const newVendor: Vendor = {
  id: (mockVendors.length + 1).toString(),
  name: vendorData.name,
  email: vendorData.email,
  phone: vendorData.phone || '',
  address: vendorData.address || '',
  category: vendorData.category || 'Other',
  registrationDate: new Date().toISOString().split('T')[0],
  status: 'active',
  complianceScore: 75,
  riskLevel: 'medium',
  documents: [], // Ensure this is VendorDocument[], not File[]
  contacts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  industry: vendorData.category || 'Other',
  website: vendorData.website || '',
  contactPerson: vendorData.contactName || '',
  taxId: vendorData.taxId || '',
  totalDeliveries: 0,
  successfulDeliveries: 0,
  lastDelivery: '',
  notes: vendorData.notes
};
    
    mockVendors.push(newVendor);
    
    return {
      success: true,
      data: newVendor,
      message: 'Vendor created successfully'
    };
  }

  // Update vendor
  async updateVendor(id: string, vendorData: Partial<VendorFormData>): Promise<ApiResponse<Vendor>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const vendorIndex = mockVendors.findIndex(v => v.id === id);
    
    if (vendorIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: 'Vendor not found'
      };
    }
    
const updatedVendor: Vendor = {
  ...mockVendors[vendorIndex],
  name: vendorData.name || mockVendors[vendorIndex].name,
  email: vendorData.email || mockVendors[vendorIndex].email,
  phone: vendorData.phone || mockVendors[vendorIndex].phone,
  address: vendorData.address || mockVendors[vendorIndex].address,
  category: vendorData.category || mockVendors[vendorIndex].category,
  website: vendorData.website || mockVendors[vendorIndex].website,
  contactPerson: vendorData.contactName || mockVendors[vendorIndex].contactPerson,
  taxId: vendorData.taxId || mockVendors[vendorIndex].taxId,
  notes: vendorData.notes || mockVendors[vendorIndex].notes,
  // Don't directly assign documents from vendorData as they might be File[]
  documents: mockVendors[vendorIndex].documents, // Keep existing documents
  updatedAt: new Date().toISOString()
};
    return {
      success: true,
      data: updatedVendor,
      message: 'Vendor updated successfully'
    };
  }

  // Delete vendor
  async deleteVendor(id: string): Promise<ApiResponse<{ success: boolean }>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const vendorIndex = mockVendors.findIndex(v => v.id === id);
    
    if (vendorIndex === -1) {
      return {
        success: false,
        data: { success: false },
        message: 'Vendor not found'
      };
    }
    
    mockVendors.splice(vendorIndex, 1);
    
    return {
      success: true,
      data: { success: true },
      message: 'Vendor deleted successfully'
    };
  }

  // Bulk delete vendors
  async bulkDeleteVendors(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let deletedCount = 0;
    
    ids.forEach(id => {
      const index = mockVendors.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVendors.splice(index, 1);
        deletedCount++;
      }
    });
    
    return {
      success: true,
      data: { deletedCount },
      message: `${deletedCount} vendors deleted successfully`
    };
  }

  // Update vendor status
  async updateVendorStatus(
    id: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<ApiResponse<Vendor>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const vendor = mockVendors.find(v => v.id === id);
    
    if (!vendor) {
      return {
        success: false,
        data: null as any,
        message: 'Vendor not found'
      };
    }
    
    vendor.status = status;
    vendor.updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: vendor,
      message: 'Vendor status updated successfully'
    };
  }

  // Get vendor metrics
  async getVendorMetrics(): Promise<ApiResponse<VendorMetrics>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockMetrics,
      message: 'Vendor metrics fetched successfully'
    };
  }

  // Get vendor performance data
  async getVendorPerformance(
    vendorId: string,
    period: string = '30d'
  ): Promise<ApiResponse<VendorPerformance>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const vendor = mockVendors.find(v => v.id === vendorId);
    
    if (!vendor) {
      return {
        success: false,
        data: null as any,
        message: 'Vendor not found'
      };
    }
    
  const performance: VendorPerformance = {
  vendorId,
  period,
  totalOrders: vendor.totalDeliveries || 0,
  completedOrders: vendor.successfulDeliveries || 0,
  cancelledOrders: (vendor.totalDeliveries || 0) - (vendor.successfulDeliveries || 0), // Add this
  onTimeDeliveryRate: Math.random() * 0.3 + 0.7, // Add this
  qualityScore: Math.floor(Math.random() * 30) + 70, // Add this
  successRate: vendor.totalDeliveries ? (vendor.successfulDeliveries || 0) / vendor.totalDeliveries : 0,
  averageDeliveryTime: Math.floor(Math.random() * 10) + 5,
  complianceScore: vendor.complianceScore,
  riskLevel: vendor.riskLevel,
  monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    orders: Math.floor(Math.random() * 20) + 5,
    successRate: Math.random() * 0.3 + 0.7
  }))
};
    
    return {
      success: true,
      data: performance,
      message: 'Vendor performance data fetched successfully'
    };
  }

  // Get vendor analytics
  async getVendorAnalytics(
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<VendorAnalytics>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const analytics: VendorAnalytics = {
      totalVendors: mockVendors.length,
      activeVendors: mockVendors.filter(v => v.status === 'active').length,
      newVendorsThisMonth: 3,
      averageComplianceScore: mockMetrics.averageComplianceScore,
      topPerformingVendors: mockVendors
        .sort((a, b) => b.complianceScore - a.complianceScore)
        .slice(0, 5)
        .map(v => ({
          id: v.id,
          name: v.name,
          complianceScore: v.complianceScore,
          successRate: v.totalDeliveries ? (v.successfulDeliveries || 0) / v.totalDeliveries : 0
        })),
      riskDistribution: {
        low: mockVendors.filter(v => v.riskLevel === 'low').length,
        medium: mockVendors.filter(v => v.riskLevel === 'medium').length,
        high: mockVendors.filter(v => v.riskLevel === 'high').length
      },
      categoryDistribution: mockVendors.reduce((acc, vendor) => {
        acc[vendor.category] = (acc[vendor.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return {
      success: true,
      data: analytics,
      message: 'Vendor analytics fetched successfully'
    };
  }

  // Search vendors
  async searchVendors(
    query: string,
    filters?: VendorFilters
  ): Promise<ApiResponse<PaginatedResponse<Vendor>>> {
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vendors = mockVendors.filter(v => v.category === category);
    
    return {
      success: true,
      data: vendors,
      message: `Vendors in ${category} category fetched successfully`
    };
  }

  // Get high-risk vendors
  async getHighRiskVendors(): Promise<ApiResponse<Vendor[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const highRiskVendors = mockVendors.filter(v => v.riskLevel === 'high');
    
    return {
      success: true,
      data: highRiskVendors,
      message: 'High-risk vendors fetched successfully'
    };
  }

  // Update compliance score
  async updateComplianceScore(
    vendorId: string,
    score: number,
    notes?: string
  ): Promise<ApiResponse<Vendor>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const vendor = mockVendors.find(v => v.id === vendorId);
    
    if (!vendor) {
      return {
        success: false,
        data: null as any,
        message: 'Vendor not found'
      };
    }
    
    vendor.complianceScore = score;
    vendor.updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: vendor,
      message: 'Compliance score updated successfully'
    };
  }

  // Upload vendor documents
  async uploadVendorDocuments(
    vendorId: string,
    documents: File[],
    documentType: string
  ): Promise<ApiResponse<VendorDocument[]>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
const mockDocuments: VendorDocument[] = documents.map((file, index) => ({
  id: `doc_${vendorId}_${Date.now()}_${index}`,
  vendorId,
  name: file.name,
  type: documentType as 'license' | 'certificate' | 'insurance' | 'tax' | 'other',
  size: file.size,
  url: `https://example.com/documents/${file.name}`,
  verified: false, // Add this
  uploadedAt: new Date().toISOString(), // Change from uploadDate
  status: 'pending'
}));

    
    return {
      success: true,
      data: mockDocuments,
      message: 'Documents uploaded successfully'
    };
  }

  // Delete vendor document
  async deleteVendorDocument(
    vendorId: string,
    documentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: { success: true },
      message: 'Document deleted successfully'
    };
  }

  // Verify vendor document
  async verifyVendorDocument(
    vendorId: string,
    documentId: string,
    verified: boolean
  ): Promise<ApiResponse<VendorDocument>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
const mockDocument: VendorDocument = {
  id: documentId,
  vendorId,
  name: 'Sample Document.pdf',
  type: 'license',
  size: 1024000,
  url: 'https://example.com/documents/sample.pdf',
  verified: verified, // Add this
  uploadedAt: new Date().toISOString(), // Change from uploadDate
  status: verified ? 'verified' : 'pending'
};
    
    return {
      success: true,
      data: mockDocument,
      message: `Document ${verified ? 'verified' : 'marked as pending'} successfully`
    };
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const history = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `history_${vendorId}_${i}`,
      score: Math.floor(Math.random() * 30) + 70,
      date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Compliance review ${i + 1}`,
      changedBy: `User ${i + 1}`
    }));
    
    return {
      success: true,
      data: history,
      message: 'Vendor compliance history fetched successfully'
    };
  }

  // Export vendors data
  async exportVendors(
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: VendorFilters
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Exporting vendors in ${format} format with filters:`, filters);
    // Mock file download
    const blob = new Blob(['Mock export data'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock progress updates
    if (onUploadProgress) {
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => onUploadProgress(i), i * 20);
      }
    }
    
    return {
      success: true,
      data: {
        imported: 15,
        failed: 2,
        errors: ['Invalid email format in row 3', 'Missing required field in row 8']
      },
      message: 'Vendors imported successfully'
    };
  }

  // Get vendor categories
  async getVendorCategories(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    count: number;
  }>>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categories = mockVendors.reduce((acc, vendor) => {
      acc[vendor.category] = (acc[vendor.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryList = Object.entries(categories).map(([name, count], index) => ({
      id: `cat_${index}`,
      name,
      count
    }));
    
    return {
      success: true,
      data: categoryList,
      message: 'Vendor categories fetched successfully'
    };
  }

  // Validate vendor data
  async validateVendorData(vendorData: VendorFormData): Promise<ApiResponse<{
    valid: boolean;
    errors: Record<string, string>;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const errors: Record<string, string> = {};
    
    if (!vendorData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!vendorData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorData.email)) {
      errors.email = 'Invalid email format';
    }
    
    const valid = Object.keys(errors).length === 0;
    
    return {
      success: true,
      data: { valid, errors },
      message: valid ? 'Vendor data is valid' : 'Validation failed'
    };
  }

  // Check vendor email uniqueness
  async checkEmailUniqueness(email: string, excludeId?: string): Promise<ApiResponse<{
    available: boolean;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingVendor = mockVendors.find(v => 
      v.email === email && v.id !== excludeId
    );
    
    return {
      success: true,
      data: { available: !existingVendor },
      message: existingVendor ? 'Email already exists' : 'Email is available'
    };
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activities = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `activity_${vendorId}_${i}`,
      action: ['Created', 'Updated', 'Status Changed', 'Document Uploaded', 'Compliance Updated'][i % 5],
      details: `Activity ${i + 1} details`,
      performedBy: `User ${(i % 3) + 1}`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
    }));
    
    return {
      success: true,
      data: activities,
      message: 'Vendor activity log fetched successfully'
    };
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