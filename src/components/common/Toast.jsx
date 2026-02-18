'use client';

import styled from 'styled-components';
import { useEffect } from 'react';

const ToastContainerStyled = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;

  @media (max-width: 480px) {
    left: 12px;
    right: 12px;
    top: 12px;
  }
`;

const ToastItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
  min-width: 300px;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  ${props => props.$isClosing && `
    animation: slideOut 0.3s ease-out forwards;
  `}

  background: ${props => {
    switch (props.$type) {
      case 'success':
        return '#d4edda';
      case 'error':
        return '#f8d7da';
      case 'warning':
        return '#fff3cd';
      case 'info':
      default:
        return '#d1ecf1';
    }
  }};

  color: ${props => {
    switch (props.$type) {
      case 'success':
        return '#155724';
      case 'error':
        return '#721c24';
      case 'warning':
        return '#856404';
      case 'info':
      default:
        return '#0c5460';
    }
  }};

  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
      default:
        return '#17a2b8';
    }
  }};
`;

const Icon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

function ToastComponent({ id, type = 'info', title, message, duration = 4000, onClose }) {
  const icons = {
    success: '',
    error: '',
    warning: '',
    info: ''
  };

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <ToastItem $type={type}>
      <Icon>{icons[type]}</Icon>
      <Content>
        {title && <Title>{title}</Title>}
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={() => onClose(id)}>✕</CloseButton>
    </ToastItem>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <ToastContainerStyled>
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </ToastContainerStyled>
  );
}

export default ToastComponent;
