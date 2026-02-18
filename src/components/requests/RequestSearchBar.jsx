'use client';

import styled from 'styled-components';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRequestSearchSuggestions, useRequestSearchHistory, usePopularRequestSearches, useSaveRequestSearch } from '@/hooks/useRequestSearch';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-width: 200px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 14px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #1f2937;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.05);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #666;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 12px;
  font-size: 14px;
  color: #1f2937;
  font-family: inherit;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ClearButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #1f2937;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
  display: ${props => props.isOpen ? 'block' : 'none'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
`;

const Section = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const SectionHeader = styled.div`
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #fafafa;
`;

const Item = styled.div`
  padding: 12px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1f2937;
  font-size: 14px;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f0f0f0' : 'transparent'};

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    flex-shrink: 0;
  }
`;

const ItemText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemMain = styled.div`
  color: #1f2937;
  font-weight: 500;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  color: #999;
`;

const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #e5e5e5;
    color: #1f2937;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  padding: 20px 14px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

export default function RequestSearchBar({
  onSearch,
  onSuggestionSelect,
  placeholder = 'Search requests...'
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch suggestions (min 2 chars)
  const { data: suggestionsData = [], isLoading: suggestionsLoading } = useRequestSearchSuggestions(
    query,
    query.length >= 2
  );
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData.suggestions || []);

  // Fetch history
  const { data: historyData = [], isLoading: historyLoading } = useRequestSearchHistory(true);
  const history = Array.isArray(historyData) ? historyData : (historyData.history || []);

  // Fetch popular searches
  const { data: popularData = [], isLoading: popularLoading } = usePopularRequestSearches(true);
  const popular = Array.isArray(popularData) ? popularData : (popularData.popular || []);

  // Save search callback
  const saveSearchMutation = useSaveRequestSearch();
  const saveSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      saveSearchMutation.mutate(searchQuery);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const allItems = [
    ...suggestions,
    ...history.slice(0, 3),
    ...popular.slice(0, 3)
  ];

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          const item = allItems[selectedIndex];
          const searchQuery = item.query || item.title || item;
          setQuery(searchQuery);
          saveSearch(searchQuery);
          onSearch(searchQuery);
          setShowDropdown(false);
          setSelectedIndex(-1);
          searchInputRef.current?.blur();
        } else if (query.trim()) {
          saveSearch(query);
          onSearch(query);
          setShowDropdown(false);
          searchInputRef.current?.blur();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowDropdown(true);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleItemClick = (item) => {
    const searchQuery = item.query || item.title || item;
    setQuery(searchQuery);
    saveSearch(searchQuery);
    onSuggestionSelect?.(searchQuery);
    onSearch(searchQuery);
    setShowDropdown(false);
    searchInputRef.current?.blur();
  };

  return (
    <SearchContainer ref={dropdownRef}>
      <SearchInputWrapper>
        <Search />
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          aria-label="Search requests"
        />
        {query && (
          <ClearButton onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </ClearButton>
        )}
      </SearchInputWrapper>

      <Dropdown isOpen={showDropdown}>
        {query.length >= 2 && suggestions.length > 0 && (
          <Section>
            <SectionHeader>Suggestions</SectionHeader>
            {suggestions.map((item, idx) => (
              <Item
                key={`suggestion-${idx}`}
                onClick={() => handleItemClick(item)}
                selected={selectedIndex === idx}
              >
                <Search size={16} />
                <ItemText>
                  <ItemMain>{item.title || item.query || item}</ItemMain>
                  {item.count && <ItemMeta>{item.count} matches</ItemMeta>}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {history.length > 0 && (!query || query.length < 2) && (
          <Section>
            <SectionHeader>Recent Searches</SectionHeader>
            {history.slice(0, 5).map((item, idx) => (
              <Item
                key={`history-${idx}`}
                onClick={() => handleItemClick(item)}
                selected={selectedIndex === suggestions.length + idx}
              >
                <Clock size={16} />
                <ItemText>
                  <ItemMain>{item.query || item.title || item}</ItemMain>
                  {item.timestamp && (
                    <ItemMeta>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </ItemMeta>
                  )}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {popular.length > 0 && (!query || query.length < 2) && (
          <Section>
            <SectionHeader>Popular Searches</SectionHeader>
            {popular.slice(0, 5).map((item, idx) => (
              <Item
                key={`popular-${idx}`}
                onClick={() => handleItemClick(item)}
                selected={selectedIndex === suggestions.length + history.length + idx}
              >
                <TrendingUp size={16} />
                <ItemText>
                  <ItemMain>{item.query || item.title || item}</ItemMain>
                  {item.searchCount && (
                    <ItemMeta>{item.searchCount} searches</ItemMeta>
                  )}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {showDropdown && (
          query.length < 2 && 
          suggestions.length === 0 && 
          history.length === 0 && 
          popular.length === 0
        ) && (
          <EmptyState>
            {query ? 'No suggestions found' : 'Start typing to search requests'}
          </EmptyState>
        )}
      </Dropdown>
    </SearchContainer>
  );
}
