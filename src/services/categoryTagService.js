import api from '@/services/api';

// ==================== CATEGORY FUNCTIONS ====================

/**
 * Get all event categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/api/v1/event-categories');
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch categories:', error?.response?.data?.message);
    // Return default categories as fallback
    return [
      { _id: 'academic', name: 'Academic', color: '#3b82f6', icon: 'BookOpen' },
      { _id: 'social', name: 'Social', color: '#ec4899', icon: 'Users' },
      { _id: 'sports', name: 'Sports', color: '#ef4444', icon: 'Trophy' },
      { _id: 'entertainment', name: 'Entertainment', color: '#f59e0b', icon: 'Music' },
      { _id: 'other', name: 'Other', color: '#6b7280', icon: 'MoreHorizontal' }
    ];
  }
};

/**
 * Get single category by ID
 */
export const getCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/v1/event-categories/${categoryId}`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to fetch category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Create new category (admin only)
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/api/v1/event-categories', categoryData);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to create category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Update category (admin only)
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.patch(`/api/v1/event-categories/${categoryId}`, categoryData);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to update category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Delete category (admin only)
 */
export const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/api/v1/event-categories/${categoryId}`);
    return true;
  } catch (error) {
    console.warn('Failed to delete category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Follow category (add to user's interests)
 */
export const followCategory = async (categoryId) => {
  try {
    const response = await api.post(`/api/v1/event-categories/${categoryId}/follow`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to follow category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Unfollow category
 */
export const unfollowCategory = async (categoryId) => {
  try {
    const response = await api.post(`/api/v1/event-categories/${categoryId}/unfollow`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to unfollow category:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Get user's followed categories
 */
export const getFollowedCategories = async () => {
  try {
    const response = await api.get('/api/v1/event-categories/followed');
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch followed categories:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events by category
 */
export const getEventsByCategory = async (categoryId, limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/api/v1/event-categories/${categoryId}/events`, {
      params: { limit, offset }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch events by category:', error?.response?.data?.message);
    return [];
  }
};

// ==================== TAG FUNCTIONS ====================

/**
 * Get all tags with optional filtering
 */
export const getTags = async (limit = 100, search = '') => {
  try {
    const response = await api.get('/api/v1/event-tags', {
      params: { limit, search }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch tags:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get trending tags
 */
export const getTrendingTags = async (limit = 10) => {
  try {
    const response = await api.get('/event-tags/trending', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch trending tags:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get popular tags
 */
export const getPopularTags = async (limit = 20) => {
  try {
    const response = await api.get('/api/v1/event-tags/popular', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch popular tags:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get tag suggestions for autocomplete
 */
export const getTagSuggestions = async (query = '', limit = 10) => {
  try {
    const response = await api.get('/api/v1/event-tags/suggestions', {
      params: { q: query, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch tag suggestions:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Create new tag
 */
export const createTag = async (tagData) => {
  try {
    const response = await api.post('/api/v1/event-tags', tagData);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to create tag:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Update tag
 */
export const updateTag = async (tagId, tagData) => {
  try {
    const response = await api.patch(`/api/v1/event-tags/${tagId}`, tagData);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to update tag:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Delete tag
 */
export const deleteTag = async (tagId) => {
  try {
    await api.delete(`/api/v1/event-tags/${tagId}`);
    return true;
  } catch (error) {
    console.warn('Failed to delete tag:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Follow tag (add to user's interests)
 */
export const followTag = async (tagId) => {
  try {
    const response = await api.post(`/api/v1/event-tags/${tagId}/follow`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to follow tag:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Unfollow tag
 */
export const unfollowTag = async (tagId) => {
  try {
    const response = await api.post(`/api/v1/event-tags/${tagId}/unfollow`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to unfollow tag:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Get user's followed tags
 */
export const getFollowedTags = async () => {
  try {
    const response = await api.get('/api/v1/event-tags/followed');
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch followed tags:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events by tag
 */
export const getEventsByTag = async (tagId, limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/api/v1/event-tags/${tagId}/events`, {
      params: { limit, offset }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch events by tag:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Search tags by name
 */
export const searchTags = async (query) => {
  try {
    const response = await api.get('/api/v1/event-tags/search', {
      params: { q: query }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to search tags:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get tag statistics
 */
export const getTagStats = async (tagId) => {
  try {
    const response = await api.get(`/api/v1/event-tags/${tagId}/stats`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to fetch tag stats:', error?.response?.data?.message);
    return null;
  }
};

/**
 * Get category statistics
 */
export const getCategoryStats = async (categoryId) => {
  try {
    const response = await api.get(`/api/v1/event-categories/${categoryId}/stats`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to fetch category stats:', error?.response?.data?.message);
    return null;
  }
};
