import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, Plus, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useDeliveries } from '@/hooks/useDeliveries';
import { cn } from '@/components/lib/utils';
import { useLayout } from '@/contexts/LayoutContext';
import type { LayoutContextType } from '@/contexts/LayoutContext';
import { ROUTES } from '@/config/routes';
import type { Delivery } from '@/types/delivery';
import { Shield, Hash} from 'lucide-react';

// Mock data based on the QR code scenarios
const mockDeliveries: Delivery[] = [
  // QR Code 1: DIV-bha-212 (The Good Delivery)
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
        name: 'Office Supplies',
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
    updatedAt: '2024-01-15T11:00:00Z'
  },
  
  // QR Code 2: ANA-yad-264 (The Weight Mismatch)
  {
    id: '2',
    orderId: 'PO-2024-002',
    vendorId: 'vendor-2',
    vendorName: 'XYZ Manufacturing',
    deliveryDate: '2024-01-15T14:20:00Z',
    expectedDate: '2024-01-15T14:00:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-2',
        name: 'Raw Materials',
        quantity: 5,
        expectedQuantity: 5,
        unit: 'boxes',
        price: 45.00,
        verified: false,
        condition: 'good'
      }
    ],
    totalAmount: 225.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Weight discrepancy detected - Expected: 12.5kg, Actual: 8.2kg',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  
  // QR Code 3: ARY-kes-275 (The Product Mismatch)
  {
    id: '3',
    orderId: 'PO-2024-003',
    vendorId: 'vendor-3',
    vendorName: 'Global Trade Corp',
    deliveryDate: '2024-01-15T09:15:00Z',
    expectedDate: '2024-01-15T09:00:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-3',
        name: 'Heavy Equipment',
        quantity: 12,
        expectedQuantity: 15,
        unit: 'units',
        price: 150.00,
        verified: false,
        condition: 'good'
      }
    ],
    totalAmount: 2250.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Product quantity mismatch - Expected: 15 units, Delivered: 12 units',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  
  // QR Code 4: HAR-bha-203 (The Flagged Vendor)
  {
    id: '4',
    orderId: 'PO-2024-004',
    vendorId: 'vendor-4',
    vendorName: 'Unreliable Vendors Inc',
    deliveryDate: '2024-01-15T16:45:00Z',
    expectedDate: '2024-01-15T16:30:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-4',
        name: 'Electronic Components',
        quantity: 20,
        expectedQuantity: 20,
        unit: 'pieces',
        price: 35.75,
        verified: false,
        condition: 'poor'
      }
    ],
    totalAmount: 715.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Vendor flagged for previous quality issues. Items show signs of damage.',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  }
];

// Map QR codes to mock data for easy identification
const qrCodeMapping = {
  'DIV-bha-212': mockDeliveries[0],
  'ANA-yad-264': mockDeliveries[1],
  'ARY-kes-275': mockDeliveries[2],
  'HAR-bha-203': mockDeliveries[3]
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  flagged: 'bg-orange-100 text-orange-800 border-orange-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusIcons = {
  pending: Clock,
  verified: CheckCircle,
  rejected: AlertTriangle,
  flagged: AlertTriangle,
  in_transit: Package,
  delivered: Package
};

const DeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ FIXED: Always call hooks at the top level
  const deliveriesHook = useDeliveries();
  const layoutHook = useLayout();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  // Extract data from hooks with fallbacks
  const deliveries = deliveriesHook?.deliveries || [];
  const loading = deliveriesHook?.loading || false;
  const error = deliveriesHook?.error || null;
  const refreshDeliveries = deliveriesHook?.refreshDeliveries || (() => {});
  
  const setLayoutData = layoutHook?.setLayoutData || ((data: any) => {});

  // Get filtered data based on route
  const getFilteredData = useMemo(() => {
    const currentPath = location.pathname;
    const dataToFilter = deliveries.length > 0 ? deliveries : mockDeliveries;
    
    if (currentPath.includes('/active')) {
      return dataToFilter.filter(d => d.status === 'in_transit' || d.status === 'pending');
    } else if (currentPath.includes('/completed')) {
      return dataToFilter.filter(d => d.status === 'verified' || d.status === 'delivered');
    } else if (currentPath.includes('/verification')) {
      return dataToFilter.filter(d => d.status === 'pending');
    } else if (currentPath.includes('/flagged')) {
      return dataToFilter.filter(d => d.status === 'flagged');
    }
    
    return dataToFilter;
  }, [deliveries, location.pathname]);

  // Filter deliveries with safe array operations
  const filteredDeliveries = useMemo(() => {
    if (!Array.isArray(getFilteredData)) {
      return [];
    }

    let filtered = [...getFilteredData];

    // Search filter - search by order ID, vendor name, or item names
    if (searchTerm) {
      filtered = filtered.filter(delivery => {
        const orderId = delivery.orderId || '';
        const vendorName = delivery.vendorName || '';
        const itemNames = delivery.items?.map(item => item.name).join(' ') || '';
        
        return orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
               vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               itemNames.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Condition filter
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(delivery => 
        delivery.items?.some(item => item.condition === conditionFilter)
      );
    }

    return filtered;
  }, [getFilteredData, searchTerm, statusFilter, conditionFilter]);

  const handleRowClick = (delivery: Delivery) => {
    navigate(`${ROUTES.DELIVERIES}/${delivery.id}`);
  };

  const handleEdit = (delivery: Delivery) => {
    navigate(`${ROUTES.DELIVERIES}/edit/${delivery.id}`);
  };

  const handleDelete = (delivery: Delivery) => {
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
      key: 'orderId' as keyof Delivery,
      label: 'Order ID',
      sortable: true,
      render: (value: string) => (
        <div className="font-mono text-sm font-medium">{value}</div>
      )
    },
    {
      key: 'vendorName' as keyof Delivery,
      label: 'Vendor',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'items' as keyof Delivery,
      label: 'Items',
      sortable: false,
      render: (items: any[]) => (
        <div className="space-y-1">
          {items?.slice(0, 2).map((item, index) => (
            <div key={index} className="text-sm">
              {item.name} ({item.quantity} {item.unit})
            </div>
          ))}
          {items?.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{items.length - 2} more
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status' as keyof Delivery,
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'totalAmount' as keyof Delivery,
      label: 'Total Amount',
      sortable: true,
      render: (value: number) => (
        <div className="text-right font-mono font-medium">
          ${value.toFixed(2)}
        </div>
      )
    },
    {
      key: 'deliveryDate' as keyof Delivery,
      label: 'Delivery Date',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'notes' as keyof Delivery,
      label: 'Notes',
      sortable: false,
      render: (value: string) => (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {value || 'No notes'}
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

  // Define breadcrumbs and actions
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Deliveries', isActive: true }
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => refreshDeliveries()}
        disabled={loading}
      >
        Refresh
      </Button>
      <Button onClick={() => navigate(`${ROUTES.DELIVERIES}/create`)}>
        <Plus className="h-4 w-4 mr-2" />
        New Delivery
      </Button>
    </div>
  );

  // Update layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Deliveries",
      pageDescription: "Manage and track delivery verifications",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    return () => setLayoutData({});
  }, [setLayoutData]);

  // Only show loading if we're actually loading and have no data
  if (loading && filteredDeliveries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && filteredDeliveries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Deliveries</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => refreshDeliveries()}>
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
                Flagged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {filteredDeliveries.filter(d => d.status === 'flagged').length}
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
                  placeholder="Search by order ID, vendor, or items..."
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
                  <SelectItem value="flagged">Flagged</SelectItem>
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

      {/* QR Code Scenarios Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">QR Code Test Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-mono text-sm font-medium text-green-800">DIV-bha-212</div>
                <div className="text-sm text-green-700">The Good Delivery</div>
                <div className="text-xs text-green-600 mt-1">All items verified, perfect condition</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-mono text-sm font-medium text-orange-800">ANA-yad-264</div>
                <div className="text-sm text-orange-700">The Weight Mismatch</div>
                <div className="text-xs text-orange-600 mt-1">Weight discrepancy detected</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-mono text-sm font-medium text-red-800">ARY-kes-275</div>
                <div className="text-sm text-red-700">The Product Mismatch</div>
                <div className="text-xs text-red-600 mt-1">Quantity mismatch: 12/15 delivered</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-mono text-sm font-medium text-gray-800">HAR-bha-203</div>
                <div className="text-sm text-gray-700">The Flagged Vendor</div>
                <div className="text-xs text-gray-600 mt-1">Vendor with quality issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deliveries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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