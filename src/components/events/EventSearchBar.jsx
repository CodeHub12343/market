'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search, X, Clock,  TrendingUpDown} from 'lucide-react';
import { useEventSearchSuggestions, usePopularEventSearches, useSearchHistory, useSaveEventSearch, useDeleteSearchHistoryEntry } from '@/hooks/useEventSearch';

const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border: 2px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:focus-within {
    border-color: ${props => props.theme?.colors?.primary || '#6366f1'};
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  }
`;

const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: ${props => props.theme?.colors?.text || '#333'};

  &::placeholder {
    color: ${props => props.theme?.colors?.textSecondary || '#999'};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme?.colors?.text || '#333'};
  }
`;

const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 49;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-top: -1px;

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 16px 16px 0 0;
    max-height: 50vh;
  }
`;

const DropdownSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  }
`;

const SectionHeader = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: ${props => props.isActive ? props.theme?.colors?.primary || '#6366f1' : props.theme?.colors?.text || '#333'};
  background: ${props => props.isActive ? (props.theme?.colors?.primaryLight || '#f0f0ff') : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.15s ease;
  font-size: 14px;

  &:hover {
    background: ${props => props.theme?.colors?.primaryLight || '#f9f9f9'};
    color: ${props => props.theme?.colors?.primary || '#6366f1'};
  }

  &:active {
    background: ${props => props.theme?.colors?.primaryLight || '#f0f0ff'};
  }
`;

const ItemText = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemAction = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme?.colors?.text || '#333'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
  font-size: 14px;
`;

const EventSearchBar = ({
  value = '',
  onChange = () => {},
  onSearchSelect = () => {},
  placeholder = 'Search events...',
  showDropdown = false,
  onShowDropdown = () => {}
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { data: suggestions = [], isFetching: suggestionsLoading } = useEventSearchSuggestions(
    localValue,
    isDropdownVisible && localValue.length >= 2
  );

  const { data: popularSearches = [] } = usePopularEventSearches(isDropdownVisible);
  const { data: searchHistory = [] } = useSearchHistory(isDropdownVisible);

  const saveSearchMutation = useSaveEventSearch();
  const deleteHistoryMutation = useDeleteSearchHistoryEntry();

  // Combine all dropdown items
  const dropdownItems = [
    ...(localValue.length >= 2 ? suggestions : []),
    ...(!localValue && searchHistory.slice(0, 3) ? searchHistory.slice(0, 3) : []),
    ...(!localValue && popularSearches ? popularSearches.slice(0, 3) : [])
  ];

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
    setSelectedIndex(-1);
    setIsDropdownVisible(true);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setIsDropdownVisible(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectItem = (item) => {
    setLocalValue(item.name || item.query || item);
    onChange(item.name || item.query || item);
    setIsDropdownVisible(false);
    
    // Save to history (non-blocking)
    if (item.query) {
      saveSearchMutation.mutate(item.query);
    } else {
      saveSearchMutation.mutate(item.name || item);
    }

    // Trigger search
    onSearchSelect(item.name || item.query || item);
  };

  const handleDeleteHistory = (e, historyId) => {
    e.stopPropagation();
    deleteHistoryMutation.mutate(historyId);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownVisible || dropdownItems.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsDropdownVisible(false);
        if (localValue.trim()) {
          saveSearchMutation.mutate(localValue.trim());
          onSearchSelect(localValue.trim());
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < dropdownItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && dropdownItems[selectedIndex]) {
          handleSelectItem(dropdownItems[selectedIndex]);
        } else if (localValue.trim()) {
          setIsDropdownVisible(false);
          saveSearchMutation.mutate(localValue.trim());
          onSearchSelect(localValue.trim());
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownVisible(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentSearches = searchHistory.slice(0, 3);
  const topPopularSearches = popularSearches.slice(0, 3);

  return (
    <SearchBarContainer ref={containerRef}>
      <SearchInputWrapper>
        <SearchIcon />
        <SearchInput
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownVisible(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
        {localValue && (
          <ClearButton onClick={handleClear} title="Clear search">
            <X size={20} />
          </ClearButton>
        )}
      </SearchInputWrapper>

      {isDropdownVisible && (
        <>
          <DropdownOverlay onClick={() => setIsDropdownVisible(false)} />
          <DropdownContainer>
            {/* Suggestions Section */}
            {localValue.length >= 2 && suggestions.length > 0 && (
              <DropdownSection>
                <SectionHeader>
                  <Search size={14} />
                  Search Results
                </SectionHeader>
                {suggestions.map((item, index) => (
                  <DropdownItem
                    key={`suggestion-${index}`}
                    isActive={selectedIndex === index}
                    onClick={() => handleSelectItem(item)}
                  >
                    <ItemText>{item}</ItemText>
                  </DropdownItem>
                ))}
              </DropdownSection>
            )}

            {/* Recent Searches Section */}
            {!localValue && recentSearches.length > 0 && (
              <DropdownSection>
                <SectionHeader>
                  <Clock size={14} />
                  Recent Searches
                </SectionHeader>
                {recentSearches.map((item, index) => (
                  <DropdownItem
                    key={`history-${item.id}`}
                    isActive={selectedIndex === (suggestions.length + index)}
                    onClick={() => handleSelectItem(item)}
                  >
                    <ItemText>{item.query}</ItemText>
                    <ItemAction
                      onClick={(e) => handleDeleteHistory(e, item.id)}
                      title="Delete"
                    >
                      <X />
                    </ItemAction>
                  </DropdownItem>
                ))}
              </DropdownSection>
            )}

            {/* Trending Section */}
            {!localValue && topPopularSearches.length > 0 && (
              <DropdownSection>
                <SectionHeader>
                  <Trending size={14} />
                  Trending Now
                </SectionHeader>
                {topPopularSearches.map((item, index) => (
                  <DropdownItem
                    key={`popular-${index}`}
                    isActive={selectedIndex === (suggestions.length + recentSearches.length + index)}
                    onClick={() => handleSelectItem(item)}
                  >
                    <ItemText>{item}</ItemText>
                  </DropdownItem>
                ))}
              </DropdownSection>
            )}

            {/* Empty State */}
            {!suggestionsLoading && dropdownItems.length === 0 && (
              <EmptyState>
                {localValue.length >= 2 ? 'No results found' : 'Start typing to search events'}
              </EmptyState>
            )}
          </DropdownContainer>
        </>
      )}
    </SearchBarContainer>
  );
};

export default EventSearchBar;
