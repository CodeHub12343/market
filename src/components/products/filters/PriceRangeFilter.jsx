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

const PriceInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.05);
  }
`;

const InputLabel = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
`;

export default function PriceRangeFilter({ minPrice, maxPrice, onChange }) {
  return (
    <FilterSection>
      <Label>Price Range</Label>
      <PriceInputGroup>
        <div>
          <InputLabel>Min (₦)</InputLabel>
          <Input
            type="number"
            name="minPrice"
            placeholder="0"
            value={minPrice}
            onChange={onChange}
            min="0"
          />
        </div>
        <div>
          <InputLabel>Max (₦)</InputLabel>
          <Input
            type="number"
            name="maxPrice"
            placeholder="999999"
            value={maxPrice}
            onChange={onChange}
            min="0"
          />
        </div>
      </PriceInputGroup>
    </FilterSection>
  );
}
