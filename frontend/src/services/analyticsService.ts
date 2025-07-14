// frontend/src/services/analyticsService.ts
import apiService from './api';
import type { ApiResponse, PaginationParams } from '../types/common';

// Analytics-specific types
interface ComplianceReport {
  id: string;
  title: string;
  type: 'vendor' | 'delivery' | 'system';
  period: string;
  score: number;
  issues: number;
  recommendations: string[];
  generatedAt: string;
  generatedBy: string;
}

interface PerformanceMetrics {
  period: string;
  deliveryMetrics: {
    totalDeliveries: number;
    onTimeDeliveries: number;
    verifiedDeliveries: number;
    fraudDetected: number;
    onTimeRate: number;
    verificationRate: number;
  };
  vendorMetrics: {
    totalVendors: number;
    activeVendors: number;
    averageComplianceScore: number;
    highRiskVendors: number;
  };
  systemMetrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    userSatisfaction: number;
  };
}

interface FraudDetectionData {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  falsePositives: number;
  detectionRate: number;
  cases: Array<{
    id: string;
    type: 'duplicate' | 'quantity' | 'quality' | 'document' | 'photo';
    severity: 'low' | 'medium' | 'high';
    description: string;
    deliveryId: string;
    vendorId: string;
    detectedAt: string;
    status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
    investigatedBy?: string;
    resolution?: string;
  }>;
}

interface TrendAnalysis {
  deliveryTrends: Array<{
    date: string;
    deliveries: number;
    verified: number;
    fraudDetected: number;
  }>;
  complianceTrends: Array<{
    date: string;
    averageScore: number;
    passRate: number;
  }>;
  vendorTrends: Array<{
    date: string;
    newVendors: number;
    activeVendors: number;
    suspendedVendors: number;
  }>;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange?: { start: string; end: string };
  includeCharts?: boolean;
  includeRawData?: boolean;
}

class AnalyticsService {
  private readonly endpoint = '/analytics';

  // Get comprehensive dashboard analytics
  async getDashboardAnalytics(period = '30d'): Promise<ApiResponse<{
    metrics: PerformanceMetrics;
    trends: TrendAnalysis;
    alerts: Array<{
      id: string;
      type: 'fraud' | 'compliance' | 'performance';
      severity: 'low' | 'medium' | 'high';
      message: string;
      timestamp: string;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/dashboard`, { period });
  }

  // Get compliance reports with pagination
  async getComplianceReports(
    params: PaginationParams & { type?: string; period?: string } = { page: 1, limit: 10 }
  ): Promise<ApiResponse<{
    reports: ComplianceReport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    return apiService.get(`${this.endpoint}/compliance-reports`, params);
  }

  // Get specific compliance report
  async getComplianceReport(id: string): Promise<ApiResponse<ComplianceReport & {
    details: {
      vendorCompliance: Array<{
        vendorId: string;
        vendorName: string;
        score: number;
        issues: string[];
        recommendations: string[];
      }>;
      deliveryCompliance: Array<{
        deliveryId: string;
        score: number;
        issues: string[];
        verificationStatus: string;
      }>;
      systemCompliance: {
        uptime: number;
        security: number;
        performance: number;
        issues: string[];
      };
    };
  }>> {
    return apiService.get(`${this.endpoint}/compliance-reports/${id}`);
  }

  // Generate new compliance report
  async generateComplianceReport(config: {
    type: 'vendor' | 'delivery' | 'system';
    period: string;
    vendorIds?: string[];
    includeRecommendations?: boolean;
  }): Promise<ApiResponse<{ reportId: string; status: string }>> {
    return apiService.post(`${this.endpoint}/compliance-reports`, config);
  }

  // Get performance metrics
  async getPerformanceMetrics(
    period = '30d',
    breakdown?: 'daily' | 'weekly' | 'monthly'
  ): Promise<ApiResponse<PerformanceMetrics & {
    breakdown: Array<{
      period: string;
      metrics: Partial<PerformanceMetrics>;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/performance`, { period, breakdown });
  }

  // Get fraud detection data
  async getFraudDetectionData(
    params: { status?: string; severity?: string; type?: string } = {}
  ): Promise<ApiResponse<FraudDetectionData>> {
    return apiService.get(`${this.endpoint}/fraud-detection`, params);
  }

