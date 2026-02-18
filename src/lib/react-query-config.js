import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ Differentiate stale times by data type
        staleTime: (query) => {
          const queryKey = query.queryKey[0];
          
          // Static data (categories, campuses) - 30 minutes
          if (['categories', 'campuses', 'departments'].includes(queryKey)) {
            return 30 * 60 * 1000;
          }
          
          // List data (services, products, roommates) - 1 minute
          if (['services', 'products', 'roommates', 'hostels', 'requests', 'events'].includes(queryKey)) {
            return 1 * 60 * 1000;
          }
          
          // Real-time data (chats, messages) - 15 seconds
          if (['chats', 'messages'].includes(queryKey)) {
            return 15 * 1000;
          }
          
          // Default - 30 seconds
          return 30 * 1000;
        },
        
        // ✅ Keep data in cache while in background
        gcTime: 10 * 60 * 1000, // 10 minutes
        
        // ✅ Retry strategy
        retry: (failureCount, error) => {
          // Don't retry 4xx errors (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          // Retry up to 2 times for 5xx errors
          return failureCount < 2;
        },
        
        // ✅ Exponential backoff for retries
        retryDelay: (attemptIndex) => {
          return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
        },
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}
