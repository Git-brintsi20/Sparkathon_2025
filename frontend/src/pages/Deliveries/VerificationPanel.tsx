import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  Check, 
  X, 
  AlertTriangle, 
  FileText, 
  Image as ImageIcon, 
  Upload,
  Eye,
  Download,
  Clock,
  User
} from 'lucide-react';

interface VerificationItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  required: boolean;
  imageUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface VerificationPanelProps {
  deliveryId: string;
  vendorName: string;
  items: VerificationItem[];
  onVerify: (itemId: string, status: 'verified' | 'rejected', notes?: string) => void;
  onUploadImage: (itemId: string, file: File) => void;
  currentUser: string;
  canApprove: boolean;
}

const VerificationPanel: React.FC<VerificationPanelProps> = ({
  deliveryId,
  vendorName,
  items,
  onVerify,
  onUploadImage,
  currentUser,
  canApprove
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(itemId, file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerification = (itemId: string, status: 'verified' | 'rejected') => {
    onVerify(itemId, status, notes);
    setNotes('');
    setSelectedItem(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const pendingItems = items.filter(item => item.status === 'pending');
  const verifiedItems = items.filter(item => item.status === 'verified');
  const rejectedItems = items.filter(item => item.status === 'rejected');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Verification Panel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">ID: {deliveryId}</Badge>
            <Badge variant="outline">{vendorName}</Badge>
          </div>
        </div>
        
        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Pending</p>
              <p className="text-lg font-bold text-yellow-600">{pendingItems.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Verified</p>
              <p className="text-lg font-bold text-green-600">{verifiedItems.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <X className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium">Rejected</p>
              <p className="text-lg font-bold text-red-600">{rejectedItems.length}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.required && (
                        <Badge variant="outline" className="bg-red-50 text-red-600">
                          Required
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    {/* Verification Details */}
                    {item.status !== 'pending' && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {item.verifiedBy && (
                          <p className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Verified by: {item.verifiedBy}
                          </p>
                        )}
                        {item.verifiedAt && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.verifiedAt}
                          </p>
                        )}
                        {item.rejectionReason && (
                          <p className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            Reason: {item.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Image Display */}
                    {item.imageUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setImagePreview(item.imageUrl!)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    )}
                    
                    {/* Upload Button */}
                    {item.status === 'pending' && (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(item.id, e)}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <span className="flex items-center gap-1">
                            <Upload className="w-4 h-4" />
                            Upload
                          </span>
                        </Button>
                      </label>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {item.status === 'pending' && canApprove && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item.id)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      Review
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleVerification(item.id, 'verified')}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedItem(item.id)}
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Modal */}
        {selectedItem && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Review Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add notes or rejection reason..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => handleVerification(selectedItem, 'verified')}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerification(selectedItem, 'rejected')}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(null);
                      setNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview Modal */}
        {imagePreview && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Image Preview</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImagePreview(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={imagePreview}
                alt="Verification"
                className="w-full max-w-md mx-auto rounded-lg border"
              />
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = imagePreview;
                    link.download = 'verification-image.jpg';
                    link.click();
                  }}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationPanel;