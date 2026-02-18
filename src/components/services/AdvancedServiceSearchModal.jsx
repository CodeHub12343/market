'use client';

import styled from 'styled-components';
import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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

const RangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

export default function AdvancedServiceSearchModal({
  isOpen,
  onClose,
  onSearch,
  filters = {},
  locations = [],
  categories = [],
  isLoading = false
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(`🔍 Filter changed - ${field}:`, value);
  };

  const handleSearch = () => {
    console.log('🔎 ADVANCED SERVICE SEARCH SUBMITTED');
    console.log('   📊 Submitted filters:', localFilters);
    console.log('   💰 Price Range:', {
      min: localFilters.minPrice || 'Any',
      max: localFilters.maxPrice || 'Any'
    });
    console.log('   ⭐ Minimum Rating:', localFilters.minRating || 'Any');
    console.log('   📍 Location:', localFilters.location || 'All Locations');
    console.log('   ⏰ Availability:', localFilters.availability || 'All');
    console.log('   🔀 Sort:', localFilters.sort || '-createdAt');
    
    // Detailed availability logging
    if (localFilters.availability) {
      const availArray = localFilters.availability.split(',');
      console.log('   ✅ Availability array:', availArray);
      console.log('   ✅ Individual values:');
      availArray.forEach((val, idx) => {
        console.log(`      [${idx}] "${val.trim()}"`);
      });
    }
    
    onSearch(localFilters);
    onClose();
  };

  const handleClear = () => {
    console.log('🗑️ Filters cleared');
    setLocalFilters({});
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Advanced Search</Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        {/* Price Range */}
        <FilterSection>
          <FilterLabel>Price Range (₦)</FilterLabel>
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

        {/* Minimum Rating */}
        <FilterSection>
          <FilterLabel>Minimum Rating</FilterLabel>
          <Select
            value={localFilters.minRating || ''}
            onChange={(e) => handleChange('minRating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4★ & Above</option>
            <option value="3.5">3.5★ & Above</option>
            <option value="3">3★ & Above</option>
            <option value="2.5">2.5★ & Above</option>
          </Select>
        </FilterSection>

        {/* Category */}
        {categories.length > 0 && (
          <FilterSection>
            <FilterLabel>Category</FilterLabel>
            <Select
              value={localFilters.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FilterSection>
        )}

        {/* Availability */}
        <FilterSection>
          <FilterLabel>Availability</FilterLabel>
          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.availability?.includes('available') || false}
                onChange={(e) => {
                  const current = localFilters.availability?.split(',') || [];
                  const updated = e.target.checked
                    ? [...current, 'available']
                    : current.filter(v => v !== 'available');
                  handleChange('availability', updated.join(','));
                }}
              />
              Available Now
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.availability?.includes('on-demand') || false}
                onChange={(e) => {
                  const current = localFilters.availability?.split(',') || [];
                  const updated = e.target.checked
                    ? [...current, 'on-demand']
                    : current.filter(v => v !== 'on-demand');
                  handleChange('availability', updated.join(','));
                }}
              />
              On Demand
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.availability?.includes('by-appointment') || false}
                onChange={(e) => {
                  const current = localFilters.availability?.split(',') || [];
                  const updated = e.target.checked
                    ? [...current, 'by-appointment']
                    : current.filter(v => v !== 'by-appointment');
                  handleChange('availability', updated.join(','));
                }}
              />
              By Appointment
            </CheckboxLabel>
          </CheckboxGroup>
        </FilterSection>

        {/* Location */}
        {locations.length > 0 && (
          <FilterSection>
            <FilterLabel>Location</FilterLabel>
            <Select
              value={localFilters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location._id || location} value={location._id || location}>
                  {location.name || location}
                </option>
              ))}
            </Select>
          </FilterSection>
        )}

        {/* Sorting */}
        <FilterSection>
          <FilterLabel>Sort By</FilterLabel>
          <Select
            value={localFilters.sort || '-createdAt'}
            onChange={(e) => handleChange('sort', e.target.value)}
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating">Top Rated</option>
            <option value="-views">Most Popular</option>
          </Select>
        </FilterSection>

        {/* Buttons */}
        <ButtonGroup>
          <Button onClick={handleClear}>Clear Filters</Button>
          <Button primary onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
