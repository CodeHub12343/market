import api from './api';

const REQUESTS_ENDPOINT = '/requests';

/**
 * Fetch all requests with pagination and filters
 */
export const fetchRequestsPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`${REQUESTS_ENDPOINT}?${queryParams}`);
    
    // Handle different response structures
    const data = response.data?.data || response.data;
    const requests = Array.isArray(data) ? data : data?.requests || [];
    const total = response.data?.total || response.data?.pagination?.total || 0;
    const currentPage = response.data?.page || response.data?.pagination?.currentPage || page;
    
    return {
      requests,
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / limit),
        total,
        limit
      }
    };
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single request by ID
 */
export const fetchRequestById = async (id) => {
  try {
    const response = await api.get(`${REQUESTS_ENDPOINT}/${id}?populate=requester`);
    return response.data.data || response.data.request || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch current user's own requests
 */
export const fetchMyRequests = async () => {
  try {
    const response = await api.get(`${REQUESTS_ENDPOINT}/my-requests`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search requests with query
 */
export const searchRequests = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    });
    const response = await api.get(`${REQUESTS_ENDPOINT}/search?${queryParams}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new request
 */
export const createRequest = async (requestData) => {
  try {
    console.log('Creating request with data:', requestData);
    const response = await api.post(REQUESTS_ENDPOINT, requestData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Create request error details:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Update a request
 */
export const updateRequest = async (id, updateData) => {
  try {
    const response = await api.patch(`${REQUESTS_ENDPOINT}/${id}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a request
 */
export const deleteRequest = async (id) => {
  try {
    const response = await api.delete(`${REQUESTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Close/fulfill a request
 */
export const closeRequest = async (id, closureData = {}) => {
  try {
    const response = await api.patch(`${REQUESTS_ENDPOINT}/${id}/close`, closureData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reopen a closed request
 */
export const reopenRequest = async (id) => {
  try {
    const response = await api.patch(`${REQUESTS_ENDPOINT}/${id}/reopen`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get offers for a specific request
 */
export const fetchRequestOffers = async (requestId) => {
  try {
    const response = await api.get(`${REQUESTS_ENDPOINT}/${requestId}/offers`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add to favorites
 */
export const toggleFavoriteRequest = async (id) => {
  try {
    const response = await api.post(`${REQUESTS_ENDPOINT}/${id}/favorite`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get trending requests
 */
export const getTrendingRequests = async () => {
  try {
    const response = await api.get(`${REQUESTS_ENDPOINT}/trending`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get requests by category
 */
export const getRequestsByCategory = async (category) => {
  try {
    const response = await api.get(`${REQUESTS_ENDPOINT}/category/${category}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get requests by status
 */
export const getRequestsByStatus = async (status) => {
  try {
    const queryParams = new URLSearchParams({ status });
    const response = await api.get(`${REQUESTS_ENDPOINT}?${queryParams}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Accept a request offer
 */
export const acceptRequestOffer = async (requestId, offerId) => {
  try {
    const response = await api.post(`${REQUESTS_ENDPOINT}/${requestId}/offers/${offerId}/accept`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reject a request offer
 */
export const rejectRequestOffer = async (requestId, offerId) => {
  try {
    const response = await api.post(`${REQUESTS_ENDPOINT}/${requestId}/offers/${offerId}/reject`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  fetchRequestsPaginated,
  fetchRequestById,
  fetchMyRequests,
  searchRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  closeRequest,
  reopenRequest,
  fetchRequestOffers,
  toggleFavoriteRequest,
  getTrendingRequests,
  getRequestsByCategory,
  getRequestsByStatus,
  acceptRequestOffer,
  rejectRequestOffer
};
