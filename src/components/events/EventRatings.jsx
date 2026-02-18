'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useAddEventRating } from '@/hooks/useEvents';
import { Star } from 'lucide-react';

const RatingsWrapper = styled.div`
  margin-top: 0;
`;

const RatingsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;

  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 18px;
  }
`;

const RatingsContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const RatingStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const AverageRating = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const AverageScore = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 6px;

  @media (min-width: 768px) {
    font-size: 40px;
    margin-bottom: 8px;
  }
`;

const AverageLabel = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const RatingLabel = styled.span`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  min-width: 50px;

  @media (min-width: 768px) {
    font-size: 14px;
    min-width: 60px;
  }
`;

const RatingBarBackground = styled.div`
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const RatingBarFill = styled.div`
  height: 100%;
  background: #fbbf24;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const RatingBarValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  min-width: 35px;
  text-align: right;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const RatingForm = styled.form`
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 18px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:not(:last-of-type) {
    margin-bottom: 14px;

    @media (min-width: 768px) {
      margin-bottom: 16px;
    }
  }
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StarGroup = styled.div`
  display: flex;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  color: ${props => props.filled ? '#fbbf24' : '#d1d5db'};

  svg {
    width: 24px;
    height: 24px;

    @media (min-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }

  &:hover {
    transform: scale(1.1);
    color: #fbbf24;
  }
`;

const ReviewInput = styled.textarea`
  padding: 10px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (min-width: 768px) {
    padding: 12px;
    font-size: 14px;
    min-height: 100px;
  }
`;

const CharCount = styled.div`
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 6px;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;

  @media (min-width: 768px) {
    margin-top: 12px;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #000;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 14px;
  background: white;
  color: #666;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const RatingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;

  @media (min-width: 768px) {
    gap: 14px;
    margin-top: 24px;
  }
`;

const RatingItem = styled.div`
  padding: 14px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const RatingItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    margin-bottom: 10px;
  }
`;

const RatingAuthor = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const RatingStars = styled.div`
  display: flex;
  gap: 3px;
  margin: 0 8px;

  svg {
    width: 14px;
    height: 14px;
    color: #fbbf24;

    @media (min-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const RatingDate = styled.span`
  font-size: 12px;
  color: #999;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const RatingReview = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-top: 20px;

  @media (min-width: 768px) {
    padding: 30px 24px;
    margin-top: 24px;
  }
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

export default function EventRatings({ eventId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addRating = useAddEventRating();

  // Mock data for ratings display
  const ratings = [
    { _id: '1', author: { name: 'John Doe' }, rating: 5, review: 'Great event!', createdAt: new Date() }
  ];

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: Math.round((ratings.filter(r => r.rating === 5).length / ratings.length) * 100) || 0,
    4: Math.round((ratings.filter(r => r.rating === 4).length / ratings.length) * 100) || 0,
    3: Math.round((ratings.filter(r => r.rating === 3).length / ratings.length) * 100) || 0,
    2: Math.round((ratings.filter(r => r.rating === 2).length / ratings.length) * 100) || 0,
    1: Math.round((ratings.filter(r => r.rating === 1).length / ratings.length) * 100) || 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRating.mutateAsync({ eventId, rating, review });
      setRating(0);
      setReview('');
    } catch (err) {
      alert('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RatingsWrapper>
      <RatingsTitle>Ratings & Reviews</RatingsTitle>

      <RatingsContent>
        <RatingStats>
          {ratings.length > 0 ? (
            <>
              <AverageRating>
                <AverageScore>{averageRating}</AverageScore>
                <AverageLabel>out of 5 stars</AverageLabel>
                <AverageLabel>{ratings.length} ratings</AverageLabel>
              </AverageRating>

              {[5, 4, 3, 2, 1].map(star => (
                <RatingBar key={star}>
                  <RatingLabel>{star} ★</RatingLabel>
                  <RatingBarBackground>
                    <RatingBarFill percentage={ratingDistribution[star]} />
                  </RatingBarBackground>
                  <RatingBarValue>{ratingDistribution[star]}%</RatingBarValue>
                </RatingBar>
              ))}
            </>
          ) : (
            <AverageRating>
              <AverageScore>-</AverageScore>
              <AverageLabel>No ratings yet</AverageLabel>
            </AverageRating>
          )}
        </RatingStats>

        <RatingForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Rate this event</Label>
            <StarGroup>
              {[1, 2, 3, 4, 5].map(star => (
                <StarButton
                  key={star}
                  type="button"
                  filled={star <= rating}
                  onClick={() => setRating(star)}
                >
                  <Star fill="currentColor" />
                </StarButton>
              ))}
            </StarGroup>
          </FormGroup>

          <FormGroup>
            <Label>Share your experience (optional)</Label>
            <ReviewInput
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others what you thought about this event..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <CharCount>{review.length}/500</CharCount>
          </FormGroup>

          <ButtonRow>
            <SubmitButton type="submit" disabled={isSubmitting || rating === 0}>
              Submit Rating
            </SubmitButton>
            <CancelButton
              type="button"
              onClick={() => {
                setRating(0);
                setReview('');
              }}
              disabled={rating === 0 && !review.trim()}
            >
              Clear
            </CancelButton>
          </ButtonRow>
        </RatingForm>
      </RatingsContent>

      {ratings.length > 0 && (
        <RatingsList>
          {ratings.map(r => (
            <RatingItem key={r._id}>
              <RatingItemHeader>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <RatingAuthor>{r.author?.name || 'Anonymous'}</RatingAuthor>
                  <RatingStars>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < r.rating ? 'currentColor' : 'none'} />
                    ))}
                  </RatingStars>
                </div>
                <RatingDate>
                  {new Date(r.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </RatingDate>
              </RatingItemHeader>
              {r.review && <RatingReview>{r.review}</RatingReview>}
            </RatingItem>
          ))}
        </RatingsList>
      )}

      {ratings.length === 0 && (
        <EmptyState>
          <EmptyText>No ratings yet. Be the first to rate this event!</EmptyText>
        </EmptyState>
      )}
    </RatingsWrapper>
  );
}
