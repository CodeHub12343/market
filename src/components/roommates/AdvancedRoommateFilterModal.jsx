'use client';

import styled from 'styled-components';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    max-width: 500px;
    max-height: 80vh;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ececec;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
  }

  option {
    background: #ffffff;
    color: #1a1a1a;
  }
`;

const RangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: #f9f9f9;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
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
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;

  input {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: ${props => props.primary ? '#1a1a1a' : '#f9f9f9'};
  color: ${props => props.primary ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.primary ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? '#333333' : '#f0f0f0'};
    border-color: ${props => props.primary ? '#333333' : '#d5d5d5'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function AdvancedRoommateFilterModal({ isOpen, onClose, onApplyFilters, initialFilters = {} }) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'lifestyleCompatibility') {
        const lifestyle = filters.lifestyleCompatibility || [];
        if (checked) {
          setFilters({
            ...filters,
            [name]: [...lifestyle, value]
          });
        } else {
          setFilters({
            ...filters,
            [name]: lifestyle.filter(item => item !== value)
          });
        }
      }
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Filter Roommates</Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        {/* Room Type */}
        <FilterSection>
          <FilterLabel htmlFor="roomType">Room Type</FilterLabel>
          <Select
            id="roomType"
            name="roomType"
            value={filters.roomType || ''}
            onChange={handleChange}
          >
            <option value="">All Room Types</option>
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="triple">Triple Room</option>
            <option value="shared">Shared Room</option>
            <option value="other">Other</option>
          </Select>
        </FilterSection>

        {/* Accommodation Type */}
        <FilterSection>
          <FilterLabel htmlFor="accommodation">Accommodation Type</FilterLabel>
          <Select
            id="accommodation"
            name="accommodation"
            value={filters.accommodation || ''}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="hostel">Hostel</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="lodge">Lodge</option>
            <option value="other">Other</option>
          </Select>
        </FilterSection>

        {/* Price Range */}
        <FilterSection>
          <FilterLabel>Price Range (NGN)</FilterLabel>
          <RangeContainer>
            <Input
              type="number"
              placeholder="Min Price"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleChange}
            />
            <Input
              type="number"
              placeholder="Max Price"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleChange}
            />
          </RangeContainer>
        </FilterSection>

        {/* Gender Preference */}
        <FilterSection>
          <FilterLabel htmlFor="genderPreference">Gender Preference</FilterLabel>
          <Select
            id="genderPreference"
            name="genderPreference"
            value={filters.genderPreference || ''}
            onChange={handleChange}
          >
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </Select>
        </FilterSection>

        {/* Lifestyle Compatibility */}
        <FilterSection>
          <FilterLabel>Lifestyle Compatibility</FilterLabel>
          <CheckboxGroup>
            {['clean', 'organized', 'social', 'quiet', 'night-owl', 'early-riser', 'pet-friendly', 'non-smoker'].map(
              lifestyle => (
                <CheckboxLabel key={lifestyle}>
                  <input
                    type="checkbox"
                    name="lifestyleCompatibility"
                    value={lifestyle}
                    checked={(filters.lifestyleCompatibility || []).includes(lifestyle)}
                    onChange={handleChange}
                  />
                  {lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1).replace('-', ' ')}
                </CheckboxLabel>
              )
            )}
          </CheckboxGroup>
        </FilterSection>

        {/* Amenities */}
        <FilterSection>
          <FilterLabel htmlFor="amenities">Required Amenities</FilterLabel>
          <Select
            id="amenities"
            name="amenities"
            value={filters.amenities || ''}
            onChange={handleChange}
          >
            <option value="">Any Amenities</option>
            <option value="WiFi">WiFi</option>
            <option value="AC">AC</option>
            <option value="Fan">Fan</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Balcony">Balcony</option>
            <option value="Wardrobe">Wardrobe</option>
            <option value="Study Desk">Study Desk</option>
            <option value="Parking">Parking</option>
            <option value="Laundry">Laundry</option>
            <option value="TV">TV</option>
            <option value="Hot Water">Hot Water</option>
            <option value="24/7 Power">24/7 Power</option>
            <option value="Generator">Generator</option>
          </Select>
        </FilterSection>

        {/* Buttons */}
        <ButtonGroup>
          <Button onClick={handleReset}>Reset</Button>
          <Button primary onClick={handleApply}>Apply Filters</Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
