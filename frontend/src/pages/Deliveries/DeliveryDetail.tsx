import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Edit, 
  Camera, 
  Scale, 
  Barcode,
  FileText,
  Calendar,
  User,
  MapPin,
  Truck,
  Download,
  Printer,
  Share2,
  ExternalLink,
  X
} from 'lucide-react';

interface DeliveryDetail {
  id: string;
  barcode: string;
  poNumber: string;
  vendorName: string;
  vendorContact: string;
  status: 'pending' | 'verified' | 'rejected' | 'in_transit';
  weight: number;
  expectedWeight: number;
  quantity: number;
  expectedQuantity: number;
  condition: string;
  createdAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  notes?: string;
  deliveryAddress: string;
  deliveryPhoto?: string;
  packagingPhoto?: string;
  verifiedBy?: string;
  trackingNumber?: string;
  complianceScore: number;
  timeline: Array<{
    id: string;
    status: string;
    timestamp: string;
    description: string;
    user?: string;
  }>;
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

const DeliveryDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'timeline'>('overview');
  const [loading, setLoading] = useState(false);
  const [showFullImage, setShowFullImage] = useState<string | null>(null);

  // Mock data for demonstration
  const mockDelivery: DeliveryDetail = {
    id: '1',
    barcode: 'BC123456789',
    poNumber: 'PO-2024-001',
    vendorName: 'ABC Suppliers Ltd',
    vendorContact: 'john.doe@abcsuppliers.com',
    status: 'verified',
    weight: 15.5,
    expectedWeight: 15.0,
    quantity: 10,
    expectedQuantity: 10,
    condition: 'good',
    createdAt: '2024-01-15T10:30:00Z',
    verifiedAt: '2024-01-15T11:00:00Z',
    notes: 'All items in perfect condition. Packaging slightly damaged but contents intact.',
    deliveryAddress: '123 Business Park, Tech City, TC 12345',
    deliveryPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    packagingPhoto: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop',
    verifiedBy: 'Sarah Johnson',
    trackingNumber: 'TRK-2024-001-ABC',
    complianceScore: 95,
    timeline: [
      {
        id: '1',
        status: 'created',
        timestamp: '2024-01-15T10:30:00Z',
        description: 'Delivery verification initiated',
        user: 'System'
      },
      {
        id: '2',
        status: 'scanned',
        timestamp: '2024-01-15T10:45:00Z',
        description: 'Barcode scanned and validated',
        user: 'Sarah Johnson'
      },
      {
        id: '3',
        status: 'weighed',
        timestamp: '2024-01-15T10:50:00Z',
        description: 'Weight verification completed',
        user: 'Sarah Johnson'
      },
      {
        id: '4',
        status: 'verified',
        timestamp: '2024-01-15T11:00:00Z',
        description: 'Delivery verified and approved',
        user: 'Sarah Johnson'
      }
    ]
  };

  const handleEdit = () => {
    console.log('Edit delivery');
  };

  const handleApprove = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Delivery approved');
    }, 1000);
  };

  const handleReject = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Delivery rejected');
    }, 1000);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status as keyof typeof statusColors]}`}>
        <Icon className="h-4 w-4" />
        {status.replace('_', ' ').toUpperCase()}
      </div>
    );
  };

  const ComplianceScore = ({ score }: { score: number }) => {
    const getColor = (score: number) => {
      if (score >= 90) return 'text-green-600';
      if (score >= 70) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">{score}%</div>
        <div className={`text-sm font-medium ${getColor(score)}`}>
          {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Attention'}
        </div>
      </div>
    );
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deliveries', href: '/deliveries' },
    { label: mockDelivery.poNumber, isActive: true }
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Download className="h-4 w-4 mr-2" />
        Export
      </button>
      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Printer className="h-4 w-4 mr-2" />
        Print
      </button>
      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </button>
      <button onClick={handleEdit} className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span>Deliveries</span>
              <span>/</span>
              <span className="text-gray-900">{mockDelivery.poNumber}</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Delivery {mockDelivery.poNumber}</h1>
            <p className="text-gray-600">Verification details for {mockDelivery.vendorName}</p>
          </div>
          {headerActions}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StatusBadge status={mockDelivery.status} />
                <div className="text-sm text-gray-600">
                  Created: {new Date(mockDelivery.createdAt).toLocaleString()}
                </div>
                {mockDelivery.verifiedAt && (
                  <div className="text-sm text-gray-600">
                    Verified: {new Date(mockDelivery.verifiedAt).toLocaleString()}
                  </div>
                )}
              </div>
              
              {mockDelivery.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleReject}
                    disabled={loading}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleApprove}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-200 bg-white rounded-t-lg">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'photos', label: 'Photos' },
            { key: 'timeline', label: 'Timeline' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Delivery Information
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Barcode</div>
                        <div className="flex items-center gap-2">
                          <Barcode className="h-4 w-4" />
                          <span className="font-mono">{mockDelivery.barcode}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Tracking Number</div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span className="font-mono">{mockDelivery.trackingNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Vendor</div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{mockDelivery.vendorName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Contact</div>
                        <div className="text-sm">{mockDelivery.vendorContact}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Delivery Address</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{mockDelivery.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Verification Details
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Weight Verification</div>
                          <div className="flex items-center justify-between">
                            <span>Expected: {mockDelivery.expectedWeight} kg</span>
                            <span className={`font-semibold ${
                              mockDelivery.weight === mockDelivery.expectedWeight 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              Actual: {mockDelivery.weight} kg
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Quantity Verification</div>
                          <div className="flex items-center justify-between">
                            <span>Expected: {mockDelivery.expectedQuantity}</span>
                            <span className={`font-semibold ${
                              mockDelivery.quantity === mockDelivery.expectedQuantity 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              Actual: {mockDelivery.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Condition</div>
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block">
                            {mockDelivery.condition}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Verified By</div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{mockDelivery.verifiedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {mockDelivery.notes && (
                      <div className="mt-6 space-y-2">
                        <div className="text-sm text-gray-600">Notes</div>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          {mockDelivery.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Compliance Score */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Compliance Score</h3>
                  </div>
                  <div className="p-6">
                    <ComplianceScore score={mockDelivery.complianceScore} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Documentation
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Delivery Photo</h4>
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setShowFullImage(mockDelivery.deliveryPhoto!)}
                    >
                      <img 
                        src={mockDelivery.deliveryPhoto} 
                        alt="Delivery" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Packaging Photo</h4>
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setShowFullImage(mockDelivery.packagingPhoto!)}
                    >
                      <img 
                        src={mockDelivery.packagingPhoto} 
                        alt="Packaging" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockDelivery.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                        {index !== mockDelivery.timeline.length - 1 && (
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{event.description}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {event.user && (
                          <p className="text-sm text-gray-600 mt-1">By {event.user}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={showFullImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetail;