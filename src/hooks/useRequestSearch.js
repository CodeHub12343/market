import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as requestSearchService from '@/services/requestSearch';
import { useCallback } from 'react';

/**
 * Hook to fetch request search suggestions
 */
export const useRequestSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['requestSearchSuggestions', query],
    queryFn: () => requestSearchService.getRequestSearchSuggestions(query),
    enabled: enabled && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch popular request searches
 */
export const usePopularRequestSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popularRequestSearches'],
    queryFn: () => requestSearchService.getPopularRequestSearches(),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
  });
};

/**
 * Hook to fetch search history
 */
export const useRequestSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['requestSearchHistory'],
    queryFn: () => requestSearchService.getSearchHistory(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to save search to history
 */
export const useSaveRequestSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query) => requestSearchService.saveSearchToHistory(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestSearchHistory'] });
    },
  });
};

/**
 * Hook to clear search history
 */
export const useClearRequestSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => requestSearchService.clearSearchHistory(),
    onSuccess: () => {
      queryClient.setQueryData(['requestSearchHistory'], []);
    },
  });
};

/**
 * Hook to delete search history entry
 */
export const useDeleteRequestSearchHistoryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => requestSearchService.deleteSearchHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requestSearchHistory'] });
    },
  });
};
