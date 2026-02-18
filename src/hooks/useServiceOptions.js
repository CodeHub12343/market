// src/hooks/useServiceOptions.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as serviceOptionsService from '@/services/serviceOptions';

/**
 * Hook to fetch all options for a service
 */
export const useServiceOptions = (serviceId, enabled = true) => {
  return useQuery({
    queryKey: ['serviceOptions', serviceId],
    queryFn: () => serviceOptionsService.getServiceOptions(serviceId),
    enabled: !!serviceId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a single service option
 */
export const useCreateServiceOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, optionData }) =>
      serviceOptionsService.createServiceOption(serviceId, optionData),
    onSuccess: (newOption, { serviceId }) => {
      // Invalidate options list
      queryClient.invalidateQueries({ queryKey: ['serviceOptions', serviceId] });
    },
    onError: (error) => {
      console.error('Create option error:', error);
    }
  });
};

/**
 * Hook to create multiple service options at once
 */
export const useCreateServiceOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, options }) =>
      serviceOptionsService.createServiceOptions(serviceId, options),
    onSuccess: (newOptions, { serviceId }) => {
      // Set in cache and invalidate
      queryClient.setQueryData(['serviceOptions', serviceId], newOptions);
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] });
    },
    onError: (error) => {
      console.error('Create options error:', error);
    }
  });
};

/**
 * Hook to update a service option
 */
export const useUpdateServiceOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, optionId, updates }) =>
      serviceOptionsService.updateServiceOption(serviceId, optionId, updates),
    onSuccess: (updatedOption, { serviceId }) => {
      // Invalidate options list
      queryClient.invalidateQueries({ queryKey: ['serviceOptions', serviceId] });
    },
    onError: (error) => {
      console.error('Update option error:', error);
    }
  });
};

/**
 * Hook to delete a service option
 */
export const useDeleteServiceOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, optionId }) =>
      serviceOptionsService.deleteServiceOption(serviceId, optionId),
    onSuccess: (_, { serviceId }) => {
      // Invalidate options list
      queryClient.invalidateQueries({ queryKey: ['serviceOptions', serviceId] });
    },
    onError: (error) => {
      console.error('Delete option error:', error);
    }
  });
};

/**
 * Hook to reorder service options
 */
export const useReorderServiceOptions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, optionIds }) =>
      serviceOptionsService.reorderServiceOptions(serviceId, optionIds),
    onSuccess: (reorderedOptions, { serviceId }) => {
      // Update cache
      queryClient.setQueryData(['serviceOptions', serviceId], reorderedOptions);
    },
    onError: (error) => {
      console.error('Reorder options error:', error);
    }
  });
};
