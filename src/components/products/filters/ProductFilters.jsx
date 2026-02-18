import React, { useState } from 'react';
import styled from 'styled-components';
import { useCategories } from '@/hooks/useCategories';
import { X, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import PriceRangeFilter from './PriceRangeFilter';
import RatingFilter from './RatingFilter';
import ConditionFilter from './ConditionFilter';
import SortOptions from './SortOptions';

const FilterWrapper = styled.div`
  width: 100%;
`;

const MobileFilterButton = styled.button`
  display: none;
  width: 100%;
  padding: 14px 16px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background: #333;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FilterContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
  max-height: 2000px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    max-height: ${(props) => (props.$isOpen ? '3000px' : '0')};
    margin-bottom: ${(props) => (props.$isOpen ? '16px' : '0')};
    padding: ${(props) => (props.$isOpen ? '16px' : '0')};
    border: ${(props) => (props.$isOpen ? '1px solid #e5e5e5' : 'none')};
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column-reverse;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 12px 14px;
    font-size: 12px;
  }
`;

const ResetButton = styled(Button)`
  background: transparent;
  border: 1px solid #e5e5e5;
  color: #666;
  
  &:hover {
    border-color: #1a1a1a;
    background: #fafafa;
  }
`;

const ApplyButton = styled(Button)`
  background: #1a1a1a;
  color: #fff;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 20px;
  padding-right: 32px;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.05);
  }
  
  &:hover {
    border-color: #1a1a1a;
    background-color: #fff;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.05);
  }
`;

const ActiveFiltersSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
`;

const ActiveFiltersLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #1a1a1a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default function ProductFilters({
  onApply,
  onReset,
  isLoading = false,
  initialFilters = {}
}) {
  const { data: categoriesData } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    category: initialFilters.category || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    condition: initialFilters.condition || '',
    rating: initialFilters.rating || '',
    minRating: initialFilters.minRating || '',
    maxRating: initialFilters.maxRating || '',
    sortBy: initialFilters.sortBy || '-createdAt',
    campus: initialFilters.campus || '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value
    }));
  };

  const handleApply = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value !== null)
    );
    onApply?.(activeFilters);
    setIsFiltersOpen(false);
  };

  const handleReset = () => {
    const defaultFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      rating: '',
      minRating: '',
      maxRating: '',
      sortBy: '-createdAt',
      campus: '',
    };
    setFilters(defaultFilters);
    onReset?.();
  };

  const removeFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ''
    }));
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(v => v !== '' && v !== null && v !== '-createdAt').length;
  };

  const activeFilters = Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== '-createdAt');

  return (
    <FilterWrapper>
      <MobileFilterButton
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        type="button"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} />
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </span>
        {isFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </MobileFilterButton>

      <FilterContainer $isOpen={isFiltersOpen}>
        <FilterHeader>
          <HeaderLeft>
            <Title>Filters</Title>
            {getActiveFilterCount() > 0 && <FilterCount>{getActiveFilterCount()}</FilterCount>}
          </HeaderLeft>
          <ButtonGroup>
            <ResetButton onClick={handleReset} disabled={isLoading}>
              Reset
            </ResetButton>
            <ApplyButton onClick={handleApply} disabled={isLoading}>
              {isLoading ? 'Applying...' : 'Apply'}
            </ApplyButton>
          </ButtonGroup>
        </FilterHeader>

        {activeFilters.length > 0 && (
          <ActiveFiltersSection>
            <ActiveFiltersLabel>Active Filters</ActiveFiltersLabel>
            <ActiveFiltersContainer>
              {activeFilters.map(([key, value]) => (
                <FilterTag key={key}>
                  <span>{`${key}: ${value}`}</span>
                  <RemoveButton onClick={() => removeFilter(key)}>
                    <X size={14} />
                  </RemoveButton>
                </FilterTag>
              ))}
            </ActiveFiltersContainer>
          </ActiveFiltersSection>
        )}

        <FilterGrid>
          {/* Search */}
          <FilterSection>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              name="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleInputChange}
            />
          </FilterSection>

          {/* Category */}
          <FilterSection>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FilterSection>

          {/* Campus */}
          <FilterSection>
            <Label htmlFor="campus">Campus</Label>
            <Select
              id="campus"
              name="campus"
              value={filters.campus}
              onChange={handleInputChange}
            >
              <option value="">All Campuses</option>
              <option value="main">Main Campus</option>
              <option value="annex">Annex Campus</option>
            </Select>
          </FilterSection>

          {/* Price Range */}
          <PriceRangeFilter 
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={handleInputChange}
          />

          {/* Condition */}
          <ConditionFilter
            condition={filters.condition}
            onChange={handleInputChange}
          />

          {/* Rating */}
          <RatingFilter
            rating={filters.rating}
            minRating={filters.minRating}
            maxRating={filters.maxRating}
            onChange={handleInputChange}
          />

          {/* Sort Options */}
          <SortOptions
            sortBy={filters.sortBy}
            onChange={handleInputChange}
          />
        </FilterGrid>
      </FilterContainer>
    </FilterWrapper>
  );
}
