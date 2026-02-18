'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadEventImages,
  getEventImages,
  deleteEventImage,
  addEventVideo,
  getEventVideos,
  deleteEventVideo,
  uploadAttendeePhotos,
  getAttendeePhotos,
  deleteAttendeePhoto,
  likeAttendeePhoto,
  getEventHighlights,
  createEventHighlights,
  updateEventHighlights,
  deleteEventHighlights,
  getEventMediaStats
} from '@/services/eventMediaService';

const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 30 * 60 * 1000,
  LONG: 60 * 60 * 1000,
  VERY_LONG: 24 * 60 * 60 * 1000
};

// ==================== IMAGE HOOKS ====================

/**
 * Get event images
 */
export const useEventImages = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-images', eventId],
    queryFn: () => getEventImages(eventId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Upload event images (mutation)
 */
export const useUploadEventImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, files }) => uploadEventImages(eventId, files),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-images', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

/**
 * Delete event image (mutation)
 */
export const useDeleteEventImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, imageId }) => deleteEventImage(eventId, imageId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-images', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

// ==================== VIDEO HOOKS ====================

/**
 * Get event videos
 */
export const useEventVideos = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-videos', eventId],
    queryFn: () => getEventVideos(eventId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Add event video (mutation)
 */
export const useAddEventVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, videoData }) => addEventVideo(eventId, videoData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-videos', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

/**
 * Delete event video (mutation)
 */
export const useDeleteEventVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, videoId }) => deleteEventVideo(eventId, videoId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-videos', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

// ==================== ATTENDEE PHOTO HOOKS ====================

/**
 * Get attendee photos
 */
export const useAttendeePhotos = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['attendee-photos', eventId],
    queryFn: () => getAttendeePhotos(eventId),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Upload attendee photos (mutation)
 */
export const useUploadAttendeePhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, files }) => uploadAttendeePhotos(eventId, files),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendee-photos', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

/**
 * Delete attendee photo (mutation)
 */
export const useDeleteAttendeePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, photoId }) => deleteAttendeePhoto(eventId, photoId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendee-photos', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-media-stats', eventId] });
    }
  });
};

/**
 * Like attendee photo (mutation)
 */
export const useLikeAttendeePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, photoId }) => likeAttendeePhoto(eventId, photoId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendee-photos', eventId] });
    }
  });
};

// ==================== HIGHLIGHTS HOOKS ====================

/**
 * Get event highlights
 */
export const useEventHighlights = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-highlights', eventId],
    queryFn: () => getEventHighlights(eventId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Create event highlights (mutation)
 */
export const useCreateEventHighlights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, highlightsData }) => createEventHighlights(eventId, highlightsData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-highlights', eventId] });
    }
  });
};

/**
 * Update event highlights (mutation)
 */
export const useUpdateEventHighlights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, highlightsData }) => updateEventHighlights(eventId, highlightsData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-highlights', eventId] });
    }
  });
};

/**
 * Delete event highlights (mutation)
 */
export const useDeleteEventHighlights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => deleteEventHighlights(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event-highlights', eventId] });
    }
  });
};

// ==================== STATS HOOKS ====================

/**
 * Get event media stats
 */
export const useEventMediaStats = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-media-stats', eventId],
    queryFn: () => getEventMediaStats(eventId),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled: !!eventId && enabled,
    retry: 1
  });
};
