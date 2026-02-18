'use client';

import React from 'react';
import styled from 'styled-components';
import { Mail, Verified } from 'lucide-react';

const SpeakersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;

const SpeakerCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const SpeakerImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: #e5e7eb;

  @media (min-width: 768px) {
    height: 180px;
  }
`;

const SpeakerImagePlaceholder = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 32px;

  @media (min-width: 768px) {
    height: 180px;
  }
`;

const SpeakerContent = styled.div`
  padding: 16px;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const SpeakerName = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const VerifiedBadge = styled(Verified)`
  width: 16px;
  height: 16px;
  color: #3b82f6;
  flex-shrink: 0;
`;

const SpeakerRole = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const SpeakerBio = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0 0 12px 0;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #666;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #1a1a1a;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 10px 14px;
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

const OrganizerSection = styled.div`
  background: #f0f7ff;
  border: 1px solid #cce5ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const OrganizerLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
`;

const OrganizerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const OrganizerImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e7eb;

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
  }
`;

const OrganizerImagePlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 22px;
  }
`;

const OrganizerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrganizerName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const OrganizerTitle = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const EventSpeakers = ({ organizer, speakers = [] }) => {
  // Default speakers for demo if none provided
  const defaultSpeakers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Keynote Speaker',
      bio: 'Industry expert with 15+ years of experience',
      email: 'sarah@example.com',
      verified: true
    },
    {
      id: 2,
      name: 'Prof. Ahmed Hassan',
      role: 'Panel Host',
      bio: 'Academic researcher and thought leader',
      email: 'ahmed@example.com',
      verified: true
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'Workshop Facilitator',
      bio: 'Practical skills trainer and consultant',
      email: 'james@example.com',
      verified: false
    }
  ];

  const speakersList = speakers && speakers.length > 0 ? speakers : defaultSpeakers;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  return (
    <>
      {/* Organizer Section */}
      {organizer && (
        <OrganizerSection>
          <OrganizerLabel>Event Organizer</OrganizerLabel>
          <OrganizerCard>
            {organizer.profileImage ? (
              <OrganizerImage src={organizer.profileImage} alt={organizer.name} />
            ) : (
              <OrganizerImagePlaceholder>{getInitials(organizer.name)}</OrganizerImagePlaceholder>
            )}
            <OrganizerInfo>
              <OrganizerName>
                {organizer.name}
                {organizer.verified && <VerifiedBadge />}
              </OrganizerName>
              <OrganizerTitle>{organizer.title || organizer.role || 'Event Organizer'}</OrganizerTitle>
            </OrganizerInfo>
            {organizer.email && (
              <ContactButton href={`mailto:${organizer.email}`} title={`Email ${organizer.name}`}>
                <Mail />
              </ContactButton>
            )}
          </OrganizerCard>
        </OrganizerSection>
      )}

      {/* Speakers Section */}
      {speakersList && speakersList.length > 0 && (
        <>
          <SpeakersGrid>
            {speakersList.map(speaker => (
              <SpeakerCard key={speaker.id || speaker._id}>
                {speaker.image ? (
                  <SpeakerImage src={speaker.image} alt={speaker.name} />
                ) : (
                  <SpeakerImagePlaceholder>{getInitials(speaker.name)}</SpeakerImagePlaceholder>
                )}
                <SpeakerContent>
                  <SpeakerName>
                    {speaker.name}
                    {speaker.verified && <VerifiedBadge />}
                  </SpeakerName>
                  <SpeakerRole>{speaker.role}</SpeakerRole>
                  {speaker.bio && <SpeakerBio>{speaker.bio}</SpeakerBio>}
                  {speaker.email && (
                    <ContactButton href={`mailto:${speaker.email}`} title={`Email ${speaker.name}`}>
                      <Mail />
                      Contact
                    </ContactButton>
                  )}
                </SpeakerContent>
              </SpeakerCard>
            ))}
          </SpeakersGrid>
        </>
      )}
    </>
  );
};

export default EventSpeakers;
