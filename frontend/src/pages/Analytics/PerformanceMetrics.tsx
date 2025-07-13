import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/components/lib/utils'; // Keeping this path as per your instruction
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Truck,
  Users
} from 'lucide-react';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface PerformanceDataPoint {
  period: string;
  deliveryTime: number;
  qualityScore: number;
  costEfficiency: number;
  vendorReliability: number;
  customerSatisfaction: number;
  orderAccuracy: number;
  responseTime: number;
  complianceScore: number;
  [key: string]: string | number;
}

// MODIFIED: Removed timeRange and onTimeRangeChange from props, as they will be internal state
export interface PerformanceMetricsProps {
  className?: string;
  data?: PerformanceDataPoint[];
  metrics?: PerformanceMetric[];
  showComparison?: boolean;
}

const PERFORMANCE_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  danger: 'hsl(0, 84%, 60%)',
  info: 'hsl(221, 83%, 53%)',
  muted: 'hsl(var(--muted-foreground))',
};

const defaultMetrics: PerformanceMetric[] = [
  {
    id: 'delivery-time',
    name: 'Avg Delivery Time',
    value: 2.3,
    target: 3.0,
    unit: 'days',
    trend: 'down',
    change: -12.5,
    status: 'excellent'
  },
  {
    id: 'quality-score',
    name: 'Quality Score',
    value: 94.2,
    target: 90.0,
    unit: '%',
    trend: 'up',
    change: 3.8,
    status: 'excellent'
  },
  {
    id: 'cost-efficiency',
    name: 'Cost Efficiency',
    value: 87.1,
    target: 85.0,
    unit: '%',
    trend: 'up',
    change: 2.4,
    status: 'good'
  },
  {
    id: 'vendor-reliability',
    name: 'Vendor Reliability',
    value: 91.5,
    target: 95.0,
    unit: '%',
    trend: 'stable',
    change: 0.3,
    status: 'warning'
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    value: 88.7,
    target: 90.0,
    unit: '%',
    trend: 'up',
    change: 1.2,
    status: 'good'
  },
  {
    id: 'order-accuracy',
    name: 'Order Accuracy',
    value: 96.8,
    target: 95.0,
    unit: '%',
    trend: 'up',
    change: 0.8,
    status: 'excellent'
  }
];

const defaultData: PerformanceDataPoint[] = [
  { period: 'Jan', deliveryTime: 2.8, qualityScore: 89, costEfficiency: 82, vendorReliability: 88, customerSatisfaction: 85, orderAccuracy: 94, responseTime: 1.2, complianceScore: 91 },
  { period: 'Feb', deliveryTime: 2.6, qualityScore: 91, costEfficiency: 84, vendorReliability: 89, customerSatisfaction: 86, orderAccuracy: 95, responseTime: 1.1, complianceScore: 92 },
  { period: 'Mar', deliveryTime: 2.4, qualityScore: 92, costEfficiency: 85, vendorReliability: 90, customerSatisfaction: 87, orderAccuracy: 96, responseTime: 1.0, complianceScore: 93 },
  { period: 'Apr', deliveryTime: 2.3, qualityScore: 94, costEfficiency: 87, vendorReliability: 91, customerSatisfaction: 89, orderAccuracy: 97, responseTime: 0.9, complianceScore: 94 },
  { period: 'May', deliveryTime: 2.2, qualityScore: 93, costEfficiency: 86, vendorReliability: 92, customerSatisfaction: 88, orderAccuracy: 96, responseTime: 0.8, complianceScore: 95 },
  { period: 'Jun', deliveryTime: 2.3, qualityScore: 94, costEfficiency: 87, vendorReliability: 91, customerSatisfaction: 89, orderAccuracy: 97, responseTime: 0.9, complianceScore: 94 }
];

