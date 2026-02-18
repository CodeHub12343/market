'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Star, ThumbsUp, Trash2, Edit2 } from 'lucide-react';

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 14px;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    padding: 16px;
  }

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  gap: 8px;
  flex: 1;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #666;
  font-size: 12px;
`;

const AuthorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AuthorName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ReviewDate = styled.div`
  font-size: 11px;
  color: #999;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
  color: #fbbf24;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const Text = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
`;

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return d.toLocaleDateString();
};

export default function ReviewCard({
  review,
  isOwn = false,
  onEdit = null,
  onDelete = null,
  onHelpful = null,
  isLoading = false,
}) {
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (onHelpful && !isHelpful) {
      setIsHelpful(true);
      onHelpful(review._id);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  return (
    <Card>
      <Header>
        <AuthorInfo>
          <Avatar>{getInitials(review.user?.fullName)}</Avatar>
          <AuthorDetails>
            <AuthorName>{review.user?.fullName || 'Anonymous'}</AuthorName>
            <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
          </AuthorDetails>
        </AuthorInfo>

        <Actions>
          {isOwn && (
            <>
              <ActionButton
                onClick={() => onEdit?.(review)}
                disabled={isLoading}
                title="Edit review"
              >
                <Edit2 />
              </ActionButton>
              <ActionButton
                onClick={() => onDelete?.(review._id)}
                disabled={isLoading}
                title="Delete review"
              >
                <Trash2 />
              </ActionButton>
            </>
          )}
        </Actions>
      </Header>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <RatingStars>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < review.rating ? '#fbbf24' : 'none'}
              color={i < review.rating ? '#fbbf24' : '#e5e5e5'}
            />
          ))}
        </RatingStars>
        {review.verified && <Badge>Verified Purchase</Badge>}
      </div>

      <Content>
        <Title>{review.title}</Title>
        <Text>{review.content}</Text>
      </Content>

      <Footer>
        <HelpfulButton
          onClick={handleHelpful}
          disabled={isHelpful}
          title={isHelpful ? 'You marked this as helpful' : 'Mark as helpful'}
        >
          <ThumbsUp />
          Helpful
          {review.helpfulCount > 0 && ` (${review.helpfulCount})`}
        </HelpfulButton>
      </Footer>
    </Card>
  );
}
