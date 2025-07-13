import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, RefreshCw, TrendingUp, AlertTriangle, Shield, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { ComplianceChart } from '@/components/charts/ComplianceChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/components/lib/utils';

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}> = ({ title, value, trend, icon, color, description }) => (
  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center text-xs",
              trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground"
            )}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-full", color)}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Vendor Performance Table
const VendorPerformanceTable: React.FC<{
  vendors: any[];
  title: string;
}> = ({ vendors, title }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor.vendorId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{vendor.vendorName}</p>
              <p className="text-xs text-muted-foreground">
                {vendor.totalDeliveries} deliveries
              </p>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-medium text-sm",
                vendor.complianceScore >= 90 ? "text-green-600" : 
                vendor.complianceScore >= 80 ? "text-yellow-600" : "text-red-600"
              )}>
                {vendor.complianceScore.toFixed(1)}%
              </p>
              <div className={cn(
                "text-xs px-2 py-1 rounded-full",
                vendor.riskLevel === 'low' ? "bg-green-100 text-green-800" :
                vendor.riskLevel === 'medium' ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {vendor.riskLevel.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Export Options
const ExportOptions: React.FC<{
  onExport: (format: 'csv' | 'xlsx' | 'pdf') => void;
  isExporting: boolean;
}> = ({ onExport, isExporting }) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onExport('csv')}
      disabled={isExporting}
    >
      <Download className="w-4 h-4 mr-2" />
      CSV
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onExport('xlsx')}
      disabled={isExporting}
    >
      <Download className="w-4 h-4 mr-2" />
      Excel
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onExport('pdf')}
      disabled={isExporting}
    >
      <Download className="w-4 h-4 mr-2" />
      PDF
    </Button>
  </div>
);

 const Analytics: React.FC = () => {
  const { 
    data, 
    loading, 
    error, 
    computedMetrics,
    refreshData, 
    exportData,
    updateFilters 
  } = useAnalytics();

  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('6months');

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsExporting(true);
    try {
      const result = await exportData(format);
      if(result){
      if (result.success) {
        // In real implementation, trigger download
        console.log('Export successful:', result.downloadUrl);
      } else {
        console.error('Export failed:', result.error);
      }}else {
    // Handle the case where the export function itself failed to return anything
    console.error('Export failed: No result was returned.');
  }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    
    const now = new Date();
    const ranges = {
      '1month': new Date(now.setMonth(now.getMonth() - 1)),
      '3months': new Date(now.setMonth(now.getMonth() - 3)),
      '6months': new Date(now.setMonth(now.getMonth() - 6)),
      '1year': new Date(now.setFullYear(now.getFullYear() - 1))
    };

    updateFilters({
      dateRange: {
        start: ranges[value as keyof typeof ranges] || ranges['6months'],
        end: new Date()
      }
    });
  };

  if (loading && !data) {
    return (
      <Layout
        pageTitle="Analytics Dashboard"
        pageDescription="Comprehensive analytics and fraud detection metrics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics', isActive: true }
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        pageTitle="Analytics Dashboard"
        pageDescription="Comprehensive analytics and fraud detection metrics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics', isActive: true }
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-600">Error loading analytics</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
            <Button onClick={refreshData} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const fraudMetrics = data?.fraudMetrics;
  const complianceTrends = data?.complianceTrends || [];
  const topPerformers = computedMetrics?.topPerformers || [];
  const bottomPerformers = computedMetrics?.bottomPerformers || [];

  // Prepare chart data
  const fraudTrendData = complianceTrends.map(trend => ({
    period: trend.period,
    fraudIncidents: trend.fraudIncidents,
    riskScore: trend.riskScore
  }));

  const deliveryPerformanceData = complianceTrends.map(trend => ({
    period: trend.period,
    deliveryRate: trend.deliveryRate,
    onTimeDeliveries: trend.onTimeDeliveries,
    totalDeliveries: trend.totalDeliveries
  }));

  return (
    <Layout
      pageTitle="Analytics Dashboard"
      pageDescription="Comprehensive analytics and fraud detection metrics"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', isActive: true }
      ]}
      headerActions={
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ExportOptions onExport={handleExport} isExporting={isExporting} />
          
          <Button
            onClick={refreshData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="p-6 space-y-8">
        {/* KPI Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KPICard
            title="Fraud Detection Score"
            value={fraudMetrics?.riskScore.toFixed(1) || '0.0'}
            trend={-12.5}
            icon={<Shield className="w-5 h-5 text-white" />}
            color="bg-green-500"
            description="Lower is better"
          />
          <KPICard
            title="Total Incidents"
            value={fraudMetrics?.totalIncidents || 0}
            trend={-8.3}
            icon={<AlertTriangle className="w-5 h-5 text-white" />}
            color="bg-red-500"
            description="Last 6 months"
          />
          <KPICard
            title="Compliance Rate"
            value={`${data?.avgComplianceRate.toFixed(1)}%` || '0%'}
            trend={computedMetrics?.complianceTrend}
            icon={<Users className="w-5 h-5 text-white" />}
            color="bg-blue-500"
            description="Average across all vendors"
          />
          <KPICard
            title="Fraud Prevented"
            value={`$${(fraudMetrics?.savingsAmount || 0).toLocaleString()}`}
            trend={15.2}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            color="bg-green-500"
            description="Estimated savings"
          />
        </motion.div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Compliance Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ComplianceChart
              title="Compliance Trends"
              data={complianceTrends}
              height={400}
              showTrends={true}
              showRiskIndicators={true}
            />
          </motion.div>

          {/* Fraud Detection Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MetricsChart
              title="Fraud Detection Metrics"
              type="line"
              data={fraudTrendData}
              xAxisKey="period"
              dataKeys={['fraudIncidents', 'riskScore']}
              colors={['hsl(var(--chart-4))', 'hsl(var(--chart-3))']}
              height={400}
              showLegend={true}
              formatValue={(value) => value.toString()}
            />
          </motion.div>
        </div>

        {/* Delivery Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricsChart
            title="Delivery Performance Analytics"
            type="area"
            data={deliveryPerformanceData}
            xAxisKey="period"
            dataKeys={['deliveryRate']}
            colors={['hsl(var(--chart-5))']}
            height={300}
            showLegend={true}
            formatValue={(value) => `${value.toFixed(1)}%`}
          />
        </motion.div>

        {/* Vendor Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <VendorPerformanceTable
              vendors={topPerformers}
              title="Top Performing Vendors"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <VendorPerformanceTable
              vendors={bottomPerformers}
              title="Vendors Requiring Attention"
            />
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {data?.totalVendors || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Active Vendors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {data?.totalDeliveries.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {computedMetrics?.averageDeliveryRate.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Delivery Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Analytics;