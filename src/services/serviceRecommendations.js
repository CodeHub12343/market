import api from './api';

/**
 * Get trending/popular services for homepage or discovery
 * @param {number} limit - Number of services to return (default: 10)
 * @returns {Promise<Object>} Popular services
 */
export const getPopularServices = async (limit = 10) => {
  try {
    const response = await api.get('/services/popular', {
      params: { limit }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching popular services:', error);
    // Fallback: return empty array
    return { popular: [] };
  }
};

/**
 * Get recommended services for logged-in user based on history/preferences
 * @param {number} limit - Number of services to return (default: 10)
 * @returns {Promise<Object>} Personalized recommendations
 */
export const getPersonalizedServiceRecommendations = async (limit = 10) => {
  try {
    const response = await api.get('/services/recommendations/personalized', {
      params: { limit }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching personalized service recommendations:', error);
    // Fallback: return empty array
    return { recommendations: [] };
  }
};

/**
 * Get services related to a specific service (same category, similar price, etc)
 * @param {string} serviceId - ID of the service to find related services for
 * @param {number} limit - Number of services to return (default: 6)
 * @returns {Promise<Object>} Related services
 */
export const getRelatedServices = async (serviceId, limit = 6) => {
  try {
    const response = await api.get(`/services/${serviceId}/related`, {
      params: { limit }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching related services for ${serviceId}:`, error);
    // Fallback: return empty array
    return { related: [] };
  }
};

/**
 * Get services in the same category as reference service
 * Used as fallback when related services not available
 * @param {string} categoryId - Category ID to fetch services from
 * @param {string} excludeServiceId - Service ID to exclude from results
 * @param {number} limit - Number of services to return (default: 6)
 * @returns {Promise<Object>} Services in category
 */
export const getServicesByCategory = async (categoryId, excludeServiceId, limit = 6) => {
  try {
    const response = await api.get('/services', {
      params: {
        category: categoryId,
        limit,
        sort: '-rating'
      }
    });
    
    const allServices = response.data.data?.services || [];
    // Filter out the current service
    const filtered = allServices.filter(s => s._id !== excludeServiceId);
    return { services: filtered.slice(0, limit) };
  } catch (error) {
    console.error('Error fetching services by category:', error);
    return { services: [] };
  }
};

/**
 * Get services frequently booked with a specific service
 * @param {string} serviceId - Service ID
 * @param {number} limit - Number of services to return (default: 6)
 * @returns {Promise<Object>} Frequently booked together services
 */
export const getFrequentlyBookedTogether = async (serviceId, limit = 6) => {
  try {
    const response = await api.get(`/services/${serviceId}/frequently-booked`, {
      params: { limit }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching frequently booked services for ${serviceId}:`, error);
    // Fallback: return empty array
    return { services: [] };
  }
};

/**
 * Mark a recommendation as clicked/viewed by user
 * Used for analytics and ML model improvement
 * @param {string} recommendationId - Recommendation ID
 * @returns {Promise<Object>} Response
 */
export const markRecommendationAsClicked = async (recommendationId) => {
  try {
    const response = await api.post(`/recommendations/${recommendationId}/click`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error marking recommendation as clicked:', error);
    // Non-blocking: don't throw error
    return { tracked: false };
  }
};

/**
 * Dismiss/hide a recommendation for user
 * Used to improve future recommendations
 * @param {string} recommendationId - Recommendation ID
 * @returns {Promise<Object>} Response
 */
export const dismissRecommendation = async (recommendationId) => {
  try {
    const response = await api.post(`/recommendations/${recommendationId}/dismiss`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    // Non-blocking: don't throw error
    return { dismissed: false };
  }
};

/**
 * Get trending services in specific category
 * @param {string} categoryId - Category ID
 * @param {number} limit - Number of services to return (default: 6)
 * @returns {Promise<Object>} Trending services in category
 */
export const getTrendingServicesByCategory = async (categoryId, limit = 6) => {
  try {
    const response = await api.get('/services/trending', {
      params: {
        category: categoryId,
        limit
      }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching trending services by category:', error);
    return { services: [] };
  }
};

/**
 * Get top-rated services (high ratings and review count)
 * @param {number} limit - Number of services to return (default: 10)
 * @returns {Promise<Object>} Top-rated services
 */
export const getTopRatedServices = async (limit = 10) => {
  try {
    const response = await api.get('/services', {
      params: {
        sort: '-rating',
        limit,
        minRating: 4
      }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching top-rated services:', error);
    return { services: [] };
  }
};

/**
 * Get services by similar price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {string} excludeServiceId - Service ID to exclude
 * @param {number} limit - Number of services to return (default: 6)
 * @returns {Promise<Object>} Services in price range
 */
export const getServicesByPriceRange = async (minPrice, maxPrice, excludeServiceId, limit = 6) => {
  try {
    const response = await api.get('/services', {
      params: {
        minPrice,
        maxPrice,
        limit,
        sort: '-rating'
      }
    });
    
    const allServices = response.data.data?.services || [];
    const filtered = allServices.filter(s => s._id !== excludeServiceId);
    return { services: filtered.slice(0, limit) };
  } catch (error) {
    console.error('Error fetching services by price range:', error);
    return { services: [] };
  }
};
