import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recommendationService from '@/services/serviceRecommendations';

/**
 * Fetch popular services for homepage/discovery
 */
export const usePopularServices = (enabled = true) => {
  return useQuery({
    queryKey: ['popularServices'],
    queryFn: () => recommendationService.getPopularServices(10),
    enabled,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour - popular services don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Fetch personalized recommendations for logged-in user
 */
export const usePersonalizedServiceRecommendations = (enabled = true) => {
  return useQuery({
    queryKey: ['personalizedServiceRecommendations'],
    queryFn: () => recommendationService.getPersonalizedServiceRecommendations(10),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes - more fresh for personalized
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

/**
 * Fetch services related to a specific service
 */
export const useRelatedServices = (serviceId, enabled = true) => {
  return useQuery({
    queryKey: ['relatedServices', serviceId],
    queryFn: () => recommendationService.getRelatedServices(serviceId, 6),
    enabled: enabled && !!serviceId,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Fetch services in same category as reference service
 * Used as fallback for related services
 */
export const useServicesByCategory = (categoryId, excludeServiceId, enabled = true) => {
  return useQuery({
    queryKey: ['servicesByCategory', categoryId, excludeServiceId],
    queryFn: () => recommendationService.getServicesByCategory(categoryId, excludeServiceId, 6),
    enabled: enabled && !!categoryId && !!excludeServiceId,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Fetch services frequently booked with a specific service
 */
export const useFrequentlyBookedTogether = (serviceId, enabled = true) => {
  return useQuery({
    queryKey: ['frequentlyBookedTogether', serviceId],
    queryFn: () => recommendationService.getFrequentlyBookedTogether(serviceId, 6),
    enabled: enabled && !!serviceId,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Mutation: Mark a recommendation as clicked
 */
export const useMarkRecommendationAsClicked = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recommendationId) => 
      recommendationService.markRecommendationAsClicked(recommendationId),
    onSuccess: () => {
      // Non-blocking: don't update UI
    },
  });
};

/**
 * Mutation: Dismiss a recommendation
 */
export const useDismissRecommendation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recommendationId) => 
      recommendationService.dismissRecommendation(recommendationId),
    onSuccess: () => {
      // Invalidate recommendations queries so UI updates
      queryClient.invalidateQueries({ queryKey: ['personalizedServiceRecommendations'] });
      queryClient.invalidateQueries({ queryKey: ['popularServices'] });
    },
  });
};

/**
 * Fetch trending services in specific category
 */
export const useTrendingServicesByCategory = (categoryId, enabled = true) => {
  return useQuery({
    queryKey: ['trendingServicesByCategory', categoryId],
    queryFn: () => recommendationService.getTrendingServicesByCategory(categoryId, 6),
    enabled: enabled && !!categoryId,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Fetch top-rated services
 */
export const useTopRatedServices = (enabled = true) => {
  return useQuery({
    queryKey: ['topRatedServices'],
    queryFn: () => recommendationService.getTopRatedServices(10),
    enabled,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Fetch services by price range
 */
export const useServicesByPriceRange = (minPrice, maxPrice, excludeServiceId, enabled = true) => {
  return useQuery({
    queryKey: ['servicesByPriceRange', minPrice, maxPrice, excludeServiceId],
    queryFn: () => recommendationService.getServicesByPriceRange(minPrice, maxPrice, excludeServiceId, 6),
    enabled: enabled && minPrice !== undefined && maxPrice !== undefined && !!excludeServiceId,
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
