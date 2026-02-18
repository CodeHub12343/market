import api from './api';

const CHAT_ENDPOINT = '/chats';

/**
 * Get all chats for current user
 */
export const fetchMyChats = async (filters = {}) => {
  try {
    const params = new URLSearchParams({
      ...filters
    });
    const response = await api.get(`${CHAT_ENDPOINT}?${params}`);
    console.log('📥 Chats response:', response.data);
    
    // Backend returns: { status: 'success', results: 1, data: { chats: [...] } }
    const chatsData = response.data?.data?.chats || response.data?.data || response.data || [];
    console.log('💾 Extracted chats:', chatsData);
    return chatsData;
  } catch (error) {
    console.error('❌ Error fetching chats:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Get single chat details
 */
export const fetchChatById = async (chatId) => {
  try {
    const response = await api.get(`${CHAT_ENDPOINT}/${chatId}`);
    console.log('📥 fetchChatById full response:', JSON.stringify(response.data, null, 2));
    
    // Response structure: { status: 'success', data: { chat, messages } }
    let chatData = response.data?.data?.chat;
    
    if (!chatData) {
      console.warn('⚠️ No chat found at response.data.data.chat, checking alternatives...');
      chatData = response.data?.data || response.data;
      console.log('Using fallback:', chatData);
    }
    
    console.log('💾 Final extracted chatData has members?', !!chatData?.members);
    console.log('💾 Final extracted chatData:', chatData);
    return chatData;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create or get 1:1 chat
 */
export const getOrCreateOneToOneChat = async (userId) => {
  try {
    console.log('📤 Creating 1:1 chat with userId:', userId);
    const response = await api.post(`${CHAT_ENDPOINT}/one-to-one`, {
      userId
    });
    
    console.log('📥 Raw response data:', response.data);
    console.log('📥 Raw response data.data:', response.data?.data);
    console.log('📥 Raw response data.data.chat:', response.data?.data?.chat);
    
    // Correct extraction: response.data = { status: 'success', data: { chat: {...} } }
    const chatData = response.data?.data?.chat;
    
    console.log('💾 Extracted chatData:', chatData);
    
    if (!chatData) {
      console.error('❌ No chat found in response.data.data.chat');
      console.error('Full response:', JSON.stringify(response.data, null, 2));
      throw new Error('Failed to create chat - response structure incorrect');
    }
    
    if (!chatData._id) {
      console.error('❌ Chat has no _id:', chatData);
      throw new Error('Failed to create chat - chat has no _id');
    }
    
    console.log('✅ Chat created with ID:', chatData._id);
    return chatData;
  } catch (error) {
    console.error('❌ Error creating chat:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create group chat
 */
export const createGroupChat = async (chatData) => {
  try {
    const response = await api.post(`${CHAT_ENDPOINT}/group`, chatData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update chat
 */
export const updateChat = async (chatId, updates) => {
  try {
    const response = await api.patch(`${CHAT_ENDPOINT}/${chatId}`, updates);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete/archive chat
 */
export const deleteChat = async (chatId) => {
  try {
    const response = await api.delete(`${CHAT_ENDPOINT}/${chatId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search users to start chat
 */
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`${CHAT_ENDPOINT}/search/users?q=${query}`);
    return response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search chats
 */
export const searchChats = async (query, filters = {}) => {
  try {
    const response = await api.get(`${CHAT_ENDPOINT}/search`, {
      params: { q: query, ...filters }
    });
    return response.data.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  fetchMyChats,
  fetchChatById,
  getOrCreateOneToOneChat,
  createGroupChat,
  updateChat,
  deleteChat,
  searchUsers,
  searchChats
};
