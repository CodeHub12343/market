import api from './api';

// Legacy endpoint (deprecated - kept for backward compatibility)
const CATEGORIES_ENDPOINT = '/categories';

// Type-specific endpoints for new separate category models
const TYPE_SPECIFIC_ENDPOINTS = {
  product: '/product-categories',
  service: '/service-categories',
  event: '/event-categories',
  hostel: '/hostel-categories',
  roommate: '/roommate-categories',
  request: '/request-categories',
};

/**
 * Fetch all categories (legacy unified endpoint)
 * @returns {Promise}
 * @deprecated Use type-specific functions instead
 */
export const fetchCategories = async () => {
  try {
    console.log('fetchCategories: Fetching all categories from', CATEGORIES_ENDPOINT);
    const response = await api.get(CATEGORIES_ENDPOINT);
    console.log('fetchCategories response:', response.data);
    
    // Extract data from response
    const data = response.data.data || response.data;
    
    // Handle array response
    if (Array.isArray(data)) {
      console.log('fetchCategories: Got array of categories:', data);
      return data;
    }
    
    // Handle nested categories property
    if (data.categories && Array.isArray(data.categories)) {
      console.log('fetchCategories: Got nested categories array:', data.categories);
      return data.categories;
    }
    
    console.log('fetchCategories: Extracted data:', data);
    return data;
  } catch (error) {
    console.error('fetchCategories error:', error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch categories by type (Product, Service, Event, Hostel, Roommate, Request)
 * @param {string} type - The listing type
 * @returns {Promise}
 */
export const fetchCategoriesByType = async (type) => {
  if (!type || !TYPE_SPECIFIC_ENDPOINTS[type]) {
    throw new Error(`Invalid category type: ${type}. Must be one of: ${Object.keys(TYPE_SPECIFIC_ENDPOINTS).join(', ')}`);
  }

  try {
    const endpoint = TYPE_SPECIFIC_ENDPOINTS[type];
    console.log(`fetchCategoriesByType: Fetching ${type} categories from`, endpoint);
    const response = await api.get(endpoint, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log(`fetchCategoriesByType response for ${type}:`, response.data);
    
    // Extract data from response
    const data = response.data.data || response.data;
    
    // Handle array response
    if (Array.isArray(data)) {
      console.log(`fetchCategoriesByType: Got array of ${type} categories:`, data);
      return data;
    }
    
    // Handle nested data property
    if (data.data && Array.isArray(data.data)) {
      console.log(`fetchCategoriesByType: Got nested ${type} categories:`, data.data);
      return data.data;
    }
    
    console.log(`fetchCategoriesByType: Extracted ${type} data:`, data);
    return data;
  } catch (error) {
    console.error(`fetchCategoriesByType error for ${type}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      config: error.config?.url,
      code: error.code
    });
    throw error.response?.data || error;
  }
};

/**
 * Fetch category by ID
 * @param {string} id - Category ID
 * @returns {Promise}
 * @deprecated Use type-specific functions instead
 */
export const fetchCategoryById = async (id) => {
  try {
    console.log('fetchCategoryById: Fetching category', id);
    const response = await api.get(`${CATEGORIES_ENDPOINT}/${id}`);
    console.log('fetchCategoryById response:', response.data);
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('fetchCategoryById error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch a single category by type and ID
 * @param {string} type - The listing type
 * @param {string} id - Category ID
 * @returns {Promise}
 */
export const fetchCategoryByTypeAndId = async (type, id) => {
  if (!type || !TYPE_SPECIFIC_ENDPOINTS[type]) {
    throw new Error(`Invalid category type: ${type}`);
  }

  try {
    const endpoint = TYPE_SPECIFIC_ENDPOINTS[type];
    console.log(`fetchCategoryByTypeAndId: Fetching ${type} category ${id} from`, `${endpoint}/${id}`);
    const response = await api.get(`${endpoint}/${id}`);
    console.log(`fetchCategoryByTypeAndId response:`, response.data);
    
    return response.data.data || response.data;
  } catch (error) {
    console.error(`fetchCategoryByTypeAndId error:`, error);
    throw error.response?.data || error;
  }
};

