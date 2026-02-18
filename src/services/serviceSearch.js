import api from './api';

const SERVICES_ENDPOINT = '/services';

/**
 * Search services with autocomplete suggestions
 */
export const getServiceSearchSuggestions = async (query, limit = 5) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get(`${SERVICES_ENDPOINT}/search/suggestions`, {
      params: { q: query, limit }
    });

    return response.data.data?.suggestions || response.data.data || [];
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
};

/**
 * Get popular/trending service searches
 */
export const getPopularServiceSearches = async (limit = 10) => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/search/popular`, {
      params: { limit }
    });

    return response.data.data?.searches || response.data.data || [];
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return [];
  }
};

/**
 * Advanced search with multiple filters
 */
export const searchServicesAdvanced = async (filters = {}) => {
  try {
    const response = await api.get(SERVICES_ENDPOINT, {
      params: {
        search: filters.query,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        availability: filters.availability,
        minRating: filters.minRating,
        location: filters.location,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit
      }
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get available locations for location-based search
 */
export const getServiceLocations = async () => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/search/locations`);
    return response.data.data?.locations || response.data.data || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};

/**
 * Save search to history (non-blocking)
 */
export const saveSearchToHistory = async (query) => {
  try {
    if (!query || query.length < 2) return;
    
    await api.post(`${SERVICES_ENDPOINT}/search/history`, {
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Non-blocking - don't throw
    console.debug('Error saving search history:', error);
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async () => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/search/history`);
    return response.data.data?.history || response.data.data || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

/**
 * Clear user's search history
 */
export const clearSearchHistory = async () => {
  try {
    await api.delete(`${SERVICES_ENDPOINT}/search/history`);
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete specific search history entry
 */
export const deleteSearchHistoryEntry = async (id) => {
  try {
    await api.delete(`${SERVICES_ENDPOINT}/search/history/${id}`);
  } catch (error) {
    console.error('Error deleting search history entry:', error);
    throw error.response?.data || error;
  }
};
