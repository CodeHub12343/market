import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as shopService from '@/services/shops';

/**
 * Hook for fetching all shops
 */
export const useAllShops = (page = 1, limit = 12, filters = {}) => {
  return useQuery({
    queryKey: ['allShops', page, limit, filters],
    queryFn: async () => {
      try {
        const result = await shopService.fetchShopsPaginated(page, limit, filters);
        console.log('useAllShops result:', result);
        return result;
      } catch (err) {
        console.error('useAllShops error:', err);
        throw err;
      }
    },
    keepPreviousData: true,
  });
};

/**
 * Hook for fetching shop by ID
 */
export const useShopById = (id, enabled = true) => {
  return useQuery({
    queryKey: ['shops', id],
    queryFn: () => shopService.fetchShopById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook for fetching current user's shop
 */
export const useMyShop = () => {
  return useQuery({
    queryKey: ['myShop'],
    queryFn: () => shopService.fetchMyShop(),
    staleTime: 0, // Always refetch to get latest shop data
    retry: 1, // Retry once if it fails
  });
};

/**
 * Hook for fetching all current user's shops
 */
export const useMyShops = () => {
  return useQuery({
    queryKey: ['myShops'],
    queryFn: () => shopService.fetchMyShops(),
    staleTime: 0, // Always refetch to get latest shop data
    retry: 1, // Retry once if it fails
  });
};

/**
 * Hook for creating shop with optional logo upload
 */
export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shopData, logoFile }) => shopService.createShop(shopData, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShops'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['myShops'] });
    },
  });
};

/**
 * Hook for updating shop
 */
export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shopData }) => shopService.updateShop(id, shopData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allShops'] });
      queryClient.invalidateQueries({ queryKey: ['shops', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
  });
};

/**
 * Hook for deleting shop
 */
export const useDeleteShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => shopService.deleteShop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShops'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
  });
};

/**
 * Hook for searching shops
 */
export const useSearchShops = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchShops', query, filters],
    queryFn: () => shopService.searchShops(query, filters),
    enabled: !!query,
  });
};

/**
 * Hook for shop analytics
 */
export const useShopAnalytics = (shopId, enabled = true) => {
  return useQuery({
    queryKey: ['shopAnalytics', shopId],
    queryFn: () => shopService.getShopAnalytics(shopId),
    enabled: !!shopId && enabled,
  });
};

/**
 * Hook for updating shop settings
 */
export const useUpdateShopSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, settings }) => shopService.updateShopSettings(id, settings),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shops', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
  });
};