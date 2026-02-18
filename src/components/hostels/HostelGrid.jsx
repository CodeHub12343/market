'use client';

import HostelCard from './HostelCard';
import HostelCardSkeleton from '@/components/loaders/HostelCardSkeleton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import styled from 'styled-components';

// ===== GRID CONTAINER =====
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  grid-column: 1 / -1;
`;

const EmptyStateContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f9f9f9 0%, #f3f4f6 100%);
  border-radius: 16px;
  border: 2px dashed #e5e7eb;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #9ca3af;
    line-height: 1.6;
  }

  @media (min-width: 768px) {
    padding: 80px 40px;

    .empty-icon {
      font-size: 56px;
    }

    h3 {
      font-size: 20px;
    }

    p {
      font-size: 15px;
    }
  }
`;

export default function HostelGrid({
  hostels = [],
  loading = false,
  error = null,
  onDelete,
  onEdit,
  isEmpty = false,
}) {
  if (loading) {
    return (
      <GridContainer>
        {Array.from({ length: 12 }).map((_, index) => (
          <HostelCardSkeleton key={`skeleton-${index}`} />
        ))}
      </GridContainer>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        message={error.message || 'Failed to load hostels'}
        onClose={() => {}}
      />
    );
  }

  if (isEmpty || hostels.length === 0) {
    return (
      <EmptyStateContainer>
        <div className="empty-icon">🏨</div>
        <h3>No Hostels Yet</h3>
        <p>Start adding hostels to your collection today</p>
      </EmptyStateContainer>
    );
  }

  return (
    <GridContainer>
      {hostels.map((hostel) => (
        <HostelCard
          key={hostel._id}
          hostel={hostel}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </GridContainer>
  );
}
