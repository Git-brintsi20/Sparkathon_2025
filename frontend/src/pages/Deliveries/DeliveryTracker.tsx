import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Hash, CheckCircle2 } from 'lucide-react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Package,
  Navigation,
  Calendar
} from 'lucide-react';

interface DeliveryStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  location?: string;
   blockchain?: BlockchainEvent;
}
interface BlockchainEvent {
  id: string;
  type: 'blockchain_commit' | 'photo_hash' | 'verification_complete';
  blockNumber: string;
  transactionHash: string;
  timestamp: string;
  gasUsed: string;
  confirmations: number;
  description: string;
}

interface DeliveryTrackerProps {
  deliveryId: string;
  vendorName: string;
  estimatedDelivery: string;
  currentLocation: string;
  steps: DeliveryStep[];
  onRefresh?: () => void;
}

const blockchainSteps: DeliveryStep[] = [
  {
    id: 'blockchain-1',
    title: 'Initial Blockchain Commit',
    description: 'Delivery data committed to blockchain',
    timestamp: '2024-01-15T10:35:00Z',
    status: 'completed',
    blockchain: {
      id: 'bc-1',
      type: 'blockchain_commit',
      blockNumber: '18,742,385',
      transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      timestamp: '2024-01-15T10:35:00Z',
      gasUsed: '42,150',
      confirmations: 28,
      description: 'Initial delivery record'
    }
  },
  {
    id: 'blockchain-2',
    title: 'Photo Hashes Stored',
    description: 'Photo hashes securely stored on blockchain',
    timestamp: '2024-01-15T10:55:00Z',
    status: 'completed',
    blockchain: {
      id: 'bc-2',
      type: 'photo_hash',
      blockNumber: '18,742,389',
      transactionHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      timestamp: '2024-01-15T10:55:00Z',
      gasUsed: '28,750',
      confirmations: 26,
      description: 'Photo integrity verified'
    }
  }
];
const BlockchainBadge = ({ event }: { event: BlockchainEvent }) => (
  <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
    <div className="flex items-center gap-2 mb-1">
      <Shield className="w-3 h-3 text-blue-600" />
      <span className="text-xs font-medium text-blue-800">Blockchain Verified</span>
      <CheckCircle2 className="w-3 h-3 text-green-600" />
    </div>
    <div className="text-xs text-blue-600 space-y-1">
      <div>Block: {event.blockNumber}</div>
      <div>Gas: {event.gasUsed}</div>
      <div>Confirmations: {event.confirmations}</div>
    </div>
  </div>
);

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  deliveryId,
  vendorName,
  estimatedDelivery,
  currentLocation,
  steps,
  onRefresh
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date().toLocaleTimeString());
        onRefresh?.();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, onRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const currentStep = steps.find(step => step.status === 'current');
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              ID: {deliveryId}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="text-xs"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Vendor:</span>
            <span className="text-sm">{vendorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">ETA:</span>
            <span className="text-sm">{estimatedDelivery}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Location:</span>
            <span className="text-sm">{currentLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Progress:</span>
            <span className="text-sm">{completedSteps}/{totalSteps} steps</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Delivery Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Current Status */}
        {currentStep && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-blue-900">Current Status</span>
            </div>
            <p className="text-sm text-blue-800 mb-1">{currentStep.title}</p>
            <p className="text-xs text-blue-600">{currentStep.description}</p>
            {currentStep.location && (
              <p className="text-xs text-blue-600 mt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                {currentStep.location}
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-4">
  
          <h3 className="font-medium text-gray-900 mb-4">Delivery Timeline</h3>
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-2 ${
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{step.title}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(step.status)}`}
                  >
                    {step.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                       {step.blockchain && (
        <BlockchainBadge event={step.blockchain} />
      )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.timestamp}
                  </span>
                  {step.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {step.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-refresh toggle */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="text-xs"
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracker;