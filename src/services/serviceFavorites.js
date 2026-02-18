import api from './api';

/**
 * Toggle service favorite status (add or remove)
 * @param {string} serviceId - Service ID
 * @returns {Promise<{data: {isFavorited: boolean}}>}
 */
export const toggleServiceFavorite = async (serviceId) => {
  try {
    const response = await api.post(`/services/${serviceId}/favorite`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error toggling service favorite:', error);
    throw error;
  }
};

/**
 * Fetch all favorited services for current user
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.sort - Sort field
 * @returns {Promise<{data: {services: array, pagination: object}}>}
 */
export const fetchServiceFavorites = async (params = {}) => {
  try {
    const response = await api.get('/services/favorites', { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching service favorites:', error);
    throw error;
  }
};

/**
 * Fetch favorited services by type/category
 * @param {string} type - Service category/type
 * @param {object} params - Query parameters
 * @returns {Promise<{data: {services: array}}>}
 */
export const fetchServiceFavoritesByType = async (type, params = {}) => {
  try {
    const response = await api.get('/services/favorites', {
      params: { ...params, type }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching service favorites by type:', error);
    throw error;
  }
};

/**
 * Check if a service is favorited
 * @param {string} serviceId - Service ID
 * @returns {Promise<{data: {isFavorited: boolean}}>}
 */
export const checkServiceIsFavorited = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}/is-favorited`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error checking if service is favorited:', error);
    // Return false if error
    return { isFavorited: false };
  }
};

/**
 * Search within favorited services
 * @param {string} query - Search query
 * @param {object} params - Query parameters
 * @returns {Promise<{data: {services: array}}>}
 */
export const searchServiceFavorites = async (query, params = {}) => {
  try {
    const response = await api.get('/services/favorites/search', {
      params: { ...params, q: query }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error searching service favorites:', error);
    throw error;
  }
};

/**
 * Update favorite metadata (notes, priority, tags)
 * @param {string} favoriteId - Favorite entry ID
 * @param {object} metadata - Metadata to update
 * @returns {Promise<{data: object}>}
 */
export const updateServiceFavorite = async (favoriteId, metadata) => {
  try {
    const response = await api.patch(`/services/favorites/${favoriteId}`, metadata);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating service favorite:', error);
    throw error;
  }
};

/**
 * Delete/remove a service from favorites
 * @param {string} serviceId - Service ID to remove
 * @returns {Promise<{data: {deleted: boolean}}>}
 */
export const deleteServiceFavorite = async (serviceId) => {
  try {
    const response = await api.delete(`/services/${serviceId}/favorite`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error deleting service favorite:', error);
    throw error;
  }
};

/**
 * Get service follower notifications/updates
 * @param {string} serviceId - Service ID
 * @param {object} params - Query parameters
 * @returns {Promise<{data: {notifications: array}}>}
 */
export const getServiceFollowNotifications = async (serviceId, params = {}) => {
  try {
    const response = await api.get(`/services/${serviceId}/follow/notifications`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching service follow notifications:', error);
    return { notifications: [] };
  }
};

/**
 * Mark service follow notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<{data: {marked: boolean}}>}
 */
export const markServiceNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(
      `/services/follow/notifications/${notificationId}/read`
    );
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Update service follow notification preferences
 * @param {string} serviceId - Service ID
 * @param {object} preferences - Notification preferences
 * @returns {Promise<{data: {preferences: object}}>}
 */
export const updateServiceFollowPreferences = async (serviceId, preferences) => {
  try {
    const response = await api.patch(
      `/services/${serviceId}/follow/preferences`,
      preferences
    );
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating service follow preferences:', error);
    throw error;
  }
};

/**
 * Get all services a user is following
 * @param {object} params - Query parameters
 * @returns {Promise<{data: {services: array, count: number}}>}
 */
export const getFollowedServices = async (params = {}) => {
  try {
    const response = await api.get('/services/followed', { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching followed services:', error);
    throw error;
  }
};
