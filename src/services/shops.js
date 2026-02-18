import api from './api';

const SHOPS_ENDPOINT = '/shops';

/**
 * Fetch all shops with optional filters
 * @param {Object} params - Query parameters (page, limit, search, category, etc.)
 * @returns {Promise}
 */
export const fetchShops = async (params = {}) => {
  try {
    const response = await api.get(SHOPS_ENDPOINT, { params });
    console.log('fetchShops response:', response.data);
    return response.data;
  } catch (error) {
    console.error('fetchShops error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch paginated shops
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const fetchShopsPaginated = async (
  page = 1,
  limit = 12,
  filters = {}
) => {
  try {
    console.log('Fetching shops with params:', { page, limit, filters });
    const response = await api.get(SHOPS_ENDPOINT, {
      params: { page, limit, ...filters },
    });
    console.log('fetchShopsPaginated response:', response.data);
    return response.data;
  } catch (error) {
    console.error('fetchShopsPaginated error:', error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch single shop by ID
 * @param {string} id - Shop ID
 * @returns {Promise}
 */
export const fetchShopById = async (id) => {
  try {
    console.log('fetchShopById: Fetching shop with ID:', id);
    const response = await api.get(`${SHOPS_ENDPOINT}/${id}`);
    console.log('fetchShopById raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle different response structures
    // Backend returns: { status: 'success', data: { shop: { ... } } }
    let shopData = response.data.data?.shop || response.data.data || response.data;
    
    // Check if response is an error
    if (shopData?.status === 'error') {
      console.error('fetchShopById: Backend returned error:', shopData.message);
      throw new Error(shopData.message);
    }
    
    if (!shopData) {
      console.error('fetchShopById: No shop data in response');
      throw new Error('Shop not found');
    }
    
    console.log('fetchShopById extracted data:', JSON.stringify(shopData, null, 2));
    console.log('fetchShopById shop fields:', {
      name: shopData.name,
      description: shopData.description,
      logo: shopData.logo,
      campus: shopData.campus,
      category: shopData.category,
      ratingsAverage: shopData.ratingsAverage,
      createdAt: shopData.createdAt,
    });
    return shopData;
  } catch (error) {
    console.error('fetchShopById error:', error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch current user's shop (single shop)
 * @returns {Promise}
 */
export const fetchMyShop = async () => {
  try {
    console.log('fetchMyShop: Fetching user shop from /shops/me');
    const response = await api.get(`${SHOPS_ENDPOINT}/me`);
    console.log('fetchMyShop response:', response.data);
    
    // Handle different response structures
    let shopData = response.data.data || response.data;
    
    // If we get an array of shops, get the first one (the user's shop)
    if (Array.isArray(shopData.shops) && shopData.shops.length > 0) {
      console.log('fetchMyShop: Got array of shops, using first one:', shopData.shops[0]);
      return shopData.shops[0];
    }
    
    // If shopData itself is an array, get the first element
    if (Array.isArray(shopData) && shopData.length > 0) {
      console.log('fetchMyShop: Got array, using first element:', shopData[0]);
      return shopData[0];
    }
    
    console.log('fetchMyShop extracted data:', shopData);
    return shopData;
  } catch (error) {
    console.error('fetchMyShop error:', error.response?.status, error.response?.data || error.message);
    // Don't throw on 404, just return null for no shop
    if (error.response?.status === 404) {
      console.log('fetchMyShop: User has no shop (404)');
      return null;
    }
    throw error.response?.data || error;
  }
};

/**
 * Fetch all current user's shops
 * @returns {Promise} - Array of shops owned by current user
 */
export const fetchMyShops = async () => {
  try {
    console.log('fetchMyShops: Fetching all user shops from /shops/me');
    const response = await api.get(`${SHOPS_ENDPOINT}/me`);
    console.log('fetchMyShops raw response:', JSON.stringify(response.data, null, 2));
    
    // Handle different response structures
    let shopData = response.data.data || response.data;
    
    // If we get { shops: [...] }, return the array
    if (shopData && Array.isArray(shopData.shops)) {
      console.log('fetchMyShops: Got shops array:', shopData.shops);
      console.log('fetchMyShops: First shop data:', shopData.shops[0]);
      return shopData.shops;
    }
    
    // If shopData itself is an array, return it
    if (Array.isArray(shopData)) {
      console.log('fetchMyShops: Got direct array:', shopData);
      console.log('fetchMyShops: First shop data:', shopData[0]);
      return shopData;
    }
    
    // If we got a single shop object, wrap it in an array
    if (shopData && shopData._id) {
      console.log('fetchMyShops: Got single shop, wrapping in array:', shopData);
      return [shopData];
    }
    
    console.log('fetchMyShops: No shops found, returning empty array');
    return [];
  } catch (error) {
    console.error('fetchMyShops error:', error.response?.status, error.response?.data || error.message);
    // Don't throw on 404, just return empty array for no shops
    if (error.response?.status === 404) {
      console.log('fetchMyShops: User has no shops (404)');
      return [];
    }
    throw error.response?.data || error;
  }
};

/**
 * Create new shop with optional logo image
 * @param {Object} shopData - Shop data
 * @param {File} logoFile - Optional logo image file
 * @returns {Promise}
 */
export const createShop = async (shopData, logoFile) => {
  try {
    console.log('createShop called with shopData:', shopData, 'logoFile:', logoFile);
    
    // If no logo file, send as regular JSON
    if (!logoFile) {
      console.log('No logo file provided, sending as JSON');
      // Ensure logo field is not included or is removed if it's an empty object
      const cleanedData = { ...shopData };
      if (!cleanedData.logo || (typeof cleanedData.logo === 'object' && Object.keys(cleanedData.logo).length === 0)) {
        delete cleanedData.logo;
      }
      const response = await api.post(SHOPS_ENDPOINT, cleanedData);
      console.log('createShop response:', response.data);
      return response.data.data;
    }

    // If logo file provided, use FormData for multipart upload
    console.log('Logo file provided, creating FormData');
    const formData = new FormData();
    
    // Append shop data fields - SKIP logo field (will append file instead)
    Object.keys(shopData).forEach((key) => {
      const value = shopData[key];
      // Skip logo field - we'll append the actual File object instead
      if (key === 'logo') {
        console.log('Skipping logo field from shopData, will append file instead');
        return;
      }
      // Only skip null/undefined, but append empty strings
      if (value !== null && value !== undefined) {
        console.log(`Appending ${key}:`, value);
        formData.append(key, value);
      }
    });

    // Append logo file LAST with correct field name
    // Make sure the File object is being appended correctly
    if (logoFile instanceof File) {
      console.log('Appending logo file:', logoFile.name, logoFile.type, logoFile.size);
      // Use 3-parameter form: key, file, filename
      formData.append('logo', logoFile, logoFile.name);
    } else {
      console.warn('Logo is not a File object:', logoFile);
      throw new Error('Logo must be a File object');
    }

    console.log('FormData created, entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // Send FormData with axios
    // Create a new FormData request without default headers interfering
    const response = await api.post(SHOPS_ENDPOINT, formData, {
      headers: {
        // Let the browser/axios set Content-Type with boundary
        'Content-Type': undefined,
      },
      transformRequest: [
        function(data) {
          // Return FormData as-is, don't transform
          return data;
        }
      ]
    });
    
    console.log('createShop response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('createShop error:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error message:', error.message);
    throw error.response?.data || error;
  }
};

/**
 * Update shop
 * @param {string} id - Shop ID
 * @param {Object} shopData - Updated shop data
 * @returns {Promise}
 */
export const updateShop = async (id, shopData) => {
  try {
    const response = await api.patch(`${SHOPS_ENDPOINT}/${id}`, shopData);
    console.log('updateShop response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('updateShop error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete shop
 * @param {string} id - Shop ID
 * @returns {Promise}
 */
export const deleteShop = async (id) => {
  try {
    const response = await api.delete(`${SHOPS_ENDPOINT}/${id}`);
    console.log('deleteShop response:', response.data);
    return response.data;
  } catch (error) {
    console.error('deleteShop error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update shop settings
 * @param {string} id - Shop ID
 * @param {Object} settings - Settings object
 * @returns {Promise}
 */
export const updateShopSettings = async (id, settings) => {
  try {
    const response = await api.post(`${SHOPS_ENDPOINT}/${id}/settings`, settings);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get shop analytics
 * @param {string} id - Shop ID
 * @returns {Promise}
 */
export const getShopAnalytics = async (id) => {
  try {
    const response = await api.get(`${SHOPS_ENDPOINT}/${id}/analytics`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search shops
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const searchShops = async (query, filters = {}) => {
  try {
    const response = await api.get(SHOPS_ENDPOINT, {
      params: { search: query, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};