import { useState, useEffect, useCallback, useMemo } from 'react';

// Analytics interfaces
export interface FraudMetrics {
  totalIncidents: number;
  riskScore: number;
  suspiciousDeliveries: number;
  flaggedVendors: number;
  fraudPrevented: number;
  savingsAmount: number;
}

export interface ComplianceTrend {
  period: string;
  complianceRate: number;
  totalVendors: number;
  compliantVendors: number;
  nonCompliantVendors: number;
  riskScore: number;
  fraudIncidents: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  deliveryRate: number;
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  complianceScore: number;
  totalDeliveries: number;
  onTimeDeliveries: number;
  fraudIncidents: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastDeliveryDate: string;
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  vendorIds?: string[];
  riskLevels?: string[];
  complianceStatus?: string[];
}

export interface AnalyticsData {
  fraudMetrics: FraudMetrics;
  complianceTrends: ComplianceTrend[];
  vendorPerformance: VendorPerformance[];
  totalVendors: number;
  totalDeliveries: number;
  avgComplianceRate: number;
  lastUpdated: string;
}

// Hook state interface
interface UseAnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilter;
}

// Mock data generator for demo
const generateMockAnalytics = (filters: AnalyticsFilter): AnalyticsData => {
  const mockComplianceTrends: ComplianceTrend[] = [
    {
      period: '2024-01',
      complianceRate: 85.5,
      totalVendors: 120,
      compliantVendors: 103,
      nonCompliantVendors: 17,
      riskScore: 4.2,
      fraudIncidents: 3,
      onTimeDeliveries: 445,
      totalDeliveries: 467,
      deliveryRate: 95.3
    },
    {
      period: '2024-02',
      complianceRate: 87.8,
      totalVendors: 125,
      compliantVendors: 110,
      nonCompliantVendors: 15,
      riskScore: 3.8,
      fraudIncidents: 2,
      onTimeDeliveries: 478,
      totalDeliveries: 501,
      deliveryRate: 95.4
    },
    {
      period: '2024-03',
      complianceRate: 91.2,
      totalVendors: 128,
      compliantVendors: 117,
      nonCompliantVendors: 11,
      riskScore: 3.1,
      fraudIncidents: 1,
      onTimeDeliveries: 512,
      totalDeliveries: 534,
      deliveryRate: 95.9
    },
    {
      period: '2024-04',
      complianceRate: 89.7,
      totalVendors: 132,
      compliantVendors: 118,
      nonCompliantVendors: 14,
      riskScore: 3.5,
      fraudIncidents: 2,
      onTimeDeliveries: 523,
      totalDeliveries: 548,
      deliveryRate: 95.4
    },
    {
      period: '2024-05',
      complianceRate: 92.8,
      totalVendors: 135,
      compliantVendors: 125,
      nonCompliantVendors: 10,
      riskScore: 2.9,
      fraudIncidents: 1,
      onTimeDeliveries: 567,
      totalDeliveries: 589,
      deliveryRate: 96.3
    }
  ];

  const mockVendorPerformance: VendorPerformance[] = [
    {
      vendorId: 'V001',
      vendorName: 'TechCorp Solutions',
      complianceScore: 95.2,
      totalDeliveries: 89,
      onTimeDeliveries: 87,
      fraudIncidents: 0,
      riskLevel: 'low',
      lastDeliveryDate: '2024-05-15'
    },
    {
      vendorId: 'V002',
      vendorName: 'Global Supply Co',
      complianceScore: 88.7,
      totalDeliveries: 156,
      onTimeDeliveries: 145,
      fraudIncidents: 1,
      riskLevel: 'medium',
      lastDeliveryDate: '2024-05-14'
    },
    {
      vendorId: 'V003',
      vendorName: 'Swift Logistics',
      complianceScore: 76.3,
      totalDeliveries: 67,
      onTimeDeliveries: 58,
      fraudIncidents: 3,
      riskLevel: 'high',
      lastDeliveryDate: '2024-05-13'
    },
    {
      vendorId: 'V004',
      vendorName: 'Premium Parts Ltd',
      complianceScore: 91.8,
      totalDeliveries: 134,
      onTimeDeliveries: 128,
      fraudIncidents: 0,
      riskLevel: 'low',
      lastDeliveryDate: '2024-05-16'
    },
    {
      vendorId: 'V005',
      vendorName: 'Reliable Goods Inc',
      complianceScore: 83.4,
      totalDeliveries: 98,
      onTimeDeliveries: 89,
      fraudIncidents: 2,
      riskLevel: 'medium',
      lastDeliveryDate: '2024-05-12'
    }
  ];

  return {
    fraudMetrics: {
      totalIncidents: 9,
      riskScore: 3.1,
      suspiciousDeliveries: 23,
      flaggedVendors: 8,
      fraudPrevented: 15,
      savingsAmount: 47500
    },
    complianceTrends: mockComplianceTrends,
    vendorPerformance: mockVendorPerformance,
    totalVendors: 135,
    totalDeliveries: 2639,
    avgComplianceRate: 89.4,
    lastUpdated: new Date().toISOString()
  };
};

export const useAnalytics = () => {
  const [state, setState] = useState<UseAnalyticsState>({
    data: null,
    loading: false,
    error: null,
    filters: {
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        end: new Date()
      }
    }
  });

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (filters?: Partial<AnalyticsFilter>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentFilters = { ...state.filters, ...filters };
      const mockData = generateMockAnalytics(currentFilters);
      
      setState(prev => ({
        ...prev,
        data: mockData,
        loading: false,
        filters: currentFilters
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      }));
    }
  }, [state.filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilter>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
    
    // Auto-fetch when filters change
    fetchAnalytics(newFilters);
  }, [fetchAnalytics]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Export data functionality
  const exportData = useCallback(async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      if (!state.data) return;
      
      // Simulate export
      console.log(`Exporting analytics data as ${format}...`);
      
      // In real implementation, this would call an API endpoint
      // or use a library like xlsx or jspdf to generate the file
      
      return {
        success: true,
        downloadUrl: `/api/analytics/export?format=${format}&timestamp=${Date.now()}`
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }, [state.data]);

  // Computed metrics
  const computedMetrics = useMemo(() => {
    if (!state.data) return null;
    
    const { complianceTrends, vendorPerformance } = state.data;
    
    // Calculate trends
    const recentTrends = complianceTrends.slice(-3);
    const complianceTrend = recentTrends.length > 1 ? 
      recentTrends[recentTrends.length - 1].complianceRate - recentTrends[0].complianceRate : 0;
    
    // Risk distribution
    const riskDistribution = vendorPerformance.reduce((acc, vendor) => {
      acc[vendor.riskLevel] = (acc[vendor.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Top/bottom performers
    const sortedVendors = [...vendorPerformance].sort((a, b) => b.complianceScore - a.complianceScore);
    const topPerformers = sortedVendors.slice(0, 5);
    const bottomPerformers = sortedVendors.slice(-5).reverse();
    
    return {
      complianceTrend,
      riskDistribution,
      topPerformers,
      bottomPerformers,
      totalFraudIncidents: complianceTrends.reduce((sum, trend) => sum + trend.fraudIncidents, 0),
      averageDeliveryRate: complianceTrends.reduce((sum, trend) => sum + trend.deliveryRate, 0) / complianceTrends.length
    };
  }, [state.data]);

  // Initialize data on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    // Data
    data: state.data,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    computedMetrics,
    
    // Actions
    fetchAnalytics,
    updateFilters,
    refreshData,
    exportData,
    
    // Utilities
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data
  };
};