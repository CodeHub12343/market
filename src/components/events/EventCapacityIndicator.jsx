'use client';

import React from 'react';
import styled from 'styled-components';
import { AlertCircle, CheckCircle } from 'lucide-react';

const CapacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const CapacityLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CapacityLabelText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const CapacityCount = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #4f46e5;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => {
    if (props.percentage >= 100) return '#dc2626';
    if (props.percentage >= 80) return '#f59e0b';
    return '#10b981';
  }};
  border-radius: 4px;
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const CapacityStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${props => {
    if (props.status === 'full') return '#fee2e2';
    if (props.status === 'warning') return '#fef3c7';
    return '#dcfce7';
  }};
  border-radius: 6px;
  border: 1px solid ${props => {
    if (props.status === 'full') return '#fecaca';
    if (props.status === 'warning') return '#fde68a';
    return '#bbf7d0';
  }};
  font-size: 13px;
  color: ${props => {
    if (props.status === 'full') return '#991b1b';
    if (props.status === 'warning') return '#92400e';
    return '#065f46';
  }};

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 14px;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const EventCapacityIndicator = ({ currentAttendees = 0, capacity = null }) => {
  if (!capacity) {
    return null;
  }

  const percentage = (currentAttendees / capacity) * 100;
  const spotsLeft = Math.max(0, capacity - currentAttendees);
  
  let status = 'available';
  let statusMessage = `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} available`;

  if (currentAttendees >= capacity) {
    status = 'full';
    statusMessage = 'Event is full';
  } else if (percentage >= 80) {
    status = 'warning';
    statusMessage = `Almost full - ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`;
  }

  return (
    <CapacityContainer>
      <CapacityLabel>
        <CapacityLabelText>Capacity</CapacityLabelText>
        <CapacityCount>
          {currentAttendees} / {capacity}
        </CapacityCount>
      </CapacityLabel>

      <ProgressBarContainer>
        <ProgressBar percentage={Math.min(percentage, 100)} />
      </ProgressBarContainer>

      <CapacityStatus status={status}>
        {status === 'available' && <CheckCircle />}
        {status !== 'available' && <AlertCircle />}
        <span>{statusMessage}</span>
      </CapacityStatus>
    </CapacityContainer>
  );
};

export default EventCapacityIndicator;
