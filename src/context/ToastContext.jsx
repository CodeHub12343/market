'use client';

import { createContext, useState, useCallback, useContext } from 'react';
import { ToastContainer } from '@/components/common/Toast';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', title) => {
    return addToast({ type, message, title });
  }, [addToast]);

  const success = useCallback((message, title = 'Success') => {
    return addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    return addToast({ type: 'error', message, title });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    return addToast({ type: 'warning', message, title });
  }, [addToast]);

  const info = useCallback((message, title = 'Info') => {
    return addToast({ type: 'info', message, title });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    show,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use Toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
