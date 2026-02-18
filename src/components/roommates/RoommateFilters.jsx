'use client'

import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
`

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  span {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
`

const RangeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const RangeInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`

const RangeLabel = styled.span`
  font-size: 13px;
  color: #666;
  min-width: 40px;
  text-align: center;
`

const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 12px 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;

    &:hover {
      background: #333;
    }
  ` : `
    background: white;
    color: #1a1a1a;

    &:hover {
      background: #f5f5f5;
    }
  `}
`

export function RoommateFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    roomType: initialFilters.roomType || [],
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    amenities: initialFilters.amenities || [],
    leaseType: initialFilters.leaseType || [],
    availability: initialFilters.availability !== false
  })

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const handleRangeChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange?.(filters)
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      roomType: [],
      minPrice: '',
      maxPrice: '',
      amenities: [],
      leaseType: [],
      availability: true
    }
    setFilters(defaultFilters)
    onFilterChange?.(defaultFilters)
  }

  return (
    <FiltersContainer>
      {/* Room Type */}
      <FilterGroup>
        <FilterTitle>Room Type</FilterTitle>
        {['Shared Room', 'Private Room', 'Studio'].map(type => (
          <FilterOption key={type}>
            <input
              type="checkbox"
              checked={filters.roomType.includes(type)}
              onChange={() => handleCheckboxChange('roomType', type)}
            />
            <span>{type}</span>
          </FilterOption>
        ))}
      </FilterGroup>

      <Divider />

      {/* Price Range */}
      <FilterGroup>
        <FilterTitle>Price Range (₦)</FilterTitle>
        <RangeInputGroup>
          <RangeInput
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleRangeChange('minPrice', e.target.value)}
          />
          <RangeLabel>—</RangeLabel>
          <RangeInput
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleRangeChange('maxPrice', e.target.value)}
          />
        </RangeInputGroup>
      </FilterGroup>

      <Divider />

      {/* Amenities */}
      <FilterGroup>
        <FilterTitle>Amenities</FilterTitle>
        {['WiFi', 'Kitchen', 'Bathroom', 'Parking', 'AC', 'Water', 'Generator'].map(amenity => (
          <FilterOption key={amenity}>
            <input
              type="checkbox"
              checked={filters.amenities.includes(amenity)}
              onChange={() => handleCheckboxChange('amenities', amenity)}
            />
            <span>{amenity}</span>
          </FilterOption>
        ))}
      </FilterGroup>

      <Divider />

      {/* Lease Type */}
      <FilterGroup>
        <FilterTitle>Lease Type</FilterTitle>
        {['Flexible', '6 Months', '12 Months'].map(type => (
          <FilterOption key={type}>
            <input
              type="checkbox"
              checked={filters.leaseType.includes(type)}
              onChange={() => handleCheckboxChange('leaseType', type)}
            />
            <span>{type}</span>
          </FilterOption>
        ))}
      </FilterGroup>

      <Divider />

      {/* Availability */}
      <FilterGroup>
        <FilterOption>
          <input
            type="checkbox"
            checked={filters.availability}
            onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.checked }))}
          />
          <span>Available Now</span>
        </FilterOption>
      </FilterGroup>

      <Divider />

      {/* Buttons */}
      <ButtonGroup>
        <Button onClick={handleResetFilters}>Reset</Button>
        <Button $primary onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </ButtonGroup>
    </FiltersContainer>
  )
}
