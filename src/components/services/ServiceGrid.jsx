// src/components/services/ServiceGrid.jsx

import styled from 'styled-components';
import ServiceCard from './ServiceCard';
import { AlertCircle, Package } from 'lucide-react';

const GridWrapper = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 1024px) {
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 1024px) {
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  flex-shrink: 0;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonContent = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonTitle = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  width: 85%;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonText = styled.div`
  height: 12px;
  background: linear-gradient(90deg, #f5f5f5 25%, #f0f0f0 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: shimmerSlow 2s infinite;
  border-radius: 4px;
  width: ${props => props.$width || '100%'};

  @keyframes shimmerSlow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const SkeletonRating = styled.div`
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  width: 70px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonPrice = styled.div`
  height: 18px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  width: 60px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px dashed #e5e5e5;

  @media (min-width: 768px) {
    padding: 80px 40px;
  }
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 48px;
    height: 48px;
    color: #ccc;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
  max-width: 400px;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff5f5;
  border: 1px solid #fde2e2;
  border-radius: 8px;
  color: #c92a2a;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    padding: 20px;
    font-size: 15px;
  }
`;

const ErrorText = styled.span`
  font-size: 14px;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 0 16px;

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 40px;
    padding: 0;
  }
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  background: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.$active ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #1a1a1a;
    background: ${props => props.$active ? '#1a1a1a' : '#f9f9f9'};
    transform: translateY(-1px);
  }

  @media (min-width: 768px) {
    min-width: 40px;
    height: 40px;
    font-size: 15px;
  }
`;

export default function ServiceGrid({
  services = [],
  loading = false,
  error = null,
  title,
  pagination = null,
  onPageChange
}) {
  if (loading && !services.length) {
    return (
      <GridWrapper>
        <LoadingContainer>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonImage />
              <SkeletonContent>
                <SkeletonTitle />
                <SkeletonText $width="70%" />
                <div style={{ flex: 1 }} />
                <SkeletonFooter>
                  <SkeletonRating />
                  <SkeletonPrice />
                </SkeletonFooter>
              </SkeletonContent>
            </SkeletonCard>
          ))}
        </LoadingContainer>
      </GridWrapper>
    );
  }

  return (
    <GridWrapper>
      <Grid>
        {error && (
          <ErrorContainer>
            <AlertCircle />
            <ErrorText>{error.message || 'Failed to load services'}</ErrorText>
          </ErrorContainer>
        )}

        {services.length > 0 ? (
          services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Package />
            </EmptyIcon>
            <EmptyTitle>No Services Yet</EmptyTitle>
            <EmptyText>
              {error
                ? 'Unable to load services. Please try again later.'
                : 'No services available at the moment. Check back soon!'}
            </EmptyText>
          </EmptyState>
        )}
      </Grid>

      {pagination && pagination.pages > 1 && (
        <PaginationContainer>
          <PaginationButton
            disabled={pagination.page === 1}
            onClick={() => onPageChange?.(1)}
            title="First page"
          >
            ⟨⟨
          </PaginationButton>

          <PaginationButton
            disabled={pagination.page === 1}
            onClick={() => onPageChange?.(pagination.page - 1)}
            title="Previous page"
          >
            ⟨
          </PaginationButton>

          <span style={{ color: '#999', fontSize: '14px', margin: '0 8px' }}>
            Page {pagination.page} of {pagination.pages}
          </span>

          <PaginationButton
            disabled={pagination.page === pagination.pages}
            onClick={() => onPageChange?.(pagination.page + 1)}
            title="Next page"
          >
            ⟩
          </PaginationButton>

          <PaginationButton
            disabled={pagination.page === pagination.pages}
            onClick={() => onPageChange?.(pagination.pages)}
            title="Last page"
          >
            ⟩⟩
          </PaginationButton>
        </PaginationContainer>
      )}
    </GridWrapper>
  );
}
