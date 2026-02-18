import api from './api';

const SHOP_OFFERS_ENDPOINT = '/shop-offers';

/**
 * Fetch all shop offers with pagination and filters
 */
export const fetchOffersPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single shop offer by ID
 */
export const fetchOfferById = async (id) => {
  try {
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}/${id}`);
    return response.data.data || response.data.offer || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's created offers
 */
export const fetchMyOffers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}/my-offers?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new shop offer
 * Supports both JSON and form-data (for image upload)
 */
export const createOffer = async (offerData, imageFile = null) => {
  try {
    if (imageFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Add other fields to FormData
      Object.entries(offerData).forEach(([key, value]) => {
        if (key === 'discount' || key === 'location') {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      const response = await api.post(SHOP_OFFERS_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data || response.data;
    } else {
      // Plain JSON request
      const response = await api.post(SHOP_OFFERS_ENDPOINT, offerData);
      return response.data.data || response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a shop offer
 */
export const updateOffer = async (id, updateData, imageFile = null) => {
  try {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === 'discount' || key === 'location') {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      const response = await api.patch(`${SHOP_OFFERS_ENDPOINT}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data || response.data;
    } else {
      const response = await api.patch(`${SHOP_OFFERS_ENDPOINT}/${id}`, updateData);
      return response.data.data || response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a shop offer
 */
export const deleteOffer = async (id) => {
  try {
    const response = await api.delete(`${SHOP_OFFERS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Claim a shop offer
 */
export const claimOffer = async (id) => {
  try {
    const response = await api.post(`${SHOP_OFFERS_ENDPOINT}/${id}/claim`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Unclaim a shop offer
 */
export const unclaimOffer = async (id) => {
  try {
    const response = await api.post(`${SHOP_OFFERS_ENDPOINT}/${id}/unclaim`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Toggle favorite on a shop offer
 */
export const toggleFavoriteOffer = async (id) => {
  try {
    const response = await api.post(`${SHOP_OFFERS_ENDPOINT}/${id}/favorite`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search shop offers
 */
export const searchOffers = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    });
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}/search?${queryParams}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get trending shop offers
 */
export const getTrendingOffers = async () => {
  try {
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}/trending`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get popular/top shop offers
 */
export const getPopularOffers = async () => {
  try {
    const response = await api.get(`${SHOP_OFFERS_ENDPOINT}/popular`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  fetchOffersPaginated,
  fetchOfferById,
  fetchMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  claimOffer,
  unclaimOffer,
  toggleFavoriteOffer,
  searchOffers,
  getTrendingOffers,
  getPopularOffers
};
