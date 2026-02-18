import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import * as roommateService from '@/services/roommates'

/**
 * Hook to fetch paginated roommate listings with automatic campus filtering
 * By default, only shows roommates from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useRoommates = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();
  
  const enhancedFilters = {
    page,
    limit,
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['roommates', enhancedFilters],
    queryFn: () => roommateService.fetchRoommates(page, limit, filters),
    enabled: !!user, // Only fetch if user is authenticated
    staleTime: 0, // Always consider data stale so it refetches
    gcTime: 5 * 60 * 1000 // 5 minutes (formerly cacheTime)
  })
}

/**
 * Hook to fetch single roommate listing
 */
export const useRoommateDetails = (id) => {
  return useQuery({
    queryKey: ['roommate', id],
    queryFn: () => roommateService.fetchRoommateById(id),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!id
  })
}

/**
 * Hook to fetch user's roommate listings
 */
export const useMyRoommates = () => {
  return useQuery({
    queryKey: ['myRoommates'],
    queryFn: roommateService.fetchMyRoommates,
    staleTime: 0,
    gcTime: 5 * 60 * 1000
  })
}

/**
 * Hook to create roommate listing
 */
export const useCreateRoommate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roommateData) => roommateService.createRoommate(roommateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
      queryClient.invalidateQueries({ queryKey: ['myRoommates'] })
    }
  })
}

/**
 * Hook to update roommate listing
 */
export const useUpdateRoommate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updateData }) => roommateService.updateRoommate(id, updateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roommate', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
      queryClient.invalidateQueries({ queryKey: ['myRoommates'] })
    }
  })
}

/**
 * Hook to delete roommate listing
 */
export const useDeleteRoommate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => roommateService.deleteRoommate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
      queryClient.invalidateQueries({ queryKey: ['myRoommates'] })
    }
  })
}

/**
 * Hook to search roommates
 */
export const useSearchRoommates = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchRoommates', query, filters],
    queryFn: () => roommateService.searchRoommates(query, filters),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!query
  })
}

/**
 * Hook to fetch roommate applicants
 */
export const useRoommateApplicants = (roommateId) => {
  return useQuery({
    queryKey: ['roommateApplicants', roommateId],
    queryFn: () => roommateService.fetchRoommateApplicants(roommateId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!roommateId
  })
}

/**
 * Hook to fetch trending roommates
 */
export const useTrendingRoommates = () => {
  return useQuery({
    queryKey: ['trendingRoommates'],
    queryFn: roommateService.fetchTrendingRoommates,
    staleTime: 0,
    gcTime: 5 * 60 * 1000
  })
}

/**
 * Hook to fetch recommended roommates
 */
export const useRecommendedRoommates = () => {
  return useQuery({
    queryKey: ['recommendedRoommates'],
    queryFn: roommateService.fetchRecommendedRoommates,
    staleTime: 0,
    gcTime: 5 * 60 * 1000
  })
}

export default {
  useRoommates,
  useRoommateDetails,
  useMyRoommates,
  useCreateRoommate,
  useUpdateRoommate,
  useDeleteRoommate,
  useSearchRoommates,
  useRoommateApplicants,
  useTrendingRoommates,
  useRecommendedRoommates
}
