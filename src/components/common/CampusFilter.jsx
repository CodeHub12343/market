'use client';

import styled from 'styled-components';
import { Globe, Home } from 'lucide-react';

// ===== STYLED COMPONENTS =====
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    padding: 14px 20px;
    border-radius: 14px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 24px;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    font-size: 14px;
    gap: 10px;
  }

  &:hover {
    color: #333;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

const CampusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  margin-left: auto;
  padding-left: 12px;
  border-left: 2px solid #e5e7eb;

  @media (min-width: 640px) {
    font-size: 13px;
    gap: 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #667eea;
    flex-shrink: 0;
  }
`;

const CampusName = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CampusSelect = styled.select`
  padding: 8px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    font-size: 13px;
    padding: 9px 14px;
  }

  &:hover {
    border-color: #9ca3af;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  option {
    padding: 8px;
    color: #1a1a1a;
  }
`;

// ===== COMPONENT =====
export default function CampusFilter({
  showAllCampuses,
  selectedCampus,
  campusName,
  userCampus,
  allCampuses = [],
  onToggleAllCampuses,
  onCampusChange,
  disabled = false
}) {
  return (
    <FilterContainer role="group" aria-label="Campus filter options">
      {/* Main Toggle */}
      <Label htmlFor="campus-toggle" title="Show listings from all campuses or just your campus">
        <Checkbox
          id="campus-toggle"
          type="checkbox"
          checked={showAllCampuses}
          onChange={onToggleAllCampuses}
          disabled={disabled}
          aria-label={showAllCampuses ? 'Viewing all campuses' : 'Viewing only my campus'}
        />
        <span>{showAllCampuses ? 'All Campuses' : 'My Campus'}</span>
      </Label>

      {/* Campus Info */}
      <CampusInfo>
        {showAllCampuses ? (
          <>
            <Globe size={16} aria-hidden="true" />
            <span>Showing listings from all campuses</span>
          </>
        ) : (
          <>
            <Home size={16} aria-hidden="true" />
            <span>Showing listings from <CampusName>{campusName}</CampusName></span>
          </>
        )}
      </CampusInfo>

      {/* Campus Selector (visible when showing all campuses) */}
      {showAllCampuses && allCampuses.length > 0 && (
        <SelectContainer>
          <CampusSelect
            value={selectedCampus || ''}
            onChange={(e) => onCampusChange(e.target.value || null)}
            disabled={disabled}
            aria-label="Select specific campus to filter"
          >
            <option value="">All Campuses</option>
            {allCampuses.map(campus => (
              <option key={campus._id} value={campus._id}>
                {campus.name}
              </option>
            ))}
          </CampusSelect>
        </SelectContainer>
      )}
    </FilterContainer>
  );
}
