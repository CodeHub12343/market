'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import {
  useHostelSearchSuggestions,
  useSearchHistory,
  usePopularHostelSearches,
  useSaveHostelSearch,
} from '@/hooks/useHostelSearch';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #999;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 0 10px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 10px 0;
    font-size: 13px;
  }
`;

const ClearButton = styled.button`
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
    color: #1a1a1a;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
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
  gap: 10px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: #f5f5f5;
    border-left-color: #1a1a1a;
  }

  &.active {
    background: #f5f5f5;
    border-left-color: #1a1a1a;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const ItemText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemMain = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const EmptyState = styled.div`
  padding: 20px 14px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

export default function HostelSearchBar({
  onSearch,
  onSuggestionSelect,
  placeholder = 'Search hostels...',
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch suggestions (min 2 chars)
  const { data: suggestionsData = [], isLoading: suggestionsLoading } =
    useHostelSearchSuggestions(query, query.length >= 2);
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData.suggestions || []);

  // Fetch history
  const { data: historyData = [], isLoading: historyLoading } = useSearchHistory(true);
  const history = Array.isArray(historyData) ? historyData : (historyData.history || []);

  // Fetch popular searches
  const { data: popularData = [], isLoading: popularLoading } = usePopularHostelSearches(true);
  const popular = Array.isArray(popularData) ? popularData : (popularData.popular || []);

  // Save search callback
  const saveSearchMutation = useSaveHostelSearch();
  const saveSearch = saveSearchMutation?.mutate || (() => {
    console.warn('⚠️ saveSearch is not ready yet');
  });

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
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
          if (saveSearch) saveSearch(searchQuery);
          onSearch(searchQuery);
          setShowDropdown(false);
          setSelectedIndex(-1);
          searchInputRef.current?.blur();
        } else if (query.trim()) {
          if (saveSearch) saveSearch(query);
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
    if (saveSearch) saveSearch(searchQuery);
    onSuggestionSelect?.(searchQuery);
    onSearch(searchQuery);
    setShowDropdown(false);
    searchInputRef.current?.blur();
  };

  return (
    <SearchContainer ref={searchInputRef}>
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
        />
        {query && <ClearButton onClick={handleClear}><X /></ClearButton>}
      </SearchInputWrapper>

      <Dropdown ref={dropdownRef} isOpen={showDropdown}>
        {/* Suggestions */}
        {query.length >= 2 && suggestions.length > 0 && (
          <Section>
            <SectionHeader>Suggestions</SectionHeader>
            {suggestions.map((item, index) => (
              <Item
                key={`suggestion-${index}`}
                className={selectedIndex === index ? 'active' : ''}
                onClick={() => handleItemClick(item)}
              >
                <Search />
                <ItemText>
                  <ItemMain>{item.title || item.name || item}</ItemMain>
                  {item.location && <ItemMeta>{item.location}</ItemMeta>}
                  {item.price && <ItemMeta>₦{item.price?.toLocaleString()}</ItemMeta>}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {/* History */}
        {history.length > 0 && !query && (
          <Section>
            <SectionHeader>Recent Searches</SectionHeader>
            {history.slice(0, 3).map((item, index) => (
              <Item
                key={`history-${index}`}
                className={selectedIndex === suggestions.length + index ? 'active' : ''}
                onClick={() => handleItemClick(item)}
              >
                <Clock />
                <ItemText>
                  <ItemMain>{item.query || item}</ItemMain>
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {/* Popular Searches */}
        {popular.length > 0 && !query && (
          <Section>
            <SectionHeader>Popular Searches</SectionHeader>
            {popular.slice(0, 3).map((item, index) => (
              <Item
                key={`popular-${index}`}
                className={selectedIndex === suggestions.length + history.length + index ? 'active' : ''}
                onClick={() => handleItemClick(item)}
              >
                <Trending2 />
                <ItemText>
                  <ItemMain>{item.query || item.title || item}</ItemMain>
                  {item.count && <ItemMeta>{item.count} searches</ItemMeta>}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {/* Empty States */}
        {query.length >= 2 && suggestionsLoading && (
          <EmptyState>Loading suggestions...</EmptyState>
        )}
        {query.length >= 2 && !suggestionsLoading && suggestions.length === 0 && (
          <EmptyState>No hostels found for "{query}"</EmptyState>
        )}
        {!query && history.length === 0 && popular.length === 0 && (
          <EmptyState>Start typing to search for hostels</EmptyState>
        )}
      </Dropdown>
    </SearchContainer>
  );
}
