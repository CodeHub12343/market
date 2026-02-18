import { useState } from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  ${(props) => props.$show === false && 'display: none;'}
`;

const Icon = styled.span`
  font-size: 20px;
  color: #dc2626;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-weight: 600;
  color: #7f1d1d;
  margin: 0;
`;

const Message = styled.p`
  color: #b91c1c;
  font-size: 14px;
  margin: 4px 0 0 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;

  &:hover {
    color: #991b1b;
  }
`;

export default function ErrorAlert({ message, onClose }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <AlertContainer $show={show}>
      <Icon>⚠️</Icon>
      <Content>
        <Title>Error</Title>
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={handleClose}>✕</CloseButton>
    </AlertContainer>
  );
}