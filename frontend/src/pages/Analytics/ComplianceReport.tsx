import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { Download, Filter, AlertTriangle, CheckCircle, XCircle, Eye, FileText, BarChart3, Clock, User, Shield } from 'lucide-react';
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
import { useLayout } from '@/contexts/LayoutContext';
import apiService from '@/services/api';

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

  const { data, loading, error, updateFilters: _updateFilters, exportData } = useAnalytics();

  const [selectedDateRange, setSelectedDateRange] = useState('last6months');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [sortBy, setSortBy] = useState('complianceScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Real data from API
  const [incidents, setIncidents] = useState<ComplianceIncident[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [blockchainData, setBlockchainData] = useState<any>(null);

  // Fetch compliance incidents and alerts from API
  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const [complianceRes, blockchainRes] = await Promise.all([
          apiService.get<any>('/analytics/compliance-report'),
          apiService.get<any>('/blockchain/network'),
        ]);

        if (complianceRes.success && complianceRes.data) {
          const logs = complianceRes.data.logs || complianceRes.data.complianceLogs || [];
          // Build incidents from compliance logs
          const inc: ComplianceIncident[] = logs
            .filter((l: any) => l.severity === 'high' || l.severity === 'critical' || l.status === 'flagged')
            .map((l: any, i: number) => ({
              id: l._id || `INC${i}`,
              vendorName: l.vendorName || l.vendorId?.name || 'Unknown',
              type: l.type || 'delivery',
              severity: l.severity || 'medium',
              date: l.createdAt || l.date,
              description: l.description || l.type,
              status: l.status === 'resolved' ? 'resolved' : l.status === 'flagged' ? 'open' : 'investigating',
              assignedTo: l.assignedTo || 'Unassigned',
            }));
          setIncidents(inc);

          // Build alerts from all logs
          const alt: ComplianceAlert[] = logs.slice(0, 10).map((l: any, i: number) => ({
            id: l._id || `ALT${i}`,
            title: l.description || `${l.type} - ${l.severity}`,
            type: l.severity === 'critical' || l.severity === 'high' ? 'error' : l.severity === 'medium' ? 'warning' : 'info',
            date: l.createdAt || l.date,
            read: l.status === 'resolved',
            priority: l.severity === 'critical' || l.severity === 'high' ? 'high' : l.severity === 'medium' ? 'medium' : 'low',
          }));
          setAlerts(alt);
        }

        if (blockchainRes.success && blockchainRes.data) {
          setBlockchainData(blockchainRes.data);
        }
      } catch (err) {
        console.error('Failed to load compliance data:', err);
      }
    };
    fetchComplianceData();
  }, [selectedDateRange]);
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
  }, [selectedDateRange]);

  // ADDED: Memoized filtered and sorted vendor list
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
                <p className="text-2xl font-bold text-red-600">{incidents.filter(i => i.status === 'open').length}</p>
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
                <p className="text-2xl font-bold text-blue-600">{blockchainData?.verifiedDeliveries || data?.avgComplianceRate?.toFixed(0) || 0}%</p>
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
                {incidents.map((incident) => (
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
                {alerts.map((alert) => (
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
                        <div className="font-medium">Network Status</div>
                        <div className="text-sm text-gray-500">{blockchainData?.connected ? 'Connected' : 'Disconnected'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{blockchainData?.totalDeliveries?.toLocaleString() || 0} Transactions</div>
                      <div className="text-xs text-gray-500">Total verified</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Verified Deliveries:</span>
                      <span className="font-mono text-blue-600">{blockchainData?.verifiedDeliveries?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Vendors:</span>
                      <span>{blockchainData?.totalVendors || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compliance Logs:</span>
                      <span>{blockchainData?.complianceLogs || 0}</span>
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
                    <div className="text-3xl font-bold text-red-600">
                      {incidents.length > 0 ? `${((1 - incidents.filter(i => i.status === 'open').length / Math.max(incidents.length, 1)) * 100).toFixed(1)}%` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Issue Resolution Rate</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Incidents</span>
                      <Badge className="bg-red-100 text-red-800">{incidents.filter(i => i.status === 'open').length} Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolved</span>
                      <Badge className="bg-green-100 text-green-800">{incidents.filter(i => i.status === 'resolved').length} Closed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Under Review</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{incidents.filter(i => i.status === 'investigating').length} Pending</Badge>
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
                {incidents.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No audit trail entries yet
                  </div>
                )}
                {incidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {incident.severity === 'high' || incident.severity === 'critical' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Link className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="font-medium">{incident.type}</span>
                        <Badge className={incident.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {incident.status === 'resolved' ? 'Verified' : 'Recorded'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(incident.date)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {incident.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReport;