import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/components/lib/utils';
import apiService from '@/services/api';

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

const mapNotificationType = (type: string): Alert['type'] => {
  switch (type) {
    case 'fraud_alert': return 'fraud';
    case 'compliance_alert': return 'compliance';
    case 'delivery_status': return 'delivery';
    case 'system': return 'system';
    default: return 'system';
  }
};

const mapSeverity = (severity: string): Alert['priority'] => {
  switch (severity) {
    case 'critical':
    case 'high': return 'high';
    case 'medium': return 'medium';
    default: return 'low';
  }
};

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
        const res = await apiService.get<{ notifications: any[]; total: number }>('/notifications', { limit: maxItems });
        const mapped: Alert[] = (res.data?.notifications || []).map((n: any) => ({
          id: n._id,
          type: mapNotificationType(n.type),
          priority: mapSeverity(n.severity),
          title: n.title,
          message: n.message,
          timestamp: n.createdAt,
          isRead: n.isRead,
          isDismissed: false,
          actionRequired: n.severity === 'high' || n.severity === 'critical',
          metadata: {
            vendorId: n.metadata?.vendorId,
            deliveryId: n.metadata?.deliveryId,
          },
        }));
        setAlerts(mapped);
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