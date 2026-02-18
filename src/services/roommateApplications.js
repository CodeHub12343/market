import api from './api'

const APPLICATIONS_ENDPOINT = '/roommate-applications'

/**
 * Fetch user's roommate applications
 */
export const fetchMyApplications = async (page = 1, limit = 12) => {
  try {
    const queryParams = new URLSearchParams({ page, limit })
    const response = await api.get(`${APPLICATIONS_ENDPOINT}?${queryParams}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching applications:', error)
    throw error.response?.data || error
  }
}

/**
 * Apply to roommate listing
 */
export const applyToRoommate = async (roommateId, applicationData) => {
  try {
    // Map duration to leaseDuration enum value
    const durationMap = {
      'flexible': 'flexible',
      '6': '6-months',
      '12': '12-months',
      '6-months': '6-months',
      '12-months': '12-months'
    }
    const leaseDuration = durationMap[applicationData.duration] || 'flexible'

    const response = await api.post(`${APPLICATIONS_ENDPOINT}`, {
      roommateId: roommateId,
      message: applicationData.message,
      budget: applicationData.budget,
      moveInDate: applicationData.moveInDate,
      leaseDuration: leaseDuration,
      rating: applicationData.rating
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error applying to roommate listing:', error)
    throw error.response?.data || error
  }
}

/**
 * Get application details
 */
export const fetchApplicationById = async (applicationId) => {
  try {
    const response = await api.get(`${APPLICATIONS_ENDPOINT}/${applicationId}`)
    return response.data.data || response.data.application || response.data
  } catch (error) {
    console.error('Error fetching application:', error)
    throw error.response?.data || error
  }
}

/**
 * Approve application
 */
export const approveApplication = async (applicationId, responseMessage = '') => {
  try {
    const response = await api.patch(`${APPLICATIONS_ENDPOINT}/${applicationId}/approve`, {
      responseMessage
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error approving application:', error)
    throw error.response?.data || error
  }
}

/**
 * Reject application
 */
export const rejectApplication = async (applicationId, responseMessage = '') => {
  try {
    const response = await api.patch(`${APPLICATIONS_ENDPOINT}/${applicationId}/reject`, {
      responseMessage
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('Error updating application status:', error)
    throw error.response?.data || error
  }
}

/**
 * Withdraw application
 */
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await api.delete(`${APPLICATIONS_ENDPOINT}/${applicationId}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error withdrawing application:', error)
    throw error.response?.data || error
  }
}

/**
 * Get roommate's pending applications
 */
export const fetchRoommateApplications = async (roommateId, status = 'pending') => {
  try {
    const response = await api.get(`${APPLICATIONS_ENDPOINT}?roommate=${roommateId}&status=${status}`)
    return response.data.data || response.data.applications || response.data
  } catch (error) {
    console.error('Error fetching roommate applications:', error)
    throw error.response?.data || error
  }
}

/**
 * Update application status (approve/reject)
 */
export const updateApplicationStatus = async (applicationId, status, message = '') => {
  try {
    if (status === 'approved') {
      return await approveApplication(applicationId, message)
    } else if (status === 'rejected') {
      return await rejectApplication(applicationId, message)
    } else {
      throw new Error(`Unknown status: ${status}`)
    }
  } catch (error) {
    console.error('Error updating application status:', error)
    throw error.response?.data || error
  }
}

export default {
  fetchMyApplications,
  applyToRoommate,
  fetchApplicationById,
  approveApplication,
  rejectApplication,
  updateApplicationStatus,
  withdrawApplication,
  fetchRoommateApplications
}
