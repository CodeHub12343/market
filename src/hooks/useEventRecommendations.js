'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getUpcomingEvents,
  getPersonalizedEventRecommendations,
  getEventsByCategory,
  getEventsNearYou,
  getPopularEvents,
  getTrendingEvents,
  getTopRatedEvents,
  getSimilarEvents,
  getEventsFromFollowedOrganizers,
  getEventsBasedOnHistory,
  getEventYouMightLike,
  getTrendingCategories,
  getWeekendEvents,
  getNextWeekEvents
} from '@/services/eventRecommendations';

// Cache durations
const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,       // 5 minutes - user-specific
  MEDIUM: 30 * 60 * 1000,      // 30 minutes - semi-stable
  LONG: 60 * 60 * 1000,        // 1 hour - stable trending
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours - rarely changes
};

/**
 * Get upcoming events sorted by date
 */
export const useUpcomingEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['upcoming-events', limit],
    queryFn: () => getUpcomingEvents(limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get personalized event recommendations based on user interests
 */
export const usePersonalizedEventRecommendations = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['personalized-event-recommendations', limit],
    queryFn: () => getPersonalizedEventRecommendations(limit),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
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
 * Get events near user location
 */
export const useEventsNearYou = (limit = 10, radiusKm = 50, enabled = true) => {
  return useQuery({
    queryKey: ['events-near-you', limit, radiusKm],
    queryFn: () => getEventsNearYou(limit, radiusKm),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get popular trending events
 */
export const usePopularEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['popular-events', limit],
    queryFn: () => getPopularEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get trending events (most joined recently)
 */
export const useTrendingEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['trending-events', limit],
    queryFn: () => getTrendingEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get top-rated events
 */
export const useTopRatedEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['top-rated-events', limit],
    queryFn: () => getTopRatedEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get events similar to a given event
 */
export const useSimilarEvents = (eventId, limit = 6, enabled = true) => {
  return useQuery({
    queryKey: ['similar-events', eventId, limit],
    queryFn: () => getSimilarEvents(eventId, limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Get events organized by people user follows
 */
export const useEventsFromFollowedOrganizers = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['events-followed-organizers', limit],
    queryFn: () => getEventsFromFollowedOrganizers(limit),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get events based on user's previous attendance
 */
export const useEventsBasedOnHistory = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['events-history-based', limit],
    queryFn: () => getEventsBasedOnHistory(limit),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get events you might like (hybrid personalization)
 */
export const useEventYouMightLike = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['event-might-like', limit],
    queryFn: () => getEventYouMightLike(limit),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get trending categories
 */
export const useTrendingCategories = (limit = 5, enabled = true) => {
  return useQuery({
    queryKey: ['trending-categories', limit],
    queryFn: () => getTrendingCategories(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get events happening this weekend
 */
export const useWeekendEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['weekend-events', limit],
    queryFn: () => getWeekendEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get events happening next week
 */
export const useNextWeekEvents = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['next-week-events', limit],
    queryFn: () => getNextWeekEvents(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};
