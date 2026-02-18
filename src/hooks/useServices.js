// src/hooks/useServices.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as serviceService from '@/services/services';
import { useCallback } from 'react';

/**
 * Hook to fetch all services with automatic campus filtering
 * By default, only shows services from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useAllServices = (params = {}, enabled = true) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedParams = {
    ...params,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['services', enhancedParams],
    queryFn: () => serviceService.getAllServices(enhancedParams),
    enabled: enabled && !!user, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to fetch current user's services
 */
export const useMyServices = (enabled = true) => {
  return useQuery({
    queryKey: ['myServices'],
    queryFn: serviceService.getMyServices,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch single service
 */
export const useService = (id, enabled = true) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getServiceById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceService.createService,
    onSuccess: (newService) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
      // Optionally add to cache
      queryClient.setQueryData(['service', newService._id], newService);
    },
    onError: (error) => {
      console.error('Create service error:', error);
    }
  });
};

/**
 * Hook to update service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => serviceService.updateService(id, updates),
    onSuccess: (updatedService) => {
      // Update cache
      queryClient.setQueryData(['service', updatedService._id], updatedService);
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
    },
    onError: (error) => {
      console.error('Update service error:', error);
    }
  });
};

/**
 * Hook to delete service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
    },
    onError: (error) => {
      console.error('Delete service error:', error);
    }
  });
};

/**
 * Hook to search services
 */
export const useSearchServices = (query, params = {}, enabled = !!query) => {
  return useQuery({
    queryKey: ['servicesSearch', query, params],
    queryFn: () => serviceService.searchServices(query, params),
    enabled,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch services by category
 */
export const useServicesByCategory = (categoryId, params = {}, enabled = !!categoryId) => {
  return useQuery({
    queryKey: ['servicesByCategory', categoryId, params],
    queryFn: () => serviceService.getServicesByCategory(categoryId, params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch services by provider
 */
export const useServicesByProvider = (providerId, params = {}, enabled = !!providerId) => {
  return useQuery({
    queryKey: ['servicesByProvider', providerId, params],
    queryFn: () => serviceService.getServicesByProvider(providerId, params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to rate service
 */
export const useRateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, ratingData }) => serviceService.rateService(serviceId, ratingData),
    onSuccess: (review, variables) => {
      const { serviceId } = variables;
      // Invalidate the specific service query to refresh reviews
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] });
      // Invalidate service reviews for this specific service
      queryClient.invalidateQueries({ queryKey: ['serviceReviews', serviceId] });
      // Invalidate all services list in case ratings changed
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Rate service error:', error);
    }
  });
};

/**
 * Hook to fetch service reviews
 */
export const useServiceReviews = (serviceId, params = {}, enabled = !!serviceId) => {
  return useQuery({
    queryKey: ['serviceReviews', serviceId, params],
    queryFn: () => serviceService.getServiceReviews(serviceId, params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for advanced filtering
 */
export const useFilterServices = (filters = {}, enabled = true) => {
  return useQuery({
    queryKey: ['servicesFilter', filters],
    queryFn: () => serviceService.filterServices(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch service statistics
 */
export const useServiceStats = (serviceId, enabled = !!serviceId) => {
  return useQuery({
    queryKey: ['serviceStats', serviceId],
    queryFn: () => serviceService.getServiceStats(serviceId),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default {
  useAllServices,
  useMyServices,
  useService,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useSearchServices,
  useServicesByCategory,
  useServicesByProvider,
  useRateService,
  useServiceReviews,
  useFilterServices,
  useServiceStats
};
