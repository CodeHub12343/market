import api from './api';

const EVENTS_ENDPOINT = '/events';

/**
 * Fetch all events with pagination and filters
 */
export const fetchEventsPaginated = async (page = 1, limit = 12, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await api.get(`${EVENTS_ENDPOINT}?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch single event by ID
 */
export const fetchEventById = async (id) => {
  try {
    const response = await api.get(`${EVENTS_ENDPOINT}/${id}`);
    return response.data.data || response.data.event || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch user's created events
 */
export const fetchMyEvents = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`${EVENTS_ENDPOINT}/my-events?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create new event
 * Supports both JSON and form-data (for image upload)
 */
export const createEvent = async (eventData, bannerImage = null) => {
  try {
    let config = {};

    if (bannerImage) {
      // Use form-data for file upload
      const formData = new FormData();
      
      // Add all event data fields, skipping undefined/null values
      Object.keys(eventData).forEach(key => {
        const value = eventData[key];
        
        // Skip undefined and null values
        if (value === undefined || value === null) {
          return;
        }
        
        // Convert objects/arrays to JSON strings for form-data
        if (typeof value === 'object' && value !== null) {
          // For nested objects like contactInfo, filter out empty values
          if (key === 'contactInfo' || key === 'settings') {
            const filtered = Object.fromEntries(
              Object.entries(value).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            );
            if (Object.keys(filtered).length > 0) {
              formData.append(key, JSON.stringify(filtered));
            }
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, value);
        }
      });

      // Add the image file
      if (bannerImage instanceof File) {
        formData.append('banner', bannerImage);
      }

      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await api.post(EVENTS_ENDPOINT, formData, config);
      return response.data.data;
    } else {
      // Use JSON for non-image creation
      const response = await api.post(EVENTS_ENDPOINT, eventData);
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update event
 * Supports both JSON and form-data (for image upload)
 */
export const updateEvent = async (id, eventData, bannerImage = null) => {
  try {
    let config = {};

    if (bannerImage) {
      // Use form-data for file upload
      const formData = new FormData();
      
      // Add all event data fields, skipping undefined/null values
      Object.keys(eventData).forEach(key => {
        const value = eventData[key];
        
        // Skip undefined and null values
        if (value === undefined || value === null) {
          return;
        }
        
        // Convert objects/arrays to JSON strings for form-data
        if (typeof value === 'object' && value !== null) {
          // For nested objects like contactInfo, filter out empty values
          if (key === 'contactInfo' || key === 'settings') {
            const filtered = Object.fromEntries(
              Object.entries(value).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            );
            if (Object.keys(filtered).length > 0) {
              formData.append(key, JSON.stringify(filtered));
            }
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          formData.append(key, value);
        }
      });

      // Add the image file
      if (bannerImage instanceof File) {
        formData.append('banner', bannerImage);
      }

      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await api.patch(`${EVENTS_ENDPOINT}/${id}`, formData, config);
      return response.data.data;
    } else {
      // Use JSON for non-image update
      const response = await api.patch(`${EVENTS_ENDPOINT}/${id}`, eventData);
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`${EVENTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Join event as attendee
 */
export const joinEvent = async (id) => {
  try {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/join`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Leave event
 */
export const leaveEvent = async (id) => {
  try {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/leave`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Toggle favorite event
 */
export const toggleFavoriteEvent = async (id) => {
  try {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/favorite`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add rating to event
 */
export const addEventRating = async (id, rating, comment = '') => {
  try {
    const response = await api.post(`${EVENTS_ENDPOINT}/${id}/rating`, {
      rating,
      comment
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add comment to event
 */
export const addEventComment = async (eventId, comment) => {
  try {
    // Debugging: log inputs to catch undefined IDs or empty comments
    if (typeof window !== 'undefined') {
      // Browser log
      console.debug('[events.service] addEventComment called with', { eventId, comment });
    } else {
      // Server-side log
      console.log('[events.service] addEventComment called with', { eventId, comment });
    }

    if (!eventId) {
      throw new Error('addEventComment: eventId is required');
    }

    const response = await api.post(`${EVENTS_ENDPOINT}/${eventId}/comments`, {
      comment
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get event comments
 */
export const getEventComments = async (id, page = 1, limit = 10) => {
  try {
    const response = await api.get(`${EVENTS_ENDPOINT}/${id}/comments?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search events
 */
export const searchEvents = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    });
    const response = await api.get(`${EVENTS_ENDPOINT}?${queryParams}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get popular events
 */
export const getPopularEvents = async (limit = 6) => {
  try {
    const response = await api.get(`${EVENTS_ENDPOINT}/popular?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get trending events
 */
export const getTrendingEvents = async (limit = 6) => {
  try {
    const response = await api.get(`${EVENTS_ENDPOINT}/trending?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
