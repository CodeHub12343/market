'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Clock, Users, MapPin, Award, ChevronDown, ChevronUp } from 'lucide-react';

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const SessionBlock = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SessionHeader = styled.button`
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  @media (min-width: 768px) {
    padding: 18px;
    gap: 14px;
  }
`;

const SessionIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 18px;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const SessionTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const SessionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #666;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f0f0f0;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SessionContent = styled.div`
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 0 18px 18px 18px;
    gap: 16px;
  }
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #4f46e5;

  @media (min-width: 768px) {
    padding: 14px;
    gap: 14px;
  }
`;

const ActivityTime = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  min-width: 60px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    font-size: 13px;
    min-width: 70px;
  }
`;

const ActivityDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const ActivityName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ActivityDesc = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const SpeakerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SpeakerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;

  svg {
    width: 14px;
    height: 14px;
    color: #4f46e5;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const SectionLabel = styled.h5`
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 8px 0 0 0;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
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

const SessionBreakdown = ({ sessions = [], eventDuration }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!sessions || sessions.length === 0) {
    return <EmptyState>No session information available</EmptyState>;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <BreakdownContainer>
      {sessions.map((session, index) => {
        const isExpanded = expandedIndex === index;
        const durationMinutes = session.duration || 120;

        return (
          <SessionBlock key={index}>
            <SessionHeader
              onClick={() => toggleExpand(index)}
              type="button"
            >
              <SessionIndicator>
                {index + 1}
              </SessionIndicator>

              <SessionInfo>
                <SessionTitle>
                  {session.name || `Session ${index + 1}`}
                </SessionTitle>
                <SessionMeta>
                  {session.startTime && (
                    <MetaItem>
                      <Clock />
                      {session.startTime}
                    </MetaItem>
                  )}
                  {durationMinutes && (
                    <MetaItem>
                      <Clock />
                      {durationMinutes} min
                    </MetaItem>
                  )}
                  {session.location && (
                    <MetaItem>
                      <MapPin />
                      {session.location}
                    </MetaItem>
                  )}
                  {session.speakers && session.speakers.length > 0 && (
                    <MetaItem>
                      <Users />
                      {session.speakers.length} speaker
                      {session.speakers.length > 1 ? 's' : ''}
                    </MetaItem>
                  )}
                </SessionMeta>
              </SessionInfo>

              <ExpandIcon>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </ExpandIcon>
            </SessionHeader>

            {isExpanded && (
              <SessionContent>
                {/* Description */}
                {session.description && (
                  <div>
                    <SectionLabel>About this session</SectionLabel>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '8px 0 0 0',
                      lineHeight: '1.6'
                    }}>
                      {session.description}
                    </p>
                  </div>
                )}

                {/* Activities/Agenda */}
                {session.activities && session.activities.length > 0 && (
                  <div>
                    <SectionLabel>Activities</SectionLabel>
                    <ActivitiesGrid>
                      {session.activities.map((activity, actIndex) => (
                        <ActivityItem key={actIndex}>
                          <ActivityTime>
                            {activity.time || activity.startTime}
                          </ActivityTime>
                          <ActivityDetails>
                            <ActivityName>
                              {activity.name || activity.title}
                            </ActivityName>
                            {activity.description && (
                              <ActivityDesc>
                                {activity.description}
                              </ActivityDesc>
                            )}
                          </ActivityDetails>
                        </ActivityItem>
                      ))}
                    </ActivitiesGrid>
                  </div>
                )}

                {/* Speakers */}
                {session.speakers && session.speakers.length > 0 && (
                  <div>
                    <SectionLabel>Speakers</SectionLabel>
                    <SpeakerList>
                      {session.speakers.map((speaker, speakerIndex) => (
                        <SpeakerItem key={speakerIndex}>
                          <Award />
                          <span>
                            {speaker.name || speaker.fullName}
                            {speaker.title && ` - ${speaker.title}`}
                          </span>
                        </SpeakerItem>
                      ))}
                    </SpeakerList>
                  </div>
                )}

                {/* Location Details */}
                {session.venueDetails && (
                  <div>
                    <SectionLabel>Venue</SectionLabel>
                    <p style={{
                      fontSize: '13px',
                      color: '#666',
                      margin: '8px 0 0 0',
                      lineHeight: '1.5'
                    }}>
                      {session.venueDetails}
                    </p>
                  </div>
                )}
              </SessionContent>
            )}
          </SessionBlock>
        );
      })}
    </BreakdownContainer>
  );
};

export default SessionBreakdown;
