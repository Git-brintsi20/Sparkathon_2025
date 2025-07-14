import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import type { Vendor, VendorFormData } from '@/types/vendor';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2
} from 'lucide-react';
// REMOVED: import { Layout } from '@/components/layout/Layout';
// ADDED: Import the useLayout hook
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVendors } from '@/hooks/useVendors';
import VendorForm from '@/components/forms/VendorForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import { cn } from '@/components/lib/utils';
import { Shield, ExternalLink, Link as LinkIcon ,  ShieldCheck} from 'lucide-react';
import type  {VendorMetrics} from   '@/types/vendor';
declare module '@/types/vendor' {
  interface Vendor {
    blockchainVerification?: BlockchainVerification;
  }
}

// Add this interface after the other type definitions
interface BlockchainVerification {
  isVerified: boolean;
  transactionHash: string;
  blockNumber: number;
  verificationDate: string;
}


const VendorList: React.FC = () => {
  // ADDED: Call the useLayout hook
  const { setLayoutData } = useLayout();

  const {
    vendors,
    loading,
    error,
    pagination,
    filters,
    metrics,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    setFilters,
    setPage,
    searchVendors,
    refreshVendors
  } = useVendors();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Define breadcrumbs for the layout context
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Vendors', isActive: true }
  ];

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      searchVendors(value, filters);
    } else {
      fetchVendors();
    }
  };

  const BlockchainBadge = ({ verification }: { verification?: BlockchainVerification }) => {
  if (!verification?.isVerified) return null;
  
  return (
    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
      <Shield className="h-3 w-3" />
      <span>Verified</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          window.open(`https://etherscan.io/tx/${verification.transactionHash}`, '_blank');
        }}
        className="hover:text-green-700"
      >
        <ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
};


  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      active: CheckCircle,
      inactive: XCircle,
      suspended: AlertTriangle
    };

    const Icon = icons[status as keyof typeof icons] || XCircle;

    return (
      <Badge className={cn('flex items-center gap-1', variants[status as keyof typeof variants])}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Risk level badge
  const RiskBadge = ({ level }: { level: string }) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[level as keyof typeof variants]}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  // Compliance score display
  const ComplianceScore = ({ score }: { score: number }) => {
    const getColor = (score: number) => {
      if (score >= 90) return 'text-green-600';
      if (score >= 70) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="flex items-center gap-2">
        <div className={cn('text-sm font-medium', getColor(score))}>
          {score}%
        </div>
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              score >= 90 ? 'bg-green-500' :
                score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  // Table columns
  const columns: Column<Vendor>[] = [
    {
      key: 'name',
      label: 'Vendor Name',
  render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-medium flex items-center gap-2">
            {value}
            <BlockchainBadge verification={row.blockchainVerification} />
          </div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
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
      key: 'riskLevel',
      label: 'Risk Level',
      render: (value) => <RiskBadge level={value} />
    },
    {
      key: 'totalDeliveries',
      label: 'Deliveries',
      render: (value) => (
        <div className="text-sm font-medium">
          {value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'lastDelivery',
      label: 'Last Delivery',
      render: (value) => (
        <div className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
        </div>
      )
    }
  ];

  // Row actions
  const renderActions = (vendor: Vendor) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSelectedVendor(vendor)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedVendor(vendor);
          setShowEditDialog(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteVendor(vendor.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );

  // Define header actions for the layout context
  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8 w-64"
        />
      </div>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm
            mode="create"
            onSubmit={async (data: VendorFormData) => {
              await createVendor(data);
              setShowCreateDialog(false);
              refreshVendors();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

// Metrics cards - based on actual mock data
// Update the metricsCards to include blockchain metrics
const metricsCards = [
  {
    title: 'Total Vendors',
    value: metrics?.totalVendors || 12,
    change: '+12%',
    positive: true,
    blockchainInfo: `${metrics?.blockchainTransactions || 156} TX`
  },
  {
    title: 'Active Vendors',
    value: metrics?.activeVendors || 10,
    change: '+8%',
    positive: true,
    blockchainInfo: `${metrics?.verifiedRecords || 142} verified`
  },
  {
    title: 'High Risk',
    value: metrics?.highRiskVendors || 1,
    change: '-25%',
    positive: true,
    blockchainInfo: `${metrics?.immutableRecords || 24} immutable`
  },
  {
    title: 'Avg Compliance',
    value: `${metrics?.averageComplianceScore || 87}%`,
    change: '+3%',
    positive: true,
    blockchainInfo: `Block #${metrics?.lastBlockNumber || 18500000}`
  }
];


  // ADDED: useEffect hook to set and clear layout data
  useEffect(() => {
    setLayoutData({
      pageTitle: "Vendor Management",
      pageDescription: "Manage your vendor network and compliance",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    // Return a cleanup function
    return () => setLayoutData({});
  }, [setLayoutData, searchTerm, filters, loading, metrics, showCreateDialog]); // Added dependencies for headerActions to update correctly

  return (
    // REMOVED: The <Layout> wrapper from the return statement.
    // The page now only returns its own content.
    <div className="p-6 space-y-6">

            {/* Blockchain Verification Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-800">Blockchain-Verified Vendor Network</h3>
            <p className="text-sm text-blue-600">
              All vendor records are immutably stored on the Ethereum blockchain
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
          <LinkIcon className="h-4 w-4 mr-2" />
          View Smart Contract
        </Button>
      </div>
      {/* Metrics Cards */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {metricsCards.map((metric, index) => (
    <motion.div
      key={metric.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
            <div className={cn(
              'text-sm font-medium',
              metric.positive ? 'text-green-600' : 'text-red-600'
            )}>
              {metric.change}
            </div>
          </div>
          {metric.blockchainInfo && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <LinkIcon className="h-3 w-3" />
              <span>{metric.blockchainInfo}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>

      {/* Vendor Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          data={vendors}
          columns={columns}
          loading={loading}
          actions={renderActions}
          onRowClick={(vendor) => setSelectedVendor(vendor)}
          emptyMessage="No vendors found"
          pagination={true}
          pageSize={pagination.limit}
        />
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          {selectedVendor && (() => {

            const initialFormDataForEdit: Partial<VendorFormData> = {
              ...selectedVendor,

              documents: undefined,
            };

            return (
              <VendorForm
                mode="edit"
                initialData={initialFormDataForEdit}
                onSubmit={async (data: VendorFormData) => {
                  await updateVendor(selectedVendor.id, data);
                  setShowEditDialog(false);
                  setSelectedVendor(null);
                  refreshVendors();
                }}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorList;
