'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, AlertCircle, Zap } from 'lucide-react';
import RequestCard from './RequestCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';
import EnhancedErrorAlert from '@/components/common/EnhancedErrorAlert';
import { RequestGridSkeleton, RequestCardSkeleton } from '@/components/common/SkeletonLoaders';

// ===== MAIN GRID CONTAINER =====
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.8) 100%);
  border-radius: 16px;
  border: 2px dashed #e5e7eb;

  @media (min-width: 640px) {
    padding: 80px 40px;
    border-radius: 20px;
  }

  @media (min-width: 1024px) {
    padding: 100px 60px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
  opacity: 0.8;

  @media (min-width: 640px) {
    font-size: 64px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 72px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 10px 0;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 20px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  text-align: center;
  max-width: 400px;

  @media (min-width: 640px) {
    font-size: 15px;
    margin-bottom: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
    margin-bottom: 32px;
  }
`;

const CreateButton = styled(Link)`
  padding: 11px 22px;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (min-width: 640px) {
    padding: 12px 28px;
    font-size: 14px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 14px 32px;
    font-size: 15px;
    border-radius: 14px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

// ===== ERROR STATE =====
const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  padding: 16px;
  background: linear-gradient(135deg, #fef2f2 0%, #fde8e8 100%);
  border: 1.5px solid #fecaca;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #991b1b;

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 16px;
    font-size: 14px;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ErrorText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ErrorTitle = styled.p`
  font-weight: 700;
  margin: 0;
  font-size: 13px;

  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const ErrorMessage = styled.p`
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
  font-size: 12px;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

// ===== LOADING STATE =====
const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

// ===== PAGINATION =====
const PaginationWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 14px;
    margin-top: 28px;
    padding: 20px 0;
  }

  @media (min-width: 1024px) {
    gap: 16px;
    margin-top: 32px;
  }
`;

const PaginationButton = styled.button`
  padding: 10px 12px;
  border: 1.5px solid #e5e5e5;
  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 12px;
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;
  touch-action: manipulation;

  @media (min-width: 640px) {
    padding: 11px 16px;
    font-size: 13px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 14px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: #1a1a1a;
      color: white;
      border-color: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
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

const PageInfo = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 600;
  padding: 0 8px;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

// ===== FEATURED BANNER =====
const FeaturedBanner = styled.div`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #fcd34d;

  @media (min-width: 640px) {
    padding: 16px 20px;
    border-radius: 16px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    padding: 18px 24px;
    border-radius: 18px;
  }
`;

const FeaturedIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;

  @media (min-width: 640px) {
    font-size: 24px;
  }
`;

const FeaturedText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #92400e;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

export default function RequestGrid({
  requests = [],
  isLoading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  userOwnedRequests = [],
  userFavorites = []
}) {
  // Handle error state with retry option
  if (error && requests.length === 0) {
    return (
      <GridContainer>
        <EnhancedErrorAlert 
          title="Failed to load requests"
          message={error}
          onRetry={() => window.location.reload()}
          dismissible={true}
        />
      </GridContainer>
    );
  }

  // Show skeleton loaders during initial load
  if (isLoading && requests.length === 0) {
    return <RequestGridSkeleton count={12} />;
  }

  // Empty state
  if (requests.length === 0 && !isLoading) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>No requests found</EmptyTitle>
          <EmptyDescription>
            There are no requests matching your filters. Be the first to post one or adjust your filters to see more opportunities.
          </EmptyDescription>
          <CreateButton href="/requests/new">
            <Zap size={16} />
            Post a Request
          </CreateButton>
        </EmptyState>
      </GridContainer>
    );
  }

  const totalItems = (totalPages - 1) * 12 + requests.length;

  return (
    <>
      {/* Featured banner showing count */}
      {totalPages > 1 && currentPage === 1 && requests.length > 0 && (
        <GridContainer>
          <FeaturedBanner role="status" aria-live="polite">
            <FeaturedIcon>⚡</FeaturedIcon>
            <FeaturedText>
              Showing {requests.length} of {totalItems} requests
            </FeaturedText>
          </FeaturedBanner>
        </GridContainer>
      )}

      {/* Requests grid */}
      <GridContainer 
        role="grid" 
        aria-label="Requests grid"
        aria-busy={isLoading}
      >
        {requests.map(request => (
          <RequestCard
            key={request._id}
            request={request}
            isOwned={userOwnedRequests.includes(request._id)}
            isFavorite={userFavorites.includes(request._id)}
          />
        ))}
        
        {/* Show skeleton loaders while loading more */}
        {isLoading && requests.length > 0 && (
          Array.from({ length: 4 }).map((_, i) => (
            <RequestCardSkeleton key={`skeleton-${i}`} />
          ))
        )}
      </GridContainer>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={12}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
