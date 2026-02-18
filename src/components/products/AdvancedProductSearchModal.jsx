'use client';

import styled from 'styled-components';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function AdvancedProductSearchModal({
  isOpen,
  onClose,
  onSearch,
  filters = {},
  categories = [],
  isLoading = false
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  useEffect(() => {
    if (isOpen && categories.length > 0) {
      console.log('📂 Categories available in modal:', categories.map(c => ({ id: c._id, name: c.name })));
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    if (field === 'category') {
      const selectedCat = categories.find(c => c._id === value);
      console.log(`🔧 Category filter changed:`, selectedCat ? `${selectedCat.name} (${value})` : `Empty - will show all`);
    }
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('🔍 Advanced search triggered with filters:', {
      ...localFilters,
      categoryName: localFilters.category ? 
        categories.find(c => c._id === localFilters.category)?.name : 'ALL'
    });
    onSearch(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sortBy: '-createdAt',
    };
    setLocalFilters(clearedFilters);
    onSearch(clearedFilters);
    onClose();
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
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FilterSection>
        )}

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

        {/* Condition */}
        <FilterSection>
          <FilterLabel>Condition</FilterLabel>
          <Select
            value={localFilters.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </Select>
        </FilterSection>

        {/* Rating */}
        <FilterSection>
          <FilterLabel>Minimum Rating</FilterLabel>
          <Select
            value={localFilters.rating || ''}
            onChange={(e) => handleChange('rating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="topRated">⭐ 4.5★ & Above (Top Rated)</option>
            <option value="highRated">⭐ 4★ & Above</option>
            <option value="unrated">📊 Unrated Products</option>
          </Select>
        </FilterSection>

        {/* Availability */}
        <FilterSection>
          <FilterLabel>Stock Status</FilterLabel>
          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.inStock === 'true' || false}
                onChange={(e) => handleChange('inStock', e.target.checked ? 'true' : '')}
              />
              In Stock Only
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.hasImages === 'true' || false}
                onChange={(e) => handleChange('hasImages', e.target.checked ? 'true' : '')}
              />
              Has Images
            </CheckboxLabel>
          </CheckboxGroup>
        </FilterSection>

        {/* Sorting */}
        <FilterSection>
          <FilterLabel>Sort By</FilterLabel>
          <Select
            value={localFilters.sortBy || '-createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="-createdAt">🆕 Newest First</option>
            <option value="createdAt">🕐 Oldest First</option>
            <option value="price">💰 Price: Low to High</option>
            <option value="-price">💸 Price: High to Low</option>
            <option value="-ratingsAverage">⭐ Top Rated</option>
            <option value="-analytics.views">👀 Most Viewed</option>
            <option value="-analytics.favorites">❤️ Most Favorited</option>
            <option value="name">🔤 A-Z</option>
            <option value="-name">🔤 Z-A</option>
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
