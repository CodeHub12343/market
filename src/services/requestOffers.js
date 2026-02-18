import api from './api';

const REQUEST_OFFERS_ENDPOINT = '/offers';

/**
 * Fetch all request-based offers with pagination and filters
 */
export const fetchRequestOffersPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single request-based offer by ID
 */
export const fetchRequestOfferById = async (id) => {
  try {
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/${id}`);
    return response.data.data || response.data.offer || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's sent offers (seller view)
 */
export const fetchMySentOffers = async () => {
  try {
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/my-offers`);
    // Handle different response structures
    let offersData = response.data.data?.offers || response.data.data || response.data.offers || response.data;
    
    console.log('Raw response:', response.data);
    console.log('Offers data before mapping:', offersData);
    
    // Ensure it's an array
    if (!Array.isArray(offersData)) {
      offersData = [];
    }
    
    // Map the response to ensure consistent field naming
    const mappedOffers = offersData.map(offer => ({
      ...offer,
      offerPrice: offer.amount || offer.offerPrice || 0, // Map amount to offerPrice for consistency
      offerDescription: offer.message || offer.offerDescription // Map message to offerDescription
    }));
    
    console.log('Offers after mapping:', mappedOffers);
    return mappedOffers;
  } catch (error) {
    console.error('Error fetching my sent offers:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch offers for a specific request (requester view)
 */
export const fetchOffersForRequest = async (requestId) => {
  try {
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/request/${requestId}`);
    let offersData = response.data.data?.offers || response.data.data || response.data.offers || response.data;
    
    // Ensure it's an array
    if (!Array.isArray(offersData)) {
      offersData = [];
    }
    
    // Map the response to ensure consistent field naming
    return offersData.map(offer => ({
      ...offer,
      offerPrice: offer.amount || offer.offerPrice || 0, // Map amount to offerPrice for consistency
      offerDescription: offer.message || offer.offerDescription // Map message to offerDescription
    }));
  } catch (error) {
    console.error('Error fetching offers for request:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch all offers received by the current user (for their requests)
 */
export const fetchOffersReceivedByMe = async (page = 1, limit = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/my-received/all?${queryParams}`);
    let offersData = response.data.data?.offers || response.data.data || response.data.offers || response.data;
    
    // Ensure it's an array
    if (!Array.isArray(offersData)) {
      offersData = [];
    }
    
    // Map the response to ensure consistent field naming
    const mappedOffers = offersData.map(offer => ({
      ...offer,
      offerPrice: offer.amount || offer.offerPrice || 0,
      offerDescription: offer.message || offer.offerDescription
    }));
    
    return {
      offers: mappedOffers,
      total: response.data.total || response.data.results || mappedOffers.length,
      totalPages: response.data.totalPages || Math.ceil((response.data.total || mappedOffers.length) / limit)
    };
  } catch (error) {
    console.error('Error fetching offers received by me:', error);
    throw error.response?.data || error;
  }
};

/**
 * Search offers with query
 */
export const searchRequestOffers = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    });
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/search?${queryParams}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new offer on a request
 */
export const createRequestOffer = async (offerData) => {
  try {
    // Ensure amount is a number
    const payload = {
      request: offerData.request,
      amount: parseFloat(offerData.amount),
      ...(offerData.message && { message: offerData.message }),
      ...(offerData.product && { product: offerData.product })
    };

    console.log('Creating offer with payload:', payload);
    const response = await api.post(REQUEST_OFFERS_ENDPOINT, payload);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Create offer error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Update an offer
 */
export const updateRequestOffer = async (id, updateData) => {
  try {
    const response = await api.patch(`${REQUEST_OFFERS_ENDPOINT}/${id}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete an offer
 */
export const deleteRequestOffer = async (id) => {
  try {
    const response = await api.delete(`${REQUEST_OFFERS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Accept an offer (requester action)
 */
export const acceptRequestOffer = async (id) => {
  try {
    const response = await api.post(`${REQUEST_OFFERS_ENDPOINT}/${id}/accept`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reject an offer (requester action)
 */
export const rejectRequestOffer = async (id) => {
  try {
    const response = await api.post(`${REQUEST_OFFERS_ENDPOINT}/${id}/reject`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get trending offers
 */
export const getTrendingRequestOffers = async () => {
  try {
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/trending`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get popular offers by category
 */
export const getOffersByCategory = async (category) => {
  try {
    const response = await api.get(`${REQUEST_OFFERS_ENDPOINT}/category/${category}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  fetchRequestOffersPaginated,
  fetchRequestOfferById,
  fetchMySentOffers,
  fetchOffersForRequest,
  searchRequestOffers,
  createRequestOffer,
  updateRequestOffer,
  deleteRequestOffer,
  acceptRequestOffer,
  rejectRequestOffer,
  getTrendingRequestOffers,
  getOffersByCategory
};
