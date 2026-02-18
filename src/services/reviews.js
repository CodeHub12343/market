import api from './api';

const REVIEWS_ENDPOINT = '/reviews';

/**
 * Fetch product reviews - uses nested route /products/:id/reviews
 */
export const fetchProductReviews = async (
  productId,
  params = {}
) => {
  try {
    const response = await api.get(
      `/products/${productId}/reviews`,
      { params }
    );
    return response.data.data?.reviews || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch shop reviews - uses general reviews endpoint with shop filter
 */
export const fetchShopReviews = async (shopId, params = {}) => {
  try {
    const response = await api.get(
      `${REVIEWS_ENDPOINT}`,
      { params: { shop: shopId, ...params } }
    );
    return response.data.data?.reviews || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's own reviews - uses general reviews endpoint with user filter
 */
export const fetchMyReviews = async (params = {}) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}`, {
      params: { user: 'me', ...params },
    });
    return response.data.data?.reviews || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single review by ID
 */
export const fetchReviewById = async (reviewId) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}/${reviewId}`);
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create product review - uses nested route /products/:id/reviews
 * Backend expects: { review: string, rating: number }
 */
export const createProductReview = async (productId, reviewData) => {
  try {
    // Transform frontend data to backend format
    const backendData = {
      review: reviewData.content || reviewData.review, // Map content to review field
      rating: reviewData.rating,
      title: reviewData.title, // Additional field, backend may ignore
    };
    const response = await api.post(`/products/${productId}/reviews`, backendData);
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create shop review - uses general reviews endpoint
 * Backend expects: { review: string, rating: number, shop: id }
 */
export const createShopReview = async (shopId, reviewData) => {
  try {
    // Transform frontend data to backend format
    const backendData = {
      review: reviewData.content || reviewData.review,
      rating: reviewData.rating,
      title: reviewData.title,
      shop: shopId,
    };
    const response = await api.post(REVIEWS_ENDPOINT, backendData);
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update review
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.patch(
      `${REVIEWS_ENDPOINT}/${reviewId}`,
      reviewData
    );
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete review
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`${REVIEWS_ENDPOINT}/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (reviewId) => {
  try {
    const response = await api.patch(
      `${REVIEWS_ENDPOINT}/${reviewId}/helpful`
    );
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get product rating statistics - would need backend implementation
 * For now, calculate from reviews or use product averageRating field
 */
export const getProductRatingStats = async (productId) => {
  try {
    // Try to get stats endpoint first if it exists
    try {
      const response = await api.get(`/products/${productId}/reviews/stats`);
      return response.data.data || response.data;
    } catch (e) {
      // Fallback: fetch reviews and calculate stats locally
      const reviews = await fetchProductReviews(productId);
      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;

      reviews.forEach((review) => {
        const rating = Math.round(review.rating);
        if (distribution[rating] !== undefined) {
          distribution[rating]++;
        }
        totalRating += review.rating;
      });

      return {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
        distribution,
      };
    }
  } catch (error) {
    console.error('Error getting product stats:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get shop rating statistics - would need backend implementation
 */
export const getShopRatingStats = async (shopId) => {
  try {
    // Try to get stats endpoint first if it exists
    try {
      const response = await api.get(`/shops/${shopId}/reviews/stats`);
      return response.data.data || response.data;
    } catch (e) {
      // Fallback: fetch reviews and calculate stats locally
      const reviews = await fetchShopReviews(shopId);
      if (!reviews || reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
      }

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;

      reviews.forEach((review) => {
        const rating = Math.round(review.rating);
        if (distribution[rating] !== undefined) {
          distribution[rating]++;
        }
        totalRating += review.rating;
      });

      return {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
        distribution,
      };
    }
  } catch (error) {
    console.error('Error getting shop stats:', error);
    throw error.response?.data || error;
  }
};
