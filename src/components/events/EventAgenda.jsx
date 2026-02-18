'use client';

import React from 'react';
import styled from 'styled-components';
import { Clock, MapPin, Download } from 'lucide-react';
import PDFDownloadButton from './PDFDownloadButton';

const AgendaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const AgendaItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-left: 3px solid #e5e7eb;
  background: #fafafa;
  transition: all 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  &:hover {
    background: #f5f5f5;
    border-left-color: #4f46e5;
  }

  @media (min-width: 768px) {
    padding: 18px;
    gap: 18px;
  }
`;

const TimeBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
  flex-shrink: 0;
`;

const TimeLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TimeValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ActivityTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ActivityDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  margin-top: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 48px 24px;
  }
`;

const EventAgenda = ({ agenda, eventDate, eventData, eventId }) => {
  // If no agenda provided, show a default schedule
  const defaultAgenda = [
    {
      time: '09:00 AM',
      activity: 'Registration & Welcome',
      description: 'Check-in and light refreshments',
      location: 'Main Hall'
    },
    {
      time: '09:30 AM',
      activity: 'Opening Remarks',
      description: 'Introduction to the event and agenda',
      location: 'Main Hall'
    },
    {
      time: '10:00 AM',
      activity: 'Main Session',
      description: 'Key presentations and discussions',
      location: 'Main Hall'
    },
    {
      time: '11:30 AM',
      activity: 'Break',
      description: 'Networking and refreshments',
      location: 'Lounge'
    },
    {
      time: '12:00 PM',
      activity: 'Closing & Networking',
      description: 'Final remarks and informal networking',
      location: 'Main Hall'
    }
  ];

  const agendaItems = agenda && agenda.length > 0 ? agenda : defaultAgenda;

  if (!agendaItems || agendaItems.length === 0) {
    return <EmptyState>No schedule information available</EmptyState>;
  }

  const pdfData = eventData || {
    agenda: agendaItems,
    date: eventDate
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div />
        {eventData && (
          <PDFDownloadButton
            eventId={eventId}
            eventData={pdfData}
            label="Download Agenda"
          />
        )}
      </div>
      <AgendaContainer>
        {agendaItems.map((item, index) => (
          <AgendaItem key={index}>
            <TimeBlock>
              <TimeLabel>Time</TimeLabel>
              <TimeValue>{item.time || item.startTime}</TimeValue>
            </TimeBlock>
            <ContentBlock>
              <ActivityTitle>{item.activity || item.title}</ActivityTitle>
              {(item.description || item.content) && (
                <ActivityDescription>{item.description || item.content}</ActivityDescription>
              )}
              {(item.location || item.venue) && (
                <LocationInfo>
                  <MapPin />
                  {item.location || item.venue}
                </LocationInfo>
              )}
            </ContentBlock>
          </AgendaItem>
        ))}
      </AgendaContainer>
    </div>
  );
};

export default EventAgenda;
