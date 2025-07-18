// frontend/src/hooks/useDeliveries.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import deliveryService from '../services/deliveryService';
import type { 
  Delivery, 
  DeliveryFormData, 
  DeliveryVerificationData, 
  DeliveryMetrics,
  DeliveryFilters,
  DeliveryAnalytics 
} from '../types/delivery';
import type { PaginationParams } from '../types/common';

interface UseDeliveriesState {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: DeliveryFilters;
  metrics: DeliveryMetrics | null;
  selectedDelivery: Delivery | null;
  realtimeUpdates: boolean;
  notifications: Array<{
    id: string;
    type: 'delay' | 'fraud' | 'quality' | 'verification';
    message: string;
    deliveryId: string;
    severity: 'low' | 'medium' | 'high';
    createdAt: string;
    read?: boolean;
  }>;
}

interface UseDeliveriesActions {
  fetchDeliveries: (params?: PaginationParams & DeliveryFilters) => Promise<void>;
  fetchDeliveryById: (id: string) => Promise<Delivery | null>;
  createDelivery: (data: DeliveryFormData) => Promise<Delivery | null>;
  updateDelivery: (id: string, data: Partial<DeliveryFormData>) => Promise<Delivery | null>;
  deleteDelivery: (id: string) => Promise<boolean>;
  verifyDelivery: (data: DeliveryVerificationData) => Promise<Delivery | null>;
  updateDeliveryStatus: (id: string, status: 'pending' | 'in_transit' | 'delivered' | 'verified' | 'rejected') => Promise<boolean>;
  trackDelivery: (id: string) => Promise<any>;
  validateQRCode: (qrCode: string) => Promise<any>;
  uploadPhotos: (deliveryId: string, photos: File[], onProgress?: (progress: number) => void) => Promise<string[]>;
  fetchMetrics: (period?: string) => Promise<void>;
  fetchAnalytics: (dateRange?: { start: string; end: string }) => Promise<DeliveryAnalytics | null>;
  searchDeliveries: (query: string, filters?: DeliveryFilters) => Promise<void>;
  fetchPendingDeliveries: () => Promise<void>;
  fetchVendorDeliveries: (vendorId: string, params?: PaginationParams) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  reportFraud: (deliveryId: string, reason: string) => Promise<boolean>;
  bulkUpdateDeliveries: (deliveryIds: string[], updates: { status?: string; notes?: string }) => Promise<boolean>;
  subscribeToUpdates: (deliveryId: string, callback: (update: any) => void) => () => void;
  setFilters: (filters: Partial<DeliveryFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
  refreshDeliveries: () => Promise<void>;
  toggleRealtimeUpdates: () => void;
}

export const useDeliveries = (): UseDeliveriesState & UseDeliveriesActions => {
  
    const mockDeliveries: Delivery[] = [
  // QR Code 1: DIV-bha-212 (The Good Delivery)
  {
    id: '1',
    orderId: 'PO-2024-001',
    vendorId: 'vendor-1',
    vendorName: 'DIV-bha-212',
    deliveryDate: '2024-01-15T10:30:00Z',
    expectedDate: '2024-01-15T10:00:00Z',
    status: 'verified',
    items: [
      {
        id: 'item-1',
        name: 'Office Supplies',
        quantity: 10,
        expectedQuantity: 10,
        unit: 'pieces',
        price: 25.50,
        verified: true,
        condition: 'good'
      }
    ],
    totalAmount: 255.00,
    verificationStatus: 'verified',
    photos: [],
    notes: 'All items in perfect condition',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  
  // QR Code 2: ANA-yad-264 (The Weight Mismatch)
  {
    id: '2',
    orderId: 'PO-2024-002',
    vendorId: 'vendor-2',
    vendorName: 'ANA-yad-264',
    deliveryDate: '2024-01-15T14:20:00Z',
    expectedDate: '2024-01-15T14:00:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-2',
        name: 'Raw Materials',
        quantity: 5,
        expectedQuantity: 5,
        unit: 'boxes',
        price: 45.00,
        verified: false,
        condition: 'good'
      }
    ],
    totalAmount: 225.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Weight discrepancy detected - Expected: 12.5kg, Actual: 8.2kg',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  
  // QR Code 3: ARY-kes-275 (The Product Mismatch)
  {
    id: '3',
    orderId: 'PO-2024-003',
    vendorId: 'vendor-3',
    vendorName: 'ARY-kes-275',
    deliveryDate: '2024-01-15T09:15:00Z',
    expectedDate: '2024-01-15T09:00:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-3',
        name: 'Heavy Equipment',
        quantity: 12,
        expectedQuantity: 15,
        unit: 'units',
        price: 150.00,
        verified: false,
        condition: 'good'
      }
    ],
    totalAmount: 2250.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Product quantity mismatch - Expected: 15 units, Delivered: 12 units',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  
  // QR Code 4: HAR-bha-203 (The Flagged Vendor)
  {
    id: '4',
    orderId: 'PO-2024-004',
    vendorId: 'vendor-4',
    vendorName: 'HAR-bha-203',
    deliveryDate: '2024-01-15T16:45:00Z',
    expectedDate: '2024-01-15T16:30:00Z',
    status: 'flagged',
    items: [
      {
        id: 'item-4',
        name: 'Electronic Components',
        quantity: 20,
        expectedQuantity: 20,
        unit: 'pieces',
        price: 35.75,
        verified: false,
        condition: 'poor'
      }
    ],
    totalAmount: 715.00,
    verificationStatus: 'flagged',
    photos: [],
    notes: 'Vendor flagged for previous quality issues. Items show signs of damage.',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  }
];
  const [state, setState] = useState<UseDeliveriesState>({
    deliveries: mockDeliveries, // Use mock data instead of empty array
    loading: false, // Set to false for immediate display
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: mockDeliveries.length,
      totalPages: 1,
    },
    filters: {},
    metrics: null,
    selectedDelivery: null,
    realtimeUpdates: false,
    notifications: [],
  });

  // Fetch deliveries with pagination and filters
  const fetchDeliveries = useCallback(async (params?: PaginationParams & DeliveryFilters) => {
    console.log('Fetching mock deliveries...');
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate API delay
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        deliveries: mockDeliveries,
        loading: false 
      }));
    }, 500);
  }, []);

  // Fetch single delivery by ID
  const fetchDeliveryById = useCallback(async (id: string): Promise<Delivery | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.getDeliveryById(id);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          selectedDelivery: response.data!,
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch delivery',
          loading: false,
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return null;
    }
  }, []);

  // Create new delivery
  const createDelivery = useCallback(async (data: DeliveryFormData): Promise<Delivery | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.createDelivery(data);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: [response.data!, ...prev.deliveries],
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to create delivery',
          loading: false,
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return null;
    }
  }, []);

  // Update delivery
  const updateDelivery = useCallback(async (id: string, data: Partial<DeliveryFormData>): Promise<Delivery | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.updateDelivery(id, data);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: prev.deliveries.map(delivery => 
            delivery.id === id ? response.data! : delivery
          ),
          selectedDelivery: prev.selectedDelivery?.id === id ? response.data! : prev.selectedDelivery,
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update delivery',
          loading: false,
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return null;
    }
  }, []);

  // Delete delivery
  const deleteDelivery = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.deleteDelivery(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          deliveries: prev.deliveries.filter(delivery => delivery.id !== id),
          selectedDelivery: prev.selectedDelivery?.id === id ? null : prev.selectedDelivery,
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete delivery',
          loading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return false;
    }
  }, []);

  // Verify delivery
  const verifyDelivery = useCallback(async (data: DeliveryVerificationData): Promise<Delivery | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.verifyDelivery(data);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: prev.deliveries.map(delivery => 
            delivery.id === data.deliveryId ? response.data! : delivery
          ),
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to verify delivery',
          loading: false,
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return null;
    }
  }, []);

  // Update delivery status
  const updateDeliveryStatus = useCallback(async (
    id: string, 
    status: 'pending' | 'in_transit' | 'delivered' | 'verified' | 'rejected'
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.updateDeliveryStatus(id, status);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: prev.deliveries.map(delivery => 
            delivery.id === id ? { ...delivery, status } : delivery
          ),
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update delivery status',
          loading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return false;
    }
  }, []);

  // Track delivery
  const trackDelivery = useCallback(async (id: string) => {
    try {
      const response = await deliveryService.trackDelivery(id);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to track delivery:', error);
      return null;
    }
  }, []);

  // Validate QR code
  const validateQRCode = useCallback(async (qrCode: string) => {
    try {
      const response = await deliveryService.validateQRCode(qrCode);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to validate QR code:', error);
      return null;
    }
  }, []);

  // Upload photos
  const uploadPhotos = useCallback(async (
    deliveryId: string, 
    photos: File[], 
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    try {
      const response = await deliveryService.uploadPhotos(deliveryId, photos, onProgress);
      
      if (response.success && response.data) {
        return response.data.urls;
      }
      return [];
    } catch (error) {
      console.error('Failed to upload photos:', error);
      return [];
    }
  }, []);

  // Fetch metrics
  const fetchMetrics = useCallback(async (period?: string) => {
    try {
      const response = await deliveryService.getDeliveryMetrics(period);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          metrics: response.data!,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch delivery metrics:', error);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async (
    dateRange?: { start: string; end: string }
  ): Promise<DeliveryAnalytics | null> => {
    try {
      const response = await deliveryService.getDeliveryAnalytics(dateRange);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch delivery analytics:', error);
      return null;
    }
  }, []);

  // Search deliveries
  const searchDeliveries = useCallback(async (query: string, filters?: DeliveryFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.searchDeliveries(query, filters);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: response.data!,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to search deliveries',
          loading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
    }
  }, []);

  // Fetch pending deliveries
  const fetchPendingDeliveries = useCallback(async () => {
    try {
      const response = await deliveryService.getPendingDeliveries();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          deliveries: response.data!,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch pending deliveries:', error);
    }
  }, []);

  // Fetch vendor deliveries
  const fetchVendorDeliveries = useCallback(async (vendorId: string, params?: PaginationParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.getVendorDeliveries(vendorId, params);
      
      if (response.success && response.data) {
        const responseData = response.data;
        setState(prev => ({
          ...prev,
          deliveries: responseData.deliveries || [],
          pagination: {
            page: responseData.page || 1,
            limit: responseData.limit || 10,
            total: responseData.total || 0,
            totalPages: responseData.totalPages || 0,
          },
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch vendor deliveries',
          loading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await deliveryService.getDeliveryNotifications();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          notifications: response.data || [],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  // Report fraud
  const reportFraud = useCallback(async (deliveryId: string, reason: string): Promise<boolean> => {
    try {
      const response = await deliveryService.reportFraud(deliveryId, reason);
      
      if (response.success) {
        // Optionally refresh deliveries or update the specific delivery
        await fetchDeliveries();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to report fraud:', error);
      return false;
    }
  }, [fetchDeliveries]);

  // Bulk update deliveries
  const bulkUpdateDeliveries = useCallback(async (
    deliveryIds: string[], 
    updates: { status?: string; notes?: string }
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await deliveryService.bulkUpdateDeliveries(deliveryIds, updates);
      
      if (response.success) {
        // Refresh deliveries to get updated data
        await fetchDeliveries();
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to bulk update deliveries',
          loading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false,
      }));
      return false;
    }
  }, [fetchDeliveries]);

  // Subscribe to real-time updates
  const subscribeToUpdates = useCallback((deliveryId: string, callback: (update: any) => void) => {
    return deliveryService.subscribeToDeliveryUpdates(deliveryId, callback);
  }, []);

  // Set filters
  const setFilters = useCallback((filters: Partial<DeliveryFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      pagination: { ...prev.pagination, page: 1 }, // Reset to first page when filters change
    }));
  }, []);

  // Set page
  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  // Set limit
  const setLimit = useCallback((limit: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, limit, page: 1 }, // Reset to first page when limit changes
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh deliveries
  const refreshDeliveries = useCallback(async () => {
    await fetchDeliveries();
  }, [fetchDeliveries]);

  // Toggle real-time updates
  const toggleRealtimeUpdates = useCallback(() => {
    setState(prev => ({ ...prev, realtimeUpdates: !prev.realtimeUpdates }));
  }, []);

  // Effect to auto-refresh when pagination or filters change
  useEffect(() => {
    fetchDeliveries();
  }, [state.pagination.page, state.pagination.limit, state.filters]);

  // Effect to fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Memoized computed values
  const memoizedValues = useMemo(() => ({
    hasDeliveries: state.deliveries.length > 0,
    totalDeliveries: state.pagination.total,
    currentPage: state.pagination.page,
    totalPages: state.pagination.totalPages,
    hasNextPage: state.pagination.page < state.pagination.totalPages,
    hasPreviousPage: state.pagination.page > 1,
    isFirstPage: state.pagination.page === 1,
    isLastPage: state.pagination.page === state.pagination.totalPages,
    pendingCount: state.deliveries.filter(d => d.status === 'pending').length,
    inTransitCount: state.deliveries.filter(d => d.status === 'in_transit').length,
    deliveredCount: state.deliveries.filter(d => d.status === 'delivered').length,
    verifiedCount: state.deliveries.filter(d => d.status === 'verified').length,
    rejectedCount: state.deliveries.filter(d => d.status === 'rejected').length,
    unreadNotifications: state.notifications.filter(n => n.read === false || n.read === undefined).length,
    highPriorityNotifications: state.notifications.filter(n => n.severity === 'high').length,
  }), [state.deliveries, state.pagination, state.notifications]);

  return {
    // State
    ...state,
    ...memoizedValues,
    
    // Actions
    fetchDeliveries,
    fetchDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    verifyDelivery,
    updateDeliveryStatus,
    trackDelivery,
    validateQRCode,
    uploadPhotos,
    fetchMetrics,
    fetchAnalytics,
    searchDeliveries,
    fetchPendingDeliveries,
    fetchVendorDeliveries,
    fetchNotifications,
    reportFraud,
    bulkUpdateDeliveries,
    subscribeToUpdates,
    setFilters,
    setPage,
    setLimit,
    clearError,
    refreshDeliveries,
    toggleRealtimeUpdates,
  };
};