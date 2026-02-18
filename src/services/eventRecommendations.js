import api from '@/services/api';

/**
 * Get upcoming events sorted by date
 */
export const getUpcomingEvents = async (limit = 10, daysAhead = 30) => {
  try {
    const response = await api.get('/events/upcoming', {
      params: { limit, daysAhead }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch upcoming events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get personalized event recommendations based on user interests
 */
export const getPersonalizedEventRecommendations = async (limit = 10) => {
  try {
    const response = await api.get('/events/recommendations/personalized', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch personalized recommendations:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events by category
 */
export const getEventsByCategory = async (category, limit = 6) => {
  try {
    if (!category) return [];
    const response = await api.get(`/events/category/${category}`, {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn(`Failed to fetch ${category} events:`, error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events near user location
 */
export const getEventsNearYou = async (limit = 10, radiusKm = 50) => {
  try {
    const response = await api.get('/events/nearby', {
      params: { limit, radiusKm }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch nearby events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get popular trending events
 */
export const getPopularEvents = async (limit = 10) => {
  try {
    const response = await api.get('/events/popular', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch popular events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get trending events (most joined recently)
 */
export const getTrendingEvents = async (limit = 10) => {
  try {
    const response = await api.get('/events/trending', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch trending events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get top-rated events
 */
export const getTopRatedEvents = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/top-rated', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch top-rated events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events similar to a given event (by category, location, tags)
 */
export const getSimilarEvents = async (eventId, limit = 6) => {
  try {
    if (!eventId) return [];
    const response = await api.get(`/api/v1/events/${eventId}/similar`, {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch similar events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events organized by people user follows
 */
export const getEventsFromFollowedOrganizers = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/followed-organizers', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch events from followed organizers:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events based on user's previous attendance
 */
export const getEventsBasedOnHistory = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/recommendations/history', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch history-based recommendations:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events you might like (hybrid personalization)
 */
export const getEventYouMightLike = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/might-like', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch "might like" events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get trending categories
 */
export const getTrendingCategories = async (limit = 5) => {
  try {
    const response = await api.get('/events/trending-categories', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch trending categories:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events happening this weekend
 */
export const getWeekendEvents = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/weekend', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch weekend events:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get events happening next week
 */
export const getNextWeekEvents = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/events/next-week', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch next week events:', error?.response?.data?.message);
    return [];
  }
};
