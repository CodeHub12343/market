'use client';

import { useEvent, useDeleteEvent, useJoinEvent, useLeaveEvent, useToggleFavoriteEvent } from '@/hooks/useEvents';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import { EventDetailSkeleton } from '@/components/common/SkeletonLoaders';
import Link from 'next/link';
import EventComments from '@/components/events/EventComments';
import EventShareDropdown from '@/components/events/EventShareDropdown';
import { ChevronLeft, Heart, MapPin, Calendar, Clock, Users, Share2, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 40px;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 0 32px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1f2937;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (min-width: 768px) {
    max-width: 400px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #ec4899;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MainContent = styled.div`
  padding-top: 80px;
  max-width: 900px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

  @media (min-width: 768px) {
    height: 380px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    height: 420px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4));
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${props => {
    switch (props.category) {
      case 'academic': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'social': return 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
      case 'sports': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'entertainment': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: scale(1.1);
    color: #ec4899;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: 32px 28px;
    margin-bottom: 24px;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 16px;
  }
`;

const Description = styled.p`
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
  font-size: 15px;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetaIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #1f2937;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MetaLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const LocationSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  border: 1px solid rgba(31, 41, 55, 0.1);
  margin-bottom: 28px;

  @media (min-width: 768px) {
    margin-bottom: 32px;
  }
`;

const LocationIcon = styled.div`
  width: 44px;
  height: 44px;
  background: #1f2937;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const LocationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LocationLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LocationText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px 0;

  @media (min-width: 768px) {
    gap: 16px;
    padding: 24px 0;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 14px 24px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(31, 41, 55, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(31, 41, 55, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    padding: 16px 28px;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 14px 24px;
  background: white;
  color: #1f2937;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: #1f2937;
    background: #f3f4f6;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    padding: 16px 28px;
  }
`;

const DangerButton = styled(SecondaryButton)`
  color: #ef4444;
  border-color: #fee2e2;

  &:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const CommentsSection = styled.div`
  margin-top: 32px;
`;

const ErrorContainer = styled(ContentCard)`
  text-align: center;

  h2 {
    color: #ef4444;
    font-size: 24px;
    margin-bottom: 12px;
  }

  p {
    color: #6b7280;
  }
`;

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const eventId = params?.id;
  const { data: event, isLoading, error } = useEvent(eventId);
  const [isFavorited, setIsFavorited] = useState(false);
  const deleteEvent = useDeleteEvent();
  const joinEvent = useJoinEvent();
  const leaveEvent = useLeaveEvent();

  if (isLoading) {
    return (
      <PageWrapper>
        <Header>
          <HeaderLeft>
            <BackButton onClick={() => router.back()}>
              <ChevronLeft size={24} />
            </BackButton>
            <HeaderTitle>Loading...</HeaderTitle>
          </HeaderLeft>
        </Header>
        <MainContent>
          <EventDetailSkeleton />
        </MainContent>
      </PageWrapper>
    );
  }

  if (error || !event) {
    return (
      <PageWrapper>
        <Header>
          <HeaderLeft>
            <BackButton onClick={() => router.back()}>
              <ChevronLeft size={24} />
            </BackButton>
            <HeaderTitle>Error</HeaderTitle>
          </HeaderLeft>
        </Header>
        <MainContent>
          <ErrorContainer>
            <h2>Event Not Found</h2>
            <p>{error?.message || 'The event you are looking for does not exist.'}</p>
          </ErrorContainer>
        </MainContent>
      </PageWrapper>
    );
  }

  const isOwner = user?._id === event.createdBy?._id;
  const isAttending = event.attendees?.includes(user?._id);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent.mutateAsync(eventId);
        router.push('/events');
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const handleJoinLeave = async () => {
    try {
      if (isAttending) {
        await leaveEvent.mutateAsync(eventId);
      } else {
        await joinEvent.mutateAsync(eventId);
      }
    } catch (err) {
      alert(`Failed to ${isAttending ? 'leave' : 'join'} event`);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ChevronLeft size={24} />
          </BackButton>
          <HeaderTitle>{event.title}</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <IconButton onClick={() => setIsFavorited(!isFavorited)} title="Add to favorites">
            <Heart fill={isFavorited ? 'currentColor' : 'none'} />
          </IconButton>
        </HeaderRight>
      </Header>

      <MainContent>
        {/* Hero Section */}
        <HeroSection>
          {event.bannerUrl ? (
            <>
              <HeroImage src={event.bannerUrl} alt={event.title} />
              <HeroOverlay />
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }} />
          )}
          <CategoryBadge category={event.category}>
            {typeof event.category === 'object' && event.category?.name ? event.category.name : 'Event'}
          </CategoryBadge>
          <FavoriteButton
            onClick={() => setIsFavorited(!isFavorited)}
            title="Add to favorites"
          >
            <Heart fill={isFavorited ? 'currentColor' : 'none'} />
          </FavoriteButton>
        </HeroSection>

        {/* Main Content Card */}
        <ContentCard>
          <TitleSection>
            <Title>{event.title}</Title>
            {event.description && <Description>{event.description}</Description>}
          </TitleSection>

          {/* Meta Information */}
          <MetaGrid>
            <MetaItem>
              <MetaIcon>
                <Calendar />
              </MetaIcon>
              <MetaLabel>Date</MetaLabel>
              <MetaValue>{formattedDate}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <Clock />
              </MetaIcon>
              <MetaLabel>Time</MetaLabel>
              <MetaValue>{formattedTime}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <Users />
              </MetaIcon>
              <MetaLabel>Attendees</MetaLabel>
              <MetaValue>
                {event.attendees?.length || 0}
                {event.capacity && `/${event.capacity}`}
              </MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <MapPin />
              </MetaIcon>
              <MetaLabel>Location</MetaLabel>
              <MetaValue>{event.location ? 'View' : 'TBA'}</MetaValue>
            </MetaItem>
          </MetaGrid>

          {/* Location Detail */}
          {event.location && (
            <LocationSection>
              <LocationIcon>
                <MapPin />
              </LocationIcon>
              <LocationContent>
                <LocationLabel>Location</LocationLabel>
                <LocationText>{event.location}</LocationText>
              </LocationContent>
            </LocationSection>
          )}

          {/* Action Buttons */}
          <ActionBar>
            <PrimaryButton onClick={handleJoinLeave}>
              {isAttending ? (
                <>
                  <Users size={18} />
                  Leave Event
                </>
              ) : (
                <>
                  <Users size={18} />
                  Join Event
                </>
              )}
            </PrimaryButton>

            <SecondaryButton asChild>
              <EventShareDropdown event={event} />
            </SecondaryButton>

            {isOwner && (
              <>
                <SecondaryButton onClick={() => router.push(`/events/${eventId}/edit`)}>
                  <Edit2 size={18} />
                  Edit
                </SecondaryButton>
                <DangerButton onClick={handleDelete}>
                  <Trash2 size={18} />
                  Delete
                </DangerButton>
              </>
            )}
          </ActionBar>
        </ContentCard>

        {/* Comments Section */}
        {eventId && (
          <CommentsSection>
            <EventComments eventId={eventId} />
          </CommentsSection>
        )}
      </MainContent>
    </PageWrapper>
  );
}
