import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as reviewsService from '@/services/roommateReviews'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const CACHE_TIME = 10 * 60 * 1000 // 10 minutes

/**
 * Hook to fetch reviews for a roommate
 */
export const useRoommateReviews = (roommateId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['roommateReviews', roommateId, page, limit],
    queryFn: () => reviewsService.fetchRoommateReviews(roommateId, page, limit),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!roommateId
  })
}

/**
 * Hook to create roommate review
 */
export const useCreateRoommateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roommateId, reviewData }) =>
      reviewsService.createRoommateReview(roommateId, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roommateReviews', variables.roommateId] })
      queryClient.invalidateQueries({ queryKey: ['roommateStats', variables.roommateId] })
    }
  })
}

/**
 * Hook to update roommate review
 */
export const useUpdateRoommateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, updateData }) =>
      reviewsService.updateRoommateReview(reviewId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommateReviews'] })
    }
  })
}

/**
 * Hook to delete roommate review
 */
export const useDeleteRoommateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId) => reviewsService.deleteRoommateReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommateReviews'] })
    }
  })
}

/**
 * Hook to fetch roommate review stats
 */
export const useRoommateReviewStats = (roommateId) => {
  return useQuery({
    queryKey: ['roommateStats', roommateId],
    queryFn: () => reviewsService.fetchRoommateReviewStats(roommateId),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!roommateId
  })
}

export default {
  useRoommateReviews,
  useCreateRoommateReview,
  useUpdateRoommateReview,
  useDeleteRoommateReview,
  useRoommateReviewStats
}
