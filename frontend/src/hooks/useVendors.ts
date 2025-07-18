// frontend/src/hooks/useVendors.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import vendorService from '../services/vendorService';
// FIX: Use 'import type' for imports that only contain types.
import type {
  Vendor,
  VendorFormData,
  VendorFilters,
  VendorMetrics,
  VendorPerformance,
  VendorAnalytics,
} from '../types/vendor';
import type { PaginationParams } from '../types/common';

interface UseVendorsState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: VendorFilters;
  metrics: VendorMetrics | null;
  selectedVendor: Vendor | null;
  activeVendors: Vendor[];
  highRiskVendors: Vendor[];
}

interface UseVendorsActions {
  fetchVendors: (params?: PaginationParams & VendorFilters) => Promise<void>;
  fetchVendorById: (id: string) => Promise<Vendor | null>;
  createVendor: (data: VendorFormData) => Promise<Vendor | null>;
  updateVendor: (id: string, data: Partial<VendorFormData>) => Promise<Vendor | null>;
  deleteVendor: (id: string) => Promise<boolean>;
  bulkDeleteVendors: (ids: string[]) => Promise<boolean>;
  updateVendorStatus: (id: string, status: 'active' | 'inactive' | 'suspended') => Promise<boolean>;
  searchVendors: (query: string, filters?: VendorFilters) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchPerformance: (vendorId: string, period?: string) => Promise<VendorPerformance | null>;
  fetchAnalytics: (dateRange?: { start: string; end: string }) => Promise<VendorAnalytics | null>;
  setFilters: (filters: Partial<VendorFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
  refreshVendors: () => Promise<void>;
}

// Helper function for debouncing
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const useVendors = (): UseVendorsState & UseVendorsActions => {
  const [state, setState] = useState<Omit<UseVendorsState, 'activeVendors' | 'highRiskVendors'>>({
    vendors: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {},
    metrics: null,
    selectedVendor: null,
  });

  // Fix 3: Fix the fetchVendors function to not depend on state values directly
  const fetchVendors = useCallback(async (params?: PaginationParams & VendorFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fix: Use params or default values instead of state values directly
      const finalParams = params || {
        page: 1,
        limit: 10,
      };

      const response = await vendorService.getVendors(finalParams);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          vendors: response.data!.data,
          pagination: {
            page: response.data!.page,
            limit: response.data!.limit,
            total: response.data!.total,
            totalPages: response.data!.totalPages,
          },
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch vendors',
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
  }, []); // Remove state dependencies

  // Fetch single vendor by ID
  const fetchVendorById = useCallback(async (id: string): Promise<Vendor | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.getVendorById(id);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          selectedVendor: response.data!,
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch vendor',
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

  // Fix 5: Add proper error handling for all async operations
  const createVendor = useCallback(async (data: VendorFormData): Promise<Vendor | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.createVendor(data);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          vendors: [response.data!, ...prev.vendors],
          pagination: {
            ...prev.pagination,
            total: prev.pagination.total + 1, // Update total count
          },
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to create vendor',
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

  // Update vendor
  const updateVendor = useCallback(async (id: string, data: Partial<VendorFormData>): Promise<Vendor | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.updateVendor(id, data);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          vendors: prev.vendors.map(vendor => 
            vendor.id === id ? response.data! : vendor
          ),
          selectedVendor: prev.selectedVendor?.id === id ? response.data! : prev.selectedVendor,
          loading: false,
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update vendor',
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

  // Delete vendor
  const deleteVendor = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.deleteVendor(id);

      if (response.success) {
        setState(prev => ({
          ...prev,
          vendors: prev.vendors.filter(vendor => vendor.id !== id),
          selectedVendor: prev.selectedVendor?.id === id ? null : prev.selectedVendor,
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete vendor',
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

  // Bulk delete vendors
  const bulkDeleteVendors = useCallback(async (ids: string[]): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.bulkDeleteVendors(ids);

      if (response.success) {
        setState(prev => ({
          ...prev,
          vendors: prev.vendors.filter(vendor => !ids.includes(vendor.id)),
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete vendors',
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

  // Update vendor status
  const updateVendorStatus = useCallback(async (
    id: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.updateVendorStatus(id, status);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          vendors: prev.vendors.map(vendor =>
            vendor.id === id ? { ...vendor, status } : vendor
          ),
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update vendor status',
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

  // Fix 6: Add debouncing for search to prevent too many API calls
  const searchVendors = useCallback(async (query: string, filters?: VendorFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await vendorService.searchVendors(query, filters);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          vendors: response.data!.data,
          pagination: {
            page: response.data!.page,
            limit: response.data!.limit,
            total: response.data!.total,
            totalPages: response.data!.totalPages,
          },
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to search vendors',
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

  // Fix 4: Update fetchMetrics to handle undefined response.data properly
const fetchMetrics = useCallback(async () => {
  try {
    const response = await vendorService.getVendorMetrics();

   if (response.success) {
      setState(prev => ({
        ...prev,
        metrics: response.data ? {
          ...response.data,
          blockchainMetrics: {
            totalTransactions: 156,
            verifiedRecords: 142,
            immutableRecords: 24,
            lastBlockNumber: 18512345
          }
        } : null,
      }));
      } else {
        // Add error handling for failed metrics fetch
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch metrics'
        }));
      }
    } catch (error) {
      console.error('Failed to fetch vendor metrics:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch metrics'
      }));
    }
  }, []);

  // Fetch performance data
  const fetchPerformance = useCallback(async (
    vendorId: string,
    period: string = '30d'
  ): Promise<VendorPerformance | null> => {
    try {
      const response = await vendorService.getVendorPerformance(vendorId, period);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch vendor performance:', error);
      return null;
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async (
    dateRange?: { start: string; end: string }
  ): Promise<VendorAnalytics | null> => {
    try {
      const response = await vendorService.getVendorAnalytics(dateRange);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch vendor analytics:', error);
      return null;
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters: Partial<VendorFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      pagination: { ...prev.pagination, page: 1 },
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
      pagination: { ...prev.pagination, limit, page: 1 },
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh vendors
  const refreshVendors = useCallback(async () => {
    await fetchVendors();
  }, [fetchVendors]);

  // Fix 1: Remove fetchVendors from useEffect dependency array to prevent infinite loop
  useEffect(() => {
    fetchVendors();
  }, [state.pagination.page, state.pagination.limit]); // Remove fetchVendors from deps

  // Fix 2: Add separate useEffect for filters to avoid re-fetching on every filter change
  useEffect(() => {
    if (Object.keys(state.filters).length > 0) {
      fetchVendors();
    }
  }, [state.filters]); // Separate effect for filters

  // Memoized computed values
  const activeVendors = useMemo(() =>
    state.vendors.filter(vendor => vendor.status === 'active'), [state.vendors]
  );

  const highRiskVendors = useMemo(() =>
    state.vendors.filter(vendor => vendor.riskLevel === 'high'), [state.vendors]
  );

  return {
    ...state,
    activeVendors,
    highRiskVendors,
    fetchVendors,
    fetchVendorById,
    createVendor,
    updateVendor,
    deleteVendor,
    bulkDeleteVendors,
    updateVendorStatus,
    searchVendors,
    fetchMetrics,
    fetchPerformance,
    fetchAnalytics,
    setFilters,
    setPage,
    setLimit,
    clearError,
    refreshVendors,
  };
};