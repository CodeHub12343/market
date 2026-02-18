'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { useEventHighlights } from '@/hooks/useEventMedia';

const HighlightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    gap: 28px;
  }
`;

const HighlightCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const HighlightMedia = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HighlightImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoPlayButton = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: #000;

  svg {
    width: 32px;
    height: 32px;
    margin-left: 4px;
  }
`;

const HighlightContent = styled.div`
  padding: 20px;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const HighlightTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const HighlightDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 20px;
  }
`;

const HighlightStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 20px;
    margin-top: 20px;
    padding-top: 20px;
  }
`;

const StatItem = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    color: #999;
  }

  &:hover {
    color: #4f46e5;

    svg {
      color: #4f46e5;
    }
  }

  ${props => props.liked && `
    color: #ef4444;

    svg {
      fill: #ef4444;
      color: #ef4444;
    }
  `}

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;

  @media (min-width: 768px) {
    gap: 10px;
    margin-top: 16px;
  }
`;

const Tag = styled.span`
  background: #f3f4f6;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 15px;

  @media (min-width: 768px) {
    padding: 80px 24px;
    font-size: 16px;
  }
`;

const Banner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;

    @media (min-width: 768px) {
      font-size: 20px;
      margin-bottom: 10px;
    }
  }

  p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }
`;

const EventHighlights = ({ eventId, eventTitle, eventDate }) => {
  const { data: highlights } = useEventHighlights(eventId);
  const [likedHighlights, setLikedHighlights] = useState({});

  if (!highlights) {
    return <EmptyState>No highlights available yet.</EmptyState>;
  }

  const handleLike = (highlightId) => {
    setLikedHighlights(prev => ({
      ...prev,
      [highlightId]: !prev[highlightId]
    }));
  };

  return (
    <HighlightsContainer>
      <Banner>
        <h2>Event Highlights</h2>
        <p>Relive the best moments from {eventTitle || 'this event'}</p>
      </Banner>

      {highlights.items && highlights.items.length > 0 ? (
        highlights.items.map((item, index) => (
          <HighlightCard key={item._id || index}>
            <HighlightMedia>
              {item.type === 'video' ? (
                <>
                  <HighlightImage
                    src={item.thumbnail || 'https://via.placeholder.com/1280x720'}
                    alt={item.title}
                  />
                  <VideoPlayButton>
                    <Play />
                  </VideoPlayButton>
                </>
              ) : (
                <HighlightImage src={item.mediaUrl} alt={item.title} />
              )}
            </HighlightMedia>

            <HighlightContent>
              <HighlightTitle>{item.title}</HighlightTitle>
              {item.description && (
                <HighlightDescription>{item.description}</HighlightDescription>
              )}

              {item.tags && item.tags.length > 0 && (
                <TagsContainer>
                  {item.tags.map((tag, i) => (
                    <Tag key={i}>#{tag}</Tag>
                  ))}
                </TagsContainer>
              )}

              <HighlightStats>
                <StatItem
                  onClick={() => handleLike(item._id)}
                  liked={likedHighlights[item._id]}
                >
                  <Heart />
                  {item.likes || 0} likes
                </StatItem>
                <StatItem>
                  <MessageCircle />
                  {item.comments || 0} comments
                </StatItem>
                <StatItem>
                  <Share2 />
                  Share
                </StatItem>
              </HighlightStats>
            </HighlightContent>
          </HighlightCard>
        ))
      ) : (
        <EmptyState>
          Event organizer will share highlights here after the event ends.
        </EmptyState>
      )}
    </HighlightsContainer>
  );
};

export default EventHighlights;
