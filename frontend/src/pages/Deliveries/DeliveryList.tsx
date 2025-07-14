import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import { Package, Search, Filter, Plus, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useDeliveries } from '@/hooks/useDeliveries';
import { cn } from '@/components/lib/utils';
// REMOVED: import { Layout } from '@/components/layout/Layout';
// ADDED: Import useLayout hook
import { useLayout } from '@/contexts/LayoutContext';
import { ROUTES } from '@/config/routes'; // Import ROUTES

interface Delivery {
  id: string;
  barcode: string;
  poNumber: string;
  vendorName: string;
  status: 'pending' | 'verified' | 'rejected' | 'in_transit';
  weight: number;
  quantity: number;
  condition: string;
  createdAt: string;
  verifiedAt?: string;
  notes?: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusIcons = {
  pending: Clock,
  verified: CheckCircle,
  rejected: AlertTriangle,
  in_transit: Package
};

const DeliveryList: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { deliveries, loading, error, refreshDeliveries } = useDeliveries();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  // Mock data for demonstration
  const mockDeliveries: Delivery[] = [
    {
      id: '1',
      barcode: 'BC123456789',
      poNumber: 'PO-2024-001',
      vendorName: 'ABC Suppliers Ltd',
      status: 'verified',
      weight: 15.5,
      quantity: 10,
      condition: 'good',
      createdAt: '2024-01-15T10:30:00Z',
      verifiedAt: '2024-01-15T11:00:00Z',
      notes: 'All items in perfect condition'
    },
    {
      id: '2',
      barcode: 'BC987654321',
      poNumber: 'PO-2024-002',
      vendorName: 'XYZ Manufacturing',
      status: 'pending',
      weight: 8.2,
      quantity: 5,
      condition: 'excellent',
      createdAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '3',
      barcode: 'BC456789123',
      poNumber: 'PO-2024-003',
      vendorName: 'Global Trade Corp',
      status: 'in_transit',
      weight: 22.8,
      quantity: 15,
      condition: 'good',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '4',
      barcode: 'BC789123456',
      poNumber: 'PO-2024-004',
      vendorName: 'Tech Solutions Inc',
      status: 'rejected',
      weight: 3.1,
      quantity: 2,
      condition: 'damaged',
      createdAt: '2024-01-15T16:45:00Z',
      notes: 'Packaging damaged during transport'
    }
  ];

  const displayDeliveries = deliveries?.length ? deliveries : mockDeliveries;

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    let filtered = [...displayDeliveries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.condition === conditionFilter);
    }

    return filtered;
  }, [displayDeliveries, searchTerm, statusFilter, conditionFilter]);

  const handleRowClick = (delivery: Delivery) => {
    // Navigate to delivery detail page
    navigate(`${ROUTES.DELIVERIES}/${delivery.id}`); // Use navigate for routing
  };

  const handleEdit = (delivery: Delivery) => {
    navigate(`${ROUTES.DELIVERIES}/edit/${delivery.id}`); // Use navigate for routing
  };

  const handleDelete = (delivery: Delivery) => {
    console.log('Delete delivery:', delivery.id);
    // In a real app, you'd call a delete function from useDeliveries hook
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <div className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
        statusColors[status as keyof typeof statusColors]
      )}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </div>
    );
  };

  const columns = [
    {
      key: 'barcode' as keyof Delivery,
      label: 'Barcode',
      sortable: true,
      render: (value: string) => (
        <div className="font-mono text-sm">{value}</div>
      )
    },
    {
      key: 'poNumber' as keyof Delivery,
      label: 'PO Number',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'vendorName' as keyof Delivery,
      label: 'Vendor',
      sortable: true
    },
    {
      key: 'status' as keyof Delivery,
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'weight' as keyof Delivery,
      label: 'Weight (kg)',
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-mono">{value.toFixed(1)}</div>
      )
    },
    {
      key: 'quantity' as keyof Delivery,
      label: 'Quantity',
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-mono">{value}</div>
      )
    },
    {
      key: 'condition' as keyof Delivery,
      label: 'Condition',
      sortable: true,
      render: (value: string) => (
        <div className="capitalize">{value}</div>
      )
    },
    {
      key: 'createdAt' as keyof Delivery,
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const getActions = (delivery: Delivery) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleRowClick(delivery);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(delivery);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(delivery);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // Define breadcrumbs for the layout context
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Deliveries', isActive: true }
  ];

  // Define header actions for the layout context
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => refreshDeliveries?.()}
        disabled={loading}
      >
        Refresh
      </Button>
      <Button onClick={() => navigate(ROUTES.CREATE_DELIVERY)}> {/* Use navigate here */}
        <Plus className="h-4 w-4 mr-2" />
        New Delivery
      </Button>
    </div>
  );

  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Deliveries",
      pageDescription: "Manage and track delivery verifications",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, refreshDeliveries, loading, navigate]); // Added navigate to dependencies for headerActions

  if (error) {
    return (
      // REMOVED <Layout> wrapper
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Deliveries</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refreshDeliveries?.()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    // REMOVED <Layout> wrapper
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredDeliveries.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredDeliveries.filter(d => d.status === 'verified').length}
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredDeliveries.filter(d => d.status === 'pending').length}
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {filteredDeliveries.filter(d => d.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <SelectItem value="in_transit">In Transit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deliveries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DataTable
          data={filteredDeliveries}
          columns={columns}
          loading={loading}
          searchable={false}
          onRowClick={handleRowClick}
          actions={getActions}
          emptyMessage="No deliveries found"
          className="w-full"
        />
      </motion.div>
    </div>
  );
};

export default DeliveryList;
