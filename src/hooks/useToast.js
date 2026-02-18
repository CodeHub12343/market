import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

/**
 * Custom hook to use toast notifications
 * Usage:
 *   const toast = useToast();
 *   toast.success('Success message');
 *   toast.error('Error message');
 *   toast.warning('Warning message');
 *   toast.info('Info message');
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

export default useToast;
