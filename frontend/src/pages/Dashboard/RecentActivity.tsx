import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/components/lib/utils';
import { Shield, ExternalLink } from 'lucide-react';

interface Activity {
  id: string;
  type: 'delivery' | 'vendor' | 'compliance' | 'alert' | 'blockchain'; // Add blockchain type
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: {
    vendorName?: string;
    deliveryId?: string;
    amount?: number;
    blockchainHash?: string; // Add this line
    blockNumber?: number;    // Add this line
    verified?: boolean;      // Add this line
  };
}

interface RecentActivityProps {
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

// Add this helper function after the imports
const truncateHash = (hash: string): string => {
  if (hash.length <= 10) return hash;
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
       const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'New Delivery Verified',
    description: 'Delivery #DEL-2024-001 has been successfully verified',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: 'John Doe',
    status: 'success',
    metadata: {
      vendorName: 'ABC Suppliers',
      deliveryId: 'DEL-2024-001',
      amount: 15000,
      blockchainHash: '0x742d35cc6bb89dcf5f8b4b5c9b2e4b8c5d3e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      blockNumber: 18759234,
      verified: true
    }
  },
  {
    id: '2',
    type: 'blockchain',
    title: 'Blockchain Transaction Confirmed',
    description: 'Smart contract execution for vendor compliance verification',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    user: 'System',
    status: 'success',
    metadata: {
      vendorName: 'ABC Suppliers',
      blockchainHash: '0x851f46ec7cb96fdfa6e4d8a7b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      blockNumber: 18759235,
      verified: true
    }
  },
  {
    id: '3',
    type: 'vendor',
    title: 'New Vendor Registered',
    description: 'New vendor "XYZ Corp" registered in the system',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: 'Jane Smith',
    status: 'info',
    metadata: {
      vendorName: 'XYZ Corp',
      blockchainHash: '0x962a57fd8ea07gfeb7f5e9c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      blockNumber: 18759236,
      verified: true
    }
  },
  {
    id: '4',
    type: 'compliance',
    title: 'Compliance Check Failed',
    description: 'Vendor compliance check failed for missing documentation',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'Mike Johnson',
    status: 'error',
    metadata: {
      vendorName: 'DEF Industries',
      verified: false
    }
  },
  {
    id: '5',
    type: 'alert',
    title: 'Fraud Alert Triggered',
    description: 'Suspicious activity detected in delivery verification',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: 'System',
    status: 'warning',
    metadata: {
      deliveryId: 'DEL-2024-002',
      verified: false
    }
  }
];

        setActivities(mockActivities.slice(0, maxItems));
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