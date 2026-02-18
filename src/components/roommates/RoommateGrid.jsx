'use client'

import styled from 'styled-components'
import { RoommateCard } from './RoommateCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  grid-column: 1 / -1;
`

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  gap: 16px;
`

const EmptyIcon = styled.div`
  font-size: 48px;
`

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`

const EmptyText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
  max-width: 400px;
`

export function RoommateGrid({
  roommates = [],
  isLoading = false,
  error = null,
  onFavoriteChange
}) {
  if (isLoading) {
    return (
      <Grid>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Grid>
    )
  }

  if (error) {
    return (
      <EmptyState>
        <EmptyIcon>⚠️</EmptyIcon>
        <EmptyTitle>Failed to load roommate listings</EmptyTitle>
        <EmptyText>Please try refreshing the page or check your connection</EmptyText>
      </EmptyState>
    )
  }

  if (!roommates || roommates.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>🏠</EmptyIcon>
        <EmptyTitle>No roommate listings found</EmptyTitle>
        <EmptyText>
          Try adjusting your filters or search criteria to find available roommates
        </EmptyText>
      </EmptyState>
    )
  }

  return (
    <Grid>
      {roommates.map((roommate) => (
        <RoommateCard
          key={roommate._id}
          roommate={roommate}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </Grid>
  )
}
