"use client";

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/react-query-config';
import { initializeSocket, disconnectSocket } from '@/lib/socket';

// Create optimized QueryClient instance
const queryClient = createQueryClient();

export default function Providers({ children }) {
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      initializeSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
