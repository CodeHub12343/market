'use client'

import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, AlertCircle } from 'lucide-react'
import { useFavorites } from '@/hooks/useRoommates'
import { RoommateGrid } from '@/components/roommates/RoommateGrid'
import { RoommateSearchBar } from '@/components/roommates/RoommateSearchBar'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: 768px) {
    padding: 32px 24px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Icon = styled.div`
  font-size: 32px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
`

const Count = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #ffe0e6;
  color: #d32f2f;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 8px;
`

const SearchWrapper = styled.div`
  margin-bottom: 32px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`

const EmptyTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
`

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #999;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`

const BrowseButton = styled(Link)`
  display: inline-block;
  margin-top: 24px;
  padding: 12px 20px;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
`

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

const FilterChip = styled.button`
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2196f3;
    color: #2196f3;
  }

  &.active {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
  }
`

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;

  strong {
    color: #2196f3;
    font-weight: 700;
  }
`

export default function RoommateFavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPrice, setFilterPrice] = useState('all')
  const { data, isLoading, error, refetch } = useFavorites()

  const favorites = data?.favorites || []

  const filteredFavorites = favorites.filter(room => {
    const matchesSearch =
      !searchQuery ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrice =
      filterPrice === 'all' ||
      (filterPrice === 'budget' && room.rent < 50000) ||
      (filterPrice === 'mid' && room.rent >= 50000 && room.rent < 100000) ||
      (filterPrice === 'premium' && room.rent >= 100000)

    return matchesSearch && matchesPrice
  })

  const suggestions = [
    'Downtown Apartment',
    'University Campus',
    'Business District',
    'Residential Area',
  ]

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <TitleSection>
            <Icon>❤️</Icon>
            <div>
              <Title>My Favorites</Title>
            </div>
          </TitleSection>
        </Header>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <TitleSection>
          <Icon>❤️</Icon>
          <div>
            <Title>My Favorites</Title>
            <Subtitle>Bookmarked roommate listings</Subtitle>
          </div>
        </TitleSection>
        <Count>{favorites.length} saved</Count>
      </Header>

      {error && (
        <ErrorAlert
          message={error?.message || 'Failed to load favorites'}
          onRetry={() => refetch()}
        />
      )}

      {favorites.length > 0 ? (
        <>
          <SearchWrapper>
            <RoommateSearchBar
              onSearch={setSearchQuery}
              suggestions={suggestions}
            />
          </SearchWrapper>

          <FilterSection>
            <FilterChip
              className={filterPrice === 'all' ? 'active' : ''}
              onClick={() => setFilterPrice('all')}
            >
              All Prices
            </FilterChip>
            <FilterChip
              className={filterPrice === 'budget' ? 'active' : ''}
              onClick={() => setFilterPrice('budget')}
            >
              Under ₦50k
            </FilterChip>
            <FilterChip
              className={filterPrice === 'mid' ? 'active' : ''}
              onClick={() => setFilterPrice('mid')}
            >
              ₦50k - ₦100k
            </FilterChip>
            <FilterChip
              className={filterPrice === 'premium' ? 'active' : ''}
              onClick={() => setFilterPrice('premium')}
            >
              ₦100k+
            </FilterChip>
          </FilterSection>

          <StatsBar>
            <StatItem>
              <strong>{filteredFavorites.length}</strong> listings
            </StatItem>
            <StatItem>
              Average price: <strong>
                ₦{Math.round(
                  filteredFavorites.reduce((sum, r) => sum + r.rent, 0) /
                    filteredFavorites.length
                ).toLocaleString()}
              </strong>
            </StatItem>
            <StatItem>
              Average rating: <strong>
                {(
                  filteredFavorites.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  filteredFavorites.length
                ).toFixed(1)}
              </strong>
            </StatItem>
          </StatsBar>

          {filteredFavorites.length > 0 ? (
            <RoommateGrid
              roommates={filteredFavorites}
              isLoading={isLoading}
              error={error}
              onFavoriteChange={() => refetch()}
            />
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>No matching favorites</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or price filters
              </EmptyDescription>
            </EmptyState>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>💔</EmptyIcon>
          <EmptyTitle>No saved favorites yet</EmptyTitle>
          <EmptyDescription>
            Start saving your favorite roommate listings! Like listings while browsing to save
            them here for later.
          </EmptyDescription>
          <BrowseButton href="/roommates">
            Browse Listings
          </BrowseButton>
        </EmptyState>
      )}
    </PageContainer>
  )
}
