import api from './api'

const REVIEWS_ENDPOINT = '/roommate-reviews'

/**
 * Fetch reviews for a roommate listing
 */
export const fetchRoommateReviews = async (roommateId, page = 1, limit = 10) => {
  try {
    const queryParams = new URLSearchParams({ page, limit })
    const response = await api.get(`${REVIEWS_ENDPOINT}/roommate/${roommateId}?${queryParams}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching roommate reviews:', error)
    throw error.response?.data || error
  }
}

/**
 * Create review for roommate experience
 */
export const createRoommateReview = async (roommateId, reviewData) => {
  try {
    const response = await api.post(`${REVIEWS_ENDPOINT}/${roommateId}`, reviewData)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error.response?.data || error
  }
}

/**
 * Update review
 */
export const updateRoommateReview = async (reviewId, updateData) => {
  try {
    const response = await api.patch(`${REVIEWS_ENDPOINT}/${reviewId}`, updateData)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error updating review:', error)
    throw error.response?.data || error
  }
}

/**
 * Delete review
 */
export const deleteRoommateReview = async (reviewId) => {
  try {
    const response = await api.delete(`${REVIEWS_ENDPOINT}/${reviewId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error.response?.data || error
  }
}

/**
 * Get roommate's review stats
 */
export const fetchRoommateReviewStats = async (roommateId) => {
  try {
    const response = await api.get(`${REVIEWS_ENDPOINT}/stats/${roommateId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching review stats:', error)
    throw error.response?.data || error
  }
}

export default {
  fetchRoommateReviews,
  createRoommateReview,
  updateRoommateReview,
  deleteRoommateReview,
  fetchRoommateReviewStats
}
