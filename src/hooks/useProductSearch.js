import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as searchService from '@/services/productSearch';

/**
 * Hook to fetch product search suggestions
 */
export const useProductSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['productSearchSuggestions', query],
    queryFn: () => searchService.getProductSearchSuggestions(query),
    enabled: enabled && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch popular product searches
 */
export const usePopularProductSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popularProductSearches'],
    queryFn: () => searchService.getPopularProductSearches(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * Hook for advanced product search
 */
export const useAdvancedProductSearch = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ['advancedProductSearch', filters],
    queryFn: () => searchService.searchProductsAdvanced(filters),
    enabled: enabled && (filters.query || filters.category || filters.minPrice || filters.maxPrice),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch available product locations
 */
export const useProductLocations = (enabled = true) => {
  return useQuery({
    queryKey: ['productLocations'],
    queryFn: () => searchService.getProductLocations(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * Hook to fetch product search history
 */
export const useProductSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['productSearchHistory'],
    queryFn: () => searchService.getProductSearchHistory(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to save product search to history
 */
export const useSaveProductSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query) => searchService.saveProductSearchToHistory(query),
    onSuccess: () => {
      // Invalidate history to refetch
      queryClient.invalidateQueries({ queryKey: ['productSearchHistory'] });
    },
    onError: (error) => {
      console.error('Error saving product search:', error);
    }
  });
};

/**
 * Hook to clear product search history
 */
export const useClearProductSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchService.clearProductSearchHistory(),
    onSuccess: () => {
      queryClient.setQueryData(['productSearchHistory'], []);
    },
  });
};

/**
 * Hook to delete a product search history item
 */
export const useDeleteProductSearchHistoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => searchService.deleteProductSearchHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSearchHistory'] });
    },
  });
};
