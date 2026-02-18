import api from './api';

/**
 * Get search suggestions for requests
 */
export const getRequestSearchSuggestions = async (query) => {
  try {
    const response = await api.get('/requests/search/suggestions', {
      params: { query }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching request search suggestions:', error);
    return [];
  }
};

/**
 * Get popular request searches
 */
export const getPopularRequestSearches = async () => {
  try {
    const response = await api.get('/requests/search/popular');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching popular request searches:', error);
    return [];
  }
};

/**
 * Get search history for current user
 */
export const getSearchHistory = async () => {
  try {
    const response = await api.get('/requests/search/history');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
};

/**
 * Save search to user's history
 */
export const saveSearchToHistory = async (query) => {
  try {
    const response = await api.post('/requests/search/history', { query });
    return response.data;
  } catch (error) {
    console.error('Error saving search to history:', error);
    throw error;
  }
};

/**
 * Clear all search history for current user
 */
export const clearSearchHistory = async () => {
  try {
    const response = await api.delete('/requests/search/history');
    return response.data;
  } catch (error) {
    console.error('Error clearing search history:', error);
    throw error;
  }
};

/**
 * Delete specific search history entry
 */
export const deleteSearchHistoryEntry = async (id) => {
  try {
    const response = await api.delete(`/requests/search/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting search history entry:', error);
    throw error;
  }
};
