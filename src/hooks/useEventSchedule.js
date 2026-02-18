'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEventAgenda,
  getEventSpeakers,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
  addEventSpeaker,
  updateEventSpeaker,
  removeEventSpeaker,
  generateAgendaPDF,
  getSessionDetails,
  getSpeakerDetails,
  reorderAgendaItems
} from '@/services/eventScheduleService';

const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 30 * 60 * 1000,
  LONG: 60 * 60 * 1000,
  VERY_LONG: 24 * 60 * 60 * 1000
};

// ==================== AGENDA HOOKS ====================

/**
 * Get event agenda/schedule
 */
export const useEventAgenda = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-agenda', eventId],
    queryFn: () => getEventAgenda(eventId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Get session details
 */
export const useSessionDetails = (eventId, sessionId, enabled = true) => {
  return useQuery({
    queryKey: ['session-details', eventId, sessionId],
    queryFn: () => getSessionDetails(eventId, sessionId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && !!sessionId && enabled,
    retry: 1
  });
};

/**
 * Create agenda item (mutation)
 */
export const useCreateAgendaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agendaData }) => createAgendaItem(eventId, agendaData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-agenda', eventId] });
    }
  });
};

/**
 * Update agenda item (mutation)
 */
export const useUpdateAgendaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agendaId, agendaData }) =>
      updateAgendaItem(eventId, agendaId, agendaData),
    onSuccess: (_, { eventId, agendaId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-agenda', eventId] });
      queryClient.invalidateQueries({ queryKey: ['session-details', eventId, agendaId] });
    }
  });
};

/**
 * Delete agenda item (mutation)
 */
export const useDeleteAgendaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agendaId }) => deleteAgendaItem(eventId, agendaId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-agenda', eventId] });
    }
  });
};

/**
 * Reorder agenda items (mutation)
 */
export const useReorderAgendaItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agendaOrder }) => reorderAgendaItems(eventId, agendaOrder),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-agenda', eventId] });
    }
  });
};

// ==================== SPEAKER HOOKS ====================

/**
 * Get event speakers
 */
export const useEventSpeakers = (eventId, enabled = true) => {
  return useQuery({
    queryKey: ['event-speakers', eventId],
    queryFn: () => getEventSpeakers(eventId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && enabled,
    retry: 1
  });
};

/**
 * Get speaker details
 */
export const useSpeakerDetails = (eventId, speakerId, enabled = true) => {
  return useQuery({
    queryKey: ['speaker-details', eventId, speakerId],
    queryFn: () => getSpeakerDetails(eventId, speakerId),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!eventId && !!speakerId && enabled,
    retry: 1
  });
};

/**
 * Add event speaker (mutation)
 */
export const useAddEventSpeaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, speakerData }) => addEventSpeaker(eventId, speakerData),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-speakers', eventId] });
    }
  });
};

/**
 * Update event speaker (mutation)
 */
export const useUpdateEventSpeaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, speakerId, speakerData }) =>
      updateEventSpeaker(eventId, speakerId, speakerData),
    onSuccess: (_, { eventId, speakerId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-speakers', eventId] });
      queryClient.invalidateQueries({ queryKey: ['speaker-details', eventId, speakerId] });
    }
  });
};

/**
 * Remove event speaker (mutation)
 */
export const useRemoveEventSpeaker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, speakerId }) => removeEventSpeaker(eventId, speakerId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-speakers', eventId] });
    }
  });
};

// ==================== PDF & DOWNLOAD HOOKS ====================

/**
 * Generate agenda PDF
 */
export const useGenerateAgendaPDF = () => {
  return useMutation({
    mutationFn: ({ eventId, eventData }) => generateAgendaPDF(eventId, eventData),
    onError: (error) => {
      console.error('Failed to generate PDF:', error);
    }
  });
};
