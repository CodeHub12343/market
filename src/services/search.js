import api from './api';

const SEARCH_ENDPOINT = '/search';

/**
 * Search products with full-text search and filters
 */
export const searchProducts = async (query, filters = {}) => {
  try {
    const response = await api.get(`${SEARCH_ENDPOINT}/products`, {
      params: {
        search: query,
        ...filters,
      },
    });
    return response.data.data?.products || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get search suggestions (autocomplete)
 * Returns suggestions based on:
 * - Popular searches
 * - Product names
 * - Categories
 * - Recent user searches (if user is logged in)
 */
export const getSearchSuggestions = async (query, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get(`${SEARCH_ENDPOINT}/suggestions`, {
      params: {
        q: query,
        limit,
      },
    });

    // Format suggestions to ensure consistent structure
    const suggestions = response.data.data?.suggestions || response.data.data || [];
    return suggestions.map((suggestion) => ({
      id: suggestion._id || suggestion.id,
      text: suggestion.name || suggestion.text || suggestion,
      type: suggestion.type || 'product', // 'product', 'category', 'shop'
      highlight: suggestion.highlight || null,
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    // Return empty array on error instead of throwing
    return [];
  }
};

/**
 * Get popular searches / trending searches
 */
export const getPopularSearches = async (limit = 10) => {
  try {
    const response = await api.get(`${SEARCH_ENDPOINT}/popular`, {
      params: { limit },
    });
    return response.data.data?.searches || response.data.data || [];
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return [];
  }
};

/**
 * Save search to user's search history
 */
export const saveSearchToHistory = async (query, filters = {}) => {
  try {
    const response = await api.post(`${SEARCH_ENDPOINT}/history`, {
      query,
      filters,
      timestamp: new Date().toISOString(),
    });
    return response.data.data || response.data;
  } catch (error) {
    // Don't throw error - search history is not critical
    console.warn('Could not save search history:', error);
    return null;
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async (limit = 20) => {
  try {
    const response = await api.get(`${SEARCH_ENDPOINT}/history`, {
      params: { limit },
    });
    return response.data.data?.searches || response.data.data || [];
  } catch (error) {
    console.warn('Error fetching search history:', error);
    return [];
  }
};

/**
 * Clear search history
 */
export const clearSearchHistory = async () => {
  try {
    const response = await api.delete(`${SEARCH_ENDPOINT}/history`);
    return response.data;
  } catch (error) {
    console.warn('Error clearing search history:', error);
    return null;
  }
};

/**
 * Clear a specific search history entry
 */
export const deleteSearchHistoryEntry = async (entryId) => {
  try {
    const response = await api.delete(`${SEARCH_ENDPOINT}/history/${entryId}`);
    return response.data;
  } catch (error) {
    console.warn('Error deleting search history entry:', error);
    return null;
  }
};

/**
 * Search with advanced filters - for advanced search modal
 */
export const advancedSearch = async (filters = {}) => {
  try {
    const response = await api.get(`${SEARCH_ENDPOINT}/products`, {
      params: filters,
    });
    return response.data.data?.products || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Filter by seller/shop
 */
export const searchByShop = async (shopId, filters = {}) => {
  try {
    const response = await api.get(`${SEARCH_ENDPOINT}/products`, {
      params: {
        shop: shopId,
        ...filters,
      },
    });
    return response.data.data?.products || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all available categories for search filters
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.data?.categories || response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Get all available campuses for search filters
 */
export const getCampuses = async () => {
  try {
    const response = await api.get('/campuses');
    return response.data.data?.campuses || response.data.data || [];
  } catch (error) {
    console.error('Error fetching campuses:', error);
    return [];
  }
};
