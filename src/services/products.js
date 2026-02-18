import api from "./api";

const PRODUCTS_ENDPOINT = "/products";

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query parameters (page, limit, category, search, etc.)
 * @returns {Promise}
 */
export const fetchProducts = async (params = {}) => {
  try {
    // Clean up empty string parameters
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    // Convert sortBy format from '-createdAt' to 'createdAt' with order 'desc'
    if (cleanParams.sortBy) {
      if (cleanParams.sortBy.startsWith('-')) {
        cleanParams.sortBy = cleanParams.sortBy.substring(1);
        cleanParams.order = 'desc';
      } else {
        cleanParams.order = 'asc';
      }
    }

    console.log("📤 fetchProducts - Sending to backend:", {
      endpoint: '/products/search/advanced',
      params: cleanParams,
      hasCategoryFilter: !!cleanParams.category
    });
    const response = await api.get(`${PRODUCTS_ENDPOINT}/search/advanced`, { params: cleanParams });
    console.log("📥 fetchProducts response status:", response.status, "items:", response.data?.data?.products?.length || 0);
    
    // Extract products from the correct structure
    // Backend returns: { status, results, pagination, data: { products } }
    if (response.data?.data?.products && Array.isArray(response.data.data.products)) {
      console.log("Returning products array:", response.data.data.products.length);
      return response.data.data.products;
    }
    
    // Fallback for other structures
    if (Array.isArray(response.data?.data)) {
      console.log("Returning data array:", response.data.data.length);
      return response.data.data;
    }
    
    if (Array.isArray(response.data)) {
      console.log("Returning response.data array:", response.data.length);
      return response.data;
    }
    
    console.warn("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("fetchProducts error:", error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch paginated products
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const fetchProductsPaginated = async (
  page = 1,
  limit = 12,
  filters = {}
) => {
  try {
    console.log("Fetching products with params:", { page, limit, filters });
    const response = await api.get(PRODUCTS_ENDPOINT, {
      params: { page, limit, ...filters },
    });
    console.log("fetchProductsPaginated response:", response.data);
    return response.data;
  } catch (error) {
    console.error("fetchProductsPaginated error:", error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch all marketplace products (not filtered by seller)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const fetchAllMarketplaceProducts = async (
  page = 1,
  limit = 12,
  filters = {}
) => {
  try {
    // Ensure no seller filter to get all marketplace products
    const marketplaceFilters = { ...filters };
    delete marketplaceFilters.seller;
    
    console.log("Fetching ALL marketplace products with params:", { page, limit, filters: marketplaceFilters });
    const response = await api.get(PRODUCTS_ENDPOINT, {
      params: { page, limit, ...marketplaceFilters },
    });
    console.log("fetchAllMarketplaceProducts response:", response.data);
    return response.data;
  } catch (error) {
    console.error("fetchAllMarketplaceProducts error:", error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch single product by ID
 * @param {string} id - Product ID
 * @returns {Promise}
 */
export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/${id}`);
    console.log("fetchProductById response:", response.data);
    // Handle the nested product structure { product: {...} }
    const product = response.data?.product || response.data?.data?.product || response.data?.data || response.data;
    console.log("fetchProductById extracted product:", product);
    return product;
  } catch (error) {
    console.error("fetchProductById error:", error.response?.status, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Fetch products by seller ID (my products)
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const fetchMyProducts = async (params = {}) => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}`, {
      params: { ...params, seller: "me" },
    });
    // Return the full response so we can see the structure
    console.log("fetchMyProducts response:", response.data);
    return response.data;
  } catch (error) {
    console.error("fetchMyProducts error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Create new product
 * @param {Object} productData - Product data
 * @param {File[]} images - Product images
 * @returns {Promise}
 */
export const createProduct = async (productData, images = []) => {
  try {
    const formData = new FormData();

    // Add product data
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Add images
    images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images`, image);
      }
    });

    const response = await api.post(PRODUCTS_ENDPOINT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // allow up to 60s for uploads
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @param {File[]} newImages - New product images
 * @returns {Promise}
 */
export const updateProduct = async (id, productData, newImages = []) => {
  try {
    const formData = new FormData();

    // Add product data
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Add new images
    newImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });

    const response = await api.patch(`${PRODUCTS_ENDPOINT}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // allow up to 60s for uploads
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`${PRODUCTS_ENDPOINT}/${id}`, {
      timeout: 30000, // allow up to 30s for Cloudinary image deletion
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise}
 */
export const searchProducts = async (query, filters = {}) => {
  try {
    const response = await api.get(PRODUCTS_ENDPOINT, {
      params: { search: query, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get product statistics
 * @returns {Promise}
 */
export const getProductStats = async () => {
  try {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/stats`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload product images
 * @param {File[]} files - Image files
 * @returns {Promise}
 */
export const uploadProductImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/cloudinary/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
