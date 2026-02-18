import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as serviceFavoritesService from '@/services/serviceFavorites';

/**
 * Fetch all favorited services with pagination
 */
export const useServiceFavorites = (params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['serviceFavorites', params],
    queryFn: () => serviceFavoritesService.fetchServiceFavorites(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled
  });
};

/**
 * Fetch favorited services filtered by type/category
 */
export const useServiceFavoritesByType = (type, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['serviceFavoritesByType', type, params],
    queryFn: () => serviceFavoritesService.fetchServiceFavoritesByType(type, params),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: enabled && !!type
  });
};

/**
 * Check if a specific service is favorited
 */
export const useIsServiceFavorited = (serviceId, enabled = true) => {
  return useQuery({
    queryKey: ['isServiceFavorited', serviceId],
    queryFn: () => serviceFavoritesService.checkServiceIsFavorited(serviceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: enabled && !!serviceId
  });
};

/**
 * Toggle service favorite status
 */
export const useToggleServiceFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId) => serviceFavoritesService.toggleServiceFavorite(serviceId),
    onSuccess: (data, serviceId) => {
      // Invalidate favorite-related queries
      queryClient.invalidateQueries({ queryKey: ['serviceFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['isServiceFavorited', serviceId] });
      queryClient.invalidateQueries({ queryKey: ['serviceFavoritesByType'] });
    },
    onError: (error) => {
      console.error('Failed to toggle service favorite:', error);
    }
  });
};

/**
 * Delete/remove service from favorites
 */
export const useDeleteServiceFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId) => serviceFavoritesService.deleteServiceFavorite(serviceId),
    onSuccess: (data, serviceId) => {
      // Invalidate favorite-related queries
      queryClient.invalidateQueries({ queryKey: ['serviceFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['isServiceFavorited', serviceId] });
      queryClient.invalidateQueries({ queryKey: ['serviceFavoritesByType'] });
    },
    onError: (error) => {
      console.error('Failed to delete service favorite:', error);
    }
  });
};

/**
 * Search within favorited services
 */
export const useSearchServiceFavorites = (query, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['searchServiceFavorites', query, params],
    queryFn: () => serviceFavoritesService.searchServiceFavorites(query, params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    enabled: enabled && !!query
  });
};

/**
 * Update service favorite metadata
 */
export const useUpdateServiceFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ favoriteId, metadata }) =>
      serviceFavoritesService.updateServiceFavorite(favoriteId, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceFavorites'] });
    },
    onError: (error) => {
      console.error('Failed to update service favorite:', error);
    }
  });
};

/**
 * Get service follow notifications
 */
export const useServiceFollowNotifications = (serviceId, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['serviceFollowNotifications', serviceId, params],
    queryFn: () => serviceFavoritesService.getServiceFollowNotifications(serviceId, params),
    staleTime: 1 * 60 * 1000, // 1 minute (notifications are fresh)
    gcTime: 5 * 60 * 1000,
    enabled: enabled && !!serviceId
  });
};

/**
 * Mark notification as read
 */
export const useMarkServiceNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) =>
      serviceFavoritesService.markServiceNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceFollowNotifications'] });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    }
  });
};

/**
 * Update service follow notification preferences
 */
export const useUpdateServiceFollowPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, preferences }) =>
      serviceFavoritesService.updateServiceFollowPreferences(serviceId, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceFollowNotifications'] });
    },
    onError: (error) => {
      console.error('Failed to update follow preferences:', error);
    }
  });
};

/**
 * Get all followed services
 */
export const useFollowedServices = (params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['followedServices', params],
    queryFn: () => serviceFavoritesService.getFollowedServices(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled
  });
};
