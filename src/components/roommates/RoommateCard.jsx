'use client'

import styled from 'styled-components'
import { Heart, MapPin, Users, Home, Star, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToggleRoommateFavorite } from '@/hooks/useRoommateFavorites'

const Card = styled(Link)`
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 768px) {
    border-radius: 16px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: #e5e5e5;

    .favorite-btn {
      opacity: 1;
    }
  }
`

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f5f5f5;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: scale(1.1);
    background: #ffffff;
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$isFavorite ? '#e53935' : '#999'};
    fill: ${props => props.$isFavorite ? '#e53935' : 'none'};
  }
`

const BadgeContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`

const Badge = styled.span`
  background: ${props => {
    switch (props.$type) {
      case 'available': return '#e8f5e9';
      case 'featured': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'available': return '#2e7d32';
      case 'featured': return '#e65100';
      default: return '#666';
    }
  }};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`

const Content = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;

  @media (min-width: 768px) {
    padding: 16px;
  }
`

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
  font-weight: 500;

  svg {
    width: 14px;
    height: 14px;
  }
`

const Details = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
`

const Price = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
`

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }
`

export function RoommateCard({ roommate, onFavoriteChange }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const { mutate: toggleFavorite } = useToggleRoommateFavorite()

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      toggleFavorite({ roommateId: roommate._id, isFavorited })
      setIsFavorited(!isFavorited)
      onFavoriteChange?.(roommate._id, !isFavorited)
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  return (
    <Card href={`/roommates/${roommate._id}`}>
      <ImageContainer>
        <img
          src={roommate.images?.[0] || '/default-avatar.svg'}
          alt={roommate.title}
        />
        <BadgeContainer>
          {roommate.isAvailable && <Badge $type="available">Available</Badge>}
          {roommate.isFeatured && <Badge $type="featured">Featured</Badge>}
        </BadgeContainer>
        <FavoriteButton
          className="favorite-btn"
          $isFavorite={isFavorited}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          <Heart />
        </FavoriteButton>
      </ImageContainer>

      <Content>
        <Title>{roommate.title}</Title>

        <Location>
          <MapPin />
          {roommate.location?.address || 'Location not specified'}
        </Location>

        <Details>
          <DetailItem>
            <Home />
            {roommate.roomType || 'Room'}
          </DetailItem>
          <DetailItem>
            <Users />
            {roommate.numberOfRooms || 1} room(s)
          </DetailItem>
        </Details>

        <Price>
          ₦{roommate.budget?.minPrice?.toLocaleString() || '0'}/month
        </Price>
      </Content>
    </Card>
  )
}
