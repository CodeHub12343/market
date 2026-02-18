'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as favService from '@/services/favorites';

/**
 * Hook to fetch all favorites for current user
 */
export const useFavorites = (params = {}) => {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => favService.fetchFavorites(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch favorites by item type (e.g., 'Product')
 */
export const useFavoritesByType = (itemType = 'Product', params = {}) => {
  return useQuery({
    queryKey: ['favorites', itemType, params],
    queryFn: () => favService.fetchFavoritesByType(itemType, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to check if specific product is favorited
 */
export const useIsFavorited = (itemId, itemType = 'Product', enabled = true) => {
  return useQuery({
    queryKey: ['favorites', 'check', itemId],
    queryFn: async () => {
      const favorites = await favService.fetchFavorites();
      return favorites.some(
        (fav) => fav.item._id === itemId && fav.itemType === itemType
      );
    },
    enabled: !!itemId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to toggle favorite (add/remove)
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, itemType = 'Product' }) =>
      favService.toggleFavorite(itemId, itemType),
    onSuccess: () => {
      // Invalidate favorites queries to refetch
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
    },
  });
};

/**
 * Hook to delete a favorite
 */
export const useDeleteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favoriteId) => favService.deleteFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Error deleting favorite:', error);
    },
  });
};

/**
 * Hook to search favorites
 */
export const useSearchFavorites = (q, params = {}) => {
  return useQuery({
    queryKey: ['favorites', 'search', q, params],
    queryFn: () => favService.searchFavorites(q, params),
    enabled: !!q,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update favorite metadata (tags, notes, priority)
 */
export const useUpdateFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ favoriteId, updateData }) =>
      favService.updateFavorite(favoriteId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Error updating favorite:', error);
    },
  });
};
