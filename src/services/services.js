// src/services/services.js

import api from './api';

const SERVICES_ENDPOINT = '/services';
const SERVICE_REVIEWS_ENDPOINT = '/service-reviews';

/**
 * Fetch all services with filtering and pagination
 */
export const getAllServices = async (params = {}) => {
  try {
    // Log the request parameters
    console.log('📤 Fetching services with params:', params);
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    console.log('   ✅ Cleaned params:', filteredParams);
    
    const response = await api.get(SERVICES_ENDPOINT, { params: filteredParams });
    console.log(`   📥 Received ${response.data?.data?.services?.length || 0} services`);
    return response.data;
  } catch (error) {
    console.error('   ❌ Error fetching services:', error);
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

/**
 * Fetch current user's services
 */
export const getMyServices = async () => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your services' };
  }
};

/**
 * Fetch single service by ID
 */
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch service' };
  }
};

/**
 * Create new service
 */
export const createService = async (serviceData) => {
  try {
    // Prepare headers for FormData
    const config = {};
    if (serviceData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
      // File uploads and image processing can take longer; extend timeout for this request
      config.timeout = 60000; // 60 seconds
    }
    
    const response = await api.post(SERVICES_ENDPOINT, serviceData, config);
    return response.data.data.service;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create service' };
  }
};

/**
 * Update service
 */
export const updateService = async (id, updates) => {
  try {
    // Prepare headers for FormData
    const config = {};
    if (updates instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
      // Allow longer timeout for updates that include file uploads
      config.timeout = 60000; // 60 seconds
    }
    
    const response = await api.patch(`${SERVICES_ENDPOINT}/${id}`, updates, config);
    return response.data.data.service;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update service' };
  }
};

/**
 * Delete service
 */
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`${SERVICES_ENDPOINT}/${id}`, {
      timeout: 30000, // allow up to 30s for Cloudinary image deletion
    });
    return response.status === 204;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete service' };
  }
};

/**
 * Search services
 */
export const searchServices = async (query, params = {}) => {
  try {
    const response = await api.get(SERVICES_ENDPOINT, {
      params: { search: query, ...params }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search services' };
  }
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (categoryId, params = {}) => {
  try {
    const response = await api.get(SERVICES_ENDPOINT, {
      params: { category: categoryId, ...params }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch services by category' };
  }
};

/**
 * Get services by provider (shop)
 */
export const getServicesByProvider = async (providerId, params = {}) => {
  try {
    const response = await api.get(SERVICES_ENDPOINT, {
      params: { provider: providerId, ...params }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch provider services' };
  }
};

/**
 * Rate a service
 */
export const rateService = async (serviceId, ratingData) => {
  try {
    const response = await api.post(`${SERVICE_REVIEWS_ENDPOINT}`, {
      service: serviceId,
      ...ratingData
    });
    return response.data.data.review;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to rate service' };
  }
};

/**
 * Get service reviews
 */
export const getServiceReviews = async (serviceId, params = {}) => {
  try {
    const response = await api.get(`${SERVICE_REVIEWS_ENDPOINT}`, {
      params: { service: serviceId, ...params }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

/**
 * Filter services with advanced options
 */
export const filterServices = async (filters = {}) => {
  try {
    const queryParams = {
      ...(filters.search && { search: filters.search }),
      ...(filters.category && { category: filters.category }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.minRating && { minRating: filters.minRating }),
      ...(filters.maxRating && { maxRating: filters.maxRating }),
      ...(filters.availability && { availability: filters.availability }),
      ...(filters.sort && { sort: filters.sort }),
      ...(filters.page && { page: filters.page }),
      ...(filters.limit && { limit: filters.limit })
    };

    const response = await api.get(SERVICES_ENDPOINT, { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to filter services' };
  }
};

/**
 * Get service statistics (for provider dashboard)
 */
export const getServiceStats = async (serviceId) => {
  try {
    const response = await api.get(`${SERVICES_ENDPOINT}/${serviceId}/stats`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch service statistics' };
  }
};

export default {
  getAllServices,
  getMyServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices,
  getServicesByCategory,
  getServicesByProvider,
  rateService,
  getServiceReviews,
  filterServices,
  getServiceStats
};
