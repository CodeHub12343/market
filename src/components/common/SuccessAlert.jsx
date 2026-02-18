import { useState, useEffect } from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  ${(props) => props.$show === false && 'display: none;'}
`;

const Icon = styled.span`
  font-size: 20px;
  color: #16a34a;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-weight: 600;
  color: #15803d;
  margin: 0;
`;

const Message = styled.p`
  color: #166534;
  font-size: 14px;
  margin: 4px 0 0 0;
`;

export default function SuccessAlert({ message, onClose, duration = 3000 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AlertContainer $show={show}>
      <Icon>✓</Icon>
      <Content>
        <Title>Success</Title>
        <Message>{message}</Message>
      </Content>
    </AlertContainer>
  );
}