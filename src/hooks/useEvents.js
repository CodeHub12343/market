import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as eventService from '@/services/events';

/**
 * Hook for fetching all events with automatic campus filtering
 * By default, only shows events from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useAllEvents = (filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['events', enhancedFilters],
    queryFn: () => eventService.fetchEventsPaginated(
      enhancedFilters.page || 1,
      enhancedFilters.limit || 12,
      enhancedFilters
    ),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user, // Only fetch if authenticated
  });
};

/**
 * Hook for fetching single event by ID
 */
export const useEvent = (id, enabled = true) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.fetchEventById(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for fetching user's events
 */
export const useMyEvents = (params = {}) => {
  return useQuery({
    queryKey: ['myEvents', params],
    queryFn: () => eventService.fetchMyEvents(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for creating event
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventData, bannerImage }) =>
      eventService.createEvent(eventData, bannerImage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
      // Store creator info in localStorage for ownership verification
      if (data._id) {
        const creatorMap = JSON.parse(localStorage.getItem('eventCreators') || '{}');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user._id) {
          creatorMap[data._id] = user._id;
          localStorage.setItem('eventCreators', JSON.stringify(creatorMap));
        }
      }
    },
  });
};

/**
 * Hook for updating event
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventData, bannerImage }) =>
      eventService.updateEvent(id, eventData, bannerImage),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
    },
  });
};

/**
 * Hook for deleting event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['myEvents'] });
    },
  });
};

/**
 * Hook for joining event
 */
export const useJoinEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eventService.joinEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', data._id] });
    },
  });
};

/**
 * Hook for leaving event
 */
export const useLeaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eventService.leaveEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', data._id] });
    },
  });
};

/**
 * Hook for toggling favorite event
 */
export const useToggleFavoriteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eventService.toggleFavoriteEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', data._id] });
    },
  });
};

/**
 * Hook for adding event rating
 */
export const useAddEventRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating, comment }) =>
      eventService.addEventRating(id, rating, comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events', data._id] });
    },
  });
};

/**
 * Hook for adding event comment
 */
export const useAddEventComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, comment }) => {
      // Debug: log inputs received by mutation function
      try {
        if (typeof window !== 'undefined') {
          console.debug('[useAddEventComment] mutationFn received', { eventId, comment });
        } else {
          console.log('[useAddEventComment] mutationFn received', { eventId, comment });
        }
      } catch (e) {
        // ignore
      }
      return eventService.addEventComment(eventId, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventComments'] });
    },
  });
};

/**
 * Hook for getting event comments
 */
export const useEventComments = (eventId, page = 1) => {
  return useQuery({
    queryKey: ['eventComments', eventId, page],
    queryFn: () => eventService.getEventComments(eventId, page),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for searching events
 */
export const useSearchEvents = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchEvents', query, filters],
    queryFn: () => eventService.searchEvents(query, filters),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook for getting popular events
 */
export const usePopularEvents = (limit = 6) => {
  return useQuery({
    queryKey: ['popularEvents', limit],
    queryFn: () => eventService.getPopularEvents(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * Hook for getting trending events
 */
export const useTrendingEvents = (limit = 6) => {
  return useQuery({
    queryKey: ['trendingEvents', limit],
    queryFn: () => eventService.getTrendingEvents(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
