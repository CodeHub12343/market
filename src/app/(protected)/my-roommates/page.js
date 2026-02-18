'use client'

import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { useMyRoommates, useDeleteRoommate } from '@/hooks/useRoommates'
import { RoommateGrid } from '@/components/roommates/RoommateGrid'
import LoadingSpinner from '@/components/common/LoadingSpinner'
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

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #2196f3;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const FilterTab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: ${props => (props.$active ? '#2196f3' : '#999')};
  font-weight: ${props => (props.$active ? '700' : '600')};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #2196f3;
  }

  border-bottom-color: ${props => (props.$active ? '#2196f3' : 'transparent')};
`

const ListingCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 16px;
  padding: 16px;
  align-items: center;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const ListingImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f0f0;

  @media (max-width: 768px) {
    height: 200px;
  }
`

const ListingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ListingTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`

const ListingMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const ListingStats = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #999;
`

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return '#e8f5e9'
      case 'draft':
        return '#f5f5f5'
      case 'expired':
        return '#ffebee'
      default:
        return '#f5f5f5'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#2e7d32'
      case 'draft':
        return '#666'
      case 'expired':
        return '#c62828'
      default:
        return '#666'
    }
  }};
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    grid-column: 1 / -1;
  }
`

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #666;
  }

  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }

  &.delete:hover {
    background: #ffebee;
    border-color: #ef5350;

    svg {
      color: #ef5350;
    }
  }
`

const ListingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

export default function MyRoommatesPage() {
  const [activeStatus, setActiveStatus] = useState('all')
  const { data, isLoading, error, refetch } = useMyRoommates()
  const { mutate: deleteRoommate, isPending: isDeleting } = useDeleteRoommate()

  const roommates = data?.roommates || []

  const filteredRoommates = roommates.filter(roommate => {
    if (activeStatus === 'all') return true
    return roommate.status === activeStatus
  })

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteRoommate(id, {
        onSuccess: () => {
          refetch()
        },
      })
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <Title>My Roommate Listings</Title>
          <CreateButton href="/roommates/new">
            <Plus /> Create New Listing
          </CreateButton>
        </Header>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header>
        <Title>My Roommate Listings</Title>
        <CreateButton href="/roommates/new">
          <Plus /> Create New Listing
        </CreateButton>
      </Header>

      {error && (
        <ErrorAlert
          message={error?.message || 'Failed to load your listings'}
          onRetry={() => refetch()}
        />
      )}

      {roommates.length > 0 && (
        <FilterTabs>
          <FilterTab
            $active={activeStatus === 'all'}
            onClick={() => setActiveStatus('all')}
          >
            All ({roommates.length})
          </FilterTab>
          <FilterTab
            $active={activeStatus === 'active'}
            onClick={() => setActiveStatus('active')}
          >
            Active ({roommates.filter(r => r.status === 'active').length})
          </FilterTab>
          <FilterTab
            $active={activeStatus === 'draft'}
            onClick={() => setActiveStatus('draft')}
          >
            Draft ({roommates.filter(r => r.status === 'draft').length})
          </FilterTab>
          <FilterTab
            $active={activeStatus === 'expired'}
            onClick={() => setActiveStatus('expired')}
          >
            Expired ({roommates.filter(r => r.status === 'expired').length})
          </FilterTab>
        </FilterTabs>
      )}

      {filteredRoommates.length > 0 ? (
        <ListingsContainer>
          {filteredRoommates.map(roommate => (
            <ListingCard key={roommate._id}>
              <ListingImage
                src={roommate.images?.[0] || '/default-avatar.svg'}
                alt={roommate.title}
              />
              <ListingInfo>
                <ListingTitle>{roommate.title}</ListingTitle>
                <ListingMeta>
                  <span>📍 {roommate.location}</span>
                  <span>₦{roommate.rent?.toLocaleString()}/mo</span>
                  <span>🏠 {roommate.roomType}</span>
                </ListingMeta>
                <ListingStats>
                  <span>
                    {roommate.applicationCount || 0} applications
                  </span>
                  <span>•</span>
                  <span>
                    ⭐ {roommate.rating || 'No'} reviews
                  </span>
                  <span>•</span>
                  <StatusBadge $status={roommate.status || 'draft'}>
                    {roommate.status?.charAt(0).toUpperCase() + roommate.status?.slice(1) || 'Draft'}
                  </StatusBadge>
                </ListingStats>
              </ListingInfo>
              <Actions>
                <ActionButton
                  as={Link}
                  href={`/roommates/${roommate._id}/edit`}
                  title="Edit listing"
                >
                  <Edit />
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(roommate._id)}
                  disabled={isDeleting}
                  title="Delete listing"
                >
                  <Trash2 />
                </ActionButton>
              </Actions>
            </ListingCard>
          ))}
        </ListingsContainer>
      ) : (
        <EmptyState>
          <EmptyIcon>🏠</EmptyIcon>
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
            {roommates.length === 0
              ? "You haven't created any listings yet"
              : 'No listings in this category'}
          </h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            {roommates.length === 0
              ? 'Start by creating your first roommate listing'
              : 'Try a different filter or create a new listing'}
          </p>
          {roommates.length === 0 && (
            <CreateButton href="/roommates/new" style={{ marginTop: '16px' }}>
              <Plus /> Create Your First Listing
            </CreateButton>
          )}
        </EmptyState>
      )}
    </PageContainer>
  )
}
