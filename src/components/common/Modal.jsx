'use client';

import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const ModalBody = styled.div`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #666;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${(props) => (props.isDangerous ? '#d32f2f' : '#667eea')};
  color: white;

  &:hover:not(:disabled) {
    ${(props) =>
      props.isDangerous
        ? 'background: #b71c1c;'
        : 'background: #5568d3; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);'}
  }
`;

export default function Modal({
  isOpen = true,
  title = 'Confirm',
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  hideCancel = false,
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {!hideCancel && (
            <CancelButton onClick={onCancel} disabled={isLoading}>
              {cancelText}
            </CancelButton>
          )}
          <ConfirmButton
            onClick={onConfirm}
            isDangerous={isDangerous}
            disabled={isLoading}
          >
            {isLoading ? '⏳ ' : ''}
            {confirmText}
          </ConfirmButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
