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

const RatingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const RatingRadio = styled.label`
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

const RangeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.2s ease;
  
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

const RATING_PRESETS = [
  { value: 'topRated', label: '⭐ 4.5+' },
  { value: 'highRated', label: '⭐ 4.0+' },
  { value: 'unrated', label: 'Unrated' },
];

export default function RatingFilter({ rating, minRating, maxRating, onChange }) {
  const [usePreset, setUsePreset] = React.useState(!!rating);

  const handlePresetChange = (e) => {
    setUsePreset(true);
    onChange({ target: { name: 'rating', value: e.target.value } });
  };

  const handleRangeChange = (e) => {
    setUsePreset(false);
    onChange(e);
  };

  return (
    <FilterSection>
      <Label>Rating</Label>
      
      <RatingGrid>
        {RATING_PRESETS.map(preset => (
          <RatingRadio 
            key={preset.value}
            $checked={rating === preset.value}
          >
            <input
              type="radio"
              name="rating"
              value={preset.value}
              checked={rating === preset.value}
              onChange={handlePresetChange}
            />
            {preset.label}
          </RatingRadio>
        ))}
        <RatingRadio $checked={rating === ''}>
          <input
            type="radio"
            name="rating"
            value=""
            checked={rating === ''}
            onChange={handlePresetChange}
          />
          All Ratings
        </RatingRadio>
      </RatingGrid>

      <RangeInputGroup>
        <div>
          <InputLabel>Min</InputLabel>
          <Input
            type="number"
            name="minRating"
            placeholder="0"
            min="0"
            max="5"
            step="0.1"
            value={minRating}
            onChange={handleRangeChange}
          />
        </div>
        <div>
          <InputLabel>Max</InputLabel>
          <Input
            type="number"
            name="maxRating"
            placeholder="5"
            min="0"
            max="5"
            step="0.1"
            value={maxRating}
            onChange={handleRangeChange}
          />
        </div>
      </RangeInputGroup>
    </FilterSection>
  );
}
