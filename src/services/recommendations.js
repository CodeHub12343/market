import api from './api';

const RECOMMENDATIONS_ENDPOINT = '/recommendations';

/**
 * Get trending products for homepage/discovery
 */
export const getTrendingRecommendations = async (params = {}) => {
  try {
    const response = await api.get(`${RECOMMENDATIONS_ENDPOINT}/trending`, {
      params,
    });
    return response.data.data?.recommendations || response.data.data || [];
  } catch (error) {
    console.error('Error fetching trending recommendations:', error);
    return [];
  }
};

/**
 * Get personalized recommendations for logged-in user
 */
export const getPersonalizedRecommendations = async (params = {}) => {
  try {
    const response = await api.get(RECOMMENDATIONS_ENDPOINT, { params });
    return response.data.data?.recommendations || response.data.data || [];
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    return [];
  }
};

/**
 * Get product-specific recommendations (related products, customers also bought, etc.)
 */
export const getProductRecommendations = async (productId, params = {}) => {
  try {
    const response = await api.get(
      `${RECOMMENDATIONS_ENDPOINT}/product/${productId}`,
      { params }
    );
    return response.data.data?.recommendations || response.data.data || [];
  } catch (error) {
    console.error(`Error fetching recommendations for product ${productId}:`, error);
    return [];
  }
};

/**
 * Mark a recommendation as clicked (track engagement)
 */
export const markRecommendationAsClicked = async (recommendationId) => {
  try {
    const response = await api.post(
      `${RECOMMENDATIONS_ENDPOINT}/${recommendationId}/click`
    );
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error marking recommendation as clicked:', error);
    return null;
  }
};

/**
 * Dismiss a recommendation (user doesn't want to see it)
 */
export const dismissRecommendation = async (recommendationId) => {
  try {
    const response = await api.post(
      `${RECOMMENDATIONS_ENDPOINT}/${recommendationId}/dismiss`
    );
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    return null;
  }
};

/**
 * Get related products by category (fallback when recommendations unavailable)
 */
export const getRelatedProducts = async (productId, categoryId, limit = 6) => {
  try {
    const response = await api.get(`/products`, {
      params: {
        category: categoryId,
        exclude: productId,
        limit,
      },
    });
    return response.data.data?.products || response.data.data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

/**
 * Get frequently bought together products
 */
export const getFrequentlyBoughtTogether = async (productId, limit = 4) => {
  try {
    const response = await api.get(`/products/${productId}/frequently-bought-together`, {
      params: { limit },
    });
    return response.data.data?.products || response.data.data || [];
  } catch (error) {
    // Fallback to regular recommendations
    return await getProductRecommendations(productId, { limit });
  }
};
