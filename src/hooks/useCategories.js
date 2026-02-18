import { useQuery } from '@tanstack/react-query';
import * as categoryService from '@/services/categories';

/**
 * Hook for fetching all categories (legacy unified endpoint)
 * @deprecated Use type-specific hooks instead
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.fetchCategories(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  });
};

/**
 * Hook for fetching categories by type
 * @param {string} type - The listing type: 'product', 'service', 'event', 'hostel', 'roommate', 'request'
 * @param {boolean} enabled - Whether to enable the query
 */
export const useCategoriesByType = (type, enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'type', type],
    queryFn: () => categoryService.fetchCategoriesByType(type),
    enabled: !!type && enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching product categories
 */
export const useProductCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'product'],
    queryFn: () => categoryService.fetchCategoriesByType('product'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching service categories
 */
export const useServiceCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'service'],
    queryFn: () => categoryService.fetchCategoriesByType('service'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching event categories
 */
export const useEventCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'event'],
    queryFn: () => categoryService.fetchCategoriesByType('event'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching hostel categories
 */
export const useHostelCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'hostel'],
    queryFn: () => categoryService.fetchCategoriesByType('hostel'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching roommate categories
 */
export const useRoommateCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'roommate'],
    queryFn: () => categoryService.fetchCategoriesByType('roommate'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching request categories
 */
export const useRequestCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'request'],
    queryFn: () => categoryService.fetchCategoriesByType('request'),
    enabled,
    staleTime: 0, // Data is always stale - always refetch
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    retry: 2,
  });
};

/**
 * Hook for fetching category by ID (legacy)
 * @deprecated Use type-specific hooks instead
 */
export const useCategoryById = (id, enabled = true) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.fetchCategoryById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook for fetching a single category by type and ID
 * @param {string} type - The listing type
 * @param {string} id - Category ID
 */
export const useCategoryByTypeAndId = (type, id, enabled = true) => {
  return useQuery({
    queryKey: ['categories', 'type', type, id],
    queryFn: () => categoryService.fetchCategoryByTypeAndId(type, id),
    enabled: !!type && !!id && enabled,
  });
};

