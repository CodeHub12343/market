'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  followCategory,
  unfollowCategory,
  getFollowedCategories,
  getEventsByCategory,
  getTags,
  getTrendingTags,
  getPopularTags,
  getTagSuggestions,
  createTag,
  updateTag,
  deleteTag,
  followTag,
  unfollowTag,
  getFollowedTags,
  getEventsByTag,
  searchTags
} from '@/services/categoryTagService';

const CACHE_TIMES = {
  SHORT: 5 * 60 * 1000,         // 5 minutes - user-specific
  MEDIUM: 30 * 60 * 1000,        // 30 minutes - semi-stable
  LONG: 60 * 60 * 1000,          // 1 hour - stable
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours - rarely changes
};

// ==================== CATEGORY HOOKS ====================

/**
 * Get all event categories
 */
export const useCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['event-categories'],
    queryFn: () => getCategories(),
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get single category
 */
export const useCategory = (categoryId, enabled = true) => {
  return useQuery({
    queryKey: ['event-category', categoryId],
    queryFn: () => getCategory(categoryId),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled: !!categoryId && enabled,
    retry: 1
  });
};

/**
 * Create category (mutation)
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
    }
  });
};

/**
 * Update category (mutation)
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }) => updateCategory(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      queryClient.invalidateQueries({ queryKey: ['event-category', categoryId] });
    }
  });
};

/**
 * Delete category (mutation)
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
    }
  });
};

/**
 * Follow category (mutation)
 */
export const useFollowCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => followCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followed-categories'] });
    }
  });
};

/**
 * Unfollow category (mutation)
 */
export const useUnfollowCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => unfollowCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followed-categories'] });
    }
  });
};

/**
 * Get user's followed categories
 */
export const useFollowedCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['followed-categories'],
    queryFn: () => getFollowedCategories(),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get events by category
 */
export const useEventsByCategory = (categoryId, limit = 20, enabled = true) => {
  return useQuery({
    queryKey: ['events-by-category', categoryId, limit],
    queryFn: () => getEventsByCategory(categoryId, limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!categoryId && enabled,
    retry: 1
  });
};

// ==================== TAG HOOKS ====================

/**
 * Get all tags with search
 */
export const useTags = (limit = 100, search = '', enabled = true) => {
  return useQuery({
    queryKey: ['event-tags', limit, search],
    queryFn: () => getTags(limit, search),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get trending tags
 */
export const useTrendingTags = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['trending-event-tags', limit],
    queryFn: () => getTrendingTags(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get popular tags
 */
export const usePopularTags = (limit = 20, enabled = true) => {
  return useQuery({
    queryKey: ['popular-event-tags', limit],
    queryFn: () => getPopularTags(limit),
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    enabled,
    retry: 1
  });
};

/**
 * Get tag suggestions
 */
export const useTagSuggestions = (query = '', limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['tag-suggestions', query, limit],
    queryFn: () => getTagSuggestions(query, limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!query && enabled,
    retry: 1
  });
};

/**
 * Create tag (mutation)
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData) => createTag(tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-tags'] });
      queryClient.invalidateQueries({ queryKey: ['trending-event-tags'] });
      queryClient.invalidateQueries({ queryKey: ['popular-event-tags'] });
    }
  });
};

/**
 * Update tag (mutation)
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, data }) => updateTag(tagId, data),
    onSuccess: (_, { tagId }) => {
      queryClient.invalidateQueries({ queryKey: ['event-tags'] });
      queryClient.invalidateQueries({ queryKey: ['event-tag', tagId] });
    }
  });
};

/**
 * Delete tag (mutation)
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-tags'] });
      queryClient.invalidateQueries({ queryKey: ['trending-event-tags'] });
      queryClient.invalidateQueries({ queryKey: ['popular-event-tags'] });
    }
  });
};

/**
 * Follow tag (mutation)
 */
export const useFollowTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId) => followTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followed-tags'] });
    }
  });
};

/**
 * Unfollow tag (mutation)
 */
export const useUnfollowTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId) => unfollowTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followed-tags'] });
    }
  });
};

/**
 * Get user's followed tags
 */
export const useFollowedTags = (enabled = true) => {
  return useQuery({
    queryKey: ['followed-tags'],
    queryFn: () => getFollowedTags(),
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    enabled,
    retry: 1
  });
};

/**
 * Get events by tag
 */
export const useEventsByTag = (tagId, limit = 20, enabled = true) => {
  return useQuery({
    queryKey: ['events-by-tag', tagId, limit],
    queryFn: () => getEventsByTag(tagId, limit),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!tagId && enabled,
    retry: 1
  });
};

/**
 * Search tags
 */
export const useSearchTags = (query, enabled = true) => {
  return useQuery({
    queryKey: ['search-tags', query],
    queryFn: () => searchTags(query),
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    enabled: !!query && enabled,
    retry: 1
  });
};
