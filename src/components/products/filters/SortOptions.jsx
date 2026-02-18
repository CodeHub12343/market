import React from 'react';
import styled from 'styled-components';

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
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
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

const SORT_OPTIONS = [
  { value: '-createdAt', label: '🆕 Newest First' },
  { value: 'createdAt', label: '🕐 Oldest First' },
  { value: 'price', label: '💰 Low to High' },
  { value: '-price', label: '💸 High to Low' },
  { value: '-ratingsAverage', label: '⭐ Top Rated' },
  { value: '-analytics.views', label: '👀 Most Viewed' },
  { value: '-analytics.favorites', label: '❤️ Most Favorited' },
  { value: 'name', label: '🔤 A-Z' },
  { value: '-name', label: '🔤 Z-A' },
];

export default function SortOptions({ sortBy, onChange }) {
  return (
    <FilterSection>
      <Label>Sort By</Label>
      <Select
        name="sortBy"
        value={sortBy}
        onChange={onChange}
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FilterSection>
  );
}
