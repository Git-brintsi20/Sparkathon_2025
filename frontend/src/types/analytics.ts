// Analytics types and interfaces
import { PaginatedResponse, ApiResponse } from './common';

// Chart data types
export interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  date: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
  label?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface DonutChartData extends PieChartData {
  innerRadius?: number;
  outerRadius?: number;
}

export interface BarChartData {
  category: string;
  value: number;
  color?: string;
  target?: number;
}

export interface LineChartData {
  date: string;
  value: number;
  series: string;
  color?: string;
}

// Analytics metrics
export interface ComplianceMetrics {
  overallScore: number;
  passRate: number;
  failRate: number;
  pendingRate: number;
  trendsLastMonth: number;
  criticalIssues: number;
  resolvedIssues: number;
  averageResolutionTime: number;
}

export interface VendorPerformanceMetrics {
  vendorId: string;
  vendorName: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  onTimeRate: number;
  qualityScore: number;
  complianceScore: number;
  fraudRisk: 'low' | 'medium' | 'high';
  lastDeliveryDate: string;
  averageDeliveryTime: number;
  costEfficiency: number;
}

export interface DeliveryMetrics {
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  pendingDeliveries: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  costPerDelivery: number;
}

export interface FraudMetrics {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  falsePositives: number;
  detectionRate: number;
  averageResolutionTime: number;
  financialImpact: number;
  riskScore: number;
}

// Analytics filters
export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  vendors?: string[];
  categories?: string[];
  regions?: string[];
  riskLevels?: ('low' | 'medium' | 'high')[];
  statuses?: string[];
  departments?: string[];
}

export interface MetricsFilters extends AnalyticsFilters {
  metrics?: string[];
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  compareWith?: 'previous_period' | 'last_year' | 'baseline';
}

// Report types
export interface ReportConfig {
  id: string;
  title: string;
  description: string;
  type: 'compliance' | 'performance' | 'fraud' | 'financial' | 'operational';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  filters: AnalyticsFilters;
  recipients?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedReport {
  id: string;
  configId: string;
  title: string;
  type: string;
  format: string;
  url: string;
  size: number;
  generatedAt: string;
  expiresAt: string;
  status: 'generating' | 'ready' | 'failed' | 'expired';
  metadata: {
    recordCount: number;
    dateRange: {
      start: string;
      end: string;
    };
    filters: AnalyticsFilters;
  };
}

export interface ReportSchedule {
  id: string;
  reportConfigId: string;
  cronExpression: string;
  nextRun: string;
  lastRun?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard analytics
export interface DashboardAnalytics {
  overview: {
    totalVendors: number;
    activeDeliveries: number;
    complianceScore: number;
    fraudAlerts: number;
    trendsData: TimeSeriesData[];
  };
  compliance: ComplianceMetrics;
  performance: {
    topVendors: VendorPerformanceMetrics[];
    deliveryMetrics: DeliveryMetrics;
    monthlyTrends: TimeSeriesData[];
  };
  fraud: FraudMetrics;
  financial: {
    totalSpend: number;
    costSavings: number;
    budgetUtilization: number;
    costTrends: TimeSeriesData[];
  };
}

// Chart configurations
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';
  title: string;
  xAxis?: {
    label: string;
    dataKey: string;
    type?: 'category' | 'number' | 'time';
  };
  yAxis?: {
    label: string;
    dataKey: string;
    type?: 'number' | 'category';
  };
  legend?: {
    position: 'top' | 'bottom' | 'left' | 'right';
    align: 'start' | 'center' | 'end';
  };
  colors?: string[];
  height?: number;
  width?: number;
  responsive?: boolean;
  animate?: boolean;
}

// Analytics API response types
export interface AnalyticsApiResponse<T> extends ApiResponse<T> {
  metadata?: {
    totalRecords: number;
    processedAt: string;
    filters: AnalyticsFilters;
    executionTime: number;
  };
}

export interface MetricsResponse extends AnalyticsApiResponse<DashboardAnalytics> {}

export interface ComplianceReportResponse extends AnalyticsApiResponse<{
  summary: ComplianceMetrics;
  details: Array<{
    vendorId: string;
    vendorName: string;
    complianceScore: number;
    issues: string[];
    recommendations: string[];
  }>;
  trends: TimeSeriesData[];
}> {}

export interface PerformanceReportResponse extends AnalyticsApiResponse<{
  summary: DeliveryMetrics;
  vendors: VendorPerformanceMetrics[];
  trends: TimeSeriesData[];
  benchmarks: Record<string, number>;
}> {}

export interface FraudReportResponse extends AnalyticsApiResponse<{
  summary: FraudMetrics;
  cases: Array<{
    id: string;
    vendorId: string;
    vendorName: string;
    riskScore: number;
    status: 'investigating' | 'resolved' | 'false_positive';
    createdAt: string;
    resolvedAt?: string;
  }>;
  patterns: Array<{
    type: string;
    frequency: number;
    impact: number;
  }>;
}> {}

// Real-time analytics
export interface RealTimeMetrics {
  timestamp: string;
  metrics: {
    activeDeliveries: number;
    pendingVerifications: number;
    systemHealth: number;
    apiResponseTime: number;
    errorRate: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
}

// Export and import types
export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeHeaders: boolean;
  dateFormat: string;
  columns: string[];
  filters: AnalyticsFilters;
}

export interface ImportConfig {
  format: 'csv' | 'excel' | 'json';
  hasHeaders: boolean;
  delimiter?: string;
  mapping: Record<string, string>;
  validation: {
    required: string[];
    types: Record<string, string>;
  };
}

// Analytics hooks types
export interface UseAnalyticsOptions {
  filters?: AnalyticsFilters;
  refreshInterval?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export interface AnalyticsHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  refresh: () => void;
}

// Comparison types
export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface BenchmarkData {
  metric: string;
  value: number;
  benchmark: number;
  performance: 'above' | 'below' | 'at' | 'unknown';
  percentile: number;
}

// Analytics state types
export interface AnalyticsState {
  metrics: DashboardAnalytics | null;
  reports: GeneratedReport[];
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
  lastUpdated: string | null;
}

export interface ReportState {
  reports: GeneratedReport[];
  configs: ReportConfig[];
  schedules: ReportSchedule[];
  generating: boolean;
  error: string | null;
}