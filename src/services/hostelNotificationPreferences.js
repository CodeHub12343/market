import api from '@/lib/api';

// Follow a hostel
export const followHostel = async (hostelId) => {
  try {
    const response = await api.post(`/api/v1/hostels/${hostelId}/follow`);
    return response.data?.data || { success: true };
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Unfollow a hostel
export const unfollowHostel = async (hostelId) => {
  try {
    const response = await api.delete(`/api/v1/hostels/${hostelId}/follow`);
    return response.data?.data || { success: true };
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Check if user follows a hostel
export const isFollowingHostel = async (hostelId) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/is-following`);
    return response.data?.data?.isFollowing || false;
  } catch (error) {
    console.warn('Failed to check follow status:', error?.response?.data?.message || error.message);
    return false;
  }
};

// Get user's following list
export const getFollowingHostels = async (page = 1, limit = 20) => {
  try {
    const response = await api.get('/api/v1/user/following-hostels', {
      params: { page, limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch following hostels:', error?.response?.data?.message || error.message);
    return [];
  }
};

// Get notification preferences for a hostel
export const getNotificationPreferences = async (hostelId) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/notification-preferences`);
    return response.data?.data || {
      priceUpdates: true,
      availabilityChanges: true,
      newReviews: true,
      roomAvailability: true,
      hostelUpdates: true,
      email: true,
      push: true,
      sms: false
    };
  } catch (error) {
    console.warn('Failed to fetch notification preferences:', error?.response?.data?.message || error.message);
    // Return default preferences
    return {
      priceUpdates: true,
      availabilityChanges: true,
      newReviews: true,
      roomAvailability: true,
      hostelUpdates: true,
      email: true,
      push: true,
      sms: false
    };
  }
};

// Update notification preferences for a hostel
export const updateNotificationPreferences = async (hostelId, preferences) => {
  try {
    const response = await api.put(
      `/api/v1/hostels/${hostelId}/notification-preferences`,
      preferences
    );
    return response.data?.data || preferences;
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Get all user notification preferences
export const getAllNotificationPreferences = async () => {
  try {
    const response = await api.get('/api/v1/user/notification-preferences');
    return response.data?.data || {};
  } catch (error) {
    console.warn('Failed to fetch all notification preferences:', error?.response?.data?.message || error.message);
    return {};
  }
};

// Update global notification settings
export const updateGlobalNotificationSettings = async (settings) => {
  try {
    const response = await api.put(
      '/api/v1/user/notification-settings',
      settings
    );
    return response.data?.data || settings;
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Get hostel followers count
export const getFollowersCount = async (hostelId) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/followers-count`);
    return response.data?.data?.count || 0;
  } catch (error) {
    console.warn('Failed to fetch followers count:', error?.response?.data?.message || error.message);
    return 0;
  }
};

// Get hostel following stats
export const getFollowingStats = async (hostelId) => {
  try {
    const response = await api.get(`/api/v1/hostels/${hostelId}/following-stats`);
    return response.data?.data || {
      followers: 0,
      totalNotifications: 0,
      unreadNotifications: 0
    };
  } catch (error) {
    console.warn('Failed to fetch following stats:', error?.response?.data?.message || error.message);
    return {
      followers: 0,
      totalNotifications: 0,
      unreadNotifications: 0
    };
  }
};

// Mark all notifications as read for a hostel
export const markNotificationsAsRead = async (hostelId) => {
  try {
    const response = await api.post(
      `/api/v1/hostels/${hostelId}/mark-notifications-read`
    );
    return response.data?.data || { success: true };
  } catch (error) {
    console.warn('Failed to mark notifications as read:', error?.response?.data?.message || error.message);
    return { success: false };
  }
};

// Mute hostel notifications temporarily (1 hour, 1 day, 1 week)
export const muteHostelNotifications = async (hostelId, duration = '1h') => {
  try {
    const response = await api.post(
      `/api/v1/hostels/${hostelId}/mute-notifications`,
      { duration }
    );
    return response.data?.data || { success: true };
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Unmute hostel notifications
export const unmuteHostelNotifications = async (hostelId) => {
  try {
    const response = await api.post(
      `/api/v1/hostels/${hostelId}/unmute-notifications`
    );
    return response.data?.data || { success: true };
  } catch (error) {
    throw error?.response?.data?.message || error.message;
  }
};

// Get notification history for a hostel
export const getNotificationHistory = async (hostelId, limit = 10) => {
  try {
    const response = await api.get(
      `/api/v1/hostels/${hostelId}/notifications`,
      { params: { limit } }
    );
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch notification history:', error?.response?.data?.message || error.message);
    return [];
  }
};
