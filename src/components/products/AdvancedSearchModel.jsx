'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { X, Search, Settings } from 'lucide-react';
import { useAdvancedSearch, useCategories, useCampuses } from '@/hooks/useSearch';
import PriceRangeFilter from './filters/PriceRangeFilter';
import RatingFilter from './filters/RatingFilter';
import ConditionFilter from './filters/ConditionFilter';
import SortOptions from './filters/SortOptions';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    border-radius: 20px 20px 0 0;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #3b82f6;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #1a1a1a;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
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
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
  background: #f9f9f9;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 10px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #1a1a1a;

  &:hover {
    background: #e0e0e0;
  }
`;

const SearchButton = styled(Button)`
  background: #3b82f6;
  color: white;

  &:hover {
    background: #2563eb;
  }
`;

const ResetButton = styled(Button)`
  background: white;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const ActiveFiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e0e7ff;
  color: #3730a3;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #3730a3;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
`;

export default function AdvancedSearchModal({ isOpen, onClose, onSearch }) {
  const {
    filters,
    handleFilterChange,
    handleSearch,
    handleReset,
    categories,
    campuses,
    isLoading,
  } = useAdvancedSearch();

  const handleSearchClick = () => {
    handleSearch();
    onSearch?.(filters);
  };

  const removeFilter = (filterName) => {
    const newFilters = { ...filters };
    delete newFilters[filterName];
    handleFilterChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (v) => v !== '' && v !== null && v !== '-createdAt'
    ).length;
  };

  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value !== '' && value !== null && value !== '-createdAt' && value !== 'desc'
  );

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Settings size={24} />
            Advanced Search
            {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()} active)`}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {activeFilters.length > 0 && (
            <ActiveFiltersSection>
              {activeFilters.map(([key, value]) => (
                <FilterTag key={key}>
                  <span>{`${key}: ${value}`}</span>
                  <RemoveTagButton onClick={() => removeFilter(key)}>
                    ×
                  </RemoveTagButton>
                </FilterTag>
              ))}
            </ActiveFiltersSection>
          )}

          <FilterGrid>
            {/* Search Query */}
            <FilterSection>
              <Label htmlFor="search">Search Query</Label>
              <Input
                id="search"
                type="text"
                placeholder="Product name, brand, etc."
                value={filters.search || ''}
                onChange={(e) =>
                  handleFilterChange({ search: e.target.value })
                }
              />
            </FilterSection>

            {/* Category */}
            <FilterSection>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={filters.category || ''}
                onChange={(e) =>
                  handleFilterChange({ category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
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
                value={filters.campus || ''}
                onChange={(e) =>
                  handleFilterChange({ campus: e.target.value })
                }
              >
                <option value="">All Campuses</option>
                {campuses?.map((camp) => (
                  <option key={camp._id} value={camp._id}>
                    {camp.name}
                  </option>
                ))}
              </Select>
            </FilterSection>

            {/* Price Range */}
            <PriceRangeFilter
              minPrice={filters.minPrice || ''}
              maxPrice={filters.maxPrice || ''}
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange({ [name]: value });
              }}
            />

            {/* Condition */}
            <ConditionFilter
              condition={filters.condition || ''}
              onChange={(e) => {
                handleFilterChange({ condition: e.target.value });
              }}
            />

            {/* Rating */}
            <RatingFilter
              rating={filters.rating || ''}
              minRating={filters.minRating || ''}
              maxRating={filters.maxRating || ''}
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange({ [name]: value });
              }}
            />

            {/* In Stock */}
            <FilterSection>
              <Label>Availability</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.inStock === 'true'}
                    onChange={(e) =>
                      handleFilterChange({ inStock: e.target.checked ? 'true' : '' })
                    }
                  />
                  In Stock Only
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.hasImages === 'true'}
                    onChange={(e) =>
                      handleFilterChange({ hasImages: e.target.checked ? 'true' : '' })
                    }
                  />
                  Has Images
                </label>
              </div>
            </FilterSection>

            {/* Sort Options */}
            <SortOptions
              sortBy={filters.sortBy || '-createdAt'}
              order={filters.order || 'desc'}
              onChange={(e) => {
                const { name, value } = e.target;
                handleFilterChange({ [name]: value });
              }}
            />
          </FilterGrid>
        </ModalContent>

        <ModalFooter>
          <ResetButton onClick={handleReset} disabled={isLoading}>
            Reset All
          </ResetButton>
          <CancelButton onClick={onClose} disabled={isLoading}>
            Cancel
          </CancelButton>
          <SearchButton onClick={handleSearchClick} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </SearchButton>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
}
