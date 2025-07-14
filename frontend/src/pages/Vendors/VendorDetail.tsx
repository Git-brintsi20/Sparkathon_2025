import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/components/lib/utils';

export interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    complianceScore: number;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    category: string;
    totalOrders: number;
    completedOrders: number;
    rating: number;
    joinDate: string;
    lastActivity: string;
    riskLevel: 'low' | 'medium' | 'high';
    certifications: string[];
  };
  onView?: (vendorId: string) => void;
  onEdit?: (vendorId: string) => void;
  onContact?: (vendorId: string) => void;
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'suspended':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'high':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getComplianceColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'inactive':
      return <XCircle className="h-4 w-4 text-gray-600" />;
    case 'pending':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'suspended':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <XCircle className="h-4 w-4 text-gray-600" />;
  }
};

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onView,
  onEdit,
  onContact,
  className,
}) => {
  const completionRate = vendor.totalOrders > 0 
    ? (vendor.completedOrders / vendor.totalOrders) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn('group', className)}
    >
      <Card className="relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        {/* Risk Level Indicator */}
        <div className={cn(
          'absolute top-0 right-0 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity',
          vendor.riskLevel === 'high' ? 'bg-red-500' : 
          vendor.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        )} />

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {vendor.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getStatusColor(vendor.status)}>
                  {getStatusIcon(vendor.status)}
                  <span className="ml-1 capitalize">{vendor.status}</span>
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {vendor.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className={cn('text-2xl font-bold', getComplianceColor(vendor.complianceScore))}>
                  {vendor.complianceScore}%
                </div>
                <div className="text-xs text-muted-foreground">Compliance</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{vendor.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{vendor.address}</span>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Orders</span>
              </div>
              <div className="text-lg font-semibold">{vendor.completedOrders}/{vendor.totalOrders}</div>
              <div className="text-xs text-muted-foreground">
                {completionRate.toFixed(1)}% completion
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Risk Level</span>
              </div>
              <div className={cn('text-lg font-semibold capitalize', getRiskColor(vendor.riskLevel))}>
                {vendor.riskLevel}
              </div>
              <div className="text-xs text-muted-foreground">
                Rating: {vendor.rating}/5
              </div>
            </div>
          </div>

          {/* Certifications */}
          {vendor.certifications.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Certifications</div>
              <div className="flex flex-wrap gap-1">
                {vendor.certifications.slice(0, 3).map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {vendor.certifications.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{vendor.certifications.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Activity Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Joined: {new Date(vendor.joinDate).toLocaleDateString()}</div>
            <div>Last activity: {new Date(vendor.lastActivity).toLocaleDateString()}</div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t bg-muted/30">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(vendor.id)}
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(vendor.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onContact?.(vendor.id)}
                className="bg-primary hover:bg-primary/90"
              >
                <Mail className="h-4 w-4 mr-1" />
                Contact
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VendorCard;