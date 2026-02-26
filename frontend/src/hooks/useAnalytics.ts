import { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../services/api';

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
  [key: string]: any;
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

  // Fetch analytics data from backend
  const fetchAnalytics = useCallback(async (filters?: Partial<AnalyticsFilter>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const currentFilters = { ...state.filters, ...filters };
      const params: Record<string, string> = {
        startDate: currentFilters.dateRange.start.toISOString(),
        endDate: currentFilters.dateRange.end.toISOString(),
      };

      // Fetch dashboard, vendor analytics, delivery analytics, and fraud data in parallel
      const [dashboardRes, vendorRes, deliveryRes, fraudRes, trendsRes] = await Promise.all([
        apiService.get<any>('/analytics/dashboard', params),
        apiService.get<any>('/analytics/vendors', params),
        apiService.get<any>('/analytics/deliveries', params),
        apiService.get<any>('/analytics/fraud', params),
        apiService.get<any>('/analytics/trends', params),
      ]);

      const dashboard = dashboardRes.data;
      const vendorAnalytics = vendorRes.data;
      const deliveryAnalytics = deliveryRes.data;
      const fraudData = fraudRes.data;
      const trends = trendsRes.data;

      // Map vendor performance from topVendors + bottomVendors
      const vendorPerformance: VendorPerformance[] = [
        ...(vendorAnalytics.topVendors || []),
        ...(vendorAnalytics.bottomVendors || []),
      ].map((v: any) => ({
        vendorId: v._id || v.id,
        vendorName: v.name,
        complianceScore: v.complianceScore || 0,
        totalDeliveries: v.totalDeliveries || 0,
        onTimeDeliveries: v.onTimeDeliveries || 0,
        fraudIncidents: 0,
        riskLevel: v.riskLevel || 'low',
        lastDeliveryDate: v.lastDelivery || new Date().toISOString(),
      }));

      // Map compliance trends from backend trends data
      const complianceTrends: ComplianceTrend[] = (trends.complianceTrend || []).map((t: any) => ({
        period: t._id,
        complianceRate: t.avgScore || 0,
        totalVendors: t.count || 0,
        compliantVendors: Math.round((t.avgScore || 0) / 100 * (t.count || 0)),
        nonCompliantVendors: (t.count || 0) - Math.round((t.avgScore || 0) / 100 * (t.count || 0)),
        riskScore: 0,
        fraudIncidents: 0,
        onTimeDeliveries: 0,
        totalDeliveries: 0,
        deliveryRate: 0,
      }));

      // Map delivery trends into compliance trends
      (trends.deliveryTrend || []).forEach((dt: any) => {
        const existing = complianceTrends.find(ct => ct.period === dt._id);
        if (existing) {
          existing.totalDeliveries = dt.total || 0;
          existing.onTimeDeliveries = dt.onTime || 0;
          existing.deliveryRate = dt.total > 0 ? Math.round((dt.onTime / dt.total) * 100) : 0;
        }
      });

      const analyticsData: AnalyticsData = {
        fraudMetrics: {
          totalIncidents: fraudData.flaggedDeliveries?.length || 0,
          riskScore: 0,
          suspiciousDeliveries: fraudData.flaggedDeliveries?.length || 0,
          flaggedVendors: dashboard.overview?.fraudDetected || 0,
          fraudPrevented: 0,
          savingsAmount: 0,
        },
        complianceTrends,
        vendorPerformance,
        totalVendors: dashboard.overview?.totalVendors || 0,
        totalDeliveries: deliveryAnalytics.totalDeliveries ?? dashboard.overview?.totalDeliveries ?? 0,
        avgComplianceRate: dashboard.overview?.averageCompliance || 0,
        lastUpdated: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        data: analyticsData,
        loading: false,
        filters: currentFilters,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      }));
    }
  }, [state.filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilter>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
    fetchAnalytics(newFilters);
  }, [fetchAnalytics]);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Export data
  const exportData = useCallback(async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      if (!state.data) return { success: false, error: 'No data to export' };
      await apiService.downloadFile(
        '/analytics/export',
        `analytics-${new Date().toISOString().split('T')[0]}.${format}`,
        { format }
      );
      return { success: true, downloadUrl: '' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Export failed' };
    }
  }, [state.data]);

  // Computed metrics
  const computedMetrics = useMemo(() => {
    if (!state.data) return null;

    const { complianceTrends, vendorPerformance } = state.data;

    const recentTrends = complianceTrends.slice(-3);
    const complianceTrend = recentTrends.length > 1
      ? recentTrends[recentTrends.length - 1].complianceRate - recentTrends[0].complianceRate
      : 0;

    const riskDistribution = vendorPerformance.reduce((acc, vendor) => {
      acc[vendor.riskLevel] = (acc[vendor.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedVendors = [...vendorPerformance].sort((a, b) => b.complianceScore - a.complianceScore);
    const topPerformers = sortedVendors.slice(0, 5);
    const bottomPerformers = sortedVendors.slice(-5).reverse();

    return {
      complianceTrend,
      riskDistribution,
      topPerformers,
      bottomPerformers,
      totalFraudIncidents: complianceTrends.reduce((sum, t) => sum + t.fraudIncidents, 0),
      averageDeliveryRate: complianceTrends.length > 0
        ? complianceTrends.reduce((sum, t) => sum + t.deliveryRate, 0) / complianceTrends.length
        : 0,
    };
  }, [state.data]);

  // Initialize data on mount
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    computedMetrics,
    fetchAnalytics,
    updateFilters,
    refreshData,
    exportData,
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
  };
};
