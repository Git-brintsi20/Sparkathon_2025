import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/components/lib/utils';
import { Shield, ExternalLink } from 'lucide-react';
import apiService from '@/services/api';

const truncateHash = (hash: string): string => {
  if (hash.length <= 10) return hash;
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

interface Activity {
  id: string;
  type: 'delivery' | 'vendor' | 'compliance' | 'alert' | 'blockchain';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: {
    vendorName?: string;
    deliveryId?: string;
    amount?: number;
    blockchainHash?: string;
    blockNumber?: number;
    verified?: boolean;
  };
}

interface RecentActivityProps {
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  className,
  maxItems = 10,
  showHeader = true
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await apiService.get<{
          recentDeliveries: any[];
          recentComplianceLogs: any[];
          overview: any;
        }>('/analytics/dashboard');

        const items: Activity[] = [];

        // Map recent deliveries
        for (const d of (res.data?.recentDeliveries || [])) {
          items.push({
            id: d._id,
            type: 'delivery',
            title: `Delivery ${d.trackingNumber || d._id.slice(-6)}`,
            description: `Status: ${d.status}${d.vendor?.name ? ` — ${d.vendor.name}` : ''}`,
            timestamp: d.createdAt,
            user: 'System',
            status: d.fraudFlag ? 'error' : d.status === 'delivered' || d.status === 'verified' ? 'success' : 'info',
            metadata: { deliveryId: d._id, vendorName: d.vendor?.name },
          });
        }

        // Map recent compliance logs
        for (const l of (res.data?.recentComplianceLogs || [])) {
          items.push({
            id: l._id,
            type: 'compliance',
            title: `Compliance ${l.type || 'Log'}`,
            description: l.description || l.notes || `Score: ${l.score ?? '—'}`,
            timestamp: l.createdAt,
            user: 'System',
            status: l.type === 'violation' ? 'warning' : l.type === 'remediation' ? 'success' : 'info',
          });
        }

        // Sort by date descending and take maxItems
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(items.slice(0, maxItems));
        setError(null);
      } catch (err) {
        setError('Failed to load recent activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [maxItems]);

 const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'delivery':
      return '📦';
    case 'vendor':
      return '🏢';
    case 'compliance':
      return '📋';
    case 'alert':
      return '⚠️';
    case 'blockchain':
      return '🔗';
    default:
      return '📄';
  }
};
  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner variant="default" size="md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('w-full', className)}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity, index) => (
<div
  key={activity.id}
  className={cn(
    'flex items-start space-x-3 p-4 transition-colors hover:bg-gray-50',
    index !== activities.length - 1 && 'border-b border-gray-100'
  )}
>
  <div className="flex-shrink-0 mt-1">
    <div className={cn(
      'w-8 h-8 rounded-full flex items-center justify-center text-sm',
      getStatusColor(activity.status)
    )}>
      {getActivityIcon(activity.type)}
    </div>
  </div>
  
  <div className="flex-grow min-w-0">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-gray-900 truncate">
        {activity.title}
      </h4>
      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
        {formatTimeAgo(activity.timestamp)}
      </span>
    </div>
    
    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
      {activity.description}
    </p>
    
    {/* Blockchain verification badge */}
    {activity.metadata?.verified && activity.metadata?.blockchainHash && (
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
          <Shield className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-600 font-medium">
            Blockchain Verified
          </span>
        </div>
        <button
          onClick={() => window.open(`https://etherscan.io/tx/${activity.metadata?.blockchainHash}`, '_blank')}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>{truncateHash(activity.metadata.blockchainHash)}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    )}
    
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs text-gray-500">
        by {activity.user}
      </span>
      
      <div className="flex items-center gap-2">
        {activity.metadata?.blockNumber && (
          <span className="text-xs text-gray-500">
            Block #{activity.metadata.blockNumber.toLocaleString()}
          </span>
        )}
        {activity.metadata?.amount && (
          <span className="text-xs font-medium text-gray-700">
            ${activity.metadata.amount.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  </div>
</div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <p>No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};