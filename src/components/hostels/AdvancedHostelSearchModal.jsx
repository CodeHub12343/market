'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useHostelCategories } from '@/hooks/useCategories';
import { usePriceRange, useHostelAmenities } from '@/hooks/useHostelSearch';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

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
  animation: slideUp 0.3s ease;
  padding: 20px;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    border-radius: 16px;
    width: 90%;
    max-width: 700px;
    animation: slideDown 0.3s ease;

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
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
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #e5e7eb;
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 24px 0;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: #ffffff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const PriceRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }

  &::placeholder {
    color: #999;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1a1a1a;
  }

  span {
    font-size: 14px;
    color: #1a1a1a;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e5e5;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const RatingValue = styled.span`
  font-weight: 700;
  color: #1a1a1a;
  min-width: 40px;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #1a1a1a;
        color: white;

        &:hover {
          background: #000;
        }
      `;
    }
    return `
      background: #f3f4f6;
      color: #1a1a1a;
      border: 1px solid #e5e5e5;

      &:hover {
        background: #e5e7eb;
      }
    `;
  }}
`;

export default function AdvancedHostelSearchModal({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {}
}) {
  const [filters, setFilters] = useState({
    // Hostel filters
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    amenities: [],
    // Room filters
    roomTypes: [],
    occupancy: [],
    roomMinPrice: '',
    roomMaxPrice: '',
    // Sorting
    sort: '-createdAt',
    ...initialFilters
  });

  const { data: categories = [] } = useHostelCategories();
  const { data: priceData = {} } = usePriceRange();
  const { data: amenities = [] } = useHostelAmenities();

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomTypeToggle = (roomType) => {
    setFilters(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomType)
        ? prev.roomTypes.filter(rt => rt !== roomType)
        : [...prev.roomTypes, roomType]
    }));
  };

  const handleOccupancyToggle = (occ) => {
    setFilters(prev => ({
      ...prev,
      occupancy: prev.occupancy.includes(occ)
        ? prev.occupancy.filter(o => o !== occ)
        : [...prev.occupancy, occ]
    }));
  };

  const handleClear = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      amenities: [],
      roomTypes: [],
      occupancy: [],
      roomMinPrice: '',
      roomMaxPrice: '',
      sort: '-createdAt'
    });
  };

  const handleApply = () => {
    // Map the form filters to the expected format
    const appliedFilters = {
      category: filters.category || null,
      priceRange: {
        min: filters.minPrice ? parseInt(filters.minPrice) : null,
        max: filters.maxPrice ? parseInt(filters.maxPrice) : null
      },
      rating: filters.minRating || null,
      amenities: filters.amenities || [],
      roomTypes: filters.roomTypes || [],
      occupancy: filters.occupancy || [],
      roomPriceRange: {
        min: filters.roomMinPrice ? parseInt(filters.roomMinPrice) : null,
        max: filters.roomMaxPrice ? parseInt(filters.roomMaxPrice) : null
      },
      sortBy: filters.sort || '-createdAt'
    };
    
    onApplyFilters(appliedFilters);
    onClose();
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

        {/* ===== HOSTEL FILTERS SECTION ===== */}
        <SectionTitle>🏠 Hostel Filters</SectionTitle>

        {/* Category Filter */}
        <FilterGroup>
          <FilterLabel>Category</FilterLabel>
          <SelectInput
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </SelectInput>
        </FilterGroup>

        {/* Price Range Filter */}
        <FilterGroup>
          <FilterLabel>Price Range (₦)</FilterLabel>
          <PriceRangeContainer>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              min={priceData.min || 0}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              max={priceData.max || 500000}
            />
          </PriceRangeContainer>
        </FilterGroup>

        {/* Rating Filter */}
        <FilterGroup>
          <FilterLabel>Minimum Rating</FilterLabel>
          <SliderContainer>
            <Slider
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
            />
            <RatingValue>
              {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
            </RatingValue>
          </SliderContainer>
        </FilterGroup>

        {/* Amenities Filter */}
        {amenities.length > 0 && (
          <FilterGroup>
            <FilterLabel>Amenities</FilterLabel>
            <CheckboxGroup>
              {amenities.map(amenity => (
                <CheckboxItem key={amenity}>
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span>{amenity}</span>
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </FilterGroup>
        )}

        <SectionDivider />

        {/* ===== ROOM FILTERS SECTION ===== */}
        <SectionTitle>🛏️ Room Filters</SectionTitle>

        {/* Room Type Filter */}
        <FilterGroup>
          <FilterLabel>Room Type</FilterLabel>
          <CheckboxGroup>
            {['single', 'double', 'triple', 'quad', 'dorm'].map(roomType => (
              <CheckboxItem key={roomType}>
                <input
                  type="checkbox"
                  checked={filters.roomTypes.includes(roomType)}
                  onChange={() => handleRoomTypeToggle(roomType)}
                />
                <span>{roomType.charAt(0).toUpperCase() + roomType.slice(1)}</span>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterGroup>

        {/* Occupancy Filter */}
        <FilterGroup>
          <FilterLabel>Occupancy</FilterLabel>
          <CheckboxGroup>
            {['1 person', '2 people', '3 people', '4+ people'].map(occ => (
              <CheckboxItem key={occ}>
                <input
                  type="checkbox"
                  checked={filters.occupancy.includes(occ)}
                  onChange={() => handleOccupancyToggle(occ)}
                />
                <span>{occ}</span>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterGroup>

        {/* Room Price Range Filter */}
        <FilterGroup>
          <FilterLabel>Room Price Range (₦)</FilterLabel>
          <PriceRangeContainer>
            <Input
              type="number"
              placeholder="Min"
              value={filters.roomMinPrice}
              onChange={(e) => handleFilterChange('roomMinPrice', e.target.value)}
              min="5000"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.roomMaxPrice}
              onChange={(e) => handleFilterChange('roomMaxPrice', e.target.value)}
              max="500000"
            />
          </PriceRangeContainer>
        </FilterGroup>

        <SectionDivider />

        {/* ===== SORTING SECTION ===== */}
        <SectionTitle>📊 Sorting</SectionTitle>

        <FilterGroup>
          <FilterLabel>Sort By</FilterLabel>
          <SelectInput
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="-createdAt">Newest</option>
            <option value="minPrice">Price: Low to High</option>
            <option value="-minPrice">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="-ratingsAverage">Top Rated</option>
          </SelectInput>
        </FilterGroup>

        {/* Action Buttons */}
        <ActionButtons>
          <Button onClick={handleClear}>Clear All</Button>
          <Button variant="primary" onClick={handleApply}>Apply Filters</Button>
        </ActionButtons>
      </Modal>
    </Overlay>
  );
}


