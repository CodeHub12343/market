import api from './api';

/**
 * Toggle favorite status for a hostel
 * GET /hostels/:hostelId/favorite/toggle
 */
export const toggleHostelFavorite = async (hostelId) => {
  try {
    const { data } = await api.get(`/hostels/${hostelId}/favorite/toggle`);
    return data.data || data;
  } catch (error) {
    console.error('Error toggling hostel favorite:', error);
    throw error;
  }
};

/**
 * Get all user's favorite hostels
 * GET /hostels/favorites
 */
export const fetchFavoriteHostels = async (params = {}) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt', search = '' } = params;
    const { data } = await api.get('/hostels/favorites', {
      params: { page, limit, sort, search }
    });
    return data.data || data;
  } catch (error) {
    console.error('Error fetching favorite hostels:', error);
    throw error;
  }
};

/**
 * Get favorite hostels by type
 * GET /hostels/favorites with type filter
 */
export const fetchFavoriteHostelsByType = async (type, params = {}) => {
  try {
    const { page = 1, limit = 12 } = params;
    const { data } = await api.get('/hostels/favorites', {
      params: { page, limit, type }
    });
    return data.data || data;
  } catch (error) {
    console.error('Error fetching favorite hostels by type:', error);
    throw error;
  }
};

/**
 * Check if hostel is favorited by user
 * GET /hostels/:hostelId/is-favorited
 */
export const checkIsFavorited = async (hostelId) => {
  try {
    const { data } = await api.get(`/hostels/${hostelId}/is-favorited`);
    return data.data?.isFavorited || false;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Delete favorite hostel
 * DELETE /hostels/:hostelId/favorite
 */
export const deleteFavoriteHostel = async (hostelId) => {
  try {
    const { data } = await api.delete(`/hostels/${hostelId}/favorite`);
    return data.data || data;
  } catch (error) {
    console.error('Error deleting favorite hostel:', error);
    throw error;
  }
};

/**
 * Search within favorite hostels
 * GET /hostels/favorites/search
 */
export const searchFavoriteHostels = async (query, params = {}) => {
  try {
    const { page = 1, limit = 12 } = params;
    const { data } = await api.get('/hostels/favorites/search', {
      params: { q: query, page, limit }
    });
    return data.data || data;
  } catch (error) {
    console.error('Error searching favorite hostels:', error);
    throw error;
  }
};

/**
 * Update favorite metadata (tags, notes, priority)
 * PATCH /hostels/:hostelId/favorite/metadata
 */
export const updateFavoriteMetadata = async (hostelId, metadata) => {
  try {
    const { data } = await api.patch(`/hostels/${hostelId}/favorite/metadata`, metadata);
    return data.data || data;
  } catch (error) {
    console.error('Error updating favorite metadata:', error);
    throw error;
  }
};

/**
 * Get favorite count for a hostel
 * GET /hostels/:hostelId/favorite-count
 */
export const getFavoriteCount = async (hostelId) => {
  try {
    const { data } = await api.get(`/hostels/${hostelId}/favorite-count`);
    return data.data?.count || 0;
  } catch (error) {
    console.error('Error fetching favorite count:', error);
    return 0;
  }
};

/**
 * Get favorite statistics
 * GET /hostels/favorites/stats
 */
export const getFavoriteStats = async () => {
  try {
    const { data } = await api.get('/hostels/favorites/stats');
    return data.data || data;
  } catch (error) {
    console.error('Error fetching favorite stats:', error);
    return {
      totalFavorites: 0,
      favoritesByType: {},
      mostFavoritedHostels: []
    };
  }
};
