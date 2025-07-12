import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Package, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';
import { cn } from '@/components/lib/utils';

export interface VendorMetricsProps {
  vendorId: string;
  vendorName: string;
  metrics: {
    complianceScore: number;
    complianceHistory: Array<{
      month: string;
      score: number;
      deliveries: number;
      issues: number;
    }>;
    performanceMetrics: {
      totalOrders: number;
      completedOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
      averageDeliveryTime: number;
      onTimeDeliveryRate: number;
      qualityScore: number;
      costSavings: number;
    };
    riskMetrics: {
      riskLevel: 'low' | 'medium' | 'high';
      riskScore: number;
      riskFactors: string[];
      complianceIssues: number;
      resolvedIssues: number;
    };
    monthlyTrends: Array<{
      month: string;
      orders: number;
      revenue: number;
      satisfaction: number;
    }>;
  };
  className?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

const getComplianceColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
}> = ({ title, value, icon, trend, trendValue, className }) => (
  <div className={cn('bg-muted/30 rounded-lg p-4 space-y-2', className)}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      {trend && trendValue && (
        <div className={cn(
          'flex items-center gap-1 text-xs',
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 'text-gray-600'
        )}>
          {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
           trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export const VendorMetrics: React.FC<VendorMetricsProps> = ({
  vendorId,
  vendorName,
  metrics,
  className,
}) => {
  const { performanceMetrics, riskMetrics, complianceHistory, monthlyTrends } = metrics;
  
  const completionRate = performanceMetrics.totalOrders > 0 
    ? (performanceMetrics.completedOrders / performanceMetrics.totalOrders) * 100 
    : 0;

  const issueResolutionRate = riskMetrics.complianceIssues > 0 
    ? (riskMetrics.resolvedIssues / riskMetrics.complianceIssues) * 100 
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{vendorName} Metrics</h2>
          <p className="text-muted-foreground">Performance and compliance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getRiskColor(riskMetrics.riskLevel)}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            {riskMetrics.riskLevel.toUpperCase()} RISK
          </Badge>
          <Badge variant="outline" className={getComplianceColor(metrics.complianceScore)}>
            <Award className="h-4 w-4 mr-1" />
            {metrics.complianceScore}% Compliance
          </Badge>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Orders"
              value={performanceMetrics.totalOrders.toLocaleString()}
              icon={<Package className="h-4 w-4 text-blue-600" />}
              trend="up"
              trendValue="+12%"
            />
            <MetricCard
              title="Completion Rate"
              value={`${completionRate.toFixed(1)}%`}
              icon={<CheckCircle className="h-4 w-4 text-green-600" />}
              trend={completionRate > 85 ? 'up' : completionRate > 70 ? 'stable' : 'down'}
              trendValue={completionRate > 85 ? '+5%' : completionRate > 70 ? '0%' : '-3%'}
            />
            <MetricCard
              title="On-Time Delivery"
              value={`${performanceMetrics.onTimeDeliveryRate}%`}
              icon={<Clock className="h-4 w-4 text-purple-600" />}
              trend={performanceMetrics.onTimeDeliveryRate > 85 ? 'up' : 'stable'}
              trendValue={performanceMetrics.onTimeDeliveryRate > 85 ? '+2%' : '0%'}
            />
            <MetricCard
              title="Cost Savings"
              value={formatCurrency(performanceMetrics.costSavings)}
              icon={<DollarSign className="h-4 w-4 text-green-600" />}
              trend="up"
              trendValue="+8%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <MetricsChart
          title="Compliance Score Trend"
          type="line"
          data={complianceHistory}
          xAxisKey="month"
          dataKeys={['score']}
          colors={['hsl(var(--primary))']}
          height={250}
          formatValue={formatPercentage}
          showLegend={false}
          className="border-2 border-transparent hover:border-primary/20 transition-colors"
        />

        {/* Monthly Performance Chart */}
        <MetricsChart
          title="Monthly Performance Trends"
          type="bar"
          data={monthlyTrends}
          xAxisKey="month"
          dataKeys={['orders', 'satisfaction']}
          colors={['hsl(var(--primary))', 'hsl(var(--secondary))']}
          height={250}
          showLegend={true}
          className="border-2 border-transparent hover:border-primary/20 transition-colors"
        />
      </div>

      {/* Risk Assessment and Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score</span>
              <span className={cn('font-bold', getRiskColor(riskMetrics.riskLevel))}>
                {riskMetrics.riskScore}/100
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Compliance Issues</span>
                <span className="font-medium">{riskMetrics.complianceIssues}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Resolved Issues</span>
                <span className="font-medium text-green-600">{riskMetrics.resolvedIssues}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Resolution Rate</span>
                <span className="font-medium">{issueResolutionRate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Risk Factors</span>
              <div className="flex flex-wrap gap-1">
                {riskMetrics.riskFactors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quality Score</span>
                <span className="font-bold text-lg">{performanceMetrics.qualityScore}/100</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Avg. Delivery Time</span>
                  <span className="font-medium">{performanceMetrics.averageDeliveryTime} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Pending Orders</span>
                  <span className="font-medium">{performanceMetrics.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Cancelled Orders</span>
                  <span className="font-medium text-red-600">{performanceMetrics.cancelledOrders}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Compliance & Delivery History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MetricsChart
            title="Monthly Compliance vs Deliveries"
            type="area"
            data={complianceHistory}
            xAxisKey="month"
            dataKeys={['score', 'deliveries']}
            colors={['hsl(var(--primary))', 'hsl(var(--secondary))']}
            height={300}
            showLegend={true}
            formatValue={(value) => value.toString()}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VendorMetrics;