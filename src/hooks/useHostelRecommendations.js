'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getRelatedHostels,
  getPopularHostels,
  getPersonalizedRecommendations,
  getRecommendationsByType,
  getRecommendationsByFaculty,
  getSimilarPriceRangeHostels,
  getTopRatedHostels,
  getNewlyListedHostels,
  getHostelsSimilarToFavorites,
  getRecommendationsFromHistory,
  getLocationBasedRecommendations,
  getAmenityBasedRecommendations
} from '@/services/hostelRecommendations';

// Cache durations
const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,      // 5 minutes - user-specific
  MEDIUM: 30 * 60 * 1000,     // 30 minutes - semi-stable
  LONG: 60 * 60 * 1000,       // 1 hour - stable trending
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours - rarely changes
};

/**
 * Get hostels related to a specific hostel (same type/campus/faculty)
 */
export const useRelatedHostels = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['related-hostels', hostelId],
    queryFn: () => getRelatedHostels(hostelId, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Get trending/popular hostels
 */
export const usePopularHostels = (enabled = true) => {
  return useQuery({
    queryKey: ['popular-hostels'],
    queryFn: () => getPopularHostels(6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get personalized recommendations for logged-in user
 */
export const usePersonalizedRecommendations = (enabled = true) => {
  return useQuery({
    queryKey: ['personalized-recommendations'],
    queryFn: () => getPersonalizedRecommendations(8),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get recommendations by hostel type
 */
export const useRecommendationsByType = (type, enabled = true) => {
  return useQuery({
    queryKey: ['recommendations-by-type', type],
    queryFn: () => getRecommendationsByType(type, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!type && enabled,
    retry: 1
  });
};

/**
 * Get recommendations by faculty
 */
export const useRecommendationsByFaculty = (facultyId, enabled = true) => {
  return useQuery({
    queryKey: ['recommendations-by-faculty', facultyId],
    queryFn: () => getRecommendationsByFaculty(facultyId, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!facultyId && enabled,
    retry: 1
  });
};

/**
 * Get hostels in similar price range
 */
export const useSimilarPriceRangeHostels = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['similar-price-hostels', hostelId],
    queryFn: () => getSimilarPriceRangeHostels(hostelId, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!hostelId && enabled,
    retry: 1
  });
};

/**
 * Get top-rated hostels
 */
export const useTopRatedHostels = (enabled = true) => {
  return useQuery({
    queryKey: ['top-rated-hostels'],
    queryFn: () => getTopRatedHostels(6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get newly listed hostels
 */
export const useNewlyListedHostels = (enabled = true) => {
  return useQuery({
    queryKey: ['newly-listed-hostels'],
    queryFn: () => getNewlyListedHostels(6),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get hostels similar to user's favorites
 */
export const useHostelsSimilarToFavorites = (enabled = true) => {
  return useQuery({
    queryKey: ['hostels-similar-to-favorites'],
    queryFn: () => getHostelsSimilarToFavorites(8),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get recommendations based on user's search/view history
 */
export const useRecommendationsFromHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['recommendations-from-history'],
    queryFn: () => getRecommendationsFromHistory(8),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get location-based recommendations
 */
export const useLocationBasedRecommendations = (location, enabled = true) => {
  return useQuery({
    queryKey: ['location-recommendations', location],
    queryFn: () => getLocationBasedRecommendations(location, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!location && enabled,
    retry: 1
  });
};

/**
 * Get amenity-based recommendations
 */
export const useAmenityBasedRecommendations = (amenities, enabled = true) => {
  return useQuery({
    queryKey: ['amenity-recommendations', amenities],
    queryFn: () => getAmenityBasedRecommendations(amenities, 6),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!(amenities && (Array.isArray(amenities) ? amenities.length > 0 : amenities)) && enabled,
    retry: 1
  });
};
