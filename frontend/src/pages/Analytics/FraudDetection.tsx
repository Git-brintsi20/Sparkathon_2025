import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Eye,
  Calendar,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/components/lib/utils';

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

const mockFraudAlerts: FraudAlert[] = [
  {
    id: 'F001',
    type: 'payment',
    severity: 'critical',
    title: 'Suspicious Payment Pattern',
    description: 'Multiple high-value transactions from same vendor in short timeframe',
    vendorName: 'QuickSupply Ltd',
    vendorId: 'V001',
    amount: 125000,
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'active',
    location: 'Mumbai, India',
    confidence: 92,
    relatedIncidents: 3,
  },
  {
    id: 'F002',
    type: 'document',
    severity: 'high',
    title: 'Document Forgery Detected',
    description: 'Invoice format inconsistencies detected by ML analysis',
    vendorName: 'TechParts Inc',
    vendorId: 'V002',
    amount: 45000,
    timestamp: new Date('2024-01-14T14:15:00'),
    status: 'investigating',
    confidence: 88,
    relatedIncidents: 1,
  },
  {
    id: 'F003',
    type: 'delivery',
    severity: 'medium',
    title: 'Delivery Route Anomaly',
    description: 'Unusual delivery route detected for high-value shipment',
    vendorName: 'LogiTrans Solutions',
    vendorId: 'V003',
    timestamp: new Date('2024-01-13T09:45:00'),
    status: 'resolved',
    location: 'Delhi, India',
    confidence: 76,
    relatedIncidents: 0,
  },
];

const mockFraudPatterns: FraudPattern[] = [
  {
    id: 'P001',
    name: 'Ghost Vendor Pattern',
    description: 'Vendors with minimal documentation requesting large payments',
    occurrences: 12,
    riskScore: 85,
    trend: 'up',
    lastDetected: new Date('2024-01-15T08:00:00'),
    affectedVendors: ['V001', 'V004', 'V007'],
  },
  {
    id: 'P002',
    name: 'Invoice Duplication',
    description: 'Same invoice submitted multiple times with minor variations',
    occurrences: 8,
    riskScore: 72,
    trend: 'down',
    lastDetected: new Date('2024-01-12T16:30:00'),
    affectedVendors: ['V002', 'V005'],
  },
  {
    id: 'P003',
    name: 'Delivery Time Manipulation',
    description: 'Artificially delayed deliveries to inflate costs',
    occurrences: 15,
    riskScore: 68,
    trend: 'stable',
    lastDetected: new Date('2024-01-14T11:20:00'),
    affectedVendors: ['V003', 'V006', 'V008', 'V009'],
  },
];

const mockFraudStats: FraudStats = {
  totalAlerts: 156,
  activeAlerts: 23,
  resolvedAlerts: 108,
  falsePositives: 25,
  totalLoss: 2350000,
  preventedLoss: 8750000,
  detectionRate: 94.2,
  avgResponseTime: 4.5,
};

const FraudDetection: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAlerts = useMemo(() => {
    return mockFraudAlerts.filter(alert => {
      const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  }, [selectedSeverity, selectedStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
      </div>

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
                  <p className="text-2xl font-bold text-red-700">{mockFraudStats.activeAlerts}</p>
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
                    ₹{(mockFraudStats.preventedLoss / 1000000).toFixed(1)}M
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
                  <p className="text-2xl font-bold text-foreground">{mockFraudStats.detectionRate}%</p>
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
                  <p className="text-2xl font-bold text-foreground">{mockFraudStats.avgResponseTime}h</p>
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
            {mockFraudPatterns.map((pattern, index) => (
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