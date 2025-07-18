import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// REMOVED: No longer import Layout from here
// import { Layout } from '@/components/layout/Layout';
import { KPICard } from './KPICard';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';
import { Shield, Link } from 'lucide-react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';

interface DashboardMetrics {
  totalVendors: number;
  activeDeliveries: number;
  complianceRate: number;
  totalValue: number;
  pendingVerifications: number;
  fraudAlerts: number;
  monthlyGrowth: number;
  deliveryAccuracy: number;
    blockchainTransactions: number; // Add this line
  blockchainVerifications: number;
}

// CORRECTED INTERFACE
interface ChartData {
  name: string;
  value: number;
  deliveries: number;
  compliance: number;
  // This index signature tells TypeScript that any string key is valid,
  // which is what the generic MetricsChart component needs.
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
  // CORRECTED: Use the useLayout hook to get the setLayoutData function
  const { setLayoutData } = useLayout();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockchainMetrics, setBlockchainMetrics] = useState({
  totalTransactions: 1247,
  verifiedDeliveries: 89,
  complianceRecords: 234,
  fraudPrevented: 12
});

  // CORRECTED: Use a useEffect hook to set the layout data when the component mounts
  useEffect(() => {
    setLayoutData({
      pageTitle: 'Dashboard',
      pageDescription: 'Overview of vendor compliance and delivery metrics.',
      breadcrumbs: [
        { label: 'Dashboard', isActive: true }
      ]
    });

    // Clean up the layout data when the component unmounts
    return () => setLayoutData({});
  }, [setLayoutData]); // Dependency array ensures this runs only once per mount

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
  totalVendors: 247,
  activeDeliveries: 89,
  complianceRate: 94.5,
  totalValue: 2847650,
  pendingVerifications: 12,
  fraudAlerts: 3,
  monthlyGrowth: 12.5,
  deliveryAccuracy: 97.8,
  blockchainTransactions: 1247, // Add this line
  blockchainVerifications: 234   // Add this line
});

      setChartData([
        { name: 'Jan', value: 2400, deliveries: 45, compliance: 92 },
        { name: 'Feb', value: 2210, deliveries: 52, compliance: 94 },
        { name: 'Mar', value: 2290, deliveries: 61, compliance: 96 },
        { name: 'Apr', value: 2000, deliveries: 48, compliance: 93 },
        { name: 'May', value: 2181, deliveries: 67, compliance: 95 },
        { name: 'Jun', value: 2500, deliveries: 89, compliance: 97 },
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'delivery',
          title: 'New Delivery Verified',
          description: 'Vendor ABC Corp - Order #12345',
          time: '2 minutes ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'alert',
          title: 'Compliance Alert',
          description: 'Vendor XYZ Ltd - Missing documentation',
          time: '15 minutes ago',
          status: 'warning'
        },
        {
          id: '3',
          type: 'vendor',
          title: 'New Vendor Registered',
          description: 'TechCorp Solutions added to system',
          time: '1 hour ago',
          status: 'success'
        },
        {
          id: '4',
          type: 'verification',
          title: 'Verification Pending',
          description: 'Delivery #67890 awaiting approval',
          time: '2 hours ago',
          status: 'pending'
        }
      ]);

      setLoading(false);
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
    value={metrics?.totalVendors || 0}
    icon={<Users className="w-6 h-6" />}
    trend={metrics?.monthlyGrowth || 0}
    trendLabel="vs last month"
    color="blue"
    blockchain={{
      isVerified: true,
      transactionHash: "0x742d35cc6bb89dcf5f8b4b5c9b2e4b8c5d3e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      blockNumber: 18759234,
      timestamp: new Date().toISOString()
    }}
  />
  <KPICard
    title="Active Deliveries"
    value={metrics?.activeDeliveries || 0}
    icon={<Package className="w-6 h-6" />}
    trend={8.2}
    trendLabel="vs last week"
    color="green"
    blockchain={{
      isVerified: true,
      transactionHash: "0x851f46ec7cb96fdfa6e4d8a7b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      blockNumber: 18759235,
      timestamp: new Date().toISOString()
    }}
  />
  <KPICard
    title="Compliance Rate"
    value={metrics?.complianceRate || 0}
    suffix="%"
    icon={<CheckCircle2 className="w-6 h-6" />}
    trend={2.1}
    trendLabel="improvement"
    color="emerald"
    blockchain={{
      isVerified: true,
      transactionHash: "0x962a57fd8ea07gfeb7f5e9c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
      blockNumber: 18759236,
      timestamp: new Date().toISOString()
    }}
  />
  <KPICard
    title="Blockchain Transactions"
    value={blockchainMetrics.totalTransactions}
    icon={<Shield className="w-6 h-6" />}
    trend={18.7}
    trendLabel="vs last month"
    color="purple"
    blockchain={{
      isVerified: true,
      transactionHash: "0xa73b68ge9fb18hgfc8g6f0d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
      blockNumber: 18759237,
      timestamp: new Date().toISOString()
    }}
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
                    {metrics?.fraudAlerts || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Pending Verifications</p>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </div>
                  <div className="text-xl font-bold text-yellow-600">
                    {metrics?.pendingVerifications || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Delivery Accuracy</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {metrics?.deliveryAccuracy || 0}%
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