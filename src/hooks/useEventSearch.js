'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getEventSearchSuggestions,
  getPopularEventSearches,
  searchEventsAdvanced,
  getEventLocations,
  getEventCategories,
  saveSearchToHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryEntry,
  getUpcomingEvents,
  getEventPriceRange,
  getEventsByCategory,
  getEventsByLocation,
  getJoinedEvents,
  getFavoriteEvents
} from '@/services/eventSearch';

// Cache durations
const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,       // 5 minutes - user-specific
  MEDIUM: 30 * 60 * 1000,      // 30 minutes - semi-stable
  LONG: 60 * 60 * 1000,        // 1 hour - stable trending
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours - rarely changes
};

/**
 * Get event search suggestions with autocomplete
 */
export const useEventSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['event-search-suggestions', query],
    queryFn: () => getEventSearchSuggestions(query, 5),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!query && query.length >= 2 && enabled,
    retry: 1
  });
};

/**
 * Get popular/trending event searches
 */
export const usePopularEventSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popular-event-searches'],
    queryFn: () => getPopularEventSearches(10),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get user's search history
 */
export const useSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['event-search-history'],
    queryFn: () => getSearchHistory(),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Save event search to history (mutation)
 */
export const useSaveEventSearch = () => {
  return useMutation({
    mutationFn: (query) => saveSearchToHistory(query)
  });
};

/**
 * Advanced event search with filters
 */
export const useAdvancedEventSearch = (filters, enabled = true) => {
  return useQuery({
    queryKey: ['advanced-event-search', filters],
    queryFn: () => searchEventsAdvanced(filters),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!enabled,
    retry: 1
  });
};

/**
 * Get available event locations
 */
export const useEventLocations = (enabled = true) => {
  return useQuery({
    queryKey: ['event-locations'],
    queryFn: () => getEventLocations(),
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get available event categories
 */
export const useEventCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['event-categories'],
    queryFn: () => getEventCategories(),
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Clear search history (mutation)
 */
export const useClearSearchHistory = () => {
  return useMutation({
    mutationFn: () => clearSearchHistory()
  });
};

/**
 * Delete single search history entry (mutation)
 */
export const useDeleteSearchHistoryEntry = () => {
  return useMutation({
    mutationFn: (id) => deleteSearchHistoryEntry(id)
  });
};

/**
 * Get upcoming events
 */
export const useUpcomingEvents = (limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['upcoming-events', limit],
    queryFn: () => getUpcomingEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get event price range stats
 */
export const useEventPriceRange = (enabled = true) => {
  return useQuery({
    queryKey: ['event-price-range'],
    queryFn: () => getEventPriceRange(),
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get events by category
 */
export const useEventsByCategory = (category, limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['events-by-category', category, limit],
    queryFn: () => getEventsByCategory(category, limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!category && enabled,
    retry: 1
  });
};

/**
 * Get events by location
 */
export const useEventsByLocation = (location, limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['events-by-location', location, limit],
    queryFn: () => getEventsByLocation(location, limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!location && enabled,
    retry: 1
  });
};

/**
 * Get events user has joined
 */
export const useJoinedEvents = (limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['joined-events', limit],
    queryFn: () => getJoinedEvents(limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get user's favorite events
 */
export const useFavoriteEvents = (limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['favorite-events', limit],
    queryFn: () => getFavoriteEvents(limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};
