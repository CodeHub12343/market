import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewService from '@/services/reviews';

/**
 * Helper to create stable query key for params
 */
const getParamsKey = (params = {}) => {
  return Object.keys(params).length > 0
    ? JSON.stringify(params)
    : undefined;
};

/**
 * Hook to fetch reviews for a product
 */
export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: ['productReviews', productId, getParamsKey(params)],
    queryFn: () => reviewService.fetchProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch reviews for a shop
 */
export const useShopReviews = (shopId, params = {}) => {
  return useQuery({
    queryKey: ['shopReviews', shopId, getParamsKey(params)],
    queryFn: () => reviewService.fetchShopReviews(shopId, params),
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user's own reviews
 */
export const useMyReviews = (params = {}) => {
  return useQuery({
    queryKey: ['myReviews', params],
    queryFn: () => reviewService.fetchMyReviews(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get single review
 */
export const useReviewById = (reviewId, enabled = true) => {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => reviewService.fetchReviewById(reviewId),
    enabled: !!reviewId && enabled,
  });
};

/**
 * Hook to create product review
 */
export const useCreateProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }) =>
      reviewService.createProductReview(productId, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['productReviews', variables.productId],
        exact: false, // Match any params
      });
      queryClient.invalidateQueries({
        queryKey: ['products', variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      queryClient.invalidateQueries({ queryKey: ['ratingStats', variables.productId] });
    },
  });
};

/**
 * Hook to create shop review
 */
export const useCreateShopReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shopId, reviewData }) =>
      reviewService.createShopReview(shopId, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shopReviews', variables.shopId],
      });
      queryClient.invalidateQueries({
        queryKey: ['shops', variables.shopId],
      });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

/**
 * Hook to update review
 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      reviewService.updateReview(reviewId, reviewData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['productReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ 
        queryKey: ['shopReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ 
        queryKey: ['ratingStats'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

/**
 * Hook to delete review
 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['productReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ 
        queryKey: ['shopReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ 
        queryKey: ['ratingStats'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

/**
 * Hook to mark review as helpful
 */
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.markReviewHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      queryClient.invalidateQueries({ queryKey: ['shopReviews'] });
    },
  });
};

/**
 * Hook to get rating statistics for a product/shop
 */
export const useRatingStats = (type, id) => {
  return useQuery({
    queryKey: ['ratingStats', type, id],
    queryFn: () => {
      if (type === 'product') {
        return reviewService.getProductRatingStats(id);
      } else if (type === 'shop') {
        return reviewService.getShopRatingStats(id);
      }
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
