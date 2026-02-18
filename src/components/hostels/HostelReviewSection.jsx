'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  useHostelReviews,
  useCreateHostelReview,
  useUpdateHostelReview,
  useDeleteHostelReview,
  useMarkReviewHelpful
} from '@/hooks/useHostelReviews';
import HostelReviewForm from './HostelReviewForm';
import HostelReviewCard from './HostelReviewCard';
import HostelRatingDistribution from './HostelRatingDistribution';

const Section = styled.section`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 1024px) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  padding: 8px 14px;
  border: 1px solid ${props => props.$active ? '#1a1a1a' : '#e5e5e5'};
  background: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#1a1a1a'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 6px;
  font-size: 13px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }

  &:hover {
    border-color: #d5d5d5;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 20px;
  color: #999;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  background: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#1a1a1a'};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UserReviewContainer = styled.div`
  padding: 16px;
  background: #f0f8ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const UserReviewLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const SuccessMessage = styled.div`
  padding: 12px 14px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

export default function HostelReviewSection({ hostelId }) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch reviews
  const { data: reviewsData, isLoading, error } = useHostelReviews(
    hostelId,
    {
      page,
      limit: 10,
      sort: sortBy,
      ...(filterRating && { rating: filterRating })
    }
  );

  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination;
  const userReview = reviews.find(r => r.user?._id === user?._id || r.reviewer?._id === user?._id);

  // Mutations
  const createMutation = useCreateHostelReview();
  const updateMutation = useUpdateHostelReview();
  const deleteMutation = useDeleteHostelReview();
  const helpfulMutation = useMarkReviewHelpful();

  const handleSubmitReview = async (formData) => {
    try {
      if (editingReview) {
        await updateMutation.mutateAsync({
          reviewId: editingReview._id,
          reviewData: formData
        });
        setSuccessMessage('Review updated successfully!');
        setEditingReview(null);
      } else {
        await createMutation.mutateAsync({
          hostelId,
          reviewData: formData
        });
        setSuccessMessage('Review posted successfully!');
      }

      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(reviewId);
      setSuccessMessage('Review deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await helpfulMutation.mutateAsync(reviewId);
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  return (
    <Section>
      <SectionTitle>Reviews & Ratings</SectionTitle>

      {/* Rating Distribution */}
      <HostelRatingDistribution hostelId={hostelId} />

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      {/* User's Own Review */}
      {userReview && (
        <UserReviewContainer>
          <UserReviewLabel>Your Review</UserReviewLabel>
          <HostelReviewCard
            review={userReview}
            isOwner={true}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onMarkHelpful={() => handleMarkHelpful(userReview._id)}
          />
        </UserReviewContainer>
      )}

      {/* Review Form */}
      <FormSection>
        {showForm ? (
          <HostelReviewForm
            initialData={editingReview}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmitReview}
            onCancel={handleCancelForm}
          />
        ) : !userReview ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            Write a Review
          </button>
        ) : null}
      </FormSection>

      {/* Filter and Sort */}
      <FilterBar>
        <FilterButton
          $active={!filterRating}
          onClick={() => {
            setFilterRating(null);
            setPage(1);
          }}
        >
          All Reviews
        </FilterButton>
        {[5, 4, 3, 2, 1].map(rating => (
          <FilterButton
            key={rating}
            $active={filterRating === rating}
            onClick={() => {
              setFilterRating(rating);
              setPage(1);
            }}
          >
            {rating}★
          </FilterButton>
        ))}

        <SortSelect
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-rating">Highest Rating</option>
          <option value="rating">Lowest Rating</option>
        </SortSelect>
      </FilterBar>

      {/* Reviews List */}
      {isLoading ? (
        <LoadingState>Loading reviews...</LoadingState>
      ) : error ? (
        <EmptyState>Failed to load reviews. Please try again later.</EmptyState>
      ) : reviews.length === 0 ? (
        <EmptyState>No reviews yet. Be the first to share your experience!</EmptyState>
      ) : (
        <>
          <ReviewsList>
            {reviews.map(review => (
              <HostelReviewCard
                key={review._id}
                review={review}
                isOwner={review.user?._id === user?._id || review.reviewer?._id === user?._id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onMarkHelpful={() => handleMarkHelpful(review._id)}
              />
            ))}
          </ReviewsList>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <PaginationContainer>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <PaginationButton
                  key={p}
                  $active={p === page}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationButton>
              ))}
            </PaginationContainer>
          )}
        </>
      )}
    </Section>
  );
}
