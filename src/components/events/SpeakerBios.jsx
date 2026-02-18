'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Verified, ChevronDown, ChevronUp, Globe } from 'lucide-react';

const BiosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const BioCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const BioHeader = styled.button`
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: flex-start;
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

const SpeakerPhoto = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const PhotoPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 24px;
  }
`;

const BioHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const SpeakerName = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const SpeakerTitle = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const BioContent = styled.div`
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 0 18px 18px 18px;
    gap: 14px;
  }
`;

const BioText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #4f46e5;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #e5e7eb;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
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

const SpeakerBios = ({ speakers = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!speakers || speakers.length === 0) {
    return <EmptyState>No speakers information available</EmptyState>;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <BiosContainer>
      {speakers.map((speaker, index) => {
        const isExpanded = expandedIndex === index;
        const initials = (speaker.name || speaker.fullName || '')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();

        return (
          <BioCard key={index}>
            <BioHeader
              onClick={() => toggleExpand(index)}
              type="button"
            >
              {speaker.photo || speaker.image ? (
                <SpeakerPhoto
                  src={speaker.photo || speaker.image}
                  alt={speaker.name || speaker.fullName}
                />
              ) : (
                <PhotoPlaceholder>
                  {initials.slice(0, 2)}
                </PhotoPlaceholder>
              )}

              <BioHeaderContent>
                <SpeakerName>
                  {speaker.name || speaker.fullName}
                  {speaker.verified && <Verified size={16} color="#4f46e5" />}
                </SpeakerName>
                {(speaker.title || speaker.role) && (
                  <SpeakerTitle>
                    {speaker.title || speaker.role}
                  </SpeakerTitle>
                )}
              </BioHeaderContent>

              <ExpandIcon>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </ExpandIcon>
            </BioHeader>

            {isExpanded && (
              <BioContent>
                {(speaker.bio || speaker.biography || speaker.description) && (
                  <BioText>
                    {speaker.bio || speaker.biography || speaker.description}
                  </BioText>
                )}

                {(speaker.email || speaker.website || speaker.social) && (
                  <ContactInfo>
                    {speaker.email && (
                      <ContactLink href={`mailto:${speaker.email}`}>
                        <Mail />
                        {speaker.email}
                      </ContactLink>
                    )}
                    {speaker.website && (
                      <ContactLink
                        href={speaker.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe />
                        {speaker.website.replace(/^https?:\/\//, '')}
                      </ContactLink>
                    )}
                    {speaker.social && typeof speaker.social === 'object' && (
                      <>
                        {speaker.social.twitter && (
                          <ContactLink
                            href={`https://twitter.com/${speaker.social.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Twitter: @{speaker.social.twitter}
                          </ContactLink>
                        )}
                        {speaker.social.linkedin && (
                          <ContactLink
                            href={speaker.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            LinkedIn Profile
                          </ContactLink>
                        )}
                      </>
                    )}
                  </ContactInfo>
                )}
              </BioContent>
            )}
          </BioCard>
        );
      })}
    </BiosContainer>
  );
};

export default SpeakerBios;
