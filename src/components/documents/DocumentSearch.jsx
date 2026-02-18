'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useSearchDocuments } from '@/hooks/useDocuments';
import DocumentGrid from './DocumentGrid';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const SearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const SearchInputWrapper = styled.form`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }

  &:active {
    border-color: #1a1a1a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: row;

    button {
      flex: 1;
    }
  }
`;

const Button = styled.button`
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const ClearButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #1a1a1a;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const ResultsCount = styled.span`
  font-weight: 700;
  font-size: 16px;
`;

const ResultsText = styled.span`
  opacity: 0.9;
`;

export default function DocumentSearch() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [filters, setFilters] = useState({});

  const { data: results = [], isLoading, error } = useSearchDocuments(
    searchedQuery,
    filters,
    !!searchedQuery
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchedQuery(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchedQuery('');
    setFilters({});
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchInputWrapper onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search documents by title, description, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ButtonGroup>
            <SearchButton
              type="submit"
              disabled={!query.trim() || isLoading}
            >
              🔍 Search
            </SearchButton>
            {searchedQuery && (
              <ClearButton onClick={handleClear}>
                ✕ Clear
              </ClearButton>
            )}
          </ButtonGroup>
        </SearchInputWrapper>

        {searchedQuery && (
          <ResultsInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ResultsCount>{results.length}</ResultsCount>
              <ResultsText>results found for &quot;{searchedQuery}&quot;</ResultsText>
            </div>
          </ResultsInfo>
        )}
      </SearchHeader>

      {searchedQuery && (
        <DocumentGrid
          documents={results}
          isLoading={isLoading}
          error={error}
        />
      )}
    </SearchContainer>
  );
}
