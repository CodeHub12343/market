import api from './api';

/**
 * Fetch reviews for a specific hostel
 */
export const fetchHostelReviews = async (hostelId, params = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', rating } = params;
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
      ...(rating && { rating })
    });

    const response = await api.get(`/hostels/${hostelId}/reviews?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hostel reviews:', error);
    throw error;
  }
};

/**
 * Fetch reviews by user
 */
export const fetchMyHostelReviews = async (params = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = params;
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort
    });

    const response = await api.get(`/hostels/reviews/my-reviews?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my hostel reviews:', error);
    throw error;
  }
};

/**
 * Get review by ID
 */
export const fetchHostelReviewById = async (reviewId) => {
  try {
    const response = await api.get(`/hostels/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hostel review:', error);
    throw error;
  }
};

/**
 * Create a new review for a hostel
 */
export const createHostelReview = async (hostelId, reviewData) => {
  try {
    const response = await api.post(`/hostels/${hostelId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating hostel review:', error);
    throw error;
  }
};

/**
 * Update an existing review
 */
export const updateHostelReview = async (reviewId, reviewData) => {
  try {
    const response = await api.patch(`/hostels/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating hostel review:', error);
    throw error;
  }
};

/**
 * Delete a review
 */
export const deleteHostelReview = async (reviewId) => {
  try {
    const response = await api.delete(`/hostels/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting hostel review:', error);
    throw error;
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (reviewId) => {
  try {
    const response = await api.patch(`/hostels/reviews/${reviewId}/helpful`);
    return response.data;
  } catch (error) {
    console.error('Error marking review helpful:', error);
    throw error;
  }
};

/**
 * Get rating statistics for a hostel
 */
export const getHostelRatingStats = async (hostelId) => {
  try {
    const response = await api.get(`/hostels/${hostelId}/rating-stats`);
    
    // Return backend response or fallback with calculated stats
    if (response.data?.data) {
      return response.data.data;
    }

    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    // Return fallback stats on error
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };
  }
};

export default {
  fetchHostelReviews,
  fetchMyHostelReviews,
  fetchHostelReviewById,
  createHostelReview,
  updateHostelReview,
  deleteHostelReview,
  markReviewHelpful,
  getHostelRatingStats
};
