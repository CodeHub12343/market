/**
 * localStorage utilities for managing hostel creator information
 * This is a temporary workaround until the backend populates creator/owner data
 */

/**
 * Store hostel creator info in localStorage
 * @param {string} hostelId - Hostel ID
 * @param {string} userId - User ID
 */
export const storeHostelCreator = (hostelId, userId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('hostelCreators') || '{}');
    creatorMap[hostelId] = userId;
    localStorage.setItem('hostelCreators', JSON.stringify(creatorMap));
  } catch (error) {
    console.error('Error storing hostel creator:', error);
  }
};

/**
 * Get hostel creator ID from localStorage
 * @param {string} hostelId - Hostel ID
 * @returns {string|null} - Creator ID or null
 */
export const getHostelCreator = (hostelId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('hostelCreators') || '{}');
    return creatorMap[hostelId] || null;
  } catch (error) {
    console.error('Error getting hostel creator:', error);
    return null;
  }
};

/**
 * Check if user is hostel owner
 * @param {string} hostelId - Hostel ID
 * @param {string} currentUserId - Current user ID
 * @param {Object} backendData - Backend hostel data (for primary check)
 * @returns {boolean}
 */
export const isHostelOwner = (hostelId, currentUserId, backendData = {}) => {
  // Primary: Check backend data (preferred)
  if (backendData.owner?._id === currentUserId) return true;
  if (backendData.owner === currentUserId) return true;
  if (backendData.createdBy?._id === currentUserId) return true;
  if (backendData.createdBy === currentUserId) return true;

  // Fallback: Check localStorage
  const storedCreator = getHostelCreator(hostelId);
  return storedCreator === currentUserId;
};

/**
 * Clear hostel creator data (useful when user logs out)
 */
export const clearHostelCreators = () => {
  try {
    localStorage.removeItem('hostelCreators');
  } catch (error) {
    console.error('Error clearing hostel creators:', error);
  }
};

/**
 * Store product creator info (for products)
 */
export const storeProductCreator = (productId, userId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('productCreators') || '{}');
    creatorMap[productId] = userId;
    localStorage.setItem('productCreators', JSON.stringify(creatorMap));
  } catch (error) {
    console.error('Error storing product creator:', error);
  }
};

/**
 * Get product creator ID from localStorage
 */
export const getProductCreator = (productId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('productCreators') || '{}');
    return creatorMap[productId] || null;
  } catch (error) {
    console.error('Error getting product creator:', error);
    return null;
  }
};

/**
 * Check if user is product owner
 */
export const isProductOwner = (productId, currentUserId, backendData = {}) => {
  // Primary: Check backend data
  if (backendData.seller?._id === currentUserId) return true;
  if (backendData.seller === currentUserId) return true;

  // Fallback: Check localStorage
  const storedCreator = getProductCreator(productId);
  return storedCreator === currentUserId;
};

/**
 * Store service creator info
 */
export const storeServiceCreator = (serviceId, userId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('serviceCreators') || '{}');
    creatorMap[serviceId] = userId;
    localStorage.setItem('serviceCreators', JSON.stringify(creatorMap));
  } catch (error) {
    console.error('Error storing service creator:', error);
  }
};

/**
 * Get service creator ID from localStorage
 */
export const getServiceCreator = (serviceId) => {
  try {
    const creatorMap = JSON.parse(localStorage.getItem('serviceCreators') || '{}');
    return creatorMap[serviceId] || null;
  } catch (error) {
    console.error('Error getting service creator:', error);
    return null;
  }
};

/**
 * Check if user is service owner
 */
export const isServiceOwner = (serviceId, currentUserId, backendData = {}) => {
  // Primary: Check backend data
  if (backendData.provider?._id === currentUserId) return true;
  if (backendData.provider === currentUserId) return true;
  if (backendData.createdBy?._id === currentUserId) return true;
  if (backendData.createdBy === currentUserId) return true;

  // Fallback: Check localStorage
  const storedCreator = getServiceCreator(serviceId);
  return storedCreator === currentUserId;
};
