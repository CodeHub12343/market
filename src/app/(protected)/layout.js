'use client';

import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout({ children }) {
  const { isProtected } = useProtectedRoute();
  const { isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect if not authenticated (handled by useProtectedRoute useEffect)
  if (!isProtected) {
    return null;
  }

  return <>{children}</>;
}