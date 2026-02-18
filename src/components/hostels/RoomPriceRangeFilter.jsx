'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e5e5eb;
  border-radius: 10px;
  font-size: 13px;
  color: #1a1a1a;
  background: #ffffff;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 14px;
  }
`;

const InputLabel = styled.span`
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 11px;
  color: #999;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const RangeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
`;

const RangeValue = styled.span`
  font-weight: 700;
  color: #1a1a1a;
`;

const RangeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e5eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #000;
      box-shadow: 0 2px 8px rgba(26, 26, 26, 0.3);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #000;
      box-shadow: 0 2px 8px rgba(26, 26, 26, 0.3);
    }
  }

  @media (min-width: 768px) {
    &::-webkit-slider-thumb {
      width: 20px;
      height: 20px;
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
    }
  }
`;

export default function RoomPriceRangeFilter({
  minPrice = null,
  maxPrice = null,
  onPriceChange,
  label = 'Price Range (₦)',
  minConstraint = 0,
  maxConstraint = 500000
}) {
  const [localMin, setLocalMin] = useState(minPrice || minConstraint);
  const [localMax, setLocalMax] = useState(maxPrice || maxConstraint);

  useEffect(() => {
    setLocalMin(minPrice || minConstraint);
  }, [minPrice, minConstraint]);

  useEffect(() => {
    setLocalMax(maxPrice || maxConstraint);
  }, [maxPrice, maxConstraint]);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      onPriceChange({ min: value, max: localMax });
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      onPriceChange({ min: localMin, max: value });
    }
  };

  const handleMinInput = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : minConstraint;
    if (value <= localMax) {
      setLocalMin(value);
      onPriceChange({ min: value, max: localMax });
    }
  };

  const handleMaxInput = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : maxConstraint;
    if (value >= localMin) {
      setLocalMax(value);
      onPriceChange({ min: localMin, max: value });
    }
  };

  return (
    <Container>
      <Label>{label}</Label>

      <InputGroup>
        <InputWrapper>
          <InputLabel>Min</InputLabel>
          <Input
            type="number"
            value={localMin}
            onChange={handleMinInput}
            onBlur={handleMinInput}
            placeholder="Minimum"
            min={minConstraint}
            max={localMax}
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Max</InputLabel>
          <Input
            type="number"
            value={localMax}
            onChange={handleMaxInput}
            onBlur={handleMaxInput}
            placeholder="Maximum"
            min={localMin}
            max={maxConstraint}
          />
        </InputWrapper>
      </InputGroup>

      <RangeSlider
        type="range"
        min={minConstraint}
        max={maxConstraint}
        value={localMin}
        onChange={handleMinChange}
        step={1000}
      />
      <RangeSlider
        type="range"
        min={minConstraint}
        max={maxConstraint}
        value={localMax}
        onChange={handleMaxChange}
        step={1000}
      />

      <RangeDisplay>
        <span>
          ₦<RangeValue>{localMin.toLocaleString()}</RangeValue>
        </span>
        <span>to</span>
        <span>
          ₦<RangeValue>{localMax.toLocaleString()}</RangeValue>
        </span>
      </RangeDisplay>
    </Container>
  );
}
