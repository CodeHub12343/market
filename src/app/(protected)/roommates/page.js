'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Sliders, X, MapPin, DollarSign } from 'lucide-react'
import { useRoommates } from '@/hooks/useRoommates'
import { useRoommateSearchSuggestions } from '@/hooks/useRoommateSearch'
import { useCampusFilter } from '@/hooks/useCampusFilter'
import { useRoommateCategories } from '@/hooks/useCategories'
import { RoommateGrid } from '@/components/roommates/RoommateGrid'
import { RoommateSearchBar } from '@/components/roommates/RoommateSearchBar'
import AdvancedRoommateFilterModal from '@/components/roommates/AdvancedRoommateFilterModal'
import CampusFilter from '@/components/common/CampusFilter'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'
import RoommateCardSkeleton from '@/components/loaders/RoommateCardSkeleton'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
`

const HeroSection = styled.div`
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 60px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`

const HeroContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const HeroSubtitle = styled.p`
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.95;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`

const SearchSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  margin-bottom: 32px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FilterButton = styled.button`
  padding: 14px 24px;
  background: white;
  border: 2px solid #000000;
  border-radius: 12px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #000000;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

const CreateButton = styled(Link)`
  padding: 14px 24px;
  background: #000000;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const ActiveFiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`

const FilterChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;

    &:hover {
      opacity: 0.8;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`

const ClearAllButton = styled.button`
  padding: 8px 14px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e5e5;
    color: #333;
  }
`

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

const ResultsInfo = styled.div`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
`

const EmptyDescription = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0 0 28px 0;
  line-height: 1.6;
`

const SuggestionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 2px solid #f0f0f0;
`

const SuggestionsTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0 12px 0;
`

