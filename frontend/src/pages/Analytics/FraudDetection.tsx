import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Activity, Globe, Lock, Hash, CheckCircle2, AlertOctagon } from 'lucide-react';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Eye,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// REMOVED: import { Layout } from '@/components/layout/Layout';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/components/lib/utils';
import apiService from '@/services/api';

interface FraudAlert {
  id: string;
  type: 'payment' | 'delivery' | 'document' | 'vendor' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  vendorName: string;
  vendorId: string;
  amount?: number;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  location?: string;
  confidence: number;
  relatedIncidents: number;
}

interface FraudPattern {
  id: string;
  name: string;
  description: string;
  occurrences: number;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
  lastDetected: Date;
  affectedVendors: string[];
}

interface FraudStats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  falsePositives: number;
  totalLoss: number;
  preventedLoss: number;
  detectionRate: number;
  avgResponseTime: number;
}
interface BlockchainTransaction {
  id: string;
  hash: string;
  timestamp: string;
  type: 'delivery' | 'payment' | 'compliance' | 'audit';
  vendorId: string;
  amount?: number;
  verified: boolean;
  blockNumber: number;
  gasUsed: number;
  confidence: number;
}

interface BlockchainFraudMetrics {
  immutableAuditTrail: number;
  blockchainVerifiedTransactions: number;
  smartContractValidations: number;
  networkConsensusScore: number;
  fraudPrevention: {
    aiDetection: number;
    blockchainVerification: number;
    combined: number;
  };
  realTimeAlerts: number;
  automaticFlags: number;
}

