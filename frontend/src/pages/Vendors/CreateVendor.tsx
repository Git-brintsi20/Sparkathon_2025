import React, { useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import VendorForm from '../../components/forms/VendorForm';
import { ROUTES } from '../../config/routes';
import { useVendors } from '../../hooks/useVendors';
import { useLayout } from '@/contexts/LayoutContext'; // Import useLayout
import { Button } from '@/components/ui/button'; // Import Button for headerActions
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const CreateVendor: React.FC = () => {
  const navigate = useNavigate();
  const { createVendor } = useVendors();
  const { setLayoutData } = useLayout(); // Use the layout hook

  const handleSubmit = async (vendorData: any) => {
    try {
      await createVendor(vendorData);
      toast.success('Vendor created successfully');
      navigate(ROUTES.VENDORS);
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error('Failed to create vendor');
    }
  };

  // Define breadcrumbs and header actions for the layout context
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Vendors', href: ROUTES.VENDORS },
    { label: 'Create New', isActive: true }
  ];

  const headerActions = (
    <Button variant="outline" onClick={() => navigate(ROUTES.VENDORS)}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Vendors
    </Button>
  );

  // Set layout data when the component mounts
  useEffect(() => {
    setLayoutData({
      pageTitle: "Create New Vendor",
      pageDescription: "Add a new vendor to the system",
      breadcrumbs: breadcrumbs,
      headerActions: headerActions
    });

    // Clean up layout data when the component unmounts
    return () => setLayoutData({});
  }, [setLayoutData, navigate]); // Added navigate to dependencies for headerActions

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Removed the mb-8 div as page title/description are now handled by Layout */}
        <div className="bg-card rounded-lg border p-6">
          <VendorForm
            mode="create" // Assuming VendorForm expects a 'mode' prop
            onSubmit={handleSubmit}
            // Removed onCancel and isLoading props as they are not defined in VendorFormProps
            // The navigation back is handled by the headerActions button.
            // The loading state is typically managed internally by VendorForm or its onSubmit handler.
          />
        </div>
      </div>
    </div>
  );
};

export default CreateVendor;
