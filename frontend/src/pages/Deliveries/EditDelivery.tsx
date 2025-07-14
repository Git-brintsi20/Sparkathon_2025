import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeliveryForm from '../../components/forms/DeliveryForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../config/routes';
import { useDeliveries } from '../../hooks/useDeliveries';
import { useLayout } from '../../contexts/LayoutContext';
import type { Delivery, DeliveryFormData } from '../../types/delivery';

const EditDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchDeliveryById, updateDelivery } = useDeliveries();
  const { setLayoutData } = useLayout();

  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to convert Delivery to DeliveryFormData
  const convertDeliveryToFormData = (delivery: Delivery): Partial<DeliveryFormData> => {
    // Map the different status values
    const mapStatus = (status: Delivery['status']): DeliveryFormData['status'] => {
      switch (status) {
        case 'verified':
          return 'delivered'; // Map verified to delivered since form doesn't have verified
        case 'rejected':
          return 'cancelled'; // Map rejected to cancelled
        case 'pending':
          return 'pending';
        case 'in_transit':
          return 'in_transit';
        case 'delivered':
          return 'delivered';
        default:
          return 'pending';
      }
    };

    // Extract the first item's data for form fields (if available)
    const firstItem = delivery.items?.[0];
    const totalQuantity = delivery.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalWeight = delivery.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    return {
      // Try to extract barcode from notes or generate a placeholder
      barcode: delivery.notes?.match(/barcode:\s*(\w+)/i)?.[1] || `BC${delivery.id.substring(0, 8)}`,
      purchaseOrderId: delivery.orderId,
      vendorId: delivery.vendorId,
      weight: totalWeight.toString(), // Convert to string as form expects
      quantity: totalQuantity.toString(), // Convert to string as form expects
      condition: firstItem?.condition || 'good',
      notes: delivery.notes || '',
      status: mapStatus(delivery.status),
      orderId: delivery.orderId,
      expectedDate: delivery.expectedDate,
      actualDate: delivery.deliveryDate,
      items: delivery.items || [],
      // Note: deliveryPhoto and packagingPhoto are not included as they're File objects
      // and we don't have access to the original files from the API response
    };
  };

  // Effect to fetch the delivery data when the component mounts or ID changes
  useEffect(() => {
    const fetchDelivery = async () => {
      if (!id) return;
      
      try {
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

  // Effect to update the main layout's title and breadcrumbs
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

    // Cleanup function to reset layout data when the component unmounts
    return () => setLayoutData({});
  }, [delivery, setLayoutData]);

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
    <div className="max-w-3xl mx-auto">
      <div className="bg-card rounded-lg border p-6 sm:p-8">
        <DeliveryForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={convertDeliveryToFormData(delivery)}
          loading={isSubmitting}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default EditDelivery;