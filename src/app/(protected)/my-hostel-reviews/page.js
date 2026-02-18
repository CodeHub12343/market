'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useMyHostelReviews, useDeleteHostelReview, useUpdateHostelReview } from '@/hooks/useHostelReviews';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { BottomNav } from '@/components/bottom-nav';
import HostelReviewCard from '@/components/hostels/HostelReviewCard';
import HostelReviewForm from '@/components/hostels/HostelReviewForm';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    width: 80px;
    background: #ffffff;
    border-right: 1px solid #f0f0f0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }

  @media (min-width: 1440px) {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 1024px) {
    padding: 32px 24px;
    gap: 24px;
    grid-column: 1;
  }
`;

const HeaderSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 1024px) {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    margin: -32px -24px 0 -24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f5f5;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.2s ease;

  @media (min-width: 1024px) {
    display: none;
  }

  &:hover {
    background: #f0f0f0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ReviewCard = styled.div`
  padding: 16px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const HostelLink = styled(Link)`
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  margin-bottom: 8px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.$danger ? '#fee2e2' : '#f3f4f6'};
  color: ${props => props.$danger ? '#dc2626' : '#1a1a1a'};
  border: 1px solid ${props => props.$danger ? '#fecaca' : '#e5e7eb'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$danger ? '#fecaca' : '#e5e7eb'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0 0 16px 0;
  }
`;

const EmptyButton = styled(Link)`
  display: inline-block;
  padding: 10px 16px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #333333;
  }
`;

const RightPanel = styled.aside`
  display: none;

  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    grid-column: 2;
    background: #ffffff;
    border-left: 1px solid #f0f0f0;
  }
`;

const SideCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const BottomNavWrapper = styled.div`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const ErrorState = styled.div`
  padding: 20px;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  padding: 12px 14px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  margin-bottom: 16px;
`;

export default function MyHostelReviewsPage() {
  useProtectedRoute();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: reviewsData, isLoading, error } = useMyHostelReviews({
    page,
    limit: 10,
    sort: '-createdAt'
  });

  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination;

  const deleteMutation = useDeleteHostelReview();
  const updateMutation = useUpdateHostelReview();

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(reviewId);
      setSuccessMessage('Review deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const handleEditSubmit = async (reviewId, formData) => {
    try {
      await updateMutation.mutateAsync({
        reviewId,
        reviewData: formData
      });
      setSuccessMessage('Review updated successfully');
      setEditingReview(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update review');
    }
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="hostels" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          <HeaderSection>
            <HeaderContent>
              <BackButton href="/hostels">
                <ChevronLeft />
              </BackButton>
              <Title>My Hostel Reviews</Title>
            </HeaderContent>
          </HeaderSection>

          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          {isLoading ? (
            <LoadingState>Loading your reviews...</LoadingState>
          ) : error ? (
            <ErrorState>Failed to load your reviews. Please try again.</ErrorState>
          ) : reviews.length === 0 ? (
            <EmptyState>
              <h3>No Reviews Yet</h3>
              <p>You haven't written any hostel reviews. Start by finding and reviewing a hostel you've stayed at.</p>
              <EmptyButton href="/hostels">Browse Hostels</EmptyButton>
            </EmptyState>
          ) : (
            <ReviewsGrid>
              {reviews.map(review => (
                <ReviewCard key={review._id}>
                  <HostelLink href={`/hostels/${review.hostel?._id || '#'}`}>
                    📍 {review.hostel?.name || 'Hostel'}
                  </HostelLink>

                  {editingReview?._id === review._id ? (
                    <HostelReviewForm
                      initialData={review}
                      isLoading={updateMutation.isPending}
                      onSubmit={(data) => handleEditSubmit(review._id, data)}
                      onCancel={() => setEditingReview(null)}
                    />
                  ) : (
                    <>
                      <HostelReviewCard
                        review={review}
                        isOwner={true}
                        onEdit={() => setEditingReview(review)}
                        onDelete={handleDelete}
                      />
                      <ActionButtons>
                        <ActionButton onClick={() => setEditingReview(review)}>
                          Edit
                        </ActionButton>
                        <ActionButton
                          $danger
                          onClick={() => handleDelete(review._id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </ActionButton>
                      </ActionButtons>
                    </>
                  )}
                </ReviewCard>
              ))}
            </ReviewsGrid>
          )}
        </ContentArea>

        <RightPanel>
          <SideCard>
            <h3>💬 Review Tips</h3>
            <p>Share honest, helpful reviews to help other students find the perfect hostel. Include details about cleanliness, comfort, amenities, and staff.</p>
          </SideCard>

          <SideCard>
            <h3>⭐ Be Fair</h3>
            <p>Rate based on your actual experience. Constructive feedback helps hostel owners improve their services.</p>
          </SideCard>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="hostels" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
