import api from './api';

const HOSTELS_ENDPOINT = '/hostels';

/**
 * Fetch all hostels with optional filters
 * @param {Object} params - Query parameters (page, limit, category, search, etc.)
 * @returns {Promise}
 */
export const fetchHostels = async (params = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch paginated hostels
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const fetchHostelsPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single hostel by ID
 * @param {string} id - Hostel ID
 * @returns {Promise}
 */
export const fetchHostelById = async (id) => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/${id}`);
    
    // Handle multiple response structures from backend
    let hostel = null;
    
    if (response.data.hostel) {
      hostel = response.data.hostel;
    } else if (response.data.data) {
      hostel = response.data.data;
    } else if (response.data._id) {
      // Response is directly the hostel object
      hostel = response.data;
    } else {
      // Fallback to entire response
      hostel = response.data;
    }
    
    // Ensure we have valid data
    if (!hostel || typeof hostel !== 'object') {
      throw new Error('Invalid hostel data received from server');
    }
    
    return hostel;
  } catch (error) {
    console.error('Error fetching hostel:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's hostels (my hostels)
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const fetchMyHostels = async (params = {}) => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}`, {
      params: { ...params, owner: 'me' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new hostel
 * @param {Object} hostelData - Hostel data
 * @param {File|File[]} image - Hostel image(s)
 * @returns {Promise}
 */
export const createHostel = async (hostelData, image = null) => {
  try {
    const formData = new FormData();

    // Add hostel data
    Object.keys(hostelData).forEach((key) => {
      if (hostelData[key] !== null && hostelData[key] !== undefined) {
        if (Array.isArray(hostelData[key])) {
          hostelData[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, hostelData[key]);
        }
      }
    });

    // Add images - handle both single and multiple
    if (image) {
      if (Array.isArray(image)) {
        // Multiple images
        image.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (image instanceof File) {
        // Single image
        formData.append('image', image);
      }
    }

    const response = await api.post(HOSTELS_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds for file uploads
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update hostel
 * @param {string} id - Hostel ID
 * @param {Object} hostelData - Updated hostel data
 * @param {File|File[]} newImage - New hostel image(s)
 * @returns {Promise}
 */
export const updateHostel = async (id, hostelData, newImage = null) => {
  try {
    const formData = new FormData();

    // Add hostel data
    Object.keys(hostelData).forEach((key) => {
      if (hostelData[key] !== null && hostelData[key] !== undefined) {
        if (Array.isArray(hostelData[key])) {
          hostelData[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, hostelData[key]);
        }
      }
    });

    // Add new images - handle both single and multiple
    if (newImage) {
      if (Array.isArray(newImage)) {
        // Multiple images
        newImage.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          }
        });
      } else if (newImage instanceof File) {
        // Single image
        formData.append('image', newImage);
      }
    }

    const response = await api.patch(`${HOSTELS_ENDPOINT}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds for file uploads
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete hostel
 * @param {string} id - Hostel ID
 * @returns {Promise}
 */
export const deleteHostel = async (id) => {
  try {
    const response = await api.delete(`${HOSTELS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search hostels
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const searchHostels = async (query, filters = {}) => {
  try {
    const response = await api.get(HOSTELS_ENDPOINT, {
      params: { search: query, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get hostel statistics
 * @returns {Promise}
 */
export const getHostelStats = async () => {
  try {
    const response = await api.get(`${HOSTELS_ENDPOINT}/stats`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload hostel image
 * @param {File} file - Image file
 * @returns {Promise}
 */
export const uploadHostelImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/cloudinary/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

