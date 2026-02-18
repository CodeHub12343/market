'use client';

import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Container = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #e5e5eb;
  border-radius: 12px;
  font-size: 13px;
  color: #1a1a1a;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: space-between;

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    transition: transform 0.2s ease;
    ${props => props.isOpen && 'transform: rotate(180deg);'}
  }

  &:hover {
    border-color: #1a1a1a;
    background: #f9f9f9;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 14px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 220px;
  max-height: 400px;
  overflow-y: auto;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    min-width: 250px;
  }
`;

const OptionGroup = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const GroupLabel = styled.div`
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9f9f9;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1a1a1a;
  }

  span {
    flex: 1;
    font-size: 13px;
    color: #1a1a1a;

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
  }
`;

const SelectAllOption = styled(Option)`
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;
  font-weight: 600;

  span {
    font-weight: 600;
  }
`;

const NoOptions = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const SelectionBadge = styled.span`
  background: #f0f9ff;
  color: #0369a1;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
`;

const ROOM_TYPES = [
  {
    category: 'Standard',
    options: [
      { id: 'single', label: 'Single Room', icon: '🛏️' },
      { id: 'double', label: 'Double Room', icon: '🛏️🛏️' },
      { id: 'triple', label: 'Triple Room', icon: '🛏️🛏️🛏️' }
    ]
  },
  {
    category: 'Large',
    options: [
      { id: 'quad', label: 'Quad Room (4 Beds)', icon: '👥' },
      { id: 'dormitory', label: 'Dormitory', icon: '🏢' },
      { id: 'suite', label: 'Suite', icon: '⭐' }
    ]
  }
];

export default function RoomTypeSelector({
  selectedRoomTypes = [],
  onRoomTypesChange,
  label = 'Room Type'
}) {
  const [isOpen, setIsOpen] = useState(false);

  const allOptions = ROOM_TYPES.flatMap(group => group.options);
  const selectedCount = selectedRoomTypes.length;
  const allSelected = selectedCount === allOptions.length;

  const handleToggle = (roomTypeId) => {
    let updated;
    if (selectedRoomTypes.includes(roomTypeId)) {
      updated = selectedRoomTypes.filter(id => id !== roomTypeId);
    } else {
      updated = [...selectedRoomTypes, roomTypeId];
    }
    onRoomTypesChange(updated);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onRoomTypesChange([]);
    } else {
      onRoomTypesChange(allOptions.map(opt => opt.id));
    }
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <Container>
      <DropdownTrigger
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
      >
        <span>{label}</span>
        {selectedCount > 0 && <SelectionBadge>{selectedCount}</SelectionBadge>}
        <ChevronDown />
      </DropdownTrigger>

      {isOpen && (
        <>
          <Overlay onClick={handleClickOutside} />
          <DropdownMenu>
            <SelectAllOption>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </SelectAllOption>

            {ROOM_TYPES.map((group) => (
              <OptionGroup key={group.category}>
                <GroupLabel>{group.category}</GroupLabel>
                {group.options.map(option => (
                  <Option key={option.id}>
                    <input
                      type="checkbox"
                      checked={selectedRoomTypes.includes(option.id)}
                      onChange={() => handleToggle(option.id)}
                    />
                    <span>{option.label}</span>
                  </Option>
                ))}
              </OptionGroup>
            ))}
          </DropdownMenu>
        </>
      )}
    </Container>
  );
}
