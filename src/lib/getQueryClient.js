import { QueryClient } from '@tanstack/react-query';

// ✅ Create a new QueryClient instance for SSR
// This prevents sharing of client state between requests
let clientQueryClientInstance;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Default stale times by data type
        staleTime: (query) => {
          const queryKey = query.queryKey[0];
          
          // Static data (categories, campuses, departments)
          if (['categories', 'campuses', 'departments', 'faculties'].includes(queryKey)) {
            return 30 * 60 * 1000; // 30 minutes
          }
          
          // List data (products, services, hostels)
          if (['services', 'products', 'hostels', 'roommates', 'requests', 'events'].includes(queryKey)) {
            return 1 * 60 * 1000; // 1 minute
          }
          
          // Real-time data (chats, messages, notifications)
          if (['chats', 'messages', 'notifications'].includes(queryKey)) {
            return 15 * 1000; // 15 seconds
          }
          
          return 30 * 1000; // 30 seconds default
        },
        
        // ✅ Keep data in cache for 10 minutes (gcTime)
        gcTime: 10 * 60 * 1000,
        
        // ✅ Smart retry strategy
        retry: (failureCount, error) => {
          // Don't retry 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          
          // Retry 5xx errors up to 2 times
          return failureCount < 2;
        },
        
        // ✅ Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // ✅ Retry mutations with exponential backoff
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}

// ✅ Get or create QueryClient
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: Create a new instance for each request
    return makeQueryClient();
  }
  
  // Client: Reuse the same instance
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = makeQueryClient();
  }
  
  return clientQueryClientInstance;
}

export default getQueryClient;
