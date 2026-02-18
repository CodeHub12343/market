'use client';

import styled from 'styled-components';
import { useState } from 'react';

const FiltersContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  @media (min-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }
`;

const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResetLink = styled.button`
  background: none;
  border: none;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 4px 8px;

  &:hover {
    color: #0d0d0d;
  }
`;

const FilterGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  background: white;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  color: #333;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #f8f7ff;
  }

  option {
    color: #333;
    background: white;
    padding: 8px;
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
  font-size: 13px;
  color: #555;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;

  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #667eea;
  }

  &:hover {
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 12px;
    padding-top: 20px;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const ResetButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const BadgeTag = styled.span`
  display: inline-block;
  background: #1a1a1a;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const categories = ['note', 'assignment', 'past-question', 'project', 'other'];
const academicLevels = ['100', '200', '300', '400', '500', 'postgraduate'];
const sortOptions = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Most Downloaded', value: '-downloads' },
  { label: 'Highest Rated', value: '-averageRating' },
  { label: 'Title (A-Z)', value: 'title' },
  { label: 'Most Viewed', value: '-views' },
];

export default function DocumentFilters({ onApply, onReset, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    course: initialFilters.course || '',
    academicLevel: initialFilters.academicLevel || '',
    category: initialFilters.category || '',
    sortBy: initialFilters.sortBy || '-createdAt',
    minRating: initialFilters.minRating || '',
    uploadedAfter: initialFilters.uploadedAfter || '',
  });

  const [selectedCategories, setSelectedCategories] = useState(
    initialFilters.categories || []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    const appliedFilters = { ...filters, categories: selectedCategories };
    onApply(appliedFilters);
  };

  const handleReset = () => {
    setFilters({
      course: '',
      academicLevel: '',
      category: '',
      sortBy: '-createdAt',
      minRating: '',
      uploadedAfter: '',
    });
    setSelectedCategories([]);
    onReset?.();
  };

  const activeFilterCount = [
    filters.course,
    filters.academicLevel,
    filters.category,
    filters.minRating,
    filters.uploadedAfter,
    ...selectedCategories,
  ].filter(Boolean).length;

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          🎯 Filters
          {activeFilterCount > 0 && <BadgeTag>{activeFilterCount}</BadgeTag>}
        </FiltersTitle>
        {activeFilterCount > 0 && (
          <ResetLink onClick={handleReset}>
            Clear All
          </ResetLink>
        )}
      </FiltersHeader>

      <FilterGroups>
        {/* Sort By */}
        <FilterGroup>
          <FilterLabel>📊 Sort By</FilterLabel>
          <FilterSelect
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        {/* Course */}
        <FilterGroup>
          <FilterLabel>📚 Course</FilterLabel>
          <FilterInput
            type="text"
            name="course"
            placeholder="e.g., CS 101, MTH 200"
            value={filters.course}
            onChange={handleInputChange}
          />
        </FilterGroup>

        {/* Academic Level */}
        <FilterGroup>
          <FilterLabel>🎓 Academic Level</FilterLabel>
          <FilterSelect
            name="academicLevel"
            value={filters.academicLevel}
            onChange={handleInputChange}
          >
            <option value="">All Levels</option>
            {academicLevels.map((level) => (
              <option key={level} value={level}>
                {level === 'postgraduate' ? 'Postgraduate' : `${level}-Level`}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        {/* Category */}
        <FilterGroup>
          <FilterLabel>🏷️ Document Type</FilterLabel>
          <CheckboxGroup>
            {categories.map((cat) => (
              <CheckboxLabel key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterGroup>

        {/* Minimum Rating */}
        <FilterGroup>
          <FilterLabel>⭐ Minimum Rating</FilterLabel>
          <FilterSelect
            name="minRating"
            value={filters.minRating}
            onChange={handleInputChange}
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </FilterSelect>
        </FilterGroup>

        {/* Uploaded After */}
        <FilterGroup>
          <FilterLabel>📅 Uploaded After</FilterLabel>
          <FilterInput
            type="date"
            name="uploadedAfter"
            value={filters.uploadedAfter}
            onChange={handleInputChange}
          />
        </FilterGroup>
      </FilterGroups>

      <ButtonGroup>
        <ApplyButton onClick={handleApply}>
          ✓ Apply
        </ApplyButton>
        <ResetButton onClick={handleReset}>
          ↻ Reset
        </ResetButton>
      </ButtonGroup>
    </FiltersContainer>
  );
}