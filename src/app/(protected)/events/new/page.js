'use client';

import { useCreateEvent } from '@/hooks/useEvents';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import EventForm from '@/components/events/EventForm';
import { ChevronLeft } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 0;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  background: white;
  position: relative;
  
  @media (min-width: 768px) {
    max-width: 500px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;

  @media (min-width: 768px) {
    display: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;

  &:hover {
    background: #f5f5f5;
    border-radius: 6px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0 12px;
  flex: 1;
`;

const ContentWrapper = styled.div`
  padding: 24px 20px;

  @media (min-width: 768px) {
    padding: 32px 24px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;

  @media (min-width: 768px) {
    font-size: 28px;
    margin-bottom: 12px;
  }
`;

const SubTitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #999;
  margin: 0 0 24px 0;
  font-weight: 500;

  @media (min-width: 768px) {
    margin-bottom: 32px;
  }
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

export default function CreateEventPage() {
  const router = useRouter();
  const createEvent = useCreateEvent();

  const handleSubmit = async (eventData, bannerImage) => {
    try {
      await createEvent.mutateAsync({
        eventData,
        bannerImage
      });
      
      router.push('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleCancel = () => {
    router.push('/events');
  };

  return (
    <PageWrapper>
      <Container>
        <MobileHeader>
          <BackButton onClick={handleCancel}>
            <ChevronLeft size={24} />
          </BackButton>
          <HeaderTitle>New Event</HeaderTitle>
        </MobileHeader>

        <ContentWrapper>
          <Title>Create Event</Title>
          <SubTitle>Share your event with the community</SubTitle>

          {createEvent.isPending && (
            <LoadingOverlay>
              <div style={{ color: 'white' }}>Creating event...</div>
            </LoadingOverlay>
          )}

          <EventForm
            onSubmit={handleSubmit}
            isLoading={createEvent.isPending}
            error={createEvent.isError ? createEvent.error?.message : null}
            success={createEvent.isSuccess ? 'Event created successfully!' : null}
            onCancel={handleCancel}
          />
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}