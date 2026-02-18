import api from './api';

const SERVICE_REVIEWS_ENDPOINT = '/service-reviews';

/**
 * Fetch all reviews for a service
 */
export const fetchServiceReviews = async (serviceId, params = {}) => {
  try {
    const response = await api.get(
      `/services/${serviceId}/reviews`,
      { params }
    );
    return response.data.data?.reviews || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's own service reviews
 */
export const fetchMyServiceReviews = async (params = {}) => {
  try {
    const response = await api.get(`${SERVICE_REVIEWS_ENDPOINT}`, {
      params: { user: 'me', ...params },
    });
    return response.data.data?.reviews || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single service review by ID
 */
export const fetchServiceReviewById = async (reviewId) => {
  try {
    const response = await api.get(`${SERVICE_REVIEWS_ENDPOINT}/${reviewId}`);
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create service review
 */
export const createServiceReview = async (serviceId, reviewData) => {
  try {
    const backendData = {
      review: reviewData.content || reviewData.review,
      rating: reviewData.rating,
      title: reviewData.title,
      service: serviceId,
    };
    const response = await api.post(`/services/${serviceId}/reviews`, backendData);
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update service review
 */
export const updateServiceReview = async (reviewId, reviewData) => {
  try {
    const backendData = {
      review: reviewData.content || reviewData.review,
      rating: reviewData.rating,
      title: reviewData.title,
    };
    const response = await api.patch(
      `${SERVICE_REVIEWS_ENDPOINT}/${reviewId}`,
      backendData
    );
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete service review
 */
export const deleteServiceReview = async (reviewId) => {
  try {
    const response = await api.delete(`${SERVICE_REVIEWS_ENDPOINT}/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark service review as helpful
 */
export const markServiceReviewHelpful = async (reviewId) => {
  try {
    const response = await api.patch(
      `${SERVICE_REVIEWS_ENDPOINT}/${reviewId}/helpful`
    );
    return response.data.data?.review || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get service rating statistics
 */
export const getServiceRatingStats = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}/reviews/stats`);
    return response.data.data || response.data;
  } catch (e) {
    // Fallback: fetch reviews and calculate stats locally
    const reviews = await fetchServiceReviews(serviceId);
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
};
