import api from './api';

const FAVORITES_ENDPOINT = '/favorites';

/**
 * Toggle favorite - add if not favorited, remove if already favorited
 */
export const toggleFavorite = async (itemId, itemType = 'Product') => {
  try {
    const response = await api.post(`${FAVORITES_ENDPOINT}/toggle`, {
      itemId,
      itemType,
    });
    return response.data.data?.favorite || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all favorites for current user
 */
export const fetchFavorites = async (params = {}) => {
  try {
    const response = await api.get(FAVORITES_ENDPOINT, { params });
    return response.data.data?.favorites || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all favorites by item type
 */
export const fetchFavoritesByType = async (itemType = 'Product', params = {}) => {
  try {
    const response = await api.get(FAVORITES_ENDPOINT, {
      params: { itemType, ...params },
    });
    return response.data.data?.favorites || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single favorite
 */
export const fetchFavoriteById = async (favoriteId) => {
  try {
    const response = await api.get(`${FAVORITES_ENDPOINT}/${favoriteId}`);
    return response.data.data?.favorite || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete favorite
 */
export const deleteFavorite = async (favoriteId) => {
  try {
    await api.delete(`${FAVORITES_ENDPOINT}/${favoriteId}`);
    return { success: true };
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check if item is favorited
 */
export const checkIsFavorited = async (itemId, itemType = 'Product') => {
  try {
    const favorites = await fetchFavorites();
    return favorites.some(
      (fav) => fav.item._id === itemId && fav.itemType === itemType
    );
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Search favorites
 */
export const searchFavorites = async (q, params = {}) => {
  try {
    const response = await api.get(`${FAVORITES_ENDPOINT}/search`, {
      params: { q, ...params },
    });
    return response.data.data?.favorites || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update favorite with tags, notes, priority
 */
export const updateFavorite = async (favoriteId, updateData) => {
  try {
    const response = await api.patch(
      `${FAVORITES_ENDPOINT}/${favoriteId}`,
      updateData
    );
    return response.data.data?.favorite || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
