import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, Phone, MapPin, Shield, Upload, CheckCircle2, AlertCircle, X, Globe, CreditCard } from 'lucide-react';

interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  taxId: string;
  businessType: string;
  complianceLevel: string;
  certifications: string[];
  primaryContact: string;
  secondaryContact: string;
  paymentTerms: string;
  notes: string;
  logo: File | null;
  complianceDocument: File | null;
}

interface VendorFormProps {
  onSubmit: (data: VendorFormData) => void;
  loading?: boolean;
  initialData?: Partial<VendorFormData>;
  mode?: 'create' | 'edit';
}

const VendorForm: React.FC<VendorFormProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData = {},
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    website: '',
    taxId: '',
    businessType: 'corporation',
    complianceLevel: 'standard',
    certifications: [],
    primaryContact: '',
    secondaryContact: '',
    paymentTerms: 'net30',
    notes: '',
    logo: null,
    complianceDocument: null,
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<VendorFormData>>({});
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [docPreview, setDocPreview] = useState<string | undefined>();

  const logoRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof VendorFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (field: 'logo' | 'complianceDocument', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (field === 'logo') {
        setLogoPreview(e.target?.result as string);
      } else {
        setDocPreview(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field: 'logo' | 'complianceDocument') => {
    setFormData(prev => ({ ...prev, [field]: null }));
    if (field === 'logo') {
      setLogoPreview(undefined);
    } else {
      setDocPreview(undefined);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<VendorFormData> = {};

    if (!formData.name) newErrors.name = 'Company name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
    if (!formData.primaryContact) newErrors.primaryContact = 'Primary contact is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Website validation
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleCertification = (cert: string) => {
    const current = formData.certifications;
    const updated = current.includes(cert) 
      ? current.filter(c => c !== cert)
      : [...current, cert];
    handleInputChange('certifications', updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">
          {mode === 'create' ? 'Add New Vendor' : 'Edit Vendor'}
        </h2>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ABC Suppliers Ltd"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Business Type</label>
            <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                <SelectItem value="nonprofit">Non-Profit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@company.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://company.com"
              className={errors.website ? 'border-destructive' : ''}
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tax ID *
            </label>
            <Input
              value={formData.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              placeholder="XX-XXXXXXX"
              className={errors.taxId ? 'border-destructive' : ''}
            />
            {errors.taxId && (
              <p className="text-sm text-destructive">{errors.taxId}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Street Address *</label>
          <Input
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Business Street"
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City *</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="New York"
              className={errors.city ? 'border-destructive' : ''}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State *</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="NY"
              className={errors.state ? 'border-destructive' : ''}
            />
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ZIP Code *</label>
            <Input
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="10001"
              className={errors.zipCode ? 'border-destructive' : ''}
            />
            {errors.zipCode && (
              <p className="text-sm text-destructive">{errors.zipCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Compliance Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Compliance Level</label>
            <Select value={formData.complianceLevel} onValueChange={(value) => handleInputChange('complianceLevel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Terms</label>
            <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net15">Net 15</SelectItem>
                <SelectItem value="net30">Net 30</SelectItem>
                <SelectItem value="net45">Net 45</SelectItem>
                <SelectItem value="net60">Net 60</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Certifications</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'FSC', 'HACCP', 'FDA'].map(cert => (
              <label key={cert} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.certifications.includes(cert)}
                  onChange={() => toggleCertification(cert)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{cert}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Contact *</label>
            <Input
              value={formData.primaryContact}
              onChange={(e) => handleInputChange('primaryContact', e.target.value)}
              placeholder="John Doe"
              className={errors.primaryContact ? 'border-destructive' : ''}
            />
            {errors.primaryContact && (
              <p className="text-sm text-destructive">{errors.primaryContact}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Secondary Contact</label>
            <Input
              value={formData.secondaryContact}
              onChange={(e) => handleInputChange('secondaryContact', e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Documents & Logo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              {logoPreview ? (
                <div className="relative">
                  <img 
                    src={logoPreview} 
                    alt="Company Logo" 
                    className="w-full h-24 object-contain rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile('logo')}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Building2 className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload company logo</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('logo', e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Compliance Document</label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              {docPreview ? (
                <div className="relative">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">{docPreview}</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile('complianceDocument')}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload compliance document</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => docRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={docRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('complianceDocument', e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any additional information about this vendor..."
          rows={3}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Submit Buttons */}
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
              {mode === 'create' ? 'Add Vendor' : 'Update Vendor'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;