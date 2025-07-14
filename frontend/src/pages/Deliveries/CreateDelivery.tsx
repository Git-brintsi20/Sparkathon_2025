import React, { useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DeliveryForm from '../../components/forms/DeliveryForm';
import { ROUTES } from '../../config/routes';
import { useDeliveries } from '../../hooks/useDeliveries';
import { useLayout } from '@/contexts/LayoutContext'; // Import useLayout
import { Button } from '@/components/ui/button'; // Import Button for headerActions
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const CreateDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { createDelivery } = useDeliveries();
  const { setLayoutData } = useLayout(); // Use the layout hook

  const handleSubmit = async (deliveryData: any) => {
    try {
      await createDelivery(deliveryData);
      toast.success('Delivery created successfully');
      navigate(ROUTES.DELIVERIES);
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast.error('Failed to create delivery');
    }
  };

  // Define breadcrumbs and header actions for the layout context
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Deliveries', href: ROUTES.DELIVERIES },
    { label: 'Create New', isActive: true }
  ];

  const headerActions = (
    <Button variant="outline" onClick={() => navigate(ROUTES.DELIVERIES)}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Deliveries
    </Button>
  );

  // Set layout data when the component mounts
  useEffect(() => {
    setLayoutData({
      pageTitle: "Create New Delivery",
      pageDescription: "Record a new delivery in the system",
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
          <DeliveryForm
            mode="create" // Assuming DeliveryForm expects a 'mode' prop
            onSubmit={handleSubmit}
            // Removed onCancel and isLoading props as they are not defined in DeliveryFormProps
            // The navigation back is handled by the headerActions button.
            // The loading state is typically managed internally by DeliveryForm or its onSubmit handler.
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;
