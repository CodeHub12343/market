import api from '@/lib/api';

/**
 * Upload event images
 */
export const uploadEventImages = async (eventId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });
    
    const response = await api.post(`/events/${eventId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading event images:', error);
    throw error;
  }
};

/**
 * Get event images
 */
export const getEventImages = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/images`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching event images:', error);
    return [];
  }
};

/**
 * Delete event image
 */
export const deleteEventImage = async (eventId, imageId) => {
  try {
    const response = await api.delete(`/events/${eventId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Add video to event
 */
export const addEventVideo = async (eventId, videoData) => {
  try {
    const response = await api.post(`/events/${eventId}/videos`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
};

/**
 * Get event videos
 */
export const getEventVideos = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/videos`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching event videos:', error);
    return [];
  }
};

/**
 * Delete event video
 */
export const deleteEventVideo = async (eventId, videoId) => {
  try {
    const response = await api.delete(`/events/${eventId}/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

/**
 * Upload attendee photos
 */
export const uploadAttendeePhotos = async (eventId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });
    
    const response = await api.post(`/events/${eventId}/attendee-photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading attendee photos:', error);
    throw error;
  }
};

/**
 * Get attendee photos
 */
export const getAttendeePhotos = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/attendee-photos`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching attendee photos:', error);
    return [];
  }
};

/**
 * Delete attendee photo
 */
export const deleteAttendeePhoto = async (eventId, photoId) => {
  try {
    const response = await api.delete(`/events/${eventId}/attendee-photos/${photoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting attendee photo:', error);
    throw error;
  }
};

/**
 * Like attendee photo
 */
export const likeAttendeePhoto = async (eventId, photoId) => {
  try {
    const response = await api.post(`/events/${eventId}/attendee-photos/${photoId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking photo:', error);
    throw error;
  }
};

/**
 * Get event highlights
 */
export const getEventHighlights = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/highlights`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event highlights:', error);
    return null;
  }
};

/**
 * Create event highlights
 */
export const createEventHighlights = async (eventId, highlightsData) => {
  try {
    const response = await api.post(`/events/${eventId}/highlights`, highlightsData);
    return response.data;
  } catch (error) {
    console.error('Error creating highlights:', error);
    throw error;
  }
};

/**
 * Update event highlights
 */
export const updateEventHighlights = async (eventId, highlightsData) => {
  try {
    const response = await api.put(`/events/${eventId}/highlights`, highlightsData);
    return response.data;
  } catch (error) {
    console.error('Error updating highlights:', error);
    throw error;
  }
};

/**
 * Delete event highlights
 */
export const deleteEventHighlights = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/highlights`);
    return response.data;
  } catch (error) {
    console.error('Error deleting highlights:', error);
    throw error;
  }
};

/**
 * Get event media stats
 */
export const getEventMediaStats = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/media-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching media stats:', error);
    return { images: 0, videos: 0, attendeePhotos: 0 };
  }
};
