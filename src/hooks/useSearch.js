import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import * as searchService from '@/services/search';

/**
 * Hook to search products
 */
export const useSearchProducts = (query, filters = {}) => {
  return useQuery({
    queryKey: ['search', 'products', query, filters],
    queryFn: () => searchService.searchProducts(query, filters),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get search suggestions (autocomplete)
 */
export const useSearchSuggestions = (query, limit = 10) => {
  return useQuery({
    queryKey: ['search', 'suggestions', query, limit],
    queryFn: () => searchService.getSearchSuggestions(query, limit),
    enabled: !!query && query.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};

/**
 * Hook to get popular/trending searches
 */
export const usePopularSearches = (limit = 10) => {
  return useQuery({
    queryKey: ['search', 'popular', limit],
    queryFn: () => searchService.getPopularSearches(limit),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to get user's search history
 */
export const useSearchHistory = (limit = 20) => {
  return useQuery({
    queryKey: ['search', 'history', limit],
    queryFn: () => searchService.getSearchHistory(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Mutation to save search to history
 */
export const useSaveSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ query, filters }) =>
      searchService.saveSearchToHistory(query, filters),
    onSuccess: () => {
      // Invalidate search history
      queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    },
  });
};

/**
 * Mutation to clear search history
 */
export const useClearSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchService.clearSearchHistory(),
    onSuccess: () => {
      // Invalidate search history
      queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    },
  });
};

/**
 * Mutation to delete specific search history entry
 */
export const useDeleteSearchHistoryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId) => searchService.deleteSearchHistoryEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    },
  });
};

/**
 * Hook to search by shop
 */
export const useSearchByShop = (shopId, filters = {}) => {
  return useQuery({
    queryKey: ['search', 'shop', shopId, filters],
    queryFn: () => searchService.searchByShop(shopId, filters),
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get categories for filters
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => searchService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to get campuses for filters
 */
export const useCampuses = () => {
  return useQuery({
    queryKey: ['campuses'],
    queryFn: () => searchService.getCampuses(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Custom hook for managing local search state with history
 * Handles debouncing and local storage fallback for history
 */
export const useLocalSearch = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const saveHistoryMutation = useSaveSearchHistory();

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.warn('Failed to parse search history:', e);
      }
    }
  }, []);

  // Add to local history
  const addToHistory = useCallback(
    (searchQuery, filters = {}) => {
      const newEntry = {
        id: Date.now(),
        query: searchQuery,
        filters,
        timestamp: new Date().toISOString(),
      };

      // Add to state
      setHistory((prev) => [newEntry, ...prev.slice(0, 19)]); // Keep last 20

      // Save to localStorage
      localStorage.setItem(
        'searchHistory',
        JSON.stringify([newEntry, ...history.slice(0, 19)])
      );

      // Try to save to backend (non-blocking)
      saveHistoryMutation.mutate({ query: searchQuery, filters });
    },
    [history, saveHistoryMutation]
  );

  // Remove from local history
  const removeFromHistory = useCallback((entryId) => {
    setHistory((prev) => prev.filter((item) => item.id !== entryId));
    localStorage.setItem(
      'searchHistory',
      JSON.stringify(history.filter((item) => item.id !== entryId))
    );
  }, [history]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  return {
    query,
    setQuery,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};

/**
 * Hook for advanced search with all available filters
 */
export const useAdvancedSearch = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const { data: categories = [] } = useCategories();
  const { data: campuses = [] } = useCampuses();

  const searchMutation = useMutation({
    mutationFn: () => searchService.advancedSearch(filters),
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback(() => {
    if (filters.search || Object.keys(filters).length > 1) {
      searchMutation.mutate();
    }
  }, [filters, searchMutation]);

  const handleReset = useCallback(() => {
    setFilters({});
    searchMutation.reset();
  }, [searchMutation]);

  return {
    filters,
    setFilters,
    handleFilterChange,
    handleSearch,
    handleReset,
    categories,
    campuses,
    results: searchMutation.data,
    isLoading: searchMutation.isPending,
    error: searchMutation.error,
  };
};
