'use client';

import styled from 'styled-components';
import { X } from 'lucide-react';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-end;
  z-index: 1000;

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    max-width: 500px;
    max-height: 80vh;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ececec;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
  }

  option {
    background: #ffffff;
    color: #1a1a1a;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: #f9f9f9;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
  }
`;

const RangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;

  input {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: ${props => props.primary ? '#1a1a1a' : '#f9f9f9'};
  color: ${props => props.primary ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.primary ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? '#333333' : '#f0f0f0'};
    border-color: ${props => props.primary ? '#333333' : '#d5d5d5'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function AdvancedRequestFilterModal({
  isOpen,
  onClose,
  onApply,
  filters = {},
  isLoading = false,
  categories = []
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Advanced Filters</Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        {/* Search Term */}
        <FilterSection>
          <FilterLabel>Search</FilterLabel>
          <Input
            type="text"
            placeholder="Search by title, description..."
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </FilterSection>

        {/* Category */}
        <FilterSection>
          <FilterLabel>Category</FilterLabel>
          <Select
            value={localFilters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories && categories.length > 0 ? (
              categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </Select>
        </FilterSection>

        {/* Status */}
        <FilterSection>
          <FilterLabel>Status</FilterLabel>
          <Select
            value={localFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="closed">Closed</option>
          </Select>
        </FilterSection>

        {/* Budget Range */}
        <FilterSection>
          <FilterLabel>Budget Range (₦)</FilterLabel>
          <RangeContainer>
            <Input
              type="number"
              placeholder="Min Price"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              min="0"
            />
          </RangeContainer>
        </FilterSection>

        {/* Buttons */}
        <ButtonGroup>
          <Button onClick={handleClear}>Clear Filters</Button>
          <Button primary onClick={handleApply} disabled={isLoading}>
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
