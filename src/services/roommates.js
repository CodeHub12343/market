import api from './api'

// Roommate listings API service
const ROOMMATES_ENDPOINT = '/roommate-listings'

/**
 * Fetch all roommate listings with pagination and filters
 */
export const fetchRoommates = async (page = 1, limit = 12, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    }
    const response = await api.get(ROOMMATES_ENDPOINT, { params })
    console.log('🏠 fetchRoommates response:', response.data)
    
    // Extract listings array from response
    const listings = response.data.data?.listings || response.data.listings || []
    console.log('📦 Extracted listings:', listings)
    
    // Ensure we return an array
    return Array.isArray(listings) ? listings : []
  } catch (error) {
    console.error('Error fetching roommates:', error)
    throw error.response?.data || error
  }
}

/**
 * Fetch single roommate listing by ID
 */
export const fetchRoommateById = async (id) => {
  try {
    const response = await api.get(`${ROOMMATES_ENDPOINT}/${id}`)
    return response.data.data?.listing || response.data.data || response.data
  } catch (error) {
    console.error('Error fetching roommate:', error)
    throw error.response?.data || error
  }
}

/**
 * Fetch user's roommate listings
 */
export const fetchMyRoommates = async () => {
  try {
    const response = await api.get(`${ROOMMATES_ENDPOINT}/my-listings`)
    return response.data.data?.listings || response.data.data?.roommates || response.data.data || response.data
  } catch (error) {
    console.error('Error fetching my roommate listings:', error)
    throw error.response?.data || error
  }
}

/**
 * Create new roommate listing
 */
export const createRoommate = async (roommateData) => {
  try {
    const response = await api.post(ROOMMATES_ENDPOINT, roommateData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60 seconds timeout for image uploads
    })
    return response.data.data?.listing || response.data.data || response.data
  } catch (error) {
    console.error('Error creating roommate listing:', error)
    throw error.response?.data || error
  }
}

/**
 * Update roommate listing
 */
export const updateRoommate = async (id, updateData) => {
  try {
    const response = await api.patch(`${ROOMMATES_ENDPOINT}/${id}`, updateData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error updating roommate listing:', error)
    throw error.response?.data || error
  }
}

/**
 * Delete roommate listing
 */
export const deleteRoommate = async (id) => {
  try {
    const response = await api.delete(`${ROOMMATES_ENDPOINT}/${id}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error deleting roommate listing:', error)
    throw error.response?.data || error
  }
}

/**
 * Search roommates with query
 */
export const searchRoommates = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    })
    const response = await api.get(`${ROOMMATES_ENDPOINT}/search?${queryParams}`)
    return response.data.data?.listings || response.data.data || response.data
  } catch (error) {
    console.error('Error searching roommates:', error)
    throw error.response?.data || error
  }
}

/**
 * Get roommate applicants
 */
export const fetchRoommateApplicants = async (roommateId) => {
  try {
    const response = await api.get(`${ROOMMATES_ENDPOINT}/${roommateId}/applicants`)
    return response.data.data || response.data.applicants || response.data
  } catch (error) {
    console.error('Error fetching applicants:', error)
    throw error.response?.data || error
  }
}

/**
 * Get trending roommates
 */
export const fetchTrendingRoommates = async () => {
  try {
    const response = await api.get(`${ROOMMATES_ENDPOINT}/trending`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching trending roommates:', error)
    throw error.response?.data || error
  }
}

/**
 * Get recommended roommates
 */
export const fetchRecommendedRoommates = async () => {
  try {
    const response = await api.get(`${ROOMMATES_ENDPOINT}/recommended`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching recommended roommates:', error)
    throw error.response?.data || error
  }
}

export default {
  fetchRoommates,
  fetchRoommateById,
  fetchMyRoommates,
  createRoommate,
  updateRoommate,
  deleteRoommate,
  searchRoommates,
  fetchRoommateApplicants,
  fetchTrendingRoommates,
  fetchRecommendedRoommates
}
