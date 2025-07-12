// frontend/src/pages/Vendors/VendorDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Edit, Trash2, Phone, Mail, Globe, MapPin, Building2, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle, Package, FileText, Settings
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricsChart } from '@/components/charts/MetricsChart';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable'; // Correctly using type import
import { useVendors } from '@/hooks/useVendors';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/components/lib/utils';
// CORRECTED: Use a type-only import for the Vendor type
import type { Vendor } from '@/types/vendor';

// REMOVED: The local VendorDetails interface is no longer needed. We use the main Vendor type.

interface Delivery {
  id: string;
  orderNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  complianceCheck: boolean;
}

const VendorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedVendor,
    loading,
    error,
    fetchVendorById,
  } = useVendors();

  // CORRECTED: The state now directly uses the comprehensive Vendor type.
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchVendorById(id);
      // MOCK DATA (In a real app, this would be fetched)
      setDeliveries([
        { id: '1', orderNumber: 'PO-2024-001', date: '2024-01-15', amount: 15000, status: 'completed', complianceCheck: true },
        { id: '2', orderNumber: 'PO-2024-002', date: '2024-01-10', amount: 8500, status: 'completed', complianceCheck: true }
      ]);
      setPerformance([
        { month: 'Jan', score: 85, deliveries: 12 },
        { month: 'Feb', score: 92, deliveries: 15 },
        { month: 'Mar', score: 88, deliveries: 18 }
      ]);
    }
  }, [id, fetchVendorById]);

  useEffect(() => {
    if (selectedVendor) {
      // CORRECTED: No more type casting needed.
      // We assume the 'selectedVendor' from the hook has all the necessary (optional) properties.
      setVendor(selectedVendor);
    }
  }, [selectedVendor]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Vendors', href: '/vendors' },
    { label: vendor?.name || 'Vendor Details', isActive: true }
  ];

  // ... (The rest of your components like StatusBadge, RiskBadge, etc., are fine)
  
  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = { active: CheckCircle, inactive: XCircle, suspended: AlertTriangle };
    const Icon = icons[status as keyof typeof icons] || XCircle;
    return (
      <Badge className={cn('flex items-center gap-1', variants[status as keyof typeof variants])}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const RiskBadge = ({ level }: { level: string }) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={variants[level as keyof typeof variants]}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </Badge>
    );
  };

  const ComplianceScore = ({ score }: { score: number }) => {
    const getColor = (s: number) => s >= 90 ? 'text-green-600' : s >= 70 ? 'text-yellow-600' : 'text-red-600';
    return (
      <div className="flex items-center gap-3">
        <div className={cn('text-3xl font-bold', getColor(score))}>{score}%</div>
        <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', getColor(score).replace('text-', 'bg-'))}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const deliveryColumns: Column<Delivery>[] = [
    { key: 'orderNumber', label: 'Order Number', render: (value) => <div className="font-medium text-primary">{value}</div> },
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'amount', label: 'Amount', render: (value) => `$${value.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (value) => <Badge className={cn(value === 'completed' ? 'bg-green-100 text-green-800' : value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')}>{value.charAt(0).toUpperCase() + value.slice(1)}</Badge> },
    { key: 'complianceCheck', label: 'Compliance', render: (value) => <div className="flex items-center gap-1">{value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}<span className="text-sm">{value ? 'Passed' : 'Failed'}</span></div> }
  ];
  
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => navigate('/vendors')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Vendors</Button>
      <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />Edit Vendor</Button>
      <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2" />Settings</Button>
    </div>
  );


  if (loading) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
      </Layout>
    );
  }

  if (error || !vendor) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vendor Not Found</h3>
            <p className="text-muted-foreground mb-4">{error || 'The vendor you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/vendors')}>Back to Vendors</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      pageTitle={vendor.name}
      pageDescription={`${vendor.industry} • ${vendor.address}`}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* Vendor Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg p-6 border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"><Building2 className="h-8 w-8 text-primary" /></div>
              <div>
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                <p className="text-muted-foreground">{vendor.industry}</p>
                <div className="flex items-center gap-4 mt-2">
                  <StatusBadge status={vendor.status} />
                  <RiskBadge level={vendor.riskLevel} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
              <ComplianceScore score={vendor.complianceScore} />
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            // Note: The `|| 0` fallbacks are good practice for optional properties
            { title: 'Total Deliveries', value: vendor.totalDeliveries || 0, icon: Package, color: 'text-blue-600' },
            { title: 'Success Rate', value: `${vendor.totalDeliveries ? Math.round(((vendor.successfulDeliveries || 0) / vendor.totalDeliveries) * 100) : 0}%`, icon: TrendingUp, color: 'text-green-600' },
            { title: 'Contact Person', value: vendor.contactPerson || 'N/A', icon: Phone, color: 'text-purple-600' },
            { title: 'Last Delivery', value: vendor.lastDelivery ? new Date(vendor.lastDelivery).toLocaleDateString() : 'N/A', icon: Calendar, color: 'text-orange-600' }
          ].map((metric, index) => (
            <motion.div key={metric.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card><CardContent className="p-4"><div className="flex items-center gap-3"><metric.icon className={cn('h-5 w-5', metric.color)} /><div><p className="text-sm text-muted-foreground">{metric.title}</p><p className="text-lg font-semibold">{metric.value}</p></div></div></CardContent></Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Company Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{vendor.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{vendor.phone}</span></div>
                  {vendor.website && ( // This optional check now works perfectly
                    <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{vendor.website}</span></div>
                  )}
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{vendor.address}</span></div>
                  {vendor.taxId && (
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm">Tax ID: {vendor.taxId}</span></div>
                  )}
                </CardContent>
              </Card>

    <Card>
  <CardHeader><CardTitle>Performance Overview</CardTitle></CardHeader>
  <CardContent>
    <MetricsChart type="line" data={performance} xAxisKey="month" dataKeys={['score']} title="Compliance Score Trend" height={200} />
  </CardContent>
</Card>
            </div>
          </TabsContent>
          
          <TabsContent value="deliveries"><Card><CardHeader><CardTitle>Recent Deliveries</CardTitle></CardHeader><CardContent><DataTable data={deliveries} columns={deliveryColumns} searchable={false} pagination={false} /></CardContent></Card></TabsContent>
          <TabsContent value="performance"><Card>
  <CardHeader><CardTitle>Performance Metrics</CardTitle></CardHeader>
  <CardContent>
    <MetricsChart type="bar" data={performance} xAxisKey="month" dataKeys={['deliveries']} title="Monthly Deliveries" height={300} />
  </CardContent>
</Card></TabsContent>
          <TabsContent value="compliance"><Card><CardHeader><CardTitle>Compliance History</CardTitle></CardHeader><CardContent><div className="text-center py-8"><FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Compliance history and audit logs will be displayed here.</p></div></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VendorDetail;