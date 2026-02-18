'use client';

import styled from 'styled-components';
import ShopCard from './ShopCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background-color: #f9fafb;
  border-radius: 12px;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .empty-text {
    color: #6b7280;
    margin-bottom: 24px;
  }
`;

const LoadingGrid = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const SkeletonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .skeleton-image {
    height: 200px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .skeleton-content {
    padding: 20px;

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      margin-bottom: 12px;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  padding: 20px;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
`;

export default function ShopGrid({
  shops = [],
  isLoading = false,
  error = null,
  onDelete,
  onEdit,
}) {
  if (isLoading) {
    return (
      <LoadingGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index}>
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '100%' }} />
              <div className="skeleton-line" style={{ width: '90%' }} />
            </div>
          </SkeletonCard>
        ))}
      </LoadingGrid>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <strong>Error loading shops:</strong> {error?.message || 'Unknown error'}
      </ErrorContainer>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <EmptyState>
        <div className="empty-icon">🏪</div>
        <div className="empty-title">No shops found</div>
        <p className="empty-text">
          There are no shops to display. Create one to get started!
        </p>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {shops.map((shop) => (
        <ShopCard
          key={shop._id}
          shop={shop}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </GridContainer>
  );
}