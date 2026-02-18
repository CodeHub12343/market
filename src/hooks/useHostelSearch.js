import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as searchService from '@/services/hostelSearch';
import { useCallback } from 'react';

/**
 * Hook to fetch hostel search suggestions (autocomplete)
 */
export const useHostelSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['hostelSearchSuggestions', query],
    queryFn: () => searchService.getHostelSearchSuggestions(query),
    enabled: enabled && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch popular hostel searches
 */
export const usePopularHostelSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popularHostelSearches'],
    queryFn: () => searchService.getPopularHostelSearches(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to fetch search history
 */
export const useSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['hostelSearchHistory'],
    queryFn: () => searchService.getSearchHistory(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes (user-specific)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to save search to history (mutation)
 */
export const useSaveHostelSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (query) => searchService.saveSearchToHistory(query),
    onSuccess: () => {
      // Invalidate history to refresh
      queryClient.invalidateQueries({ queryKey: ['hostelSearchHistory'] });
    },
    // Non-blocking - don't show error to user
    onError: () => {
      // Silently fail
    },
  });
};

/**
 * Hook to advanced search hostels
 */
export const useAdvancedHostelSearch = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ['advancedHostelSearch', filters],
    queryFn: () => searchService.searchHostelsAdvanced(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch hostel locations
 */
export const useHostelLocations = (enabled = true) => {
  return useQuery({
    queryKey: ['hostelLocations'],
    queryFn: () => searchService.getHostelLocations(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to fetch hostel amenities
 */
export const useHostelAmenities = (enabled = true) => {
  return useQuery({
    queryKey: ['hostelAmenities'],
    queryFn: () => searchService.getHostelAmenities(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to fetch price range
 */
export const usePriceRange = (enabled = true) => {
  return useQuery({
    queryKey: ['hostelPriceRange'],
    queryFn: () => searchService.getPriceRange(),
    enabled,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Hook to fetch hostel types
 */
export const useHostelTypes = (enabled = true) => {
  return useQuery({
    queryKey: ['hostelTypes'],
    queryFn: () => searchService.getHostelTypes(),
    enabled,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (rarely changes)
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Hook to clear search history (mutation)
 */
export const useClearSearchHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => searchService.clearSearchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostelSearchHistory'] });
    },
  });
};

/**
 * Hook to delete search history entry (mutation)
 */
export const useDeleteSearchHistoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => searchService.deleteSearchHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostelSearchHistory'] });
    },
  });
};

/**
 * Hook to fetch amenities distribution
 */
export const useAmenitiesDistribution = (enabled = true) => {
  return useQuery({
    queryKey: ['amenitiesDistribution'],
    queryFn: () => searchService.getAmenitiesDistribution(),
    enabled,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
