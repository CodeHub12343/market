'use client';

import styled from 'styled-components';
import { Star, ThumbsUp, Edit2, Trash2, User } from 'lucide-react';
import { useState } from 'react';

const Card = styled.div`
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #e5e5e5;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const AuthorDetails = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AuthorMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #1a1a1a;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const RatingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const VerifiedBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
`;

const Content = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const DateText = styled.span`
  font-size: 12px;
  color: #999;
`;

export default function HostelReviewCard({
  review,
  isOwner = false,
  onEdit,
  onDelete,
  onMarkHelpful
}) {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review?.helpfulCount || 0);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      setHelpfulCount(helpfulCount + 1);
      onMarkHelpful?.();
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const formatDate = (date) => {
    if (!date) return '';
    const now = new Date();
    const reviewDate = new Date(date);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card>
      <Header>
        <AuthorInfo>
          <Avatar>{getInitials(review?.user?.fullName || review?.reviewer?.fullName || 'User')}</Avatar>
          <AuthorDetails>
            <AuthorName>
              {review?.user?.fullName || review?.reviewer?.fullName || 'Anonymous User'}
              {review?.isVerifiedBooking && <VerifiedBadge>✓ Verified</VerifiedBadge>}
            </AuthorName>
            <AuthorMeta>{formatDate(review?.createdAt)}</AuthorMeta>
          </AuthorDetails>
        </AuthorInfo>
        {isOwner && (
          <Actions>
            <ActionButton onClick={() => onEdit?.(review)} title="Edit review">
              <Edit2 />
            </ActionButton>
            <ActionButton onClick={() => onDelete?.(review._id)} title="Delete review">
              <Trash2 />
            </ActionButton>
          </Actions>
        )}
      </Header>

      <RatingContainer>
        <Stars>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              fill={i < (review?.rating || 0) ? '#ffc107' : '#f0f0f0'}
            />
          ))}
        </Stars>
        <RatingText>{review?.rating}/5</RatingText>
      </RatingContainer>

      {review?.title && <Title>{review.title}</Title>}

      {review?.content && <Content>{review.content}</Content>}

      <Footer>
        <HelpfulButton onClick={handleHelpful} disabled={isHelpful}>
          <ThumbsUp />
          <span>Helpful ({helpfulCount})</span>
        </HelpfulButton>
        <DateText>{formatDate(review?.createdAt)}</DateText>
      </Footer>
    </Card>
  );
}
