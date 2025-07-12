import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/components/lib/utils';

interface Alert {
  id: string;
  type: 'fraud' | 'compliance' | 'system' | 'delivery' | 'vendor';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isDismissed: boolean;
  actionRequired: boolean;
  metadata?: {
    vendorId?: string;
    deliveryId?: string;
    complianceScore?: number;
    affectedCount?: number;
  };
}

interface AlertsPanelProps {
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
  onAlertClick?: (alert: Alert) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  className,
  maxItems = 8,
  showHeader = true,
  onAlertClick
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockAlerts: Alert[] = [
          {
            id: '1',
            type: 'fraud',
            priority: 'high',
            title: 'Suspicious Activity Detected',
            message: 'Multiple failed verification attempts detected for vendor VEN-2024-001',
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            isRead: false,
            isDismissed: false,
            actionRequired: true,
            metadata: {
              vendorId: 'VEN-2024-001',
              affectedCount: 3
            }
          },
          {
            id: '2',
            type: 'compliance',
            priority: 'high',
            title: 'Low Compliance Score',
            message: 'Vendor ABC Corp compliance score dropped below 70%',
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false,
            isDismissed: false,
            actionRequired: true,
            metadata: {
              vendorId: 'VEN-2024-002',
              complianceScore: 68
            }
          },
          {
            id: '3',
            type: 'delivery',
            priority: 'medium',
            title: 'Delivery Verification Pending',
            message: 'Delivery DEL-2024-005 has been pending verification for 24 hours',
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            isRead: true,
            isDismissed: false,
            actionRequired: true,
            metadata: {
              deliveryId: 'DEL-2024-005'
            }
          },
          {
            id: '4',
            type: 'system',
            priority: 'low',
            title: 'System Maintenance Scheduled',
            message: 'Scheduled maintenance window: Tonight 2:00 AM - 4:00 AM',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            isRead: true,
            isDismissed: false,
            actionRequired: false
          },
          {
            id: '5',
            type: 'vendor',
            priority: 'medium',
            title: 'New Vendor Registration',
            message: 'Vendor XYZ Ltd requires approval for registration',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            isRead: false,
            isDismissed: false,
            actionRequired: true,
            metadata: {
              vendorId: 'VEN-2024-003'
            }
          }
        ];

        setAlerts(mockAlerts.slice(0, maxItems));
        setError(null);
      } catch (err) {
        setError('Failed to load alerts');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [maxItems]);

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'fraud':
        return '🚨';
      case 'compliance':
        return '📊';
      case 'system':
        return '⚙️';
      case 'delivery':
        return '📦';
      case 'vendor':
        return '🏢';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleDismissAlert = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleAlertClick = (alert: Alert) => {
    handleMarkAsRead(alert.id);
    onAlertClick?.(alert);
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
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
            <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
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

  const priorityAlerts = alerts.filter(alert => alert.priority === 'high');
  const otherAlerts = alerts.filter(alert => alert.priority !== 'high');

  return (
    <Card className={cn('w-full', className)}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>System Alerts</span>
            {priorityAlerts.length > 0 && (
              <span className="text-sm font-normal text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {priorityAlerts.length} urgent
              </span>
            )}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="space-y-0">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={cn(
                'flex items-start space-x-3 p-4 transition-all duration-200 cursor-pointer',
                'hover:bg-gray-50 border-l-4',
                !alert.isRead && 'bg-blue-50/30',
                alert.priority === 'high' && 'border-l-red-500',
                alert.priority === 'medium' && 'border-l-yellow-500',
                alert.priority === 'low' && 'border-l-blue-500',
                index !== alerts.length - 1 && 'border-b border-gray-100'
              )}
              onClick={() => handleAlertClick(alert)}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border">
                  {getAlertIcon(alert.type)}
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className={cn(
                      'text-sm font-medium truncate',
                      !alert.isRead ? 'text-gray-900' : 'text-gray-700'
                    )}>
                      {alert.title}
                    </h4>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full border',
                      getPriorityColor(alert.priority)
                    )}>
                      {alert.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                    <button
                      onClick={(e) => handleDismissAlert(alert.id, e)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Dismiss alert"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <p className={cn(
                  'text-sm mt-1 line-clamp-2',
                  !alert.isRead ? 'text-gray-700' : 'text-gray-600'
                )}>
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {alert.actionRequired && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Action Required
                      </span>
                    )}
                    {!alert.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  
                  {alert.metadata?.complianceScore && (
                    <span className="text-xs font-medium text-gray-700">
                      Score: {alert.metadata.complianceScore}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm">No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};