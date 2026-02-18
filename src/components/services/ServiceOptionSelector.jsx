'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useServiceOptions } from '@/hooks/useServiceOptions';

const OptionsContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  margin-top: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

const OptionsTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f5f5f5;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const OptionCard = styled.div`
  padding: 12px;
  border: 2px solid ${props => props.$selected ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#f9f9f9' : '#ffffff'};
  position: relative;

  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    padding: 14px;
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const OptionName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  flex: 1;

  @media (min-width: 640px) {
    font-size: 15px;
  }
`;

const OptionPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const OptionDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const OptionDetails = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const DetailBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 4px;
`;

const SelectCheckmark = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.$selected ? '#1a1a1a' : 'transparent'};
  border: 2px solid ${props => props.$selected ? '#1a1a1a' : '#e5e5e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
`;

const NoOptions = styled.p`
  font-size: 14px;
  color: #999;
  text-align: center;
  padding: 20px;
  margin: 0;
`;

const SelectButton = styled.button`
  margin-top: 12px;
  padding: 10px 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 640px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

export default function ServiceOptionSelector({ serviceId, onOptionSelect, isLoading = false }) {
  const { data: options = [], isLoading: optionsLoading } = useServiceOptions(serviceId);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleSelectOption = (optionId) => {
    setSelectedOptionId(optionId);
    if (onOptionSelect) {
      const selected = options.find(opt => opt._id === optionId);
      onOptionSelect(selected);
    }
  };

  const handleConfirm = () => {
    if (selectedOptionId && onOptionSelect) {
      const selected = options.find(opt => opt._id === selectedOptionId);
      if (selected) {
        onOptionSelect(selected);
      }
    }
  };

  if (optionsLoading) {
    return (
      <OptionsContainer>
        <OptionsTitle>Service Options</OptionsTitle>
        <NoOptions>Loading options...</NoOptions>
      </OptionsContainer>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <OptionsContainer>
      <OptionsTitle>📦 Choose Your Package</OptionsTitle>
      <OptionsGrid>
        {options.map((option) => (
          <OptionCard
            key={option._id}
            $selected={selectedOptionId === option._id}
            onClick={() => handleSelectOption(option._id)}
          >
            <SelectCheckmark $selected={selectedOptionId === option._id}>
              {selectedOptionId === option._id && '✓'}
            </SelectCheckmark>
            <OptionHeader>
              <OptionName>{option.name}</OptionName>
              <OptionPrice>₦{option.price?.toLocaleString()}</OptionPrice>
            </OptionHeader>

            {option.description && (
              <OptionDescription>{option.description}</OptionDescription>
            )}

            <OptionDetails>
              {option.duration && (
                <DetailBadge title="Duration">
                  ⏱️ {option.duration} {option.durationUnit || 'hr'}
                </DetailBadge>
              )}
              {option.deliveryTime && (
                <DetailBadge title="Delivery">
                  📅 {option.deliveryTime}
                </DetailBadge>
              )}
              {option.revisions !== undefined && (
                <DetailBadge title="Revisions">
                  🔄 {option.revisions === -1 ? 'Unlimited' : option.revisions} revisions
                </DetailBadge>
              )}
            </OptionDetails>

            <SelectButton
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectOption(option._id)}
            >
              {selectedOptionId === option._id ? 'Selected' : 'Select'}
            </SelectButton>
          </OptionCard>
        ))}
      </OptionsGrid>
    </OptionsContainer>
  );
}
