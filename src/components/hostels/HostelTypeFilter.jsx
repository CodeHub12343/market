'use client';

import styled from 'styled-components';
import { Users, Heart, Home, Baby } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const TypeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px;
  font-size: 12px;
  color: #1a1a1a;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: fit-content;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: #1a1a1a;
    background: #f9f9f9;
  }

  &:active {
    transform: scale(0.95);
  }

  ${props => {
    if (props.selected) {
      return `
        background: #1a1a1a;
        color: #ffffff;
        border-color: #1a1a1a;

        svg {
          color: #ffffff;
        }
      `;
    }
  }}

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const HOSTEL_TYPES = [
  {
    id: 'boys',
    label: 'Boys Only',
    icon: Users,
    description: 'Exclusively for male students'
  },
  {
    id: 'girls',
    label: 'Girls Only',
    icon: Heart,
    description: 'Exclusively for female students'
  },
  {
    id: 'mixed',
    label: 'Mixed',
    icon: Home,
    description: 'For all genders'
  },
  {
    id: 'family',
    label: 'Family',
    icon: Baby,
    description: 'For families and couples'
  }
];

export default function HostelTypeFilter({
  selectedTypes = [],
  onTypesChange = () => {},
  label = 'Hostel Type'
}) {
  const handleTypeToggle = (typeId) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId];
    onTypesChange(newTypes);
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === HOSTEL_TYPES.length) {
      onTypesChange([]);
    } else {
      onTypesChange(HOSTEL_TYPES.map(t => t.id));
    }
  };

  return (
    <Container>
      <Label>{label}</Label>
      <ButtonGroup>
        {HOSTEL_TYPES.map(type => {
          const Icon = type.icon;
          const isSelected = selectedTypes.includes(type.id);

          return (
            <TypeButton
              key={type.id}
              selected={isSelected}
              onClick={() => handleTypeToggle(type.id)}
              title={type.description}
              aria-pressed={isSelected}
            >
              <Icon />
              <span>{type.label}</span>
            </TypeButton>
          );
        })}
      </ButtonGroup>
    </Container>
  );
}
