'use client';

import React from 'react';
import styled from 'styled-components';
import { TrendingUp, Calendar, Users, MapPin, ChevronRight, Star } from 'lucide-react';
import { useTrendingEvents } from '@/hooks/useEventRecommendations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 24px;
    height: 24px;
    color: #10b981;
  }
`;

const ViewAllLink = styled(Link)`
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    gap: 8px;
    color: #4f46e5;
  }
`;

const EventsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;

  &:hover {
    border-color: #10b981;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
    transform: translateY(-4px);
  }
`;

const TrendingBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EventImage = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  flex: 1;
`;

const EventTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #10b981;
    flex-shrink: 0;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-weight: 600;

  svg {
    width: 16px;
    height: 16px;
    fill: #10b981;
  }
`;

const Category = styled.span`
  display: inline-block;
  background: #d1fae5;
  color: #047857;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  max-width: fit-content;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
  background: #f9f9f9;
  border-radius: 12px;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const TrendingEventsList = ({ limit = 6, showViewAll = true }) => {
  const { data: events = [], isLoading } = useTrendingEvents(limit);

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>
            <TrendingUp />
            Trending Now
          </Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <TrendingUp />
          Trending Now
        </Title>
        {showViewAll && events.length > 0 && (
          <ViewAllLink href="/events">
            View All
            <ChevronRight size={16} />
          </ViewAllLink>
        )}
      </Header>

      {events.length === 0 ? (
        <EmptyState>
          No trending events at the moment. Check back soon!
        </EmptyState>
      ) : (
        <EventsList>
          {events.map(event => (
            <EventCard key={event._id} href={`/events/${event._id}`}>
              <TrendingBadge>
                <TrendingUp size={14} />
                Trending
              </TrendingBadge>
              <EventImage>
                {event.thumbnail && <img src={event.thumbnail} alt={event.title} />}
              </EventImage>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventMeta>
                  <MetaItem>
                    <Calendar size={16} />
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </MetaItem>
                  {event.location && (
                    <MetaItem>
                      <MapPin size={16} />
                      {event.location}
                    </MetaItem>
                  )}
                  {event.attendeeCount && (
                    <MetaItem>
                      <Users size={16} />
                      {event.attendeeCount} joining
                    </MetaItem>
                  )}
                  {event.rating && (
                    <Rating>
                      <Star size={14} />
                      {event.rating.toFixed(1)} ({event.reviewCount || 0} reviews)
                    </Rating>
                  )}
                </EventMeta>
                {event.category && <Category>{event.category}</Category>}
              </EventContent>
            </EventCard>
          ))}
        </EventsList>
      )}
    </Container>
  );
};

export default TrendingEventsList;
