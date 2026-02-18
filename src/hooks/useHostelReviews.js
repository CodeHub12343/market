import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as hostelReviewService from '@/services/hostelReviews';

/**
 * Hook for fetching hostel reviews
 */
export const useHostelReviews = (hostelId, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['hostelReviews', hostelId, params],
    queryFn: () => hostelReviewService.fetchHostelReviews(hostelId, params),
    enabled: !!hostelId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * Hook for fetching user's hostel reviews
 */
export const useMyHostelReviews = (params = {}) => {
  return useQuery({
    queryKey: ['myHostelReviews', params],
    queryFn: () => hostelReviewService.fetchMyHostelReviews(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * Hook for fetching single review
 */
export const useHostelReviewById = (reviewId, enabled = true) => {
  return useQuery({
    queryKey: ['hostelReview', reviewId],
    queryFn: () => hostelReviewService.fetchHostelReviewById(reviewId),
    enabled: !!reviewId && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for creating hostel review
 */
export const useCreateHostelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelId, reviewData }) =>
      hostelReviewService.createHostelReview(hostelId, reviewData),
    onSuccess: (data, variables) => {
      // Invalidate reviews list
      queryClient.invalidateQueries({
        queryKey: ['hostelReviews', variables.hostelId]
      });
      // Invalidate my reviews
      queryClient.invalidateQueries({
        queryKey: ['myHostelReviews']
      });
      // Invalidate rating stats
      queryClient.invalidateQueries({
        queryKey: ['hostelRatingStats', variables.hostelId]
      });
      // Invalidate hostel data to show updated ratings
      queryClient.invalidateQueries({
        queryKey: ['hostels', variables.hostelId]
      });
      // Invalidate all hostels list to update cards
      queryClient.invalidateQueries({
        queryKey: ['hostels']
      });
    },
  });
};

/**
 * Hook for updating hostel review
 */
export const useUpdateHostelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      hostelReviewService.updateHostelReview(reviewId, reviewData),
    onSuccess: (data) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ['hostelReviews']
      });
      queryClient.invalidateQueries({
        queryKey: ['myHostelReviews']
      });
      queryClient.invalidateQueries({
        queryKey: ['hostelReview', data._id]
      });
      // Invalidate hostel data to show updated ratings
      queryClient.invalidateQueries({
        queryKey: ['hostels']
      });
    },
  });
};

/**
 * Hook for deleting hostel review
 */
export const useDeleteHostelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) =>
      hostelReviewService.deleteHostelReview(reviewId),
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({
        queryKey: ['hostelReviews']
      });
      queryClient.invalidateQueries({
        queryKey: ['myHostelReviews']
      });
      // Invalidate hostel data to show updated ratings
      queryClient.invalidateQueries({
        queryKey: ['hostels']
      });
    },
  });
};

/**
 * Hook for marking review as helpful
 */
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) =>
      hostelReviewService.markReviewHelpful(reviewId),
    onSuccess: () => {
      // Invalidate reviews to show updated helpful count
      queryClient.invalidateQueries({
        queryKey: ['hostelReviews']
      });
    },
  });
};

/**
 * Hook for getting rating statistics
 */
export const useHostelRatingStats = (hostelId, enabled = true) => {
  return useQuery({
    queryKey: ['hostelRatingStats', hostelId],
    queryFn: () => hostelReviewService.getHostelRatingStats(hostelId),
    enabled: !!hostelId && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export default {
  useHostelReviews,
  useMyHostelReviews,
  useHostelReviewById,
  useCreateHostelReview,
  useUpdateHostelReview,
  useDeleteHostelReview,
  useMarkReviewHelpful,
  useHostelRatingStats
};
