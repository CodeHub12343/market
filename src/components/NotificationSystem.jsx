'use client';

import styled from 'styled-components';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastContainer } from '@/components/common/Toast';
import { useNotification } from '@/context/NotificationContext';

// ===== NOTIFICATION SYSTEM WRAPPER =====
const NotificationWrapper = styled.div`
  position: fixed;
  z-index: 999;
  pointer-events: none;
`

// ===== INNER COMPONENT WITH CONTEXT =====
function NotificationSystemInner({ children }) {
  const { toasts, removeNotification } = useNotification();

  return (
    <>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeNotification}
      />
    </>
  );
}

// ===== OUTER WRAPPER WITH PROVIDER =====
export function NotificationSystem({ children }) {
  return (
    <NotificationProvider>
      <NotificationSystemInner>
        {children}
      </NotificationSystemInner>
    </NotificationProvider>
  );
}

export default NotificationSystem;
