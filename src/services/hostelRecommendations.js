import api from '@/lib/api';

// Get hostels of the same type/campus/faculty
export const getRelatedHostels = async (hostelId, limit = 6) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/related`, {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch related hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get trending/popular hostels
export const getPopularHostels = async (limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/popular', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch popular hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get personalized recommendations for logged-in user
export const getPersonalizedRecommendations = async (limit = 8) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/personalized', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch personalized recommendations:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get recommendations by hostel type
export const getRecommendationsByType = async (type, limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/by-type', {
      params: { type, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch recommendations by type:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get recommendations by faculty
export const getRecommendationsByFaculty = async (facultyId, limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/by-faculty', {
      params: { facultyId, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch recommendations by faculty:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get hostels in similar price range
export const getSimilarPriceRangeHostels = async (hostelId, limit = 6) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/similar-price`, {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch similar price range hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get top-rated hostels
export const getTopRatedHostels = async (limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/top-rated', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch top-rated hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get newly listed hostels
export const getNewlyListedHostels = async (limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/newly-listed', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch newly listed hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get hostels similar to user's favorites
export const getHostelsSimilarToFavorites = async (limit = 8) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/similar-to-favorites', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch recommendations similar to favorites:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get recommendations based on user's search/view history
export const getRecommendationsFromHistory = async (limit = 8) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/from-history', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch history-based recommendations:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get campus/location based recommendations
export const getLocationBasedRecommendations = async (location, limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/by-location', {
      params: { location, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch location-based recommendations:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get amenity-based recommendations
export const getAmenityBasedRecommendations = async (amenities, limit = 6) => {
  try {
    const response = await api.get('/api/v1/hostels/recommendations/by-amenities', {
      params: { amenities: Array.isArray(amenities) ? amenities.join(',') : amenities, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch amenity-based recommendations:', error?.response?.data?.message || error.message);
    return [];
  }
};
