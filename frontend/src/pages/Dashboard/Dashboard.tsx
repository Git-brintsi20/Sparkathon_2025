import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from './KPICard';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLayout } from '@/contexts/LayoutContext';
import { Shield } from 'lucide-react';
import { 
  Users, 
  Package, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import apiService from '@/services/api';

interface DashboardOverview {
  totalVendors: number;
  activeVendors: number;
  totalDeliveries: number;
  pendingDeliveries: number;
  totalOrders: number;
  fraudDetected: number;
  averageCompliance: number;
}

interface ChartData {
  name: string;
  value: number;
  deliveries: number;
  compliance: number;
  [key: string]: string | number;
}

interface RecentActivity {
  id: string;
  type: 'delivery' | 'vendor' | 'alert' | 'verification';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'pending';
}

const Dashboard: React.FC = () => {
  const { setLayoutData } = useLayout();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockchainMetrics, setBlockchainMetrics] = useState({
    totalTransactions: 0,
    verifiedDeliveries: 0,
    complianceRecords: 0,
    fraudPrevented: 0,
  });

  useEffect(() => {
    setLayoutData({
      pageTitle: 'Dashboard',
      pageDescription: 'Overview of vendor compliance and delivery metrics.',
      breadcrumbs: [{ label: 'Dashboard', isActive: true }],
    });
    return () => setLayoutData({});
  }, [setLayoutData]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch real data from API
        const [dashboardRes, trendsRes, _blockchainRes] = await Promise.all([
          apiService.get<any>('/analytics/dashboard'),
          apiService.get<any>('/analytics/trends'),
          apiService.get<any>('/blockchain/network').catch(() => ({ data: null })),
        ]);

        const data = dashboardRes.data;
        const trends = trendsRes.data;

        // Set overview from real API data
        setOverview(data.overview);

        // Build chart data from delivery trends
        const deliveryTrend = trends.deliveryTrend || [];
        const complianceTrend = trends.complianceTrend || [];

        const chartPoints: ChartData[] = deliveryTrend.map((dt: any) => {
          const ct = complianceTrend.find((c: any) => c._id === dt._id);
          return {
            name: dt._id || 'N/A',
            value: dt.total || 0,
            deliveries: dt.total || 0,
            compliance: Math.round(ct?.avgScore || 0),
          };
        });
        setChartData(chartPoints.length > 0 ? chartPoints : [
          { name: 'Current', value: data.overview.totalDeliveries, deliveries: data.overview.totalDeliveries, compliance: Math.round(data.overview.averageCompliance) },
        ]);

        // Build recent activity from real deliveries and compliance logs
        const activities: RecentActivity[] = [];
        (data.recentDeliveries || []).slice(0, 3).forEach((d: any, i: number) => {
          activities.push({
            id: `del-${i}`,
            type: d.fraudFlag ? 'alert' : 'delivery',
            title: d.fraudFlag ? 'Fraud Alert' : `Delivery ${d.status === 'verified' ? 'Verified' : d.status}`,
            description: `${d.vendorName} - ${d.orderId}`,
            time: new Date(d.createdAt).toLocaleDateString(),
            status: d.fraudFlag ? 'error' : d.status === 'verified' ? 'success' : d.status === 'pending' ? 'pending' : 'warning',
          });
        });
        (data.recentComplianceLogs || []).slice(0, 2).forEach((log: any, i: number) => {
          activities.push({
            id: `log-${i}`,
            type: log.type === 'violation' ? 'alert' : 'verification',
            title: log.title,
            description: log.description,
            time: new Date(log.createdAt).toLocaleDateString(),
            status: log.severity === 'critical' ? 'error' : log.severity === 'high' ? 'warning' : 'success',
          });
        });
        setRecentActivity(activities);

        // Blockchain metrics from real data
        const verifiedCount = (data.recentDeliveries || []).filter((d: any) => d.verificationStatus === 'verified').length;
        setBlockchainMetrics({
          totalTransactions: data.overview.totalDeliveries + (data.recentComplianceLogs?.length || 0),
          verifiedDeliveries: verifiedCount,
          complianceRecords: data.recentComplianceLogs?.length || 0,
          fraudPrevented: data.overview.fraudDetected,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
        // Set empty defaults on error
        setOverview({ totalVendors: 0, activeVendors: 0, totalDeliveries: 0, pendingDeliveries: 0, totalOrders: 0, fraudDetected: 0, averageCompliance: 0 });
        setChartData([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // This loading state is now handled within the main return block
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    );
  }

  // CORRECTED: Remove the <Layout> wrapper from the return statement.
  // The page now only returns its own content.
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Removed the p-6 from here as the parent Layout's <main> already has it.
      className="space-y-6"
    >
{/* KPI Cards Grid */}
<motion.div 
  variants={itemVariants}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
>
  <KPICard
    title="Total Vendors"
    value={overview?.totalVendors || 0}
    icon={<Users className="w-6 h-6" />}
    trend={overview?.activeVendors ? Math.round((overview.activeVendors / overview.totalVendors) * 100) : 0}
    trendLabel="active rate"
    color="blue"
  />
  <KPICard
    title="Active Deliveries"
    value={overview?.totalDeliveries || 0}
    icon={<Package className="w-6 h-6" />}
    trend={overview?.pendingDeliveries || 0}
    trendLabel="pending"
    color="green"
  />
  <KPICard
    title="Compliance Rate"
    value={Math.round(overview?.averageCompliance || 0)}
    suffix="%"
    icon={<CheckCircle2 className="w-6 h-6" />}
    trend={0}
    trendLabel="avg score"
    color="emerald"
  />
  <KPICard
    title="Fraud Detected"
    value={overview?.fraudDetected || 0}
    icon={<Shield className="w-6 h-6" />}
    trend={0}
    trendLabel="flagged deliveries"
    color="purple"
  />
</motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <MetricsChart
            title="Delivery Trends"
            type="line"
            data={chartData}
            xAxisKey="name"
            dataKeys={['deliveries', 'compliance']}
            colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
            height={300}
            showLegend={true}
            formatValue={(value) => value.toString()}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MetricsChart
            title="Monthly Performance"
            type="bar"
            data={chartData}
            xAxisKey="name"
            dataKeys={['value']}
            colors={['hsl(var(--chart-3))']}
            height={300}
            formatValue={(value) => `$${value.toLocaleString()}`}
          />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Blockchain Statistics */}
<motion.div variants={itemVariants}>
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-purple-600" />
        Blockchain Network Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {blockchainMetrics.totalTransactions.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Transactions</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {blockchainMetrics.verifiedDeliveries}
          </div>
          <div className="text-sm text-muted-foreground">Verified Deliveries</div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {blockchainMetrics.complianceRecords}
          </div>
          <div className="text-sm text-muted-foreground">Compliance Records</div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {blockchainMetrics.fraudPrevented}
          </div>
          <div className="text-sm text-muted-foreground">Fraud Prevented</div>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>

        {/* Alerts Panel */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Fraud Alerts</p>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {overview?.fraudDetected || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Pending Verifications</p>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </div>
                  <div className="text-xl font-bold text-yellow-600">
                    {overview?.pendingDeliveries || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Compliance Score</p>
                    <p className="text-xs text-muted-foreground">Average across vendors</p>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {Math.round(overview?.averageCompliance || 0)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;