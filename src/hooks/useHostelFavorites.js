import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as hostelFavService from '@/services/hostelFavorites';

/**
 * Hook for fetching all favorite hostels
 */
export const useFavoriteHostels = (params = {}) => {
  return useQuery({
    queryKey: ['favoriteHostels', params],
    queryFn: () => hostelFavService.fetchFavoriteHostels(params),
    staleTime: 1000 * 60 * 2, // 2 minutes (user-specific data)
    retry: 1,
  });
};

/**
 * Hook for fetching favorite hostels by type
 */
export const useFavoriteHostelsByType = (type, params = {}) => {
  return useQuery({
    queryKey: ['favoriteHostels', type, params],
    queryFn: () => hostelFavService.fetchFavoriteHostelsByType(type, params),
    enabled: !!type,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook for checking if a hostel is favorited
 */
export const useIsFavorited = (hostelId) => {
  return useQuery({
    queryKey: ['isFavorited', hostelId],
    queryFn: () => hostelFavService.checkIsFavorited(hostelId),
    enabled: !!hostelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook for toggling favorite status
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => hostelFavService.toggleHostelFavorite(hostelId),
    onSuccess: (data, hostelId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['isFavorited', hostelId] });
      queryClient.invalidateQueries({ queryKey: ['favoriteHostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels', hostelId] });
      
      // Update favorite count
      queryClient.invalidateQueries({ queryKey: ['favoriteCount', hostelId] });
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
    }
  });
};

/**
 * Hook for deleting a favorite hostel
 */
export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostelId) => hostelFavService.deleteFavoriteHostel(hostelId),
    onSuccess: (data, hostelId) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteHostels'] });
      queryClient.invalidateQueries({ queryKey: ['isFavorited', hostelId] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount', hostelId] });
    },
    onError: (error) => {
      console.error('Error deleting favorite:', error);
    }
  });
};

/**
 * Hook for searching favorite hostels
 */
export const useSearchFavoriteHostels = (query, params = {}) => {
  return useQuery({
    queryKey: ['searchFavoriteHostels', query, params],
    queryFn: () => hostelFavService.searchFavoriteHostels(query, params),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook for updating favorite metadata
 */
export const useUpdateFavoriteMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostelId, metadata }) => 
      hostelFavService.updateFavoriteMetadata(hostelId, metadata),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteHostels'] });
      queryClient.invalidateQueries({ queryKey: ['hostels', variables.hostelId] });
    },
    onError: (error) => {
      console.error('Error updating favorite metadata:', error);
    }
  });
};

/**
 * Hook for getting favorite count for a hostel
 */
export const useFavoriteCount = (hostelId) => {
  return useQuery({
    queryKey: ['favoriteCount', hostelId],
    queryFn: () => hostelFavService.getFavoriteCount(hostelId),
    enabled: !!hostelId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for getting favorite statistics
 */
export const useFavoriteStats = () => {
  return useQuery({
    queryKey: ['favoriteStats'],
    queryFn: hostelFavService.getFavoriteStats,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
