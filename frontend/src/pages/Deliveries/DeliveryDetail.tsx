import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  Shield,
  Link,
  Hash,
  Package,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit,
  Camera,
  Scale,
  Barcode,
  User,
  MapPin,
  Truck,
  Download,
  Printer,
  Share2,
  ExternalLink,
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiService from '@/services/api';

// Types matching the backend API response
interface DeliveryItem {
  name: string;
  quantity: number;
  expectedQuantity: number;
  price: number;
  verified: boolean;
  condition: 'good' | 'damaged' | 'expired';
  notes?: string;
}

interface DeliveryVerification {
  verifiedBy?: string;
  verifiedAt?: string;
  qrCodeScanned?: boolean;
  photosUploaded?: boolean;
  quantityVerified?: boolean;
  qualityVerified?: boolean;
  discrepancies?: string[];
  verificationScore?: number;
}

interface Delivery {
  _id: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'verified' | 'rejected' | 'flagged';
  verificationStatus: 'pending' | 'verified' | 'failed';
  expectedDate?: string;
  deliveryDate?: string;
  items: DeliveryItem[];
  deliveryLocation?: string;
  trackingNumber?: string;
  notes?: string;
  totalAmount?: number;
  fraudFlag?: boolean;
  photos?: string[];
  verification?: DeliveryVerification;
  blockchain?: {
    transactionHash?: string;
    blockNumber?: string;
    status?: string;
    confirmations?: number;
    gasUsed?: string;
    timestamp?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  verified: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  flagged: 'bg-orange-100 text-orange-800 border-orange-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  verified: CheckCircle,
  rejected: AlertTriangle,
  in_transit: Package,
  delivered: CheckCircle2,
  flagged: AlertTriangle,
  failed: AlertTriangle,
};

const conditionColors: Record<string, string> = {
  good: 'bg-green-100 text-green-800',
  damaged: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
};

const BlockchainStatus = ({ blockchain }: { blockchain: Delivery['blockchain'] }) => {
  if (!blockchain) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(blockchain.status)}`}>
      {getStatusIcon(blockchain.status)}
      {(blockchain.status || 'unknown').toUpperCase()}
      {blockchain.status === 'confirmed' && blockchain.confirmations && (
        <span className="text-xs">({blockchain.confirmations} confirmations)</span>
      )}
    </div>
  );
};

const DeliveryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setLayoutData } = useLayout();

  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'timeline'>('overview');
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState<string | null>(null);

  const fetchDelivery = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get<{ delivery: Delivery }>(`/deliveries/${id}`);
      if (response.success && response.data) {
        setDelivery(response.data.delivery);
      } else {
        setError('Failed to load delivery details.');
      }
    } catch (err: any) {
      setError(err?.error?.message || 'Failed to load delivery details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  const handleApprove = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      await apiService.post(`/deliveries/${id}/verify`, { status: 'verified', notes: '' });
      toast.success('Delivery approved successfully');
      await fetchDelivery();
    } catch (err: any) {
      toast.error(err?.error?.message || 'Failed to approve delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      await apiService.post(`/deliveries/${id}/verify`, { status: 'rejected', notes: '' });
      toast.success('Delivery rejected');
      await fetchDelivery();
    } catch (err: any) {
      toast.error(err?.error?.message || 'Failed to reject delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/deliveries/${id}/edit`);
  };

  // Set layout data
  useEffect(() => {
    if (delivery) {
      setLayoutData({
        pageTitle: `Delivery ${delivery.orderId || delivery._id}`,
        pageDescription: `Verification details for ${delivery.vendorName}`,
        breadcrumbs: [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Deliveries', href: '/deliveries' },
          { label: delivery.orderId || delivery._id, isActive: true }
        ],
        headerActions: (
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
        )
      });
    }

    return () => setLayoutData({});
  }, [setLayoutData, delivery, actionLoading]);

  const StatusBadge = ({ status }: { status: string }) => {
    const Icon = statusIcons[status] || Clock;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || statusColors.pending}`}>
        <Icon className="h-4 w-4" />
        {status.replace('_', ' ').toUpperCase()}
      </div>
    );
  };

  const ComplianceScore = ({ score }: { score: number }) => {
    const getColor = (s: number) => {
      if (s >= 90) return 'text-green-600';
      if (s >= 70) return 'text-yellow-600';
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

  // Build timeline from real delivery data
  const buildTimeline = (d: Delivery) => {
    const events: Array<{ id: string; status: string; timestamp: string; description: string; user?: string }> = [];

    events.push({
      id: '1',
      status: 'created',
      timestamp: d.createdAt,
      description: 'Delivery record created',
      user: 'System'
    });

    if (d.expectedDate) {
      events.push({
        id: '2',
        status: 'expected',
        timestamp: d.expectedDate,
        description: 'Expected delivery date',
      });
    }

    if (d.deliveryDate) {
      events.push({
        id: '3',
        status: 'delivered',
        timestamp: d.deliveryDate,
        description: 'Delivery received',
      });
    }

    if (d.verification?.verifiedAt) {
      events.push({
        id: '4',
        status: d.status === 'rejected' ? 'rejected' : 'verified',
        timestamp: d.verification.verifiedAt,
        description: d.status === 'rejected' ? 'Delivery rejected' : 'Delivery verified and approved',
        user: d.verification.verifiedBy,
      });
    }

    if (d.updatedAt && d.updatedAt !== d.createdAt) {
      events.push({
        id: '5',
        status: 'updated',
        timestamp: d.updatedAt,
        description: 'Record last updated',
      });
    }

    // Sort by timestamp
    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return events;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error || !delivery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Failed to load delivery</h2>
          <p className="text-gray-600">{error || 'Delivery not found.'}</p>
          <button
            onClick={() => fetchDelivery()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const timeline = buildTimeline(delivery);
  const totalExpectedQty = delivery.items.reduce((sum, item) => sum + item.expectedQuantity, 0);
  const totalActualQty = delivery.items.reduce((sum, item) => sum + item.quantity, 0);
  const verificationScore = delivery.verification?.verificationScore;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Fraud Flag Warning */}
        {delivery.fraudFlag && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Fraud Flag Detected</p>
              <p className="text-sm text-red-600">This delivery has been flagged for potential fraud. Please review carefully.</p>
            </div>
          </motion.div>
        )}

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
                <StatusBadge status={delivery.status} />
                <div className="text-sm text-gray-600">
                  Created: {new Date(delivery.createdAt).toLocaleString()}
                </div>
                {delivery.verification?.verifiedAt && (
                  <div className="text-sm text-gray-600">
                    Verified: {new Date(delivery.verification.verifiedAt).toLocaleString()}
                  </div>
                )}
              </div>

              {(delivery.status === 'pending' || delivery.status === 'delivered') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Blockchain Verification */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Blockchain Verification
            </h3>
          </div>
          {delivery.blockchain?.transactionHash ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verification Status</span>
                <BlockchainStatus blockchain={delivery.blockchain} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {delivery.blockchain.blockNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Block Number</span>
                      <span className="font-mono text-sm">{delivery.blockchain.blockNumber}</span>
                    </div>
                  )}
                  {delivery.blockchain.gasUsed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gas Used</span>
                      <span className="font-mono text-sm">{delivery.blockchain.gasUsed}</span>
                    </div>
                  )}
                  {delivery.blockchain.confirmations != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confirmations</span>
                      <span className="font-mono text-sm">{delivery.blockchain.confirmations}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Transaction Hash</span>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-xs break-all">{delivery.blockchain.transactionHash}</span>
                    </div>
                  </div>
                </div>
              </div>

              {delivery.blockchain.timestamp && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    On-Chain Record
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Recorded At: </span>
                      <span className="font-mono">{new Date(delivery.blockchain.timestamp).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-green-700">Status: </span>
                      <span className="font-mono">{delivery.blockchain.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-3 text-gray-500">
                <Info className="h-5 w-5" />
                <span>Not yet recorded on blockchain</span>
              </div>
            </div>
          )}
        </div>

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
                        <div className="text-sm text-gray-600">Order ID</div>
                        <div className="flex items-center gap-2">
                          <Barcode className="h-4 w-4" />
                          <span className="font-mono">{delivery.orderId || '—'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Tracking Number</div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span className="font-mono">{delivery.trackingNumber || '—'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Vendor</div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{delivery.vendorName}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="text-sm font-semibold">
                          {delivery.totalAmount != null ? `$${delivery.totalAmount.toLocaleString()}` : '—'}
                        </div>
                      </div>
                    </div>

                    {delivery.deliveryLocation && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Delivery Location</div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{delivery.deliveryLocation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                {delivery.items.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Items ({delivery.items.length})
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left px-6 py-3 text-gray-600 font-medium">Item</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Expected Qty</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Actual Qty</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Price</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Condition</th>
                            <th className="text-center px-4 py-3 text-gray-600 font-medium">Verified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {delivery.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                              <td className="px-6 py-3 font-medium">{item.name}</td>
                              <td className="text-center px-4 py-3">{item.expectedQuantity}</td>
                              <td className={`text-center px-4 py-3 font-semibold ${item.quantity === item.expectedQuantity ? 'text-green-600' : 'text-yellow-600'}`}>
                                {item.quantity}
                              </td>
                              <td className="text-center px-4 py-3">${item.price.toLocaleString()}</td>
                              <td className="text-center px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[item.condition] || 'bg-gray-100 text-gray-800'}`}>
                                  {item.condition}
                                </span>
                              </td>
                              <td className="text-center px-4 py-3">
                                {item.verified ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-500 mx-auto" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

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
                          <div className="text-sm text-gray-600">Quantity Verification</div>
                          <div className="flex items-center justify-between">
                            <span>Expected: {totalExpectedQty}</span>
                            <span className={`font-semibold ${totalActualQty === totalExpectedQty ? 'text-green-600' : 'text-yellow-600'}`}>
                              Actual: {totalActualQty}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Verification Status</div>
                          <StatusBadge status={delivery.verificationStatus} />
                        </div>

                        {delivery.verification && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Verification Checks</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                {delivery.verification.qrCodeScanned ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-400" />}
                                <span>QR Code Scanned</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {delivery.verification.photosUploaded ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-400" />}
                                <span>Photos Uploaded</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {delivery.verification.quantityVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-400" />}
                                <span>Quantity Verified</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {delivery.verification.qualityVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-400" />}
                                <span>Quality Verified</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {delivery.verification?.verifiedBy && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Verified By</div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{delivery.verification.verifiedBy}</span>
                            </div>
                          </div>
                        )}

                        {delivery.verification?.discrepancies && delivery.verification.discrepancies.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">Discrepancies</div>
                            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                              {delivery.verification.discrepancies.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {delivery.notes && (
                      <div className="mt-6 space-y-2">
                        <div className="text-sm text-gray-600">Notes</div>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          {delivery.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {verificationScore != null && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold">Verification Score</h3>
                    </div>
                    <div className="p-6">
                      <ComplianceScore score={verificationScore} />
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Quick Info</h3>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    {delivery.expectedDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Expected Date</span>
                        <span>{new Date(delivery.expectedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {delivery.deliveryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Delivery Date</span>
                        <span>{new Date(delivery.deliveryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Items Count</span>
                      <span>{delivery.items.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span>{new Date(delivery.updatedAt).toLocaleDateString()}</span>
                    </div>
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
                {delivery.photos && delivery.photos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {delivery.photos.map((photo, index) => (
                      <div key={index} className="space-y-3">
                        <h4 className="font-medium">Photo {index + 1}</h4>
                        <div
                          className="relative cursor-pointer group"
                          onClick={() => setShowFullImage(photo)}
                        >
                          <img
                            src={photo}
                            alt={`Delivery photo ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <ExternalLink className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No photos uploaded for this delivery</p>
                  </div>
                )}
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
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                        {index !== timeline.length - 1 && (
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
