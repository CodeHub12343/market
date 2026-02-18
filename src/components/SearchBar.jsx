'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Clock, Trash2, TrendingUp } from 'lucide-react';
import {
  useSearchSuggestions,
  usePopularSearches,
  useSearchHistory,
  useLocalSearch,
} from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  svg {
    color: #999;
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 14px;
  outline: none;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
`;

const SuggestionsHeader = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9f9f9;
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }

  .type-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    background: #e0e7ff;
    color: #3730a3;
    flex-shrink: 0;
  }
`;

const HistoryItem = styled(SuggestionItem)`
  justify-content: space-between;
`;

const DeleteHistoryButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #e53935;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 16px;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

export default function SearchBar({ onSearch, onAdvancedSearch, placeholder = 'Search products...' }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const containerRef = useRef(null);

  const {
    query: historyQuery,
    addToHistory,
    removeFromHistory,
    clearHistory,
    history,
  } = useLocalSearch();

  // Only fetch suggestions if query is long enough
  const { data: suggestions = [] } = useSearchSuggestions(localQuery);
  const { data: popularSearches = [] } = usePopularSearches(10);
  const { data: searchHistory = [] } = useSearchHistory(5);

  // Determine what to show
  const shouldShowSuggestions = localQuery.length >= 2;
  const displaySuggestions = shouldShowSuggestions ? suggestions : [];
  const displayHistory = !localQuery && history.length > 0 ? history : [];
  const displayPopular = !localQuery && displayHistory.length === 0 ? popularSearches : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery = localQuery) => {
    if (!searchQuery.trim()) return;

    // Add to history
    addToHistory(searchQuery, {});

    // Call parent onSearch
    onSearch?.(searchQuery);
    setIsOpen(false);
    setLocalQuery('');
  };

  const handleSuggestionClick = (suggestion) => {
    const query = suggestion.text || suggestion;
    setLocalQuery(query);
    handleSearch(query);
  };

  const handleHistoryClick = (historyItem) => {
    setLocalQuery(historyItem.query);
    handleSearch(historyItem.query);
  };

  const handleDeleteHistory = (e, entryId) => {
    e.stopPropagation();
    removeFromHistory(entryId);
  };

  const handleClearAllHistory = () => {
    clearHistory();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container ref={containerRef}>
      <SearchInputWrapper>
        <Search />
        <SearchInput
          placeholder={placeholder}
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyPress={handleKeyPress}
        />
      </SearchInputWrapper>

      {isOpen && (
        <SuggestionsDropdown>
          {/* Suggestions */}
          {displaySuggestions.length > 0 && (
            <>
              <SuggestionsHeader>Suggestions</SuggestionsHeader>
              {displaySuggestions.map((suggestion, idx) => (
                <SuggestionItem
                  key={`suggestion-${idx}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Search />
                  <span>{suggestion.text}</span>
                  {suggestion.type && (
                    <span className="type-badge">{suggestion.type}</span>
                  )}
                </SuggestionItem>
              ))}
            </>
          )}

          {/* Search History */}
          {displayHistory.length > 0 && (
            <>
              <SuggestionsHeader>Recent Searches</SuggestionsHeader>
              {displayHistory.map((item) => (
                <HistoryItem
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Clock />
                    <span>{item.query}</span>
                  </div>
                  <DeleteHistoryButton
                    onClick={(e) => handleDeleteHistory(e, item.id)}
                    title="Delete from history"
                  >
                    <Trash2 />
                  </DeleteHistoryButton>
                </HistoryItem>
              ))}
              {displayHistory.length > 0 && (
                <ActionButton onClick={handleClearAllHistory}>
                  Clear History
                </ActionButton>
              )}
            </>
          )}

          {/* Popular Searches */}
          {displayPopular.length > 0 && !shouldShowSuggestions && (
            <>
              <SuggestionsHeader>Trending Now</SuggestionsHeader>
              {displayPopular.map((search, idx) => (
                <SuggestionItem
                  key={`popular-${idx}`}
                  onClick={() => handleSuggestionClick(search)}
                >
                  <TrendingUp />
                  <span>{search.text || search}</span>
                </SuggestionItem>
              ))}
            </>
          )}

          {/* Empty State */}
          {displaySuggestions.length === 0 &&
            displayHistory.length === 0 &&
            displayPopular.length === 0 &&
            shouldShowSuggestions && (
              <EmptyState>
                No results found for "{localQuery}"
              </EmptyState>
            )}

          {/* Advanced Search Button */}
          {!shouldShowSuggestions && (
            <ActionButton onClick={() => onAdvancedSearch?.()} style={{ borderTop: '1px solid #f0f0f0' }}>
              Open Advanced Search
            </ActionButton>
          )}
        </SuggestionsDropdown>
      )}
    </Container>
  );
}
