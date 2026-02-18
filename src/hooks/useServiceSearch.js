import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as searchService from '@/services/serviceSearch';
import { useCallback } from 'react';

/**
 * Hook to fetch service search suggestions
 */
export const useServiceSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['serviceSearchSuggestions', query],
    queryFn: () => searchService.getServiceSearchSuggestions(query),
    enabled: enabled && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch popular service searches
 */
export const usePopularServiceSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popularServiceSearches'],
    queryFn: () => searchService.getPopularServiceSearches(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * Hook for advanced service search
 */
export const useAdvancedServiceSearch = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ['advancedServiceSearch', filters],
    queryFn: () => searchService.searchServicesAdvanced(filters),
    enabled: enabled && (filters.query || filters.category || filters.minPrice || filters.maxPrice),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch available service locations
 */
export const useServiceLocations = (enabled = true) => {
  return useQuery({
    queryKey: ['serviceLocations'],
    queryFn: () => searchService.getServiceLocations(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * Hook to fetch search history
 */
export const useSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['serviceSearchHistory'],
    queryFn: () => searchService.getSearchHistory(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to save search to history
 */
export const useSaveSearch = () => {
  const queryClient = useQueryClient();

  return useCallback(async (query) => {
    try {
      await searchService.saveSearchToHistory(query);
      // Invalidate history to refetch
      queryClient.invalidateQueries({ queryKey: ['serviceSearchHistory'] });
    } catch (error) {
      console.error('Error saving search:', error);
    }
  }, [queryClient]);
};

/**
 * Hook to clear search history
 */
export const useClearSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchService.clearSearchHistory(),
    onSuccess: () => {
      queryClient.setQueryData(['serviceSearchHistory'], []);
    },
  });
};

/**
 * Hook to delete search history entry
 */
export const useDeleteSearchHistoryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => searchService.deleteSearchHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceSearchHistory'] });
    },
  });
};
