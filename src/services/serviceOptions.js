// src/services/serviceOptions.js

import api from './api';

const SERVICE_OPTIONS_ENDPOINT = '/service-options';

/**
 * Fetch all options for a service
 */
export const getServiceOptions = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}/options`);
    return response.data.data?.options || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create service option
 */
export const createServiceOption = async (serviceId, optionData) => {
  try {
    const response = await api.post(`/services/${serviceId}/options`, optionData);
    return response.data.data?.option || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create multiple service options
 */
export const createServiceOptions = async (serviceId, options) => {
  try {
    const response = await api.post(`/services/${serviceId}/options/batch`, { options });
    return response.data.data?.options || response.data.data || [];
  } catch (error) {
    // Fallback: create options one by one
    const createdOptions = [];
    for (const option of options) {
      try {
        const result = await createServiceOption(serviceId, option);
        createdOptions.push(result);
      } catch (e) {
        console.error('Failed to create option:', e);
      }
    }
    return createdOptions;
  }
};

/**
 * Update service option
 */
export const updateServiceOption = async (serviceId, optionId, updates) => {
  try {
    const response = await api.patch(`/services/${serviceId}/options/${optionId}`, updates);
    return response.data.data?.option || response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete service option
 */
export const deleteServiceOption = async (serviceId, optionId) => {
  try {
    await api.delete(`/services/${serviceId}/options/${optionId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reorder service options
 */
export const reorderServiceOptions = async (serviceId, optionIds) => {
  try {
    const response = await api.patch(`/services/${serviceId}/options/reorder`, {
      optionIds
    });
    return response.data.data?.options || response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};