  // Get trend analysis
  async getTrendAnalysis(
    period = '90d',
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<ApiResponse<TrendAnalysis>> {
    return apiService.get(`${this.endpoint}/trends`, { period, granularity });
  }

  // Get vendor performance analytics
  async getVendorAnalytics(
    vendorId?: string,
    period = '30d'
  ): Promise<ApiResponse<{
    vendorPerformance: Array<{
      vendorId: string;
      vendorName: string;
      deliveryCount: number;
      onTimeRate: number;
      qualityScore: number;
      complianceScore: number;
      fraudIncidents: number;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    topPerformers: Array<{
      vendorId: string;
      vendorName: string;
      score: number;
      metric: string;
    }>;
    riskVendors: Array<{
      vendorId: string;
      vendorName: string;
      riskScore: number;
      issues: string[];
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/vendors`, { vendorId, period });
  }

  // Get delivery analytics
  async getDeliveryAnalytics(
    filters: { vendorId?: string; status?: string; period?: string } = {}
  ): Promise<ApiResponse<{
    deliveryStats: {
      totalDeliveries: number;
      successRate: number;
      averageVerificationTime: number;
      fraudDetectionRate: number;
    };
    statusDistribution: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    timeAnalysis: Array<{
      timeSlot: string;
      deliveries: number;
      verifications: number;
    }>;
    geographicDistribution: Array<{
      region: string;
      deliveries: number;
      successRate: number;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/deliveries`, filters);
  }

  // Get quality metrics
  async getQualityMetrics(period = '30d'): Promise<ApiResponse<{
    overallQuality: number;
    verificationAccuracy: number;
    fraudDetectionAccuracy: number;
    photoQualityScore: number;
    documentQualityScore: number;
    qualityTrends: Array<{
      date: string;
      score: number;
      category: string;
    }>;
    issueBreakdown: Array<{
      issue: string;
      count: number;
      impact: 'low' | 'medium' | 'high';
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/quality`, { period });
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<ApiResponse<{
    activeDeliveries: number;
    pendingVerifications: number;
    fraudAlertsToday: number;
    systemLoad: number;
    onlineUsers: number;
    responseTime: number;
    recentActivity: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/realtime`);
  }

  // Export analytics data
  async exportAnalyticsData(
    type: 'compliance' | 'performance' | 'fraud' | 'trends',
    options: ExportOptions
  ): Promise<void> {
    const filename = `${type}-analytics-${new Date().toISOString().split('T')[0]}.${options.format}`;
    return apiService.downloadFile(`${this.endpoint}/export/${type}`, filename, options);
  }

  // Get predictive analytics
  async getPredictiveAnalytics(
    horizon: '7d' | '30d' | '90d' = '30d'
  ): Promise<ApiResponse<{
    deliveryForecast: Array<{
      date: string;
      predictedDeliveries: number;
      confidence: number;
    }>;
    riskPredictions: Array<{
      vendorId: string;
      vendorName: string;
      riskScore: number;
      riskFactors: string[];
      recommendation: string;
    }>;
    complianceForecast: Array<{
      date: string;
      predictedScore: number;
      factors: string[];
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/predictive`, { horizon });
  }

  // Get custom report
  async getCustomReport(config: {
    metrics: string[];
    filters: Record<string, any>;
    groupBy?: string;
    period: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<ApiResponse<{
    data: any[];
    summary: Record<string, any>;
    metadata: {
      generatedAt: string;
      recordCount: number;
      filters: Record<string, any>;
    };
  }>> {
    return apiService.post(`${this.endpoint}/custom-report`, config);
  }

  // Get comparison analytics
  async getComparisonAnalytics(
    type: 'vendor' | 'period' | 'region',
    compareItems: string[],
    metrics: string[] = ['deliveries', 'compliance', 'fraud']
  ): Promise<ApiResponse<{
    comparison: Array<{
      item: string;
      metrics: Record<string, number>;
      rank: number;
      percentile: number;
    }>;
    insights: Array<{
      type: 'strength' | 'weakness' | 'opportunity';
      message: string;
      impact: 'high' | 'medium' | 'low';
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/comparison`, { type, compareItems, metrics });
  }

  // Get alert statistics
  async getAlertStats(period = '30d'): Promise<ApiResponse<{
    totalAlerts: number;
    resolvedAlerts: number;
    pendingAlerts: number;
    falsePositives: number;
    alertTypes: Array<{
      type: string;
      count: number;
      averageResolutionTime: number;
    }>;
    severityDistribution: Array<{
      severity: string;
      count: number;
      percentage: number;
    }>;
  }>> {
    return apiService.get(`${this.endpoint}/alerts`, { period });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;