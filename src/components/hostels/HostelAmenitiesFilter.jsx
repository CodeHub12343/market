'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useHostelAmenities } from '@/hooks/useHostelSearch';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Trigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
    transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const TriggerText = styled.span`
  flex: 1;
  text-align: left;
  font-weight: ${props => props.$hasSelection ? '600' : '500'};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  background: #1a1a1a;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.$open ? 'block' : 'none'};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9f9f9;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1a1a1a;
    margin: 0;
  }

  span {
    flex: 1;
    font-size: 14px;
    color: #1a1a1a;
    user-select: none;
  }
`;

const SelectAllOption = styled(Option)`
  font-weight: 700;
  background: #fafafa;
  border-bottom: 1px solid #e5e5e5;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid #e5e5e5;
  font-size: 13px;
  color: #1a1a1a;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    background: #fafafa;
  }
`;

export default function HostelAmenitiesFilter({
  selectedAmenities = [],
  onAmenitiesChange,
  label = 'Amenities'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  const { data: allAmenities = [] } = useHostelAmenities();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter amenities based on search
  const filteredAmenities = allAmenities.filter(amenity =>
    amenity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAmenityChange = (amenity, checked) => {
    if (checked) {
      onAmenitiesChange([...selectedAmenities, amenity]);
    } else {
      onAmenitiesChange(selectedAmenities.filter(a => a !== amenity));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onAmenitiesChange(allAmenities);
    } else {
      onAmenitiesChange([]);
    }
  };

  const isAllSelected = selectedAmenities.length === allAmenities.length && allAmenities.length > 0;

  return (
    <Container ref={containerRef}>
      <Trigger
        $open={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <TriggerText $hasSelection={selectedAmenities.length > 0}>
          {selectedAmenities.length > 0
            ? `${label} (${selectedAmenities.length})`
            : label}
        </TriggerText>
        {selectedAmenities.length > 0 && <Badge>{selectedAmenities.length}</Badge>}
        <ChevronDown />
      </Trigger>

      <Dropdown $open={isOpen}>
        {allAmenities.length > 3 && (
          <SearchInput
            type="text"
            placeholder="Search amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {allAmenities.length > 0 && (
          <SelectAllOption>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>Select All</span>
          </SelectAllOption>
        )}

        {filteredAmenities.length > 0 ? (
          filteredAmenities.map(amenity => (
            <Option key={amenity}>
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
              />
              <span>{amenity}</span>
            </Option>
          ))
        ) : (
          <EmptyState>
            {searchQuery ? 'No amenities found' : 'Loading amenities...'}
          </EmptyState>
        )}
      </Dropdown>
    </Container>
  );
}
