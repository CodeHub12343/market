'use client';

import styled from 'styled-components';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorContainer = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 14px;
    margin: 20px 0;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const ErrorHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    margin-bottom: 14px;
  }
`;

const ErrorIcon = styled.div`
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #7f1d1d;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const ErrorMessage = styled.p`
  font-size: 13px;
  color: #991b1b;
  margin: 0;
  line-height: 1.5;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const ErrorDetails = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  font-size: 12px;
  color: #7f1d1d;
  font-family: monospace;
  overflow-x: auto;

  @media (min-width: 640px) {
    padding: 14px;
    font-size: 13px;
  }
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;

  @media (min-width: 640px) {
    gap: 12px;
    margin-top: 16px;
  }
`;

const ErrorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: 1px solid #fecaca;
  background: white;
  color: #dc2626;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &:hover {
    background: #fef2f2;
    border-color: #fca5a5;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 640px) {
    padding: 11px 16px;
    font-size: 13px;
  }
`;

export default function ErrorAlert({ 
  message, 
  title = 'Something went wrong',
  details = null,
  onRetry = null,
  showDetails = false,
  dismissible = false,
  onDismiss = null
}) {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred. Please try again.';
  };

  const displayMessage = getErrorMessage(message);

  return (
    <ErrorContainer role="alert" aria-live="assertive">
      <ErrorHeader>
        <ErrorIcon>
          <AlertCircle size={20} />
        </ErrorIcon>
        <div style={{ flex: 1 }}>
          <ErrorTitle>{title}</ErrorTitle>
          <ErrorMessage>{displayMessage}</ErrorMessage>
          {showDetails && details && (
            <ErrorDetails>
              {JSON.stringify(details, null, 2)}
            </ErrorDetails>
          )}
        </div>
      </ErrorHeader>

      {(onRetry || dismissible) && (
        <ErrorActions>
          {onRetry && (
            <ErrorButton 
              onClick={onRetry}
              aria-label="Retry failed action"
            >
              <RefreshCw size={16} />
              Retry
            </ErrorButton>
          )}
          {dismissible && onDismiss && (
            <ErrorButton 
              onClick={onDismiss}
              aria-label="Dismiss error message"
            >
              Dismiss
            </ErrorButton>
          )}
        </ErrorActions>
      )}
    </ErrorContainer>
  );
}
