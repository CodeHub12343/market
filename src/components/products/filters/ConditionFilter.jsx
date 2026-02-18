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

const ConditionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const ConditionRadio = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    border-color: #1a1a1a;
    background: #fff;
  }
  
  input[type="radio"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #1a1a1a;
  }
  
  ${(props) => props.$checked && `
    border-color: #1a1a1a;
    background: #1a1a1a;
    color: #fff;
  `}
`;

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

export default function ConditionFilter({ condition, onChange }) {
  return (
    <FilterSection>
      <Label>Condition</Label>
      <ConditionGrid>
        {CONDITION_OPTIONS.map(option => (
          <ConditionRadio 
            key={option.value}
            $checked={condition === option.value}
          >
            <input
              type="radio"
              name="condition"
              value={option.value}
              checked={condition === option.value}
              onChange={onChange}
            />
            {option.label}
          </ConditionRadio>
        ))}
      </ConditionGrid>
      <ConditionRadio $checked={condition === ''}>
        <input
          type="radio"
          name="condition"
          value=""
          checked={condition === ''}
          onChange={onChange}
        />
        All Conditions
      </ConditionRadio>
    </FilterSection>
  );
}
