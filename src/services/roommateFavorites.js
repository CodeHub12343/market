import api from './api'

const FAVORITES_ENDPOINT = '/roommate-favorites'

/**
 * Fetch user's favorite roommate listings
 */
export const fetchFavoriteRoommates = async (page = 1, limit = 12) => {
  try {
    const queryParams = new URLSearchParams({ page, limit })
    const response = await api.get(FAVORITES_ENDPOINT + `?${queryParams}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching favorite roommates:', error)
    throw error.response?.data || error
  }
}

/**
 * Add roommate to favorites
 */
export const addRoommateToFavorites = async (roommateId, notes = '') => {
  try {
    const response = await api.post(`${FAVORITES_ENDPOINT}/${roommateId}`, { notes })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error adding to favorites:', error)
    throw error.response?.data || error
  }
}

/**
 * Remove roommate from favorites
 */
export const removeRoommateFromFavorites = async (roommateId) => {
  try {
    const response = await api.delete(`${FAVORITES_ENDPOINT}/${roommateId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error removing from favorites:', error)
    throw error.response?.data || error
  }
}

/**
 * Check if roommate is favorited
 */
export const checkRoommateFavorited = async (roommateId) => {
  try {
    const response = await api.get(`${FAVORITES_ENDPOINT}/${roommateId}/check`)
    return response.data.data?.isFavorited || false
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return false
  }
}

export default {
  fetchFavoriteRoommates,
  addRoommateToFavorites,
  removeRoommateFromFavorites,
  checkRoommateFavorited
}
