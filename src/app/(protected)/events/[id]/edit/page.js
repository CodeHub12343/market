'use client';

import { useEvent, useUpdateEvent } from '@/hooks/useEvents';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import EventForm from '@/components/events/EventForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  color: white;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const BackLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const LoadingContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 48px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const ErrorContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #dc2626;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { data: event, isLoading, error } = useEvent(params.id);
  const updateEvent = useUpdateEvent();

  const handleSubmit = async (eventData, bannerImage) => {
    try {
      await updateEvent.mutateAsync({
        id: params.id,
        eventData,
        bannerImage
      });
      
      // Redirect to event detail on success
      router.push(`/events/${params.id}`);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleCancel = () => {
    router.push(`/events/${params.id}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <Header>
            <Title>Edit Event</Title>
          </Header>
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer>
        <ContentWrapper>
          <Header>
            <Title>Edit Event</Title>
          </Header>
          <ErrorContainer>
            <h2>Event not found</h2>
            <p>{error?.message || 'The event you are trying to edit does not exist.'}</p>
            <BackLink href="/events">Back to Events</BackLink>
          </ErrorContainer>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <BackLink href={`/events/${params.id}`}>← Back to Event</BackLink>
          <Title>Edit Event</Title>
        </Header>

        {updateEvent.isPending && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}

        <EventForm
          initialEvent={event}
          onSubmit={handleSubmit}
          isLoading={updateEvent.isPending}
          error={updateEvent.isError ? updateEvent.error?.message : null}
          success={updateEvent.isSuccess ? 'Event updated successfully!' : null}
          onCancel={handleCancel}
        />
      </ContentWrapper>
    </PageContainer>
  );
}