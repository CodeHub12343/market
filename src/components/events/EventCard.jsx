'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { EventCardSkeleton } from '@/components/common/SkeletonLoaders';

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;

  @media (max-width: 640px) {
    border-radius: 12px;
  }

  &:hover {
    box-shadow: 0 20px 40px rgba(31, 41, 55, 0.15);
    transform: translateY(-8px);
    border-color: rgba(31, 41, 55, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 640px) {
    height: 180px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${CardContainer}:hover & img {
    transform: scale(1.08);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => {
    const categoryName = typeof props.category === 'string' 
      ? props.category.toLowerCase() 
      : props.category?.name?.toLowerCase();
    
    switch (categoryName) {
      case 'academic': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'social': return 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
      case 'sports': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'entertainment': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default: return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
    }
  }};
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    font-size: 10px;
    padding: 6px 12px;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ec4899;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
  }

  ${props => props.isFavorited && `
    background: white;
    color: #ec4899;
  `}

  svg {
    transition: all 0.3s ease;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
  }
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  @media (max-width: 640px) {
    padding: 16px;
    gap: 12px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
`;

const Title = styled(Link)`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
  transition: color 0.3s ease;
  flex: 1;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &:hover {
    -webkit-text-fill-color: unset;
    color: #1f2937;
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const AttendeeCount = styled.div`
  background: #1f2937;
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    gap: 10px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f1f3;
    color: #374151;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #1f2937;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    font-size: 12px;
    padding: 6px;
    gap: 6px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const MetaText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    padding: 16px;
    gap: 10px;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 80px;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: #1f2937;
    background: rgba(31, 41, 55, 0.05);
    color: #1f2937;
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 11px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ViewButton = styled(Link)`
  flex: 1;
  min-width: 100px;
  padding: 12px 16px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(31, 41, 55, 0.4);
    transform: translateY(-3px);
  }

  @media (max-width: 640px) {
    padding: 10px 14px;
    font-size: 11px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export default function EventCard({ event, isLoading = false }) {
  const [isFavorited, setIsFavorited] = useState(false);

  if (isLoading) {
    return <EventCardSkeleton />;
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const attendeeCount = event.attendees?.length || 0;

  return (
    <CardContainer>
      <ImageContainer>
        <EventImage>
          {event.bannerUrl ? (
            <OptimizedImage
              src={event.bannerUrl}
              alt={event.title}
              width={400}
              height={200}
              quality={75}
              objectFit="cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <OptimizedImage
              src="/placeholder-event.jpg"
              alt={event.title}
              width={400}
              height={200}
              quality={75}
              objectFit="cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </EventImage>
        <ImageOverlay />
        <CategoryBadge category={event.category}>
          {typeof event.category === 'string' ? event.category : event.category?.name || 'Event'}
        </CategoryBadge>
        <FavoriteButton
          isFavorited={isFavorited}
          onClick={() => setIsFavorited(!isFavorited)}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </FavoriteButton>
      </ImageContainer>

      <Content>
        <TitleRow>
          <Title href={`/events/${event._id}`}>{event.title}</Title>
          {attendeeCount > 0 && (
            <AttendeeCount>{attendeeCount}</AttendeeCount>
          )}
        </TitleRow>

        <MetaGrid>
          <MetaItem>
            <Calendar size={16} />
            <MetaText>{formattedDate}</MetaText>
          </MetaItem>
          <MetaItem>
            <Clock size={16} />
            <MetaText>{formattedTime}</MetaText>
          </MetaItem>
          <MetaItem>
            <MapPin size={16} />
            <MetaText>{event.location || 'TBA'}</MetaText>
          </MetaItem>
          <MetaItem>
            <Users size={16} />
            <MetaText>{event.capacity || 'Open'}</MetaText>
          </MetaItem>
        </MetaGrid>
      </Content>

      <ActionBar>
        <ActionButton onClick={() => alert('Share feature coming soon')}>
          <Heart size={16} />
          Like
        </ActionButton>
        <ViewButton href={`/events/${event._id}`}>
          View Event
          <ChevronRight size={16} />
        </ViewButton>
      </ActionBar>
    </CardContainer>
  );
}
