'use client'

import styled from 'styled-components'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRoommateSearchSuggestions, useRoommateSearchHistory, usePopularRoommateSearches, useSaveRoommateSearch } from '@/hooks/useRoommateSearch'

const Container = styled.div`
  position: relative;
  width: 100%;
`

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f9f9f9;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
    background: #ffffff;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #666;
    flex-shrink: 0;
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;

  &::placeholder {
    color: #999;
  }
`

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
  border-radius: 50%;

  &:hover {
    background: #f0f0f0;
    color: #1a1a1a;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

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
`

const Section = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`

const SectionHeader = styled.div`
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #fafafa;
`

const Item = styled.div`
  padding: 12px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #f0f0f0;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    flex-shrink: 0;
  }
`

const ItemText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ItemMain = styled.div`
  color: #1a1a1a;
  font-weight: 500;
`

const ItemMeta = styled.div`
  font-size: 12px;
  color: #999;
`

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
    color: #1a1a1a;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const EmptyState = styled.div`
  padding: 20px 14px;
  text-align: center;
  color: #999;
  font-size: 13px;
`

export function RoommateSearchBar({ onSearch, onSuggestionSelect }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchInputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Fetch suggestions (min 2 chars)
  const { data: suggestionsData = [], isLoading: suggestionsLoading } = useRoommateSearchSuggestions(
    query,
    query.length >= 2
  )
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData.suggestions || [])

  // Log suggestions state
  useEffect(() => {
    console.log('🔍 SearchBar Suggestions State:', {
      query,
      suggestionsLoading,
      suggestionsDataRaw: suggestionsData,
      suggestionsProcessed: suggestions,
      suggestionCount: suggestions.length
    })
  }, [query, suggestions, suggestionsData, suggestionsLoading])

  // Fetch history
  const { data: historyData = [] } = useRoommateSearchHistory(true)
  const history = Array.isArray(historyData) ? historyData : (historyData.history || [])

  // Fetch popular searches
  const { data: popularData = [] } = usePopularRoommateSearches(true)
  const popular = Array.isArray(popularData) ? popularData : (popularData.popular || [])

  // Save search callback
  const saveSearchMutation = useSaveRoommateSearch()
  const saveSearch = saveSearchMutation?.mutate || (() => {
    console.warn('⚠️ saveSearch is not ready yet')
  })

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const allItems = [
    ...suggestions,
    ...history.slice(0, 3),
    ...popular.slice(0, 3)
  ]

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          const item = allItems[selectedIndex]
          const searchQuery = item.query || item.title || item
          setQuery(searchQuery)
          if (saveSearch) saveSearch(searchQuery)
          onSearch(searchQuery)
          setShowDropdown(false)
          setSelectedIndex(-1)
          searchInputRef.current?.blur()
        } else if (query.trim()) {
          if (saveSearch) saveSearch(query)
          onSearch(query)
          setShowDropdown(false)
          searchInputRef.current?.blur()
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
      default:
        break
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    console.log('✏️ Input changed:', { oldQuery: query, newQuery: value, length: value.length })
    setQuery(value)
    setSelectedIndex(-1)
    setShowDropdown(true)
  }

  const handleClear = () => {
    setQuery('')
    setSelectedIndex(-1)
    onSearch('')
    searchInputRef.current?.focus()
  }

  const handleItemClick = (item) => {
    const searchQuery = item.query || item.title || item
    setQuery(searchQuery)
    if (saveSearch) saveSearch(searchQuery)
    onSuggestionSelect?.(searchQuery)
    onSearch(searchQuery)
    setShowDropdown(false)
    searchInputRef.current?.blur()
  }

  const handleDeleteHistory = (e, historyId) => {
    e.stopPropagation()
    // TODO: Implement deleteSearchHistoryEntry hook
  }

  return (
    <Container ref={searchInputRef} onFocus={() => setShowDropdown(true)}>
      <SearchInputWrapper>
        <Search />
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder="Search roommate listings..."
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
                <ItemMain>{item.title || item.location || item}</ItemMain>
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
                <DeleteButton onClick={(e) => handleDeleteHistory(e, item._id)}>
                  <X />
                </DeleteButton>
              </Item>
            ))}
          </Section>
        )}

        {/* Popular */}
        {popular.length > 0 && !query && (
          <Section>
            <SectionHeader>Trending Now</SectionHeader>
            {popular.slice(0, 3).map((item, index) => (
              <Item
                key={`popular-${index}`}
                className={selectedIndex === suggestions.length + history.length + index ? 'active' : ''}
                onClick={() => handleItemClick(item)}
              >
                <TrendingUp />
                <ItemText>
                  <ItemMain>{item.query || item.title || item}</ItemMain>
                  {item.count && <ItemMeta>{item.count} searches</ItemMeta>}
                </ItemText>
              </Item>
            ))}
          </Section>
        )}

        {/* Empty States */}
        {query.length >= 2 && suggestions.length === 0 && (
          <EmptyState>No roommate listings found for "{query}"</EmptyState>
        )}
        {!query && history.length === 0 && popular.length === 0 && (
          <EmptyState>Start typing to search for roommate listings</EmptyState>
        )}
      </Dropdown>
    </Container>
  )
}
