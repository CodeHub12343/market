import axios from 'axios';
import { getCookie, deleteCookie } from '@/lib/cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'); // 30 seconds default instead of 10

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:');
  console.log('   API_URL:', API_URL);
  console.log('   API_TIMEOUT:', API_TIMEOUT + 'ms');
}

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Must match backend CORS config (credentials: true)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = 
      typeof window !== 'undefined' 
        ? getCookie('jwt') || localStorage.getItem('token')
        : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log token for debugging
      if (config.url?.includes('auth/me')) {
        console.log('📤 Sending /auth/me request with token:', token.substring(0, 20) + '...');
      }
    }

    // ✅ CRITICAL: If data is FormData, delete the default Content-Type
    // This forces axios to let the browser set it with the proper boundary
    if (config.data instanceof FormData) {
      if (config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    }

    // Add request start time for performance tracking
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (token expired)
api.interceptors.response.use(
  (response) => {
    // Log response time for slow requests
    if (response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      if (duration > 3000) { // Log if request took more than 3 seconds
        console.warn(`⏱️ SLOW REQUEST: ${response.config.url} took ${duration}ms`);
      }
    }
    return response;
  },
  (error) => {
    // Log error response time
    if (error.config?.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      console.error(`❌ REQUEST FAILED after ${duration}ms: ${error.config.url} - ${error.message}`);
    }
    
    // Detailed error logging for debugging
    console.error('📡 API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        deleteCookie('jwt');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;