const MetricCard: React.FC<{ metric: PerformanceMetric }> = ({ metric }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'delivery-time': return <Clock className="h-5 w-5" />;
      case 'quality-score': return <CheckCircle className="h-5 w-5" />;
      case 'cost-efficiency': return <DollarSign className="h-5 w-5" />;
      case 'vendor-reliability': return <Users className="h-5 w-5" />;
      case 'customer-satisfaction': return <Target className="h-5 w-5" />;
      case 'order-accuracy': return <Truck className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const TrendIcon = metric.trend === 'up' ? TrendingUp :
    metric.trend === 'down' ? TrendingDown : Activity;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg", getStatusColor(metric.status))}>
            {getIcon(metric.id)}
          </div>
          <div className="flex items-center space-x-1">
            <TrendIcon className={cn(
              "h-4 w-4",
              metric.trend === 'up' ? 'text-green-600' :
              metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
            )} />
            <span className={cn(
              "text-sm font-medium",
              metric.trend === 'up' ? 'text-green-600' :
              metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
            )}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            {metric.name}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              {metric.value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              {metric.unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Target: {metric.target}{metric.unit}</span>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(metric.status)
            )}>
              {metric.status}
            </span>
          </div>
        </div>

        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              metric.status === 'excellent' ? 'bg-green-500' :
              metric.status === 'good' ? 'bg-blue-500' :
              metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-4 shadow-lg min-w-[200px]">
        <p className="font-medium text-popover-foreground mb-3 text-sm">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-xs" style={{ color: entry.color }}>
                {entry.value}{entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  className,
  data = defaultData,
  metrics = defaultMetrics,
  showComparison = true,
  // REMOVED: timeRange and onTimeRangeChange from props
}) => {
  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  // ADDED: Internal state for timeRange and its handler
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
    // You might want to trigger data fetching here based on the new timeRange
    // e.g., fetchData(range);
  };

  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Performance Metrics",
      pageDescription: "Comprehensive performance tracking and KPI monitoring",
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Performance', isActive: true }
      ],
      headerActions: (
        <div className="flex items-center space-x-2">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleTimeRangeChange(option.value as '7d' | '30d' | '90d' | '1y')}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                timeRange === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, timeRange]); // Added timeRange to dependencies for headerActions to update correctly

  const radarData = useMemo(() => {
    const latest = data[data.length - 1];
    return [
      { metric: 'Quality', value: latest.qualityScore, fullMark: 100 },
      { metric: 'Delivery', value: (4 - latest.deliveryTime) * 25, fullMark: 100 },
      { metric: 'Cost Efficiency', value: latest.costEfficiency, fullMark: 100 },
      { metric: 'Reliability', value: latest.vendorReliability, fullMark: 100 },
      { metric: 'Satisfaction', value: latest.customerSatisfaction, fullMark: 100 },
      { metric: 'Accuracy', value: latest.orderAccuracy, fullMark: 100 },
    ];
  }, [data]);

  const performanceTrend = useMemo(() => {
    return data.map(item => ({
      ...item,
      overallScore: (
        item.qualityScore * 0.2 +
        item.costEfficiency * 0.15 +
        item.vendorReliability * 0.15 +
        item.customerSatisfaction * 0.15 +
        item.orderAccuracy * 0.2 +
        item.complianceScore * 0.15
      )
    }));
  }, [data]);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    // REMOVED: The outer div that contained the header.
    // The page now only returns its own content after the header is moved to layout context.
    <div className={cn('space-y-6', className)}>
      {/* Header content moved to setLayoutData in useEffect */}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="period"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="overallScore"
                    stroke={PERFORMANCE_COLORS.primary}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Overall Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="qualityScore"
                    stroke={PERFORMANCE_COLORS.success}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Quality Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="customerSatisfaction"
                    stroke={PERFORMANCE_COLORS.info}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Customer Satisfaction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Performance Radar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    className="text-xs"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    className="text-xs"
                  />
                  <Radar
                    name="Current Performance"
                    dataKey="value"
                    stroke={PERFORMANCE_COLORS.primary}
                    fill={PERFORMANCE_COLORS.primary}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Detailed Performance Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="period"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="qualityScore"
                  stackId="1"
                  stroke={PERFORMANCE_COLORS.success}
                  fill={PERFORMANCE_COLORS.success}
                  fillOpacity={0.6}
                  name="Quality Score"
                />
                <Area
                  type="monotone"
                  dataKey="costEfficiency"
                  stackId="2"
                  stroke={PERFORMANCE_COLORS.info}
                  fill={PERFORMANCE_COLORS.info}
                  fillOpacity={0.6}
                  name="Cost Efficiency"
                />
                <Area
                  type="monotone"
                  dataKey="vendorReliability"
                  stackId="3"
                  stroke={PERFORMANCE_COLORS.warning}
                  fill={PERFORMANCE_COLORS.warning}
                  fillOpacity={0.6}
                  name="Vendor Reliability"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