const SuggestionItem = styled.button`
  padding: 16px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #000000;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(51, 51, 51, 0.05) 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .suggestion-title {
    font-size: 15px;
    color: #333;
    font-weight: 600;
    margin: 0;
  }

  .suggestion-location {
    font-size: 12px;
    color: #999;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
`

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 28px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`

export default function RoommatesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({})
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  // Campus filtering
  const campusFilter = useCampusFilter()

  // Fetch categories
  const { data: categories = [] } = useRoommateCategories()

  // Merge campus filter with other filters
  const enhancedFilters = {
    page,
    limit: 12,
    ...(searchQuery && { search: searchQuery }),
    ...filters,
    ...campusFilter.getFilterParams()
  }

  const { data, isLoading, error, refetch } = useRoommates(
    page,
    12,
    enhancedFilters
  )

  // Fetch suggestions when search query exists but results are empty
  const { data: suggestionsData = [] } = useRoommateSearchSuggestions(
    searchQuery,
    searchQuery.length >= 2 && (!data || data.length === 0)
  )
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData.suggestions || [])

  // Debug: Log filters and auth state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('📋 Roommates Page Filters:', {
        searchQuery,
        enhancedFilters,
        showAllCampuses: campusFilter.showAllCampuses,
        userCampus: campusFilter.userCampus,
        campusFilterParams: campusFilter.getFilterParams()
      });
    }
  }, [searchQuery, filters, campusFilter.showAllCampuses, campusFilter.selectedCampus])

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, filters])

  const handleSearch = (query) => {
    setSearchQuery(query)
    router.push(`/roommates?search=${query}`, { shallow: true })
  }

  const handleFilterChange = (newFilters) => {
    // Transform frontend filter names to match backend expectations
    const transformedFilters = {}

    // 1. Map roomType (remains as is)
    if (newFilters.roomType) {
      transformedFilters.roomType = newFilters.roomType
    }

    // 2. Map genderPreference (backend accepts both 'gender' and 'genderPreference')
    if (newFilters.genderPreference) {
      transformedFilters.genderPreference = newFilters.genderPreference
    }

    // 3. Map accommodation (remains as is)
    if (newFilters.accommodation) {
      transformedFilters.accommodation = newFilters.accommodation
    }

    // 4. Map price range (remains as is)
    if (newFilters.minPrice) {
      transformedFilters.minPrice = newFilters.minPrice
    }
    if (newFilters.maxPrice) {
      transformedFilters.maxPrice = newFilters.maxPrice
    }

    // 5. Map amenities (ensure it's array or comma-separated string)
    if (newFilters.amenities) {
      transformedFilters.amenities = newFilters.amenities
    }

    // 6. Map lifestyle compatibility (keep as array)
    if (newFilters.lifestyleCompatibility && Array.isArray(newFilters.lifestyleCompatibility) && newFilters.lifestyleCompatibility.length > 0) {
      transformedFilters.lifestyleCompatibility = newFilters.lifestyleCompatibility
    }

    // Remove empty values
    Object.keys(transformedFilters).forEach(key => {
      if (!transformedFilters[key]) {
        delete transformedFilters[key]
      }
    })

    setFilters(transformedFilters)
  }

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    setFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Your Perfect Roommate</HeroTitle>
          <HeroSubtitle>Connect with compatible roommates on campus</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentWrapper>
        {error && (
          <ErrorAlert
            message={error?.message || 'Failed to load roommate listings'}
            onRetry={() => refetch()}
          />
        )}

        <SearchSection>
          <RoommateSearchBar onSearch={handleSearch} />
          <FilterButton onClick={() => setShowAdvancedFilter(true)}>
            <Sliders size={20} /> Filters
          </FilterButton>
          <CreateButton href="/roommates/new">
            <Plus size={20} /> List Room
          </CreateButton>
        </SearchSection>

        {/* Campus Filter */}
       {/*  <div style={{ marginBottom: '24px' }}>
          <CampusFilter
            showAllCampuses={campusFilter.showAllCampuses}
            selectedCampus={campusFilter.selectedCampus}
            campusName={campusFilter.campusName}
            userCampus={campusFilter.userCampus}
            size="small"
            onToggleAllCampuses={campusFilter.toggleAllCampuses}
            onCampusChange={campusFilter.handleCampusChange}
          />
        </div> */}

        {hasActiveFilters && (
          <ActiveFiltersSection>
            {searchQuery && (
              <FilterChip>
                <Search size={14} />
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X />
                </button>
              </FilterChip>
            )}
            {Object.entries(filters).map(([key, value]) => (
              <FilterChip key={key}>
                {typeof value === 'object' ? value.join(', ') : value}
                <button onClick={() => handleRemoveFilter(key)}>
                  <X />
                </button>
              </FilterChip>
            ))}
            {hasActiveFilters && (
              <ClearAllButton onClick={handleClearAllFilters}>
                Clear All
              </ClearAllButton>
            )}
          </ActiveFiltersSection>
        )}

        {isLoading && !data ? (
          <SkeletonGrid>
            {[...Array(12)].map((_, i) => (
              <RoommateCardSkeleton key={`skeleton-${i}`} />
            ))}
          </SkeletonGrid>
        ) : data && Array.isArray(data) && data.length > 0 ? (
          <>
            <ResultsHeader>
              <ResultsInfo>
                🎯 {data.length} listing{data.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </ResultsInfo>
            </ResultsHeader>
            {isLoading ? (
              <SkeletonGrid>
                {[...Array(12)].map((_, i) => (
                  <RoommateCardSkeleton key={`skeleton-${i}`} />
                ))}
              </SkeletonGrid>
            ) : (
              <RoommateGrid
                roommates={data}
                isLoading={isLoading}
                error={error}
                onFavoriteChange={() => refetch()}
              />
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>🏠</EmptyIcon>
            <EmptyTitle>
              No roommate listings found
              {searchQuery && ` for "${searchQuery}"`}
            </EmptyTitle>
            <EmptyDescription>
              Try adjusting your search criteria or explore related listings below
            </EmptyDescription>

            {searchQuery && suggestions.length > 0 && (
              <>
                <SuggestionsTitle>Related Listings</SuggestionsTitle>
                <SuggestionsList>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={`suggestion-${index}`}
                      onClick={() => handleSearch(suggestion.title)}
                    >
                      <p className="suggestion-title">{suggestion.title}</p>
                      {suggestion.location && (
                        <p className="suggestion-location">
                          <MapPin size={12} /> {suggestion.location}
                        </p>
                      )}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              </>
            )}

            <CreateButton href="/roommates/new" style={{ marginTop: '32px' }}>
              <Plus size={20} /> Be the First to List
            </CreateButton>
          </EmptyState>
        )}
      </ContentWrapper>

      {/* Advanced Filter Modal */}
      <AdvancedRoommateFilterModal
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        onApplyFilters={handleFilterChange}
        initialFilters={filters}
        categories={categories}
      />
    </PageContainer>
  )
}
