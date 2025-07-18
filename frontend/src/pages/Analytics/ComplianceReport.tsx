import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { Calendar, Download, Filter, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, FileText, BarChart3, Clock, User, Shield } from 'lucide-react';
import { Database, Link, Zap } from 'lucide-react'; // Added blockchain-related imports
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { ComplianceChart } from '@/components/charts/ComplianceChart';
// REMOVED: import { Layout } from '@/components/layout/Layout';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/components/lib/utils'; // Keeping this path as per your instruction

interface ComplianceIncident {
  id: string;
  vendorName: string;
  type: 'documentation' | 'delivery' | 'quality' | 'payment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo: string;
}

interface ComplianceAlert {
  id: string;
  title: string;
  type: 'warning' | 'error' | 'info';
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const ComplianceReport: React.FC = () => {
  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  const { data, loading, error, updateFilters, exportData } = useAnalytics();

  const [selectedDateRange, setSelectedDateRange] = useState('last6months');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [sortBy, setSortBy] = useState('complianceScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Compliance Report",
      pageDescription: "Comprehensive compliance monitoring and reporting",
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Compliance', isActive: true }
      ],
      headerActions: (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      )
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, exportData]); // Added exportData to dependencies for headerActions

  // Mock incidents data
  const mockIncidents: ComplianceIncident[] = [
    {
      id: 'INC001',
      vendorName: 'Swift Logistics',
      type: 'delivery',
      severity: 'high',
      date: '2024-05-15',
      description: 'Late delivery beyond agreed timeline',
      status: 'investigating',
      assignedTo: 'John Smith'
    },
    {
      id: 'INC002',
      vendorName: 'Global Supply Co',
      type: 'documentation',
      severity: 'medium',
      date: '2024-05-14',
      description: 'Missing quality certificates',
      status: 'resolved',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 'INC003',
      vendorName: 'Reliable Goods Inc',
      type: 'quality',
      severity: 'critical',
      date: '2024-05-13',
      description: 'Quality standards not met',
      status: 'open',
      assignedTo: 'Mike Davis'
    }
  ];

  // Mock alerts data
  const mockAlerts: ComplianceAlert[] = [
    {
      id: 'ALT001',
      title: 'Compliance score below threshold for Swift Logistics',
      type: 'warning',
      date: '2024-05-16',
      read: false,
      priority: 'high'
    },
    {
      id: 'ALT002',
      title: 'Monthly compliance report generated',
      type: 'info',
      date: '2024-05-15',
      read: true,
      priority: 'low'
    },
    {
      id: 'ALT003',
      title: 'Critical compliance violation detected',
      type: 'error',
      date: '2024-05-14',
      read: false,
      priority: 'high'
    }
  ];

  const filteredVendors = useMemo(() => {
    if (!data?.vendorPerformance) return [];

    let filtered = data.vendorPerformance;

    if (selectedVendor !== 'all') {
      filtered = filtered.filter(vendor => vendor.vendorId === selectedVendor);
    }

    if (selectedRiskLevel !== 'all') {
      filtered = filtered.filter(vendor => vendor.riskLevel === selectedRiskLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
  }, [data, selectedVendor, selectedRiskLevel, searchTerm, sortBy, sortOrder]);

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      const result = await exportData(format);
      if (result.success) {
        // In a real app, trigger download
        console.log('Export successful:', result.downloadUrl);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'investigating': return 'text-yellow-600 bg-yellow-50';
      case 'open': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading compliance data: {error}</p>
      </div>
    );
  }

  return (
    // REMOVED: The <Layout> wrapper from the return statement.
    // The page now only returns its own content.
    <div className="space-y-6">
      {/* Header - This content is now managed by the Layout component via context */}
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Report</h1>
          <p className="text-gray-600">Comprehensive compliance monitoring and reporting</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('xlsx')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div> */}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last3months">Last 3 Months</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Vendor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {data?.vendorPerformance?.map(vendor => (
                    <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                      {vendor.vendorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Risk Level</label>
              <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-green-600">{data?.avgComplianceRate?.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{data?.totalVendors}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Incidents</p>
                <p className="text-2xl font-bold text-red-600">{mockIncidents.filter(i => i.status === 'open').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        {/* Replaced existing Risk Score card with Blockchain Verified */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blockchain Verified</p>
                <p className="text-2xl font-bold text-blue-600">99.8%</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5"> {/* Changed grid-cols to 5 */}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger> {/* New Blockchain Tab */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceChart
              title="Compliance Trends"
              data={data?.complianceTrends || []}
              showTrends={true}
              showRiskIndicators={true}
              height={350}
            />

            <MetricsChart
              title="Risk Distribution"
              type="pie"
              data={[
                { name: 'Low Risk', value: filteredVendors.filter(v => v.riskLevel === 'low').length },
                { name: 'Medium Risk', value: filteredVendors.filter(v => v.riskLevel === 'medium').length },
                { name: 'High Risk', value: filteredVendors.filter(v => v.riskLevel === 'high').length }
              ]}
              xAxisKey="name"
              dataKeys={['value']}
              colors={['#10b981', '#f59e0b', '#ef4444']}
              height={350}
            />
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vendor Compliance Details</CardTitle>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complianceScore">Compliance Score</SelectItem>
                      <SelectItem value="vendorName">Vendor Name</SelectItem>
                      <SelectItem value="riskLevel">Risk Level</SelectItem>
                      <SelectItem value="totalDeliveries">Total Deliveries</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Vendor</th>
                      <th className="text-left p-3 font-medium">Compliance Score</th>
                      <th className="text-left p-3 font-medium">Risk Level</th>
                      <th className="text-left p-3 font-medium">Deliveries</th>
                      <th className="text-left p-3 font-medium">On-Time Rate</th>
                      <th className="text-left p-3 font-medium">Last Delivery</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.vendorId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{vendor.vendorName}</div>
                            <div className="text-sm text-gray-500">{vendor.vendorId}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{vendor.complianceScore.toFixed(1)}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${vendor.complianceScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getRiskColor(vendor.riskLevel)}>
                            {vendor.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{vendor.totalDeliveries}</div>
                            <div className="text-sm text-gray-500">
                              {vendor.onTimeDeliveries} on-time
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">
                            {((vendor.onTimeDeliveries / vendor.totalDeliveries) * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm">
                            {formatDate(vendor.lastDeliveryDate)}
                          </span>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Non-Compliance Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{incident.id}</span>
                        <Badge className={getRiskColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(incident.date)}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">{incident.vendorName}</span>
                      <span className="text-gray-500 ml-2">• {incident.type}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{incident.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Assigned to: {incident.assignedTo}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${!alert.read ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                        {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                        {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                        <span className="font-medium">{alert.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                          {alert.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(alert.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Blockchain TabsContent */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Transaction Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Latest Block</div>
                        <div className="text-sm text-gray-500">#847293</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2,450 Transactions</div>
                      <div className="text-xs text-gray-500">Verified 12s ago</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transaction Hash:</span>
                      <span className="font-mono text-blue-600">0x8a7b...9c2d</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verification Time:</span>
                      <span>0.2s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gas Used:</span>
                      <span>21,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Fraud Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">97.5%</div>
                    <div className="text-sm text-gray-500">Detection Accuracy</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Suspicious Patterns</span>
                      <Badge className="bg-red-100 text-red-800">3 Detected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-Blocked</span>
                      <Badge className="bg-yellow-100 text-yellow-800">12 Today</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">False Positives</span>
                      <Badge className="bg-green-100 text-green-800">0.3%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Immutable Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Link className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Delivery Confirmation</span>
                      <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Swift Logistics delivery #DL-2024-0156 verified on blockchain
                  </div>
                  <div className="text-xs font-mono text-blue-600">
                    Hash: 0x7a8b9c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">Compliance Violation</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Recorded</Badge>
                    </div>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Quality standards breach by Global Supply Co permanently recorded
                  </div>
                  <div className="text-xs font-mono text-blue-600">
                    Hash: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReport;