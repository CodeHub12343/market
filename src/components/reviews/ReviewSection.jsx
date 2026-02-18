'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import {
  useProductReviews,
  useShopReviews,
  useCreateProductReview,
  useCreateShopReview,
  useUpdateReview,
  useDeleteReview,
  useMarkReviewHelpful,
  useRatingStats,
} from '@/hooks/useReviews';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import RatingDistribution from './RatingDistribution';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${(props) => (props.active ? '#1a1a1a' : '#e5e5e5')};
  background: ${(props) => (props.active ? '#1a1a1a' : '#ffffff')};
  color: ${(props) => (props.active ? '#ffffff' : '#666')};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

export default function ReviewSection({ productId, shopId = null, type = 'product' }) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(null);
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Debug logging
  console.log(`📋 ReviewSection loaded: type=${type}, productId=${productId}, shopId=${shopId}`);

  const reviewsQuery = type === 'product'
    ? useProductReviews(productId, {
        sort: sortBy === 'recent' ? '-createdAt' : '-helpfulCount',
        rating: filterRating,
        page,
        limit: 10,
      })
    : useShopReviews(shopId, {
        sort: sortBy === 'recent' ? '-createdAt' : '-helpfulCount',
        rating: filterRating,
        page,
        limit: 10,
      });

  const statsQuery = useRatingStats(type, type === 'product' ? productId : shopId);
  const createProductReviewMutation = useCreateProductReview();
  const createShopReviewMutation = useCreateShopReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();
  const markHelpfulMutation = useMarkReviewHelpful();

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
        if (type === 'product') {
          await createProductReviewMutation.mutateAsync({
            productId,
            reviewData,
          });
        } else {
          await createShopReviewMutation.mutateAsync({
            shopId,
            reviewData,
          });
        }
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
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReviewMutation.mutateAsync(reviewId);
        setSuccessMessage('Review deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
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
        <RatingDistribution stats={stats} />

        {successMessage && (
          <SuccessMessage>{successMessage}</SuccessMessage>
        )}

        {user && !userReview && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 16px',
              background: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              alignSelf: 'flex-start',
              transition: 'all 0.2s ease',
            }}
          >
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
          </button>
        )}

        {showForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
            isLoading={
              (type === 'product' ? createProductReviewMutation.isPending : createShopReviewMutation.isPending) ||
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
                onClick={() => {
                  setSortBy('recent');
                  setPage(1);
                }}
              >
                Most Recent
              </FilterButton>
              <FilterButton
                active={sortBy === 'helpful'}
                onClick={() => {
                  setSortBy('helpful');
                  setPage(1);
                }}
              >
                Most Helpful
              </FilterButton>
              {[5, 4, 3, 2, 1].map((rating) => (
                <FilterButton
                  key={rating}
                  active={filterRating === rating}
                  onClick={() => {
                    setFilterRating(filterRating === rating ? null : rating);
                    setPage(1);
                  }}
                >
                  {rating} ⭐
                </FilterButton>
              ))}
            </FilterContainer>

            {reviewsLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : userReview ? (
              <>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                    Your Review
                  </div>
                  <ReviewCard
                    review={userReview}
                    isOwn={true}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    isLoading={deleteReviewMutation.isPending}
                  />
                </div>

                {otherReviews.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                      Other Reviews
                    </div>
                    <ReviewsList>
                      {otherReviews.map((review) => (
                        <ReviewCard
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
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onHelpful={handleMarkHelpful}
                  />
                ))}
              </ReviewsList>
            ) : (
              <NoReviews>
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your experience with this product!</p>
              </NoReviews>
            )}
          </>
        )}
      </Content>
    </Section>
  );
}
