// frontend/src/pages/Vendors/EditVendor.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import VendorForm from '../../components/forms/VendorForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../config/routes';
import { useVendors } from '../../hooks/useVendors';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { VendorFormData, Vendor } from '@/types/vendor';

const EditVendor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchVendorById, updateVendor, selectedVendor, loading: vendorsHookLoading, error: vendorsHookError } = useVendors();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setLayoutData } = useLayout();

  useEffect(() => {
    if (id) {
      fetchVendorById(id);
    }
  }, [id, fetchVendorById]);

  useEffect(() => {
    const breadcrumbs = [
      { label: 'Dashboard', href: '/' },
      { label: 'Vendors', href: ROUTES.VENDORS },
      { label: selectedVendor?.name ? `Edit ${selectedVendor.name}` : 'Edit Vendor', isActive: true }
    ];

    const headerActions = (
      <Button variant="outline" onClick={() => navigate(ROUTES.VENDORS)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vendors
      </Button>
    );

    setLayoutData({
      pageTitle: selectedVendor?.name ? `Edit Vendor: ${selectedVendor.name}` : "Edit Vendor",
      pageDescription: "Update vendor information",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    return () => setLayoutData({});
  }, [setLayoutData, selectedVendor, navigate]);

  const handleSubmit = async (vendorData: VendorFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateVendor(id, vendorData);
      toast.success('Vendor updated successfully');
      navigate(ROUTES.VENDORS);
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error('Failed to update vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (vendorsHookLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (vendorsHookError || !selectedVendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {vendorsHookError || "The vendor you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate(ROUTES.VENDORS)}>
            Back to Vendors
          </Button>
        </div>
      </div>
    );
  }

  const initialFormData: Partial<VendorFormData> = {
    ...selectedVendor,
    documents: undefined,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-6">
          <VendorForm
            mode="edit"
            initialData={initialFormData}
            onSubmit={handleSubmit}
            // CORRECTED: Changed `isLoading` to `loading` to match the prop definition
            loading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditVendor;