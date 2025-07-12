import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Truck,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DataTable, Column } from '@/components/common/DataTable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeliveries } from '@/hooks/useDeliveries';

interface Delivery {
  id: string;
  barcode: string;
  purchaseOrderId: string;
  vendorName: string;
  vendorId: string;
  weight: number;
  quantity: number;
  condition: string;
  status: 'pending' | 'verified' | 'rejected' | 'processing';
  deliveryDate: string;
  verificationDate?: string;
  notes?: string;
  deliveryPhoto?: string;
  packagingPhoto?: string;
  complianceScore?: number;
}

const DeliveryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);

  // Mock data - replace with actual hook
  const { deliveries, loading, error, refetch } = useDeliveries();

  // Mock data for demo
  const mockDeliveries: Delivery[] = [
    {
      id: '1',
      barcode: 'BC123456789',
      purchaseOrderId: 'PO-2024-001',
      vendorName: 'ABC Suppliers Ltd',
      vendorId: 'vendor1',
      weight: 15.5,
      quantity: 100,
      condition: 'good',
      status: 'verified',
      deliveryDate: '2024-01-15T10:30:00Z',
      verificationDate: '2024-01-15T10:45:00Z',
      complianceScore: 95
    },
    {
      id: '2',
      barcode: 'BC987654321',
      purchaseOrderId: 'PO-2024-002',
      vendorName: 'XYZ Manufacturing',
      vendorId: 'vendor2',
      weight: 8.2,
      quantity: 50,
      condition: 'excellent',
      status: 'pending',
      deliveryDate: '2024-01-15T14:20:00Z',
      complianceScore: 88
    },
    {
      id: '3',
      barcode: 'BC456789123',
      purchaseOrderId: 'PO-2024-003',
      vendorName: 'Global Trade Corp',
      vendorId: 'vendor3',
      weight: 22.8,
      quantity: 200,
      condition: 'fair',
      status: 'rejected',
      deliveryDate: '2024-01-14T16:45:00Z',
      verificationDate: '2024-01-14T17:00:00Z',
      notes: 'Packaging damaged during transport',
      complianceScore: 65
    }
  ];

  const deliveryData = deliveries || mockDeliveries;

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    let filtered = [...deliveryData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const deliveryDate = new Date(delivery.deliveryDate);
      
      switch (dateRange) {
        case 'today':
          filtered = filtered.filter(delivery => 
            new Date(delivery.deliveryDate).toDateString() === now.toDateString()
          );
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(delivery => 
            new Date(delivery.deliveryDate) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(delivery => 
            new Date(delivery.deliveryDate) >= monthAgo
          );
          break;
      }
    }

    return filtered;
  }, [deliveryData, searchTerm, statusFilter, dateRange]);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'verified':
          return { icon: CheckCircle2, color: 'text-green-600 bg-green-50', label: 'Verified' };
        case 'rejected':
          return { icon: AlertCircle, color: 'text-red-600 bg-red-50', label: 'Rejected' };
        case 'processing':
          return { icon: RefreshCw, color: 'text-blue-600 bg-blue-50', label: 'Processing' };
        default:
          return { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' };
      }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  // Compliance score badge
  const ComplianceScore = ({ score }: { score?: number }) => {
    if (!score) return <span className="text-gray-400">-</span>;
    
    const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-600 bg-green-50';
      if (score >= 70) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
        {score}%
      </span>
    );
  };

  // Table columns
  const columns: Column<Delivery>[] = [
    {
      key: 'barcode',
      label: 'Barcode',
      render: (value, row) => (
        <div className="font-mono text-sm">
          {value}
        </div>
      )
    },
    {
      key: 'purchaseOrderId',
      label: 'PO Number',
      render: (value) => (
        <div className="font-medium text-sm">
          {value}
        </div>
      )
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (value) => (
        <div className="text-sm">
          {value}
        </div>
      )
    },
    {
      key: 'weight',
      label: 'Weight',
      render: (value, row) => (
        <div className="text-sm">
          {value}kg / {row.quantity} items
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'complianceScore',
      label: 'Compliance',
      render: (value) => <ComplianceScore score={value} />
    },
    {
      key: 'deliveryDate',
      label: 'Delivery Date',
      render: (value) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const handleRowClick = (delivery: Delivery) => {
    // Navigate to delivery detail
    console.log('Navigate to delivery:', delivery.id);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for deliveries:`, selectedDeliveries);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deliveries', isActive: true }
  ];

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      pageTitle="Delivery Management"
      pageDescription="Monitor and verify all delivery activities"
    >
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-2xl font-bold">{deliveryData.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {deliveryData.filter(d => d.status === 'verified').length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {deliveryData.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {deliveryData.filter(d => d.status === 'rejected').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => refetch && refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedDeliveries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg"
          >
            <span className="text-sm font-medium">
              {selectedDeliveries.length} deliveries selected
            </span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('verify')}>
              Verify Selected
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </motion.div>
        )}

        {/* Main Table */}
        <DataTable
          data={filteredDeliveries}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          actions={(delivery) => (
            <Button variant="ghost" size="sm" onClick={() => handleRowClick(delivery)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          emptyMessage="No deliveries found matching your criteria"
        />
      </div>
    </Layout>
  );
};

export default DeliveryList;