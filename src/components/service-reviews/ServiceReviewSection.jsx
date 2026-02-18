'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import {
  useServiceReviews,
  useCreateServiceReview,
  useUpdateServiceReview,
  useDeleteServiceReview,
  useMarkServiceReviewHelpful,
  useServiceRatingStats,
} from '@/hooks/useServiceReviews';
import ServiceReviewForm from './ServiceReviewForm';
import ServiceReviewCard from './ServiceReviewCard';
import ServiceRatingDistribution from './ServiceRatingDistribution';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Section = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  margin-top: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f5;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 12px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${(props) => (props.active ? '#1a1a1a' : '#e5e5e5')};
  background: ${(props) => (props.active ? '#1a1a1a' : '#ffffff')};
  color: ${(props) => (props.active ? '#ffffff' : '#666')};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;

  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px;
  background: #fee2e2;
  border: 1px solid #dc2626;
  border-radius: 8px;
  color: #7f1d1d;
  font-size: 13px;
`;

const SuccessMessage = styled.div`
  padding: 12px;
  background: #dcfce7;
  border: 1px solid #16a34a;
  border-radius: 8px;
  color: #15803d;
  font-size: 13px;
`;

const WriteReviewButton = styled.button`
  padding: 10px 16px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: flex-start;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function ServiceReviewSection({ serviceId }) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const reviewsQuery = useServiceReviews(serviceId, {
    sort: sortBy === 'recent' ? '-createdAt' : '-helpfulCount',
    rating: filterRating,
  });

  const statsQuery = useServiceRatingStats(serviceId);
  const createReviewMutation = useCreateServiceReview();
  const updateReviewMutation = useUpdateServiceReview();
  const deleteReviewMutation = useDeleteServiceReview();
  const markHelpfulMutation = useMarkServiceReviewHelpful();

  const { data: reviews = [], isLoading: reviewsLoading } = reviewsQuery;
  const { data: stats } = statsQuery;

  const userReview = reviews?.find((r) => r.user?._id === user?._id);
  const otherReviews = reviews?.filter((r) => r.user?._id !== user?._id) || [];

  const handleSubmitReview = async (reviewData) => {
    try {
      if (editingReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: editingReview._id,
          reviewData,
        });
        setSuccessMessage('Review updated successfully!');
      } else {
        await createReviewMutation.mutateAsync({
          serviceId,
          reviewData,
        });
        setSuccessMessage('Review submitted successfully!');
      }

      setShowForm(false);
      setEditingReview(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      setSuccessMessage('Review deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markHelpfulMutation.mutateAsync(reviewId);
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  return (
    <Section>
      <Title>⭐ Reviews ({stats?.totalReviews || 0})</Title>

      <Content>
        <ServiceRatingDistribution stats={stats} />

        {successMessage && (
          <SuccessMessage>{successMessage}</SuccessMessage>
        )}

        {user && !userReview && (
          <WriteReviewButton onClick={() => setShowForm(!showForm)}>
            {showForm ? (
              <>
                <ChevronUp size={16} />
                Hide Form
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Write a Review
              </>
            )}
          </WriteReviewButton>
        )}

        {showForm && (
          <ServiceReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
            isLoading={
              createReviewMutation.isPending ||
              updateReviewMutation.isPending
            }
            initialData={editingReview}
          />
        )}

        {!showForm && (
          <>
            <FilterContainer>
              <FilterButton
                active={sortBy === 'recent'}
                onClick={() => setSortBy('recent')}
              >
                Most Recent
              </FilterButton>
              <FilterButton
                active={sortBy === 'helpful'}
                onClick={() => setSortBy('helpful')}
              >
                Most Helpful
              </FilterButton>
              {[5, 4, 3, 2, 1].map((rating) => (
                <FilterButton
                  key={rating}
                  active={filterRating === rating}
                  onClick={() =>
                    setFilterRating(filterRating === rating ? null : rating)
                  }
                >
                  {rating} ⭐
                </FilterButton>
              ))}
            </FilterContainer>

            {reviewsLoading ? (
              <LoadingContainer>Loading reviews...</LoadingContainer>
            ) : userReview ? (
              <>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '8px',
                    }}
                  >
                    Your Review
                  </div>
                  <ServiceReviewCard
                    review={userReview}
                    isOwn={true}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    isLoading={deleteReviewMutation.isPending}
                  />
                </div>

                {otherReviews.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#666',
                        marginBottom: '8px',
                      }}
                    >
                      Other Reviews
                    </div>
                    <ReviewsList>
                      {otherReviews.map((review) => (
                        <ServiceReviewCard
                          key={review._id}
                          review={review}
                          onHelpful={handleMarkHelpful}
                        />
                      ))}
                    </ReviewsList>
                  </div>
                )}
              </>
            ) : otherReviews.length > 0 ? (
              <ReviewsList>
                {otherReviews.map((review) => (
                  <ServiceReviewCard
                    key={review._id}
                    review={review}
                    onHelpful={handleMarkHelpful}
                  />
                ))}
              </ReviewsList>
            ) : (
              <NoReviews>
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your experience with this service!</p>
              </NoReviews>
            )}
          </>
        )}
      </Content>
    </Section>
  );
}
