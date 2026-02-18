'use client';

import styled from 'styled-components';

// ===== BACKDROP =====
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

// ===== MODAL CONTAINER =====
const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ===== MODAL HEADER =====
const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const ModalDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

// ===== MODAL CONTENT =====
const ModalContent = styled.div`
  padding: 20px;
`;

// ===== MODAL FOOTER =====
const ModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

// ===== BUTTON STYLES =====
const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      border-color: #999;
    }
  }
`;

const CancelButton = styled(Button)`
  background: #f9fafb;
  color: #1a1a1a;
`;

const ConfirmButton = styled(Button)`
  background: ${props => {
    if (props.$variant === 'danger') return '#ef4444';
    if (props.$variant === 'success') return '#10b981';
    return '#1a1a1a';
  }};
  color: white;
  border-color: ${props => {
    if (props.$variant === 'danger') return '#dc2626';
    if (props.$variant === 'success') return '#059669';
    return '#000';
  }};

  @media (hover: hover) {
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
`;

/**
 * Confirmation Dialog Component
 * 
 * Usage:
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   title="Delete Request?"
 *   description="This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 *   isLoading={isDeleting}
 * />
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  description = 'Are you sure?',
  content = null,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default', // 'default', 'danger', 'success'
  onConfirm,
  onCancel,
  isLoading = false
}) {
  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirm?.();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel?.();
  };

  return (
    <Backdrop onClick={handleCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>

        {content && <ModalContent>{content}</ModalContent>}

        <ModalFooter>
          <CancelButton onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </CancelButton>
          <ConfirmButton
            $variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmText}
          </ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </Backdrop>
  );
}
