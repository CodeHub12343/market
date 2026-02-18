'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Calendar, MapPin, DollarSign, Tag, ArrowUpDown } from 'lucide-react';
import { useEventCategories, useEventLocations, useEventPriceRange } from '@/hooks/useEventSearch';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    align-items: center;
    justify-content: center;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border-radius: 16px 16px 0 0;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
  animation: ${props => props.isOpen ? 'slideUp 0.3s ease' : 'slideDown 0.3s ease'};

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @media (min-width: 769px) {
    max-width: 600px;
    max-height: 80vh;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  position: sticky;
  top: 0;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#333'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme?.colors?.text || '#333'};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme?.colors?.primary || '#6366f1'};
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: ${props => props.theme?.colors?.text || '#333'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#6366f1'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#6366f1'};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  color: ${props => props.theme?.colors?.text || '#333'};

  &:hover {
    background: ${props => props.theme?.colors?.primaryLight || '#f9f9f9'};
  }

  input {
    cursor: pointer;
    accent-color: ${props => props.theme?.colors?.primary || '#6366f1'};
  }
`;

const DateInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const DateInput = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: ${props => props.theme?.colors?.text || '#333'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#6366f1'};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const PriceInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PriceInput = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: ${props => props.theme?.colors?.text || '#333'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#6366f1'};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  position: sticky;
  bottom: 0;
  z-index: 10;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'secondary' ? `
    background: ${props.theme?.colors?.border || '#e0e0e0'};
    color: ${props.theme?.colors?.text || '#333'};

    &:hover {
      background: ${props.theme?.colors?.border || '#d0d0d0'};
    }
  ` : `
    background: ${props.theme?.colors?.primary || '#6366f1'};
    color: white;

    &:hover {
      background: ${props.theme?.colors?.primaryDark || '#4f46e5'};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdvancedEventSearchModal = ({
  isOpen = false,
  onClose = () => {},
  onApply = () => {},
  onApplyFilters = () => {},
  initialFilters = {},
  categories: propCategories = []
}) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    location: initialFilters.location || '',
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    attendanceStatus: initialFilters.attendanceStatus || 'all',
    sort: initialFilters.sort || 'newest'
  });

  const { data: categories = [] } = useEventCategories(isOpen && !propCategories?.length);
  const finalCategories = propCategories?.length > 0 ? propCategories : categories;
  const { data: locations = [] } = useEventLocations(isOpen);
  const { data: priceRange = { min: 0, max: 0 } } = useEventPriceRange(isOpen);

  useEffect(() => {
    if (isOpen) {
      setFilters({
        category: initialFilters?.category || '',
        location: initialFilters?.location || '',
        startDate: initialFilters?.startDate || '',
        endDate: initialFilters?.endDate || '',
        minPrice: initialFilters?.minPrice || '',
        maxPrice: initialFilters?.maxPrice || '',
        attendanceStatus: initialFilters?.attendanceStatus || 'all',
        sort: initialFilters?.sort || 'newest'
      });
    }
  }, [isOpen]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== 'all') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Call either onApply or onApplyFilters depending on which is provided
    if (onApply) {
      onApply(activeFilters);
    } else {
      onApplyFilters(activeFilters);
    }
    onClose();
  };

  const handleClear = () => {
    setFilters({
      category: '',
      location: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: '',
      attendanceStatus: 'all',
      sort: 'newest'
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    v => v && v !== 'all' && v !== 'newest'
  );

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContent isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Filter Events</Title>
          <CloseButton onClick={onClose} title="Close">
            <X />
          </CloseButton>
        </Header>

        <Content>
          {/* Category Filter */}
          <FilterGroup>
            <FilterLabel htmlFor="category-select">
              <Tag />
              Category
            </FilterLabel>
            <Select
              id="category-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {finalCategories.map(cat => (
                <option key={cat._id || cat} value={cat._id || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </Select>
          </FilterGroup>

          {/* Location Filter */}
          <FilterGroup>
            <FilterLabel htmlFor="location-select">
              <MapPin />
              Location
            </FilterLabel>
            <Select
              id="location-select"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
          </FilterGroup>

          {/* Date Range Filter */}
          <FilterGroup>
            <FilterLabel htmlFor="start-date">
              <Calendar />
              Date Range
            </FilterLabel>
            <DateInputWrapper>
              <DateInput
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <DateInput
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                min={filters.startDate}
              />
            </DateInputWrapper>
          </FilterGroup>

          {/* Attendance Status Filter */}
          <FilterGroup>
            <FilterLabel>Attendance Status</FilterLabel>
            <CheckboxGroup>
              <CheckboxLabel>
                <input
                  type="radio"
                  name="attendance"
                  value="all"
                  checked={filters.attendanceStatus === 'all'}
                  onChange={(e) => handleFilterChange('attendanceStatus', e.target.value)}
                />
                All Events
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="radio"
                  name="attendance"
                  value="joined"
                  checked={filters.attendanceStatus === 'joined'}
                  onChange={(e) => handleFilterChange('attendanceStatus', e.target.value)}
                />
                Joined
              </CheckboxLabel>
              <CheckboxLabel>
                <input
                  type="radio"
                  name="attendance"
                  value="notJoined"
                  checked={filters.attendanceStatus === 'notJoined'}
                  onChange={(e) => handleFilterChange('attendanceStatus', e.target.value)}
                />
                Not Joined
              </CheckboxLabel>
            </CheckboxGroup>
          </FilterGroup>

          {/* Sort Filter */}
          <FilterGroup>
            <FilterLabel htmlFor="sort-select">
              <ArrowUpDown />
              Sort By
            </FilterLabel>
            <Select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="trending">Trending</option>
              <option value="mostAttended">Most Attended</option>
              <option value="highestRated">Highest Rated</option>
              <option value="soonest">Soonest Event</option>
            </Select>
          </FilterGroup>
        </Content>

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Overlay>
  );
};

export default AdvancedEventSearchModal;