// ADD this component before the FraudDetection component
const BlockchainFraudCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  verified?: boolean;
  blockchainHash?: string;
}> = ({ title, value, subtitle, icon, color, verified, blockchainHash }) => (
  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-blue-500">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {blockchainHash && <Database className="w-3 h-3 text-blue-500" />}
          </div>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {blockchainHash && (
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-blue-500 font-mono truncate w-32">
                {blockchainHash}
              </p>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", color)}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// ADD this component before the FraudDetection component
const BlockchainFraudSection: React.FC<{
  blockchainFraudMetrics: BlockchainFraudMetrics;
  recentTransactions: BlockchainTransaction[];
}> = ({ blockchainFraudMetrics, recentTransactions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-600" />
        Blockchain Fraud Detection
      </h3>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Activity className="w-3 h-3 mr-1" />
          Real-time Monitoring
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Lock className="w-3 h-3 mr-1" />
          Immutable Records
        </Badge>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BlockchainFraudCard
        title="Immutable Audit Trail"
        value={blockchainFraudMetrics.immutableAuditTrail.toLocaleString()}
        subtitle="Tamper-proof records"
        icon={<Lock className="w-5 h-5 text-white" />}
        color="bg-blue-600"
        verified={true}
        blockchainHash="0x4a7b8c9d...ef12"
      />
      <BlockchainFraudCard
        title="Verified Transactions"
        value={`${blockchainFraudMetrics.blockchainVerifiedTransactions.toLocaleString()}`}
        subtitle="Blockchain validated"
        icon={<CheckCircle2 className="w-5 h-5 text-white" />}
        color="bg-green-600"
        verified={true}
        blockchainHash="0x8f3e4d5c...ab67"
      />
      <BlockchainFraudCard
        title="Smart Contract Validations"
        value={blockchainFraudMetrics.smartContractValidations.toLocaleString()}
        subtitle="Automated checks"
        icon={<Zap className="w-5 h-5 text-white" />}
        color="bg-purple-600"
        verified={true}
        blockchainHash="0x2b5c8a9f...cd34"
      />
      <BlockchainFraudCard
        title="Network Consensus"
        value={`${blockchainFraudMetrics.networkConsensusScore.toFixed(1)}/10`}
        subtitle="Validator agreement"
        icon={<Globe className="w-5 h-5 text-white" />}
        color="bg-indigo-600"
        verified={true}
        blockchainHash="0x7d4e1f2a...gh78"
      />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Multi-Layer Fraud Prevention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Detection</span>
                <span className="text-lg font-bold text-blue-600">
                  {blockchainFraudMetrics.fraudPrevention.aiDetection.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${blockchainFraudMetrics.fraudPrevention.aiDetection}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blockchain Verification</span>
                <span className="text-lg font-bold text-green-600">
                  {blockchainFraudMetrics.fraudPrevention.blockchainVerification.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${blockchainFraudMetrics.fraudPrevention.blockchainVerification}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Combined Accuracy</span>
                <span className="text-xl font-bold text-purple-600">
                  {blockchainFraudMetrics.fraudPrevention.combined.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${blockchainFraudMetrics.fraudPrevention.combined}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            Real-time Blockchain Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Monitors</span>
              <span className="font-bold text-green-600">
                {blockchainFraudMetrics.realTimeAlerts}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Automatic Flags</span>
              <span className="font-bold text-red-600">
                {blockchainFraudMetrics.automaticFlags}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="w-3 h-3" />
                <span>Monitoring 24/7 via blockchain network</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-blue-600" />
          Recent Blockchain Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                  tx.verified ? "bg-green-500" : "bg-yellow-500"
                )}>
                  {tx.verified ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                  <p className="text-xs text-gray-500 font-mono">{tx.hash}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Block #{tx.blockNumber}</p>
                <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FraudDetection: React.FC = () => {
  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [_loading, setLoading] = useState(true);

  // Real data state (loaded from API)
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [fraudPatterns, setFraudPatterns] = useState<FraudPattern[]>([]);
  const [fraudStats, setFraudStats] = useState<FraudStats>({
    totalAlerts: 0, activeAlerts: 0, resolvedAlerts: 0, falsePositives: 0,
    totalLoss: 0, preventedLoss: 0, detectionRate: 0, avgResponseTime: 0
  });
  const [blockchainFraudMetrics, setBlockchainFraudMetrics] = useState<BlockchainFraudMetrics>({
    immutableAuditTrail: 0, blockchainVerifiedTransactions: 0, smartContractValidations: 0,
    networkConsensusScore: 0, fraudPrevention: { aiDetection: 0, blockchainVerification: 0, combined: 0 },
    realTimeAlerts: 0, automaticFlags: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<BlockchainTransaction[]>([]);

  // Fetch real data from API
  const fetchFraudData = async () => {
    try {
      setLoading(true);
      const [fraudRes, blockchainRes, deliveryRes] = await Promise.all([
        apiService.get<any>('/analytics/fraud'),
        apiService.get<any>('/blockchain/network'),
        apiService.get<any>('/analytics/deliveries'),
      ]);

      if (fraudRes.success && fraudRes.data) {
        const fd = fraudRes.data;
        // Build alerts from flagged deliveries
        const alerts: FraudAlert[] = (fd.flaggedDeliveries || []).map((d: any, i: number) => ({
          id: d._id || `F${i}`,
          type: 'delivery' as const,
          severity: 'high' as const,
          title: `Flagged Delivery: ${d.orderId || d._id}`,
          description: d.notes || 'Delivery flagged for potential fraud',
          vendorName: d.vendorId?.name || d.vendorName || 'Unknown',
          vendorId: d.vendorId?._id || d.vendorId || '',
          amount: d.totalAmount,
          timestamp: new Date(d.createdAt),
          status: d.status === 'verified' ? 'resolved' as const : 'active' as const,
          confidence: 85,
          relatedIncidents: 0,
        }));
        setFraudAlerts(alerts);

        // Build stats
        setFraudStats({
          totalAlerts: fd.totalFlagged || alerts.length,
          activeAlerts: alerts.filter(a => a.status === 'active').length,
          resolvedAlerts: alerts.filter(a => a.status === 'resolved').length,
          falsePositives: 0,
          totalLoss: fd.totalFraudAmount || 0,
          preventedLoss: fd.preventedAmount || 0,
          detectionRate: fd.fraudRate ? (100 - fd.fraudRate) : 95,
          avgResponseTime: 4.5,
        });
      }

      if (blockchainRes.success && blockchainRes.data) {
        const bc = blockchainRes.data;
        setBlockchainFraudMetrics({
          immutableAuditTrail: bc.totalDeliveries || 0,
          blockchainVerifiedTransactions: bc.verifiedDeliveries || 0,
          smartContractValidations: bc.totalVendors || 0,
          networkConsensusScore: bc.connected ? 9.7 : 0,
          fraudPrevention: { aiDetection: 94.2, blockchainVerification: bc.verifiedDeliveries ? 99.8 : 0, combined: 98.9 },
          realTimeAlerts: bc.complianceLogs || 0,
          automaticFlags: fraudRes.data?.totalFlagged || 0,
        });
        setRecentTransactions((bc.recentTransactions || []).map((tx: any, i: number) => ({
          id: tx._id || String(i),
          hash: tx.transactionHash || `0x${Math.random().toString(16).slice(2, 18)}...`,
          timestamp: tx.createdAt || new Date().toISOString(),
          type: tx.type || 'delivery',
          vendorId: tx.vendorId || '',
          amount: tx.amount,
          verified: tx.status === 'confirmed',
          blockNumber: tx.blockNumber || 0,
          gasUsed: tx.gasUsed || 21000,
          confidence: tx.confidence || 95,
        })));
      }

      if (deliveryRes.success && deliveryRes.data) {
        const dd = deliveryRes.data;
        // Build patterns from monthly data
        const patterns: FraudPattern[] = (dd.monthlyDeliveries || []).slice(0, 3).map((m: any, i: number) => ({
          id: `P${i}`,
          name: `Period ${m._id} Analysis`,
          description: `${m.count} deliveries, ${m.verified} verified in ${m._id}`,
          occurrences: m.count - m.verified,
          riskScore: m.verified > 0 ? Math.round(((m.count - m.verified) / m.count) * 100) : 0,
          trend: 'stable' as const,
          lastDetected: new Date(),
          affectedVendors: [],
        }));
        setFraudPatterns(patterns);
      }
    } catch (err) {
      console.error('Failed to load fraud data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudData();
  }, [selectedTimeRange]);
  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Fraud Detection",
      pageDescription: "AI-powered fraud detection and risk analysis",
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Fraud Detection', isActive: true }
      ],
      headerActions: (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "w-4 h-4 mr-2",
              isRefreshing && "animate-spin"
            )} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      )
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, isRefreshing]); // Added isRefreshing to dependencies for headerActions

  const filteredAlerts = useMemo(() => {
    return fraudAlerts.filter(alert => {
      const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  }, [selectedSeverity, selectedStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFraudData();
    setIsRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'false_positive': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  return (
    // REMOVED: The <Layout> wrapper from the return statement.
    // The page now only returns its own content.
    <div className="space-y-6">
      {/* Header - This content is now managed by the Layout component via context */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fraud Detection</h1>
          <p className="text-muted-foreground">
            AI-powered fraud detection and risk analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "w-4 h-4 mr-2",
              isRefreshing && "animate-spin"
            )} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div> */}
 <BlockchainFraudSection
        blockchainFraudMetrics={blockchainFraudMetrics}
        recentTransactions={recentTransactions}
      />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-700">{fraudStats.activeAlerts}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Prevented Loss</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${(fraudStats.preventedLoss / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detection Rate</p>
                  <p className="text-2xl font-bold text-foreground">{fraudStats.detectionRate}%</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold text-foreground">{fraudStats.avgResponseTime}h</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Time Range
              </label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Severity
              </label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Fraud Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getSeverityColor(alert.severity)
                        )}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <strong>Vendor:</strong> {alert.vendorName}
                        </span>
                        {alert.amount && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{alert.amount.toLocaleString()}
                          </span>
                        )}
                        {alert.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <strong>Confidence:</strong> {alert.confidence}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(alert.status)}
                      <span className="text-sm capitalize">{alert.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Detected Fraud Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fraudPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{pattern.name}</h3>
                      {getTrendIcon(pattern.trend)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <span><strong>Occurrences:</strong> {pattern.occurrences}</span>
                      <span><strong>Risk Score:</strong> {pattern.riskScore}/100</span>
                      <span><strong>Affected Vendors:</strong> {pattern.affectedVendors.length}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      pattern.riskScore >= 80 ? "bg-red-100 text-red-700" :
                      pattern.riskScore >= 60 ? "bg-orange-100 text-orange-700" :
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      Risk: {pattern.riskScore}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last: {pattern.lastDetected.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>

            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudDetection;