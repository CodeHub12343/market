import api from '@/lib/api';

/**
 * Get user's notifications with filtering and pagination
 */
export const getNotifications = async (limit = 20, offset = 0, filters = {}) => {
  try {
    const response = await api.get('/api/v1/notifications', {
      params: {
        limit,
        offset,
        type: filters.type,
        read: filters.read,
        category: filters.category
      }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch notifications:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Get count of unread notifications
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/api/v1/notifications/unread/count');
    return response.data?.data?.count || 0;
  } catch (error) {
    console.warn('Failed to fetch unread count:', error?.response?.data?.message);
    return 0;
  }
};

/**
 * Get all unread notifications
 */
export const getUnreadNotifications = async (limit = 50) => {
  try {
    const response = await api.get('/api/v1/notifications/unread', {
      params: { limit }
    });
    return response.data?.data || [];
  } catch (error) {
    console.warn('Failed to fetch unread notifications:', error?.response?.data?.message);
    return [];
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/api/v1/notifications/${notificationId}/read`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to mark notification as read:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Mark all notifications as read (non-blocking)
 */
export const markAllNotificationsAsRead = async () => {
  try {
    // Non-blocking request
    api.patch('/api/v1/notifications/read-all').catch(error => {
      console.warn('Failed to mark all as read:', error?.response?.data?.message);
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Delete a single notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/api/v1/notifications/${notificationId}`);
    return true;
  } catch (error) {
    console.warn('Failed to delete notification:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Delete all notifications (archive)
 */
export const deleteAllNotifications = async () => {
  try {
    await api.delete('/api/v1/notifications/all');
    return true;
  } catch (error) {
    console.warn('Failed to delete all notifications:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Get user's notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/api/v1/notification-preferences');
    return response.data?.data || {
      eventReminders: true,
      eventUpdates: true,
      comments: true,
      replies: true,
      attendeeJoined: true,
      eventCancelled: true,
      emailNotifications: false,
      pushNotifications: true,
      inAppNotifications: true,
      reminderTime: '1day', // 1day, 6hours, 2hours, 1hour
      frequency: 'instant' // instant, daily, weekly
    };
  } catch (error) {
    console.warn('Failed to fetch preferences:', error?.response?.data?.message);
    return {
      eventReminders: true,
      eventUpdates: true,
      comments: true,
      replies: true,
      attendeeJoined: true,
      eventCancelled: true,
      emailNotifications: false,
      pushNotifications: true,
      inAppNotifications: true,
      reminderTime: '1day',
      frequency: 'instant'
    };
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await api.patch('/api/v1/notification-preferences', preferences);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to update preferences:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Subscribe to real-time notifications (if WebSocket is available)
 */
export const subscribeToNotifications = (callback) => {
  try {
    // WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/api/v1/notifications/subscribe`
    );

    ws.onopen = () => {
      console.log('Connected to notification stream');
    };

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        callback(notification);
      } catch (err) {
        console.warn('Failed to parse notification:', err);
      }
    };

    ws.onerror = (error) => {
      console.warn('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from notification stream');
    };

    return ws;
  } catch (error) {
    console.warn('Failed to subscribe to notifications:', error);
    return null;
  }
};

/**
 * Send event reminder (for testing)
 */
export const sendEventReminder = async (eventId) => {
  try {
    const response = await api.post(`/api/v1/events/${eventId}/send-reminder`);
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to send reminder:', error?.response?.data?.message);
    throw error;
  }
};

/**
 * Send notification to organizer when attendee joins
 */
export const notifyOrganizerOfAttendee = async (eventId, attendeeId) => {
  try {
    const response = await api.post(`/api/v1/events/${eventId}/notify-organizer`, {
      attendeeId
    });
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to notify organizer:', error?.response?.data?.message);
    // Non-blocking, don't throw
    return null;
  }
};

/**
 * Notify event attendees of an update
 */
export const notifyEventUpdate = async (eventId, updateMessage) => {
  try {
    const response = await api.post(`/api/v1/events/${eventId}/notify-update`, {
      message: updateMessage
    });
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to notify of update:', error?.response?.data?.message);
    // Non-blocking, don't throw
    return null;
  }
};

/**
 * Notify event attendees of cancellation
 */
export const notifyEventCancellation = async (eventId, reason) => {
  try {
    const response = await api.post(`/api/v1/events/${eventId}/notify-cancellation`, {
      reason
    });
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to notify of cancellation:', error?.response?.data?.message);
    // Non-blocking, don't throw
    return null;
  }
};

/**
 * Create a comment notification (non-blocking)
 */
export const notifyCommentReply = async (eventId, commentId, mentionedUsers = []) => {
  try {
    // Non-blocking
    api.post(`/api/v1/events/${eventId}/comments/${commentId}/notify-replies`, {
      mentionedUsers
    }).catch(error => {
      console.warn('Failed to send comment notification:', error?.response?.data?.message);
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Test notification (for development)
 */
export const sendTestNotification = async (type = 'event_reminder') => {
  try {
    const response = await api.post('/api/v1/notifications/test', { type });
    return response.data?.data;
  } catch (error) {
    console.warn('Failed to send test notification:', error?.response?.data?.message);
    throw error;
  }
};
