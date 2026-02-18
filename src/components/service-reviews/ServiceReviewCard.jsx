'use client';

import styled from 'styled-components';
import { Star, Trash2, Edit2, ThumbsUp } from 'lucide-react';

const CardContainer = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  @media (min-width: 640px) {
    padding: 16px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const AuthorMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const AuthorName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 640px) {
    gap: 4px;
  }
`;

const Badge = styled.span`
  padding: 2px 8px;
  background: #dcfce7;
  border: 1px solid #16a34a;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #15803d;
  text-transform: uppercase;
  white-space: nowrap;
`;

const StarRow = styled.div`
  display: flex;
  gap: 2px;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ReviewTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ReviewContent = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  word-break: break-all;
  overflow-wrap: break-word;
  max-width: 100%;
  width: 100%;
  min-width: 0;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const HelpfulButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  background: ${(props) => (props.$active ? '#f0f0f0' : '#ffffff')};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }

  @media (max-width: 640px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`;

const HelpfulCount = styled.span`
  font-size: 11px;
  color: #999;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const seconds = Math.floor((now - reviewDate) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return reviewDate.toLocaleDateString();
};

export default function ServiceReviewCard({
  review,
  isOwn = false,
  onEdit,
  onDelete,
  onHelpful,
  isLoading = false,
}) {
  const authorName = review.user?.fullName || review.user?.name || 'Anonymous';
  const initials = getInitials(authorName);
  const formattedDate = formatDate(review.createdAt);

  return (
    <CardContainer>
      <HeaderRow>
        <AuthorInfo>
          <Avatar title={authorName}>{initials}</Avatar>
          <AuthorMeta>
            <AuthorName>{authorName}</AuthorName>
            <ReviewDate>{formattedDate}</ReviewDate>
          </AuthorMeta>
        </AuthorInfo>
        {review.verified && (
          <BadgeContainer>
            <Badge>✓ Verified</Badge>
          </BadgeContainer>
        )}
      </HeaderRow>

      <StarRow>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            fill={i < review.rating ? '#ffc107' : '#e5e5e5'}
            color={i < review.rating ? '#ffc107' : '#e5e5e5'}
          />
        ))}
      </StarRow>

      {review.title && <ReviewTitle>{review.title}</ReviewTitle>}
      <ReviewContent>{review.review || review.content}</ReviewContent>

      <ActionRow>
        <HelpfulButton
          onClick={() => onHelpful && onHelpful(review._id)}
          disabled={isLoading}
          $active={review.userMarkedHelpful}
        >
          <ThumbsUp />
          <HelpfulCount>
            {review.helpfulCount || 0} {review.helpfulCount === 1 ? 'person' : 'people'} found helpful
          </HelpfulCount>
        </HelpfulButton>

        {isOwn && (
          <ActionButtons>
            <ActionButton
              onClick={() => onEdit && onEdit(review)}
              disabled={isLoading}
              title="Edit review"
            >
              <Edit2 />
              Edit
            </ActionButton>
            <ActionButton
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this review?')) {
                  onDelete && onDelete(review._id);
                }
              }}
              disabled={isLoading}
              title="Delete review"
            >
              <Trash2 />
              Delete
            </ActionButton>
          </ActionButtons>
        )}
      </ActionRow>
    </CardContainer>
  );
}
