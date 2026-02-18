import api from './api';

const HOSTELS_ENDPOINT = '/hostels';

/**
 * Search hostel suggestions (autocomplete)
 * @param {string} query - Search query (min 2 chars)
 * @param {number} limit - Number of suggestions
 */
export const getHostelSearchSuggestions = async (query, limit = 5) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get(`${HOSTELS_ENDPOINT}/search/suggestions`, {
      params: { q: query, limit }
    });

    return response.data.data?.suggestions || response.data.data || [];
  } catch (error) {
    console.error('Error fetching hostel search suggestions:', error);
    return [];
  }
};

/**
 * Get popular/trending hostel searches
 * @param {number} limit - Number of popular searches
 */
export const getPopularHostelSearches = async (limit = 10) => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/search/popular`, {
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
 * @param {Object} filters - Filter object
 */
export const searchHostelsAdvanced = async (filters = {}) => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/search/advanced`, {
      params: filters
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error('Error advanced searching hostels:', error);
    return { hostels: [], pagination: { page: 1, limit: 20, total: 0 } };
  }
};

/**
 * Get available hostel locations
 */
export const getHostelLocations = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/locations`);
    return response.data.data?.locations || [];
  } catch (error) {
    console.error('Error fetching hostel locations:', error);
    return [];
  }
};

/**
 * Get available hostel amenities
 */
export const getHostelAmenities = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/amenities`);
    return response.data.data?.amenities || [];
  } catch (error) {
    console.error('Error fetching hostel amenities:', error);
    // Return common amenities as fallback
    return ['WiFi', 'Power Supply', 'AC', 'Security Gate', 'CCTV', 'Generator', 'Laundry Service', 'TV', 'Fan', 'Solar Power'];
  }
};

/**
 * Save search to user history
 * @param {string} query - Search query
 */
export const saveSearchToHistory = async (query) => {
  try {
    await api.post(`${HOSTELS_ENDPOINT}/search/history`, { query });
  } catch (error) {
    // Non-blocking - don't throw error
    console.debug('Could not save search history:', error);
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/search/history`);
    return response.data.data?.history || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = async () => {
  try {
    await api.delete(`${HOSTELS_ENDPOINT}/search/history`);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

/**
 * Delete specific search history entry
 * @param {string} id - History entry ID
 */
export const deleteSearchHistoryEntry = async (id) => {
  try {
    await api.delete(`${HOSTELS_ENDPOINT}/search/history/${id}`);
  } catch (error) {
    console.error('Error deleting search history entry:', error);
  }
};

/**
 * Get hostel amenities distribution (for filter display)
 */
export const getAmenitiesDistribution = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/amenities/distribution`);
    return response.data.data?.distribution || {};
  } catch (error) {
    console.error('Error fetching amenities distribution:', error);
    return {};
  }
};

/**
 * Get price range statistics
 */
export const getPriceRange = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/price-range`);
    return response.data.data || { min: 0, max: 500000, avg: 50000 };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 500000, avg: 50000 };
  }
};

/**
 * Get hostel types available
 */
export const getHostelTypes = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/types`);
    return response.data.data?.types || ['Boys', 'Girls', 'Mixed', 'Family'];
  } catch (error) {
    console.error('Error fetching hostel types:', error);
    return ['Boys', 'Girls', 'Mixed', 'Family'];
  }
};
