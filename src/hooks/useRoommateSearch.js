import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'

const STALE_TIME = 5 * 60 * 1000 // 5 minutes
const CACHE_TIME = 15 * 60 * 1000 // 15 minutes

/**
 * Fetch roommate search suggestions based on query
 */
export const useRoommateSearchSuggestions = (query, enabled = true) => {
  return useQuery({
    queryKey: ['roommateSearchSuggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        console.log('🔍 Suggestions: Query too short', { query: query?.length })
        return []
      }
      try {
        console.log('🔍 Fetching suggestions for:', query)
        const response = await api.get('/roommate-listings/search/suggestions', {
          params: { q: query }
        })
        console.log('🔍 Suggestions response:', response.data)
        const suggestions = response.data.data?.suggestions || response.data.suggestions || []
        console.log('🔍 Extracted suggestions:', suggestions)
        return suggestions
      } catch (error) {
        console.error('❌ Error fetching roommate search suggestions:', error)
        return []
      }
    },
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: enabled && query.length >= 2
  })
}

/**
 * Fetch roommate search history for current user
 */
export const useRoommateSearchHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['roommateSearchHistory'],
    queryFn: async () => {
      try {
        const response = await api.get('/roommate-listings/search/history')
        return response.data.data?.history || response.data.history || []
      } catch (error) {
        console.error('Error fetching roommate search history:', error)
        return []
      }
    },
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: enabled
  })
}

/**
 * Fetch popular roommate searches
 */
export const usePopularRoommateSearches = (enabled = true) => {
  return useQuery({
    queryKey: ['popularRoommateSearches'],
    queryFn: async () => {
      try {
        const response = await api.get('/roommate-listings/search/popular')
        return response.data.data?.popular || response.data.popular || []
      } catch (error) {
        console.error('Error fetching popular roommate searches:', error)
        return []
      }
    },
    staleTime: STALE_TIME,
    cacheTime: CACHE_TIME,
    enabled: enabled
  })
}

/**
 * Save a roommate search
 */
export const useSaveRoommateSearch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (query) => {
      try {
        const response = await api.post('/roommate-listings/search/save', { query })
        return response.data.data || response.data
      } catch (error) {
        console.error('Error saving roommate search:', error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate history to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['roommateSearchHistory'] })
      queryClient.invalidateQueries({ queryKey: ['popularRoommateSearches'] })
    }
  })
}

/**
 * Delete a roommate search from history
 */
export const useDeleteRoommateSearchHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (historyId) => {
      try {
        const response = await api.delete(`/roommate-listings/search/history/${historyId}`)
        return response.data.data || response.data
      } catch (error) {
        console.error('Error deleting roommate search history:', error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate history to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['roommateSearchHistory'] })
    }
  })
}

export default {
  useRoommateSearchSuggestions,
  useRoommateSearchHistory,
  usePopularRoommateSearches,
  useSaveRoommateSearch,
  useDeleteRoommateSearchHistory
}
