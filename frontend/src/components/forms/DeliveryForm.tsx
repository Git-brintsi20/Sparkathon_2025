import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Scan, Package, Scale, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface DeliveryFormData {
  barcode: string;
  purchaseOrderId: string;
  vendorId: string;
  weight: string;
  quantity: string;
  condition: string;
  notes: string;
  deliveryPhoto: File | null;
  packagingPhoto: File | null;
}

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  loading?: boolean;
  initialData?: Partial<DeliveryFormData>;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState<DeliveryFormData>({
    barcode: '',
    purchaseOrderId: '',
    vendorId: '',
    weight: '',
    quantity: '',
    condition: 'good',
    notes: '',
    deliveryPhoto: null,
    packagingPhoto: null,
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<DeliveryFormData>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<{
    delivery?: string;
    packaging?: string;
  }>({});

  const deliveryPhotoRef = useRef<HTMLInputElement>(null);
  const packagingPhotoRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof DeliveryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (field: 'deliveryPhoto' | 'packagingPhoto', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(prev => ({
        ...prev,
        [field.replace('Photo', '')]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (field: 'deliveryPhoto' | 'packagingPhoto') => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPhotoPreview(prev => ({
      ...prev,
      [field.replace('Photo', '')]: undefined
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DeliveryFormData> = {};

    if (!formData.barcode) newErrors.barcode = 'Barcode is required';
    if (!formData.purchaseOrderId) newErrors.purchaseOrderId = 'Purchase Order ID is required';
    if (!formData.vendorId) newErrors.vendorId = 'Vendor selection is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (parseFloat(formData.weight) <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (parseInt(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, barcode: 'BC123456789' }));
      setIsScanning(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Delivery Verification</h2>
      </div>

      {/* Barcode Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Barcode/QR Code</label>
        <div className="flex gap-2">
          <Input
            value={formData.barcode}
            onChange={(e) => handleInputChange('barcode', e.target.value)}
            placeholder="Scan or enter barcode"
            className={errors.barcode ? 'border-destructive' : ''}
          />
          <Button
            type="button"
            variant="outline"
            onClick={simulateBarcodeScan}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            {isScanning ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <Scan className="h-4 w-4" />
            )}
            {isScanning ? 'Scanning...' : 'Scan'}
          </Button>
        </div>
        {errors.barcode && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.barcode}
          </p>
        )}
      </div>

      {/* Purchase Order & Vendor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Purchase Order ID</label>
          <Input
            value={formData.purchaseOrderId}
            onChange={(e) => handleInputChange('purchaseOrderId', e.target.value)}
            placeholder="PO-2024-001"
            className={errors.purchaseOrderId ? 'border-destructive' : ''}
          />
          {errors.purchaseOrderId && (
            <p className="text-sm text-destructive">{errors.purchaseOrderId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Vendor</label>
          <Select value={formData.vendorId} onValueChange={(value) => handleInputChange('vendorId', value)}>
            <SelectTrigger className={errors.vendorId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendor1">ABC Suppliers Ltd</SelectItem>
              <SelectItem value="vendor2">XYZ Manufacturing</SelectItem>
              <SelectItem value="vendor3">Global Trade Corp</SelectItem>
            </SelectContent>
          </Select>
          {errors.vendorId && (
            <p className="text-sm text-destructive">{errors.vendorId}</p>
          )}
        </div>
      </div>

      {/* Weight & Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Weight (kg)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="0.00"
            className={errors.weight ? 'border-destructive' : ''}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="1"
            className={errors.quantity ? 'border-destructive' : ''}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity}</p>
          )}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Condition</label>
        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Photo Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Photo Documentation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Photo</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              {photoPreview.delivery ? (
                <div className="relative">
                  <img 
                    src={photoPreview.delivery} 
                    alt="Delivery" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePhoto('deliveryPhoto')}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload delivery photo</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => deliveryPhotoRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={deliveryPhotoRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('deliveryPhoto', e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Packaging Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Packaging Photo</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              {photoPreview.packaging ? (
                <div className="relative">
                  <img 
                    src={photoPreview.packaging} 
                    alt="Packaging" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePhoto('packagingPhoto')}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload packaging photo</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => packagingPhotoRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={packagingPhotoRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('packagingPhoto', e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any additional observations or notes..."
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="min-w-32">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verify Delivery
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DeliveryForm;