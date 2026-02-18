'use client';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const OccupancyButton = styled.button`
  padding: 10px 12px;
  background: ${props => props.selected ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.selected ? '#ffffff' : '#1a1a1a'};
  border: ${props => props.selected ? '1px solid #1a1a1a' : '1px solid #e5e5eb'};
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .occupancy-icon {
    font-size: 16px;
  }

  .occupancy-label {
    font-size: 10px;
  }

  &:hover {
    border-color: #1a1a1a;
    ${props => !props.selected && 'background: #f9f9f9;'}
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 13px;

    .occupancy-icon {
      font-size: 18px;
    }

    .occupancy-label {
      font-size: 11px;
    }
  }
`;

const OCCUPANCY_OPTIONS = [
  { id: 'single', label: 'Single', icon: '1️⃣', occupancy: 1 },
  { id: 'double', label: 'Double', icon: '2️⃣', occupancy: 2 },
  { id: 'quad', label: 'Quad', icon: '4️⃣', occupancy: 4 }
];

export default function RoomOccupancyFilter({
  selectedOccupancy = [],
  onOccupancyChange,
  label = 'Occupancy'
}) {
  const handleToggle = (occupancyId) => {
    let updated;
    if (selectedOccupancy.includes(occupancyId)) {
      updated = selectedOccupancy.filter(id => id !== occupancyId);
    } else {
      updated = [...selectedOccupancy, occupancyId];
    }
    onOccupancyChange(updated);
  };

  return (
    <Container>
      <Label>{label}</Label>
      <ButtonGroup>
        {OCCUPANCY_OPTIONS.map(option => (
          <OccupancyButton
            key={option.id}
            selected={selectedOccupancy.includes(option.id)}
            onClick={() => handleToggle(option.id)}
            title={`${option.occupancy} person${option.occupancy > 1 ? 's' : ''}`}
          >
            <div className="occupancy-icon">{option.icon}</div>
            <div className="occupancy-label">{option.label}</div>
          </OccupancyButton>
        ))}
      </ButtonGroup>
    </Container>
  );
}
