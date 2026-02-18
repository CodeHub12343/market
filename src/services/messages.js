import api from './api';

const MESSAGES_ENDPOINT = '/messages';

/**
 * Get messages for a specific chat
 */
export const fetchMessages = async (chatId, page = 1, limit = 50) => {
  try {
    console.log('📤 Fetching messages for chat:', chatId);
    const response = await api.get(`${MESSAGES_ENDPOINT}/chat/${chatId}`, {
      params: { page, limit }
    });
    
    console.log('📥 Messages response:', response.data);
    
    // Backend returns: { status: 'success', data: { messages: [...] } } or { status: 'success', data: [...] }
    const messagesData = response.data?.data?.messages || response.data?.data || [];
    console.log('💾 Extracted messages:', messagesData);
    
    return messagesData;
  } catch (error) {
    console.error('❌ Error fetching messages:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Send message
 */
export const sendMessage = async (chatId, messageData) => {
  try {
    console.log('📤 Sending message:', { chatId, messageData });
    
    let config = {};
    
    if (messageData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    // Ensure chatId is in the payload
    const payload = messageData instanceof FormData ? messageData : {
      chatId,
      ...messageData
    };
    
    console.log('📤 Payload being sent:', payload);
    const response = await api.post(MESSAGES_ENDPOINT, payload, config);
    console.log('📥 Raw response:', response.data);
    
    // Return the full data object { message, chat } from the response
    // The backend returns: { status: 'success', data: { message: {...}, chat: {...} } }
    const responseData = response.data?.data || response.data;
    
    console.log('💾 Extracted response data:', responseData);
    console.log('✅ Message sent successfully');
    return responseData;
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Get single message
 */
export const fetchMessageById = async (messageId) => {
  try {
    const response = await api.get(`${MESSAGES_ENDPOINT}/${messageId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Edit message
 */
export const updateMessage = async (messageId, updates) => {
  try {
    const response = await api.patch(`${MESSAGES_ENDPOINT}/${messageId}`, updates);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete message
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`${MESSAGES_ENDPOINT}/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search messages
 */
export const searchMessages = async (query, filters = {}) => {
  try {
    const response = await api.get(`${MESSAGES_ENDPOINT}/search`, {
      params: { q: query, ...filters }
    });
    return response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add reaction to message
 */
export const addReaction = async (messageId, emoji) => {
  try {
    const response = await api.post(
      `${MESSAGES_ENDPOINT}/${messageId}/reactions`,
      { emoji }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove reaction from message
 */
export const removeReaction = async (messageId, emoji) => {
  try {
    const response = await api.delete(
      `${MESSAGES_ENDPOINT}/${messageId}/reactions`,
      { data: { emoji } }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get reaction statistics
 */
export const getReactionStats = async (messageId) => {
  try {
    const response = await api.get(
      `${MESSAGES_ENDPOINT}/${messageId}/reactions/stats`
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload file for message
 */
export const uploadMessageFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`${MESSAGES_ENDPOINT}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  fetchMessages,
  sendMessage,
  fetchMessageById,
  updateMessage,
  deleteMessage,
  searchMessages,
  addReaction,
  removeReaction,
  getReactionStats,
  uploadMessageFile
};
