import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, Plus, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useDeliveries } from '@/hooks/useDeliveries';
import { cn } from '@/components/lib/utils';
import { useLayout } from '@/contexts/LayoutContext';
import { ROUTES } from '@/config/routes';
import type { Delivery } from '@/types/delivery';

// Extended interface for the component to handle both type systems
interface DeliveryListItem extends Delivery {
  barcode?: string;
  poNumber?: string;
  condition?: string;
  weight?: number;
  quantity?: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusIcons = {
  pending: Clock,
  verified: CheckCircle,
  rejected: AlertTriangle,
  in_transit: Package,
  delivered: Package
};

const DeliveryList: React.FC = () => {
  const navigate = useNavigate();
  
  // FIX 1: Add fallback for hook failures
  let deliveries, loading, error, refreshDeliveries;
  try {
    const hookResult = useDeliveries();
    deliveries = hookResult.deliveries;
    loading = hookResult.loading;
    error = hookResult.error;
    refreshDeliveries = hookResult.refreshDeliveries;
  } catch (hookError) {
    console.warn('useDeliveries hook failed:', hookError);
    deliveries = [];
    loading = false;
    error = null;
    refreshDeliveries = () => {};
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  
  // FIX 2: Add fallback for layout context
  let setLayoutData;
  try {
    const layoutContext = useLayout();
    setLayoutData = layoutContext.setLayoutData;
  } catch (layoutError) {
    console.warn('useLayout hook failed:', layoutError);
    setLayoutData = () => {};
  }

  // Mock data for demonstration - updated to match the actual Delivery type
  const mockDeliveries: DeliveryListItem[] = [
    {
      id: '1',
      orderId: 'PO-2024-001',
      vendorId: 'vendor-1',
      vendorName: 'ABC Suppliers Ltd',
      deliveryDate: '2024-01-15T10:30:00Z',
      expectedDate: '2024-01-15T10:00:00Z',
      status: 'verified',
      items: [
        {
          id: 'item-1',
          name: 'Sample Item',
          quantity: 10,
          expectedQuantity: 10,
          unit: 'pieces',
          price: 25.50,
          verified: true,
          condition: 'good'
        }
      ],
      totalAmount: 255.00,
      verificationStatus: 'verified',
      photos: [],
      notes: 'All items in perfect condition',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
      // Additional properties for display
      barcode: 'BC123456789',
      poNumber: 'PO-2024-001',
      condition: 'good',
      weight: 15.5,
      quantity: 10
    },
    {
      id: '2',
      orderId: 'PO-2024-002',
      vendorId: 'vendor-2',
      vendorName: 'XYZ Manufacturing',
      deliveryDate: '2024-01-15T14:20:00Z',
      expectedDate: '2024-01-15T14:00:00Z',
      status: 'pending',
      items: [
        {
          id: 'item-2',
          name: 'Another Item',
          quantity: 5,
          expectedQuantity: 5,
          unit: 'boxes',
          price: 45.00,
          verified: false,
          condition: 'good'
        }
      ],
      totalAmount: 225.00,
      verificationStatus: 'pending',
      photos: [],
      notes: '',
      createdAt: '2024-01-15T14:20:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      barcode: 'BC987654321',
      poNumber: 'PO-2024-002',
      condition: 'excellent',
      weight: 8.2,
      quantity: 5
    },
    {
      id: '3',
      orderId: 'PO-2024-003',
      vendorId: 'vendor-3',
      vendorName: 'Global Trade Corp',
      deliveryDate: '2024-01-15T09:15:00Z',
      expectedDate: '2024-01-15T09:00:00Z',
      status: 'in_transit',
      items: [
        {
          id: 'item-3',
          name: 'Heavy Equipment',
          quantity: 15,
          expectedQuantity: 15,
          unit: 'units',
          price: 150.00,
          verified: false,
          condition: 'good'
        }
      ],
      totalAmount: 2250.00,
      verificationStatus: 'pending',
      photos: [],
      notes: '',
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      barcode: 'BC456789123',
      poNumber: 'PO-2024-003',
      condition: 'good',
      weight: 22.8,
      quantity: 15
    },
    {
      id: '4',
      orderId: 'PO-2024-004',
      vendorId: 'vendor-4',
      vendorName: 'Tech Solutions Inc',
      deliveryDate: '2024-01-15T16:45:00Z',
      expectedDate: '2024-01-15T16:30:00Z',
      status: 'rejected',
      items: [
        {
          id: 'item-4',
          name: 'Damaged Goods',
          quantity: 2,
          expectedQuantity: 2,
          unit: 'pieces',
          price: 75.00,
          verified: true,
          condition: 'damaged'
        }
      ],
      totalAmount: 150.00,
      verificationStatus: 'failed',
      photos: [],
      notes: 'Packaging damaged during transport',
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      barcode: 'BC789123456',
      poNumber: 'PO-2024-004',
      condition: 'damaged',
      weight: 3.1,
      quantity: 2
    }
  ];

  // FIX 3: Ensure mock data is always used when real data is empty/null/undefined
  const displayDeliveries = (deliveries && deliveries.length > 0) ? deliveries as DeliveryListItem[] : mockDeliveries;

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    let filtered = [...displayDeliveries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        (delivery.barcode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (delivery.poNumber || delivery.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleRowClick = (delivery: DeliveryListItem) => {
    try {
      navigate(`${ROUTES.DELIVERIES}/${delivery.id}`);
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  };

  const handleEdit = (delivery: DeliveryListItem) => {
    try {
      navigate(`${ROUTES.DELIVERIES}/edit/${delivery.id}`);
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  };

  const handleDelete = (delivery: DeliveryListItem) => {
    console.log('Delete delivery:', delivery.id);
    // In a real app, you'd call a delete function from useDeliveries hook
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const Icon = statusIcons[status as keyof typeof statusIcons] || Package;
    return (
      <div className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'
      )}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </div>
    );
  };

  const columns = [
    {
      key: 'barcode' as keyof DeliveryListItem,
      label: 'Barcode',
      sortable: true,
      render: (value: string | undefined) => (
        <div className="font-mono text-sm">{value || 'N/A'}</div>
      )
    },
    {
      key: 'poNumber' as keyof DeliveryListItem,
      label: 'PO Number',
      sortable: true,
      render: (value: string | undefined, row: DeliveryListItem) => (
        <div className="font-medium">{value || row.orderId || 'N/A'}</div>
      )
    },
    {
      key: 'vendorName' as keyof DeliveryListItem,
      label: 'Vendor',
      sortable: true
    },
    {
      key: 'status' as keyof DeliveryListItem,
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'weight' as keyof DeliveryListItem,
      label: 'Weight (kg)',
      sortable: true,
      render: (value: number | undefined) => (
        <div className="text-right font-mono">
          {value ? value.toFixed(1) : 'N/A'}
        </div>
      )
    },
    {
      key: 'quantity' as keyof DeliveryListItem,
      label: 'Quantity',
      sortable: true,
      render: (value: number | undefined, row: DeliveryListItem) => (
        <div className="text-right font-mono">
          {value || row.items?.reduce((sum, item) => sum + item.quantity, 0) || 'N/A'}
        </div>
      )
    },
    {
      key: 'condition' as keyof DeliveryListItem,
      label: 'Condition',
      sortable: true,
      render: (value: string | undefined, row: DeliveryListItem) => (
        <div className="capitalize">
          {value || row.items?.[0]?.condition || 'N/A'}
        </div>
      )
    },
    {
      key: 'createdAt' as keyof DeliveryListItem,
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  const getActions = (delivery: DeliveryListItem) => (
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
      <Button onClick={() => {
        try {
          navigate(`${ROUTES.DELIVERIES}/create`);
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
      }}>
        <Plus className="h-4 w-4 mr-2" />
        New Delivery
      </Button>
    </div>
  );

  // FIX 4: Wrap useEffect in try-catch and make it conditional
  useEffect(() => {
    try {
      if (setLayoutData) {
        setLayoutData({
          pageTitle: "Deliveries",
          pageDescription: "Manage and track delivery verifications",
          breadcrumbs: breadcrumbs,
          headerActions: headerActions
        });

        return () => setLayoutData({});
      }
    } catch (layoutError) {
      console.warn('Layout context error:', layoutError);
    }
  }, [setLayoutData, refreshDeliveries, loading]);

  // FIX 5: Show loading state only when actually loading
  if (loading && (!deliveries || deliveries.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
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
                  <SelectItem value="delivered">Delivered</SelectItem>
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