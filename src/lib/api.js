import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  getChats: (params) => api.get('/chats', { params }),
  getChat: (chatId) => api.get(`/chats/${chatId}`),
  createOneToOneChat: (userId) => api.post('/chats/one-to-one', { userId }),
  createGroupChat: (data) => api.post('/chats/group', data),
  searchUsers: (query) => api.get('/chats/search/users', { params: { q: query } }),
  markAsRead: (conversationId) => api.patch(`/chats/${conversationId}/read`),
};

// Message API
export const messageAPI = {
  getMessages: (conversationId, params) =>
    api.get(`/chats/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, data) => {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.text) formData.append('text', data.text);
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    return api.post(`/chats/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateMessage: (conversationId, messageId, data) =>
    api.patch(`/chats/${conversationId}/messages/${messageId}`, data),
  deleteMessage: (conversationId, messageId) =>
    api.delete(`/chats/${conversationId}/messages/${messageId}`),
  addReaction: (messageId, emoji) =>
    api.post(`/messages/${messageId}/reactions`, { emoji }),
  removeReaction: (messageId, emoji) =>
    api.delete(`/messages/${messageId}/reactions`, { data: { emoji } }),
};

export default api;
