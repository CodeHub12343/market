import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as favoritesService from '@/services/roommateFavorites'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const CACHE_TIME = 10 * 60 * 1000 // 10 minutes

/**
 * Hook to fetch user's favorite roommate listings
 */
export const useFavoriteRoommates = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['favoriteRoommates', page, limit],
    queryFn: () => favoritesService.fetchFavoriteRoommates(page, limit),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME
  })
}

/**
 * Hook to toggle roommate favorite
 */
export const useToggleRoommateFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ roommateId, isFavorited }) => {
      if (isFavorited) {
        return favoritesService.removeRoommateFromFavorites(roommateId)
      } else {
        return favoritesService.addRoommateToFavorites(roommateId)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteRoommates'] })
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
    }
  })
}

/**
 * Hook to add roommate to favorites
 */
export const useAddRoommateToFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roommateId) => favoritesService.addRoommateToFavorites(roommateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteRoommates'] })
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
    }
  })
}

/**
 * Hook to remove roommate from favorites
 */
export const useRemoveRoommateFromFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roommateId) => favoritesService.removeRoommateFromFavorites(roommateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteRoommates'] })
      queryClient.invalidateQueries({ queryKey: ['roommates'] })
    }
  })
}

/**
 * Hook to check if roommate is favorited
 */
export const useCheckRoommateFavorited = (roommateId) => {
  return useQuery({
    queryKey: ['roommateFavorited', roommateId],
    queryFn: () => favoritesService.checkRoommateFavorited(roommateId),
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: !!roommateId
  })
}

export default {
  useFavoriteRoommates,
  useToggleRoommateFavorite,
  useAddRoommateToFavorites,
  useRemoveRoommateFromFavorites,
  useCheckRoommateFavorited
}
