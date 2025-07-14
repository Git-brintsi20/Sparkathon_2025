import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeliveryForm from '../../components/forms/DeliveryForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../config/routes';
import { useDeliveries } from '../../hooks/useDeliveries';
// FIX 1: Import the Layout context hook and the specific types needed.
import { useLayout } from '../../contexts/LayoutContext';
import type { Delivery, DeliveryFormData } from '../../types/delivery';

const EditDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // FIX 2: Use the correct function name from the hook.
  const { fetchDeliveryById, updateDelivery } = useDeliveries();
  const { setLayoutData } = useLayout();

  // FIX 3: Use specific types instead of 'any' for better safety.
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to fetch the delivery data when the component mounts or ID changes.
  useEffect(() => {
    const fetchDelivery = async () => {
      if (!id) return;
      
      try {
        // Use the correctly named function.
        const deliveryData = await fetchDeliveryById(id);
        setDelivery(deliveryData);
      } catch (error) {
        console.error('Error fetching delivery:', error);
        toast.error('Failed to load delivery details.');
        navigate(ROUTES.DELIVERIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDelivery();
  }, [id, fetchDeliveryById, navigate]);

  // Effect to update the main layout's title and breadcrumbs.
  useEffect(() => {
    if (delivery) {
      setLayoutData({
        pageTitle: `Edit Delivery`,
        pageDescription: `Updating details for order #${delivery.orderId || 'N/A'}`,
        breadcrumbs: [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Deliveries', href: ROUTES.DELIVERIES },
          { label: 'Edit Delivery', isActive: true },
        ],
      });
    }

    // Cleanup function to reset layout data when the component unmounts.
    return () => setLayoutData({});
  }, [delivery, setLayoutData]);

  // FIX 4: Use the specific 'DeliveryFormData' type for the form submission.
  const handleSubmit = async (formData: DeliveryFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateDelivery(id, formData);
      toast.success('Delivery updated successfully!');
      navigate(ROUTES.DELIVERIES);
    } catch (error) {
      console.error('Error updating delivery:', error);
      toast.error('Failed to update delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.DELIVERIES);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!delivery) {
    // This view is shown if the fetch fails or returns null.
    // The main layout will still be present because this is rendered via <Outlet />.
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Delivery Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The delivery you're looking for could not be found.
        </p>
        <button
          onClick={() => navigate(ROUTES.DELIVERIES)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to All Deliveries
        </button>
      </div>
    );
  }

  return (
    // The page only returns its own content. The main <Layout> is handled elsewhere.
    <div className="max-w-3xl mx-auto">
      <div className="bg-card rounded-lg border p-6 sm:p-8">
        <DeliveryForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={delivery}
          // FIX 5: Renamed prop from 'isLoading' to 'loading' to match the form component's props.
          loading={isSubmitting}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default EditDelivery;