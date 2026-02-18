import api from '@/lib/api';

// Get event search suggestions with autocomplete
export const getEventSearchSuggestions = async (query, limit = 5) => {
  try {
    const response = await api.get('/api/v1/events/search/suggestions', {
      params: { q: query, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch event suggestions:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get trending/popular event searches
export const getPopularEventSearches = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/search/popular', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch popular searches:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Advanced event search with filters
export const searchEventsAdvanced = async (filters) => {
  try {
    const response = await api.get('/api/v1/events/search/advanced', {
      params: filters
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to search events:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get available event locations
export const getEventLocations = async () => {
  try {
    const response = await api.get('/api/v1/events/locations');
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch locations:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get available event categories
export const getEventCategories = async () => {
  try {
    const response = await api.get('/api/v1/events/categories');
    return response.data?.data || [
      'Academic', 'Social', 'Sports', 'Entertainment', 'Other'
    ];
  } catch (error) {
    console.warn('Failed to fetch categories:', error?.response?.data?.message || error.message);
    return ['Academic', 'Social', 'Sports', 'Entertainment', 'Other'];
  }
};

// Save search to history (non-blocking)
export const saveSearchToHistory = async (query) => {
  try {
    await api.post('/api/v1/events/search/history', { query });
  } catch (error) {
    // Non-blocking, don't throw
    console.warn('Failed to save search history:', error?.response?.data?.message || error.message);
  }
};

// Get user's search history
export const getSearchHistory = async () => {
  try {
    const response = await api.get('/api/v1/events/search/history');
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch search history:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Clear search history
export const clearSearchHistory = async () => {
  try {
    await api.delete('/api/v1/events/search/history');
    return { success: true };
  } catch (error) {
    console.warn('Failed to clear search history:', error?.response?.data?.message || error.message);
    return { success: false };
  }
};

// Delete single search history entry
export const deleteSearchHistoryEntry = async (id) => {
  try {
    await api.delete(`/api/v1/events/search/history/${id}`);
    return { success: true };
  } catch (error) {
    console.warn('Failed to delete history entry:', error?.response?.data?.message || error.message);
    return { success: false };
  }
};

// Get upcoming events (sorted by date)
export const getUpcomingEvents = async (limit = 6, daysAhead = 30) => {
  try {
    const response = await api.get('/events/upcoming', {
      params: { limit, daysAhead }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch upcoming events:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get event price range stats
export const getEventPriceRange = async () => {
  try {
    const response = await api.get('/api/v1/events/price-range');
    return response.data?.data || { min: 0, max: 0 };
  } catch (error) {
    console.warn('Failed to fetch price range:', error?.response?.data?.message || error.message);
    return { min: 0, max: 0 };
  }
};

// Get events by category
export const getEventsByCategory = async (category, limit = 6) => {
  try {
    const response = await api.get('/api/v1/events/by-category', {
      params: { category, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch events by category:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get events by location
export const getEventsByLocation = async (location, limit = 6) => {
  try {
    const response = await api.get('/api/v1/events/by-location', {
      params: { location, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch events by location:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get joined events for user
export const getJoinedEvents = async (limit = 6) => {
  try {
    const response = await api.get('/api/v1/events/joined', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch joined events:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get favorited events
export const getFavoriteEvents = async (limit = 6) => {
  try {
    const response = await api.get('/api/v1/events/favorites', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch favorite events:', error?.response?.data?.message || error.message);
    return [];
  }
};
