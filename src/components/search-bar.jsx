"use client"

import styled from "styled-components"
import { Search, SlidersHorizontal, Mic } from "lucide-react"

// ===== SEARCH WRAPPER =====
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
`

// ===== SEARCH INPUT WRAPPER =====
const SearchInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 11px 14px;
  gap: 10px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  position: relative;

  @media (min-width: 768px) {
    padding: 12px 16px;
    border-radius: 14px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    padding: 12px 16px;
  }

  &:focus-within {
    background: #ffffff;
    border-color: #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`

// ===== SEARCH ICON =====
const SearchIcon = styled(Search)`
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
  }
`

// ===== INPUT FIELD =====
const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #1a1a1a;
  outline: none;
  padding: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }

  &::placeholder {
    color: #999;
    font-weight: 500;
  }
`

// ===== FILTER BUTTON =====
const FilterButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: #f5f5f5;
    border-color: #e5e5e5;
  }

  &:active {
    background: #f0f0f0;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 1024px) {
      width: 18px;
      height: 18px;
    }
  }
`

// ===== VOICE BUTTON =====
const VoiceButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: #f5f5f5;
    border-color: #e5e5e5;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;

    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 1024px) {
      width: 18px;
      height: 18px;
    }
  }
`

export function SearchBar() {
  return (
    <SearchWrapper>
      <SearchInputWrapper>
        <SearchIcon />
        <Input type="text" placeholder="Search products, services..." />
      </SearchInputWrapper>
      <VoiceButton aria-label="Voice search" title="Voice search">
        <Mic />
      </VoiceButton>
      <FilterButton aria-label="Filters" title="Filters">
        <SlidersHorizontal />
      </FilterButton>
    </SearchWrapper>
  )
}