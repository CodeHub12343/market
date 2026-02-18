'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recommendationService from '@/services/recommendations';

/**
 * Hook to fetch trending products
 */
export const useTrendingRecommendations = (params = {}) => {
  return useQuery({
    queryKey: ['trendingRecommendations', params],
    queryFn: () => recommendationService.getTrendingRecommendations(params),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch personalized recommendations for logged-in user
 */
export const usePersonalizedRecommendations = (params = {}) => {
  return useQuery({
    queryKey: ['personalizedRecommendations', params],
    queryFn: () => recommendationService.getPersonalizedRecommendations(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to fetch product-specific recommendations
 */
export const useProductRecommendations = (productId, params = {}) => {
  return useQuery({
    queryKey: ['productRecommendations', productId, params],
    queryFn: () => recommendationService.getProductRecommendations(productId, params),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch related products (fallback)
 */
export const useRelatedProducts = (productId, categoryId, limit = 6) => {
  return useQuery({
    queryKey: ['relatedProducts', productId, categoryId, limit],
    queryFn: () => recommendationService.getRelatedProducts(productId, categoryId, limit),
    enabled: !!productId && !!categoryId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch frequently bought together products
 */
export const useFrequentlyBoughtTogether = (productId, limit = 4) => {
  return useQuery({
    queryKey: ['frequentlyBoughtTogether', productId, limit],
    queryFn: () => recommendationService.getFrequentlyBoughtTogether(productId, limit),
    enabled: !!productId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};

/**
 * Mutation to track recommendation click
 */
export const useTrackRecommendationClick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recommendationId) =>
      recommendationService.markRecommendationAsClicked(recommendationId),
    onSuccess: () => {
      // Invalidate recommendation queries to potentially show different items next time
      queryClient.invalidateQueries({
        queryKey: ['productRecommendations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['personalizedRecommendations'],
      });
    },
  });
};

/**
 * Mutation to dismiss recommendation
 */
export const useDismissRecommendation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recommendationId) =>
      recommendationService.dismissRecommendation(recommendationId),
    onSuccess: () => {
      // Invalidate recommendation queries
      queryClient.invalidateQueries({
        queryKey: ['productRecommendations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['personalizedRecommendations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['trendingRecommendations'],
      });
    },
  });
};
