'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { X, Plus, Search } from 'lucide-react';
import { useTagSuggestions } from '@/hooks/useCategoryTag';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const TagsDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 44px;

  @media (min-width: 768px) {
    gap: 10px;
    padding: 14px;
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;

  @media (min-width: 768px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #3730a3;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    gap: 10px;
  }
`;

const SearchIcon = styled(Search)`
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #999;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-top: -1px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`;

const SuggestionItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f9fafb;
    color: #4f46e5;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 12px 14px;
    font-size: 15px;
  }
`;

const EmptyMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 13px;

  @media (min-width: 768px) {
    padding: 18px;
    font-size: 14px;
  }
`;

const MaxTagsWarning = styled.div`
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const EventTagPicker = ({
  selectedTags = [],
  onTagsChange = () => {},
  maxTags = 10,
  placeholder = 'Add tags...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const { data: suggestions = [] } = useTagSuggestions(
    inputValue,
    10,
    showSuggestions && inputValue.length >= 1
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag) => {
    const tagName = typeof tag === 'string' ? tag : tag.name;

    if (!selectedTags.includes(tagName) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tagName]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    tag => !selectedTags.includes(tag.name || tag)
  );

  const isMaxTagsReached = selectedTags.length >= maxTags;

  return (
    <Container ref={containerRef}>
      <Label>Event Tags</Label>

      <TagsDisplay>
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, index) => (
            <Tag key={index}>
              #{tag}
              <RemoveButton
                onClick={() => handleRemoveTag(tag)}
                type="button"
              >
                <X />
              </RemoveButton>
            </Tag>
          ))
        ) : (
          <div style={{ color: '#999', fontSize: '14px' }}>No tags added yet</div>
        )}
      </TagsDisplay>

      <InputWrapper>
        <InputContainer>
          <SearchIcon />
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={isMaxTagsReached ? 'Max tags reached' : placeholder}
            disabled={isMaxTagsReached}
          />
        </InputContainer>

        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <SuggestionsDropdown>
            {filteredSuggestions.map((tag, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleAddTag(tag)}
              >
                <span>#{tag.name || tag}</span>
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}

        {showSuggestions && inputValue && filteredSuggestions.length === 0 && (
          <SuggestionsDropdown>
            <SuggestionItem
              onClick={() => handleAddTag(inputValue.trim())}
              style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: '600' }}
            >
              <Plus size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Create tag "{inputValue}"
            </SuggestionItem>
          </SuggestionsDropdown>
        )}
      </InputWrapper>

      {isMaxTagsReached && (
        <MaxTagsWarning>
          Maximum {maxTags} tags allowed
        </MaxTagsWarning>
      )}
    </Container>
  );
};

export default EventTagPicker;
