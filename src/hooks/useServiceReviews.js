import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewService from '@/services/serviceReviews';

/**
 * Hook to fetch reviews for a service
 */
export const useServiceReviews = (serviceId, params = {}) => {
  return useQuery({
    queryKey: ['serviceReviews', serviceId, params],
    queryFn: () => reviewService.fetchServiceReviews(serviceId, params),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user's own service reviews
 */
export const useMyServiceReviews = (params = {}) => {
  return useQuery({
    queryKey: ['myServiceReviews', params],
    queryFn: () => reviewService.fetchMyServiceReviews(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get single service review
 */
export const useServiceReviewById = (reviewId, enabled = true) => {
  return useQuery({
    queryKey: ['serviceReview', reviewId],
    queryFn: () => reviewService.fetchServiceReviewById(reviewId),
    enabled: !!reviewId && enabled,
  });
};

/**
 * Hook to create service review
 */
export const useCreateServiceReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, reviewData }) =>
      reviewService.createServiceReview(serviceId, reviewData),
    onSuccess: (newReview, { serviceId }) => {
      // Invalidate all variations of service reviews query for this service
      queryClient.invalidateQueries({
        queryKey: ['serviceReviews', serviceId],
        exact: false, // Match any params
      });
      queryClient.invalidateQueries({ queryKey: ['myServiceReviews'] });
      queryClient.invalidateQueries({ queryKey: ['serviceRatingStats', serviceId] });
    },
  });
};

/**
 * Hook to update service review
 */
export const useUpdateServiceReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      reviewService.updateServiceReview(reviewId, reviewData),
    onSuccess: (updatedReview, { reviewId }) => {
      queryClient.setQueryData(['serviceReview', reviewId], updatedReview);
      queryClient.invalidateQueries({ 
        queryKey: ['serviceReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['myServiceReviews'] });
      queryClient.invalidateQueries({ 
        queryKey: ['serviceRatingStats'],
        exact: false,
      });
    },
  });
};

/**
 * Hook to delete service review
 */
export const useDeleteServiceReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.deleteServiceReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['serviceReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['myServiceReviews'] });
      queryClient.invalidateQueries({ 
        queryKey: ['serviceRatingStats'],
        exact: false,
      });
    },
  });
};

/**
 * Hook to mark service review as helpful
 */
export const useMarkServiceReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.markServiceReviewHelpful,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['serviceReviews'],
        exact: false,
      });
      queryClient.invalidateQueries({ 
        queryKey: ['serviceRatingStats'],
        exact: false,
      });
    },
  });
};

/**
 * Hook to get service rating stats
 */
export const useServiceRatingStats = (serviceId) => {
  return useQuery({
    queryKey: ['serviceRatingStats', serviceId],
    queryFn: () => reviewService.getServiceRatingStats(serviceId),
    enabled: !!serviceId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
