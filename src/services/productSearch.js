import api from './api';

const PRODUCTS_ENDPOINT = '/products';

/**
 * Search products with autocomplete suggestions
 */
export const getProductSearchSuggestions = async (query, limit = 5) => {
  try {
    if (!query || query.length < 2) {
      console.log('🔎 Query too short:', query);
      return [];
    }

    console.log('🔎 Fetching product suggestions for:', query);
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/suggestions`, {
      params: { q: query, limit }
    });

    console.log('📊 Product suggestions API Response:', response.data);
    const result = response.data.data?.suggestions || response.data.data || [];
    console.log('✅ Returning product suggestions:', result.length, 'items');
    return result;
  } catch (error) {
    console.error('❌ Error fetching product search suggestions:', error.message);
    return [];
  }
};

/**
 * Get popular/trending product searches
 */
export const getPopularProductSearches = async (limit = 10) => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/popular`, {
      params: { limit }
    });

    return response.data.data?.searches || response.data.data || [];
  } catch (error) {
    console.error('Error fetching popular product searches:', error);
    return [];
  }
};

/**
 * Advanced product search with multiple filters
 */
export const searchProductsAdvanced = async (filters = {}) => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/advanced`, { params: filters });
    return response.data.data || [];
  } catch (error) {
    console.error('Error in advanced product search:', error);
    return [];
  }
};

/**
 * Get available product locations/sellers
 */
export const getProductLocations = async () => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/locations`);
    return response.data.data?.locations || [];
  } catch (error) {
    console.error('Error fetching product locations:', error);
    return [];
  }
};

/**
 * Get user's product search history
 */
export const getProductSearchHistory = async () => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/history`);
    return response.data.data?.history || [];
  } catch (error) {
    console.error('Error fetching product search history:', error);
    return [];
  }
};

/**
 * Save product search to history
 */
export const saveProductSearchToHistory = async (query) => {
  try {
    const response = await api.post(`${PRODUCTS_ENDPOINT}/search/history`, { query });
    return response.data;
  } catch (error) {
    console.error('Error saving product search:', error);
    throw error;
  }
};

/**
 * Clear all product search history
 */
export const clearProductSearchHistory = async () => {
  try {
    const response = await api.delete(`${PRODUCTS_ENDPOINT}/search/history`);
    return response.data;
  } catch (error) {
    console.error('Error clearing product search history:', error);
    throw error;
  }
};

/**
 * Delete a single product search history item
 */
export const deleteProductSearchHistoryItem = async (id) => {
  try {
    const response = await api.delete(`${PRODUCTS_ENDPOINT}/search/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product search history item:', error);
    throw error;
  }
};
