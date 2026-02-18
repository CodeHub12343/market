'use client';

import { useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import styled from 'styled-components';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
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
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonTitle = styled.div`
  height: 14px;
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
  height: 10px;
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
  margin-top: 4px;
`;

const SkeletonPrice = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  width: 50px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonStock = styled.div`
  height: 12px;
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

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 48px 0;

  p {
    margin: 0;
  }

  p:first-child {
    font-size: 18px;
    color: #6b7280;
  }

  p:last-child {
    font-size: 14px;
    color: #9ca3af;
    margin-top: 8px;
  }
`;

const InfiniteScrollTrigger = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

export default function ProductGrid({
  products = [],
  isLoading = false,
  error = null,
  onEdit,
  isEmpty = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) {
  const loadMoreRef = useInfiniteScroll(() => {
    if (onLoadMore && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, {
    threshold: 500,
    enabled: hasMore && !isLoadingMore,
  });

  if (isLoading && !products.length) {
    return (
      <LoadingContainer>
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i}>
            <SkeletonImage />
            <SkeletonContent>
              <SkeletonTitle />
              <SkeletonText $width="70%" />
              <div style={{ flex: 1 }} />
              <SkeletonFooter>
                <SkeletonPrice />
                <SkeletonStock />
              </SkeletonFooter>
            </SkeletonContent>
          </SkeletonCard>
        ))}
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        message={error.message || 'Failed to load products'}
        onClose={() => {}}
      />
    );
  }

  if (isEmpty || products.length === 0) {
    return (
      <EmptyStateContainer>
        <p>No products found</p>
        <p>Start by adding a new product</p>
      </EmptyStateContainer>
    );
  }

  return (
    <>
      <GridContainer>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={onEdit}
          />
        ))}
        {hasMore && (
          <InfiniteScrollTrigger ref={loadMoreRef}>
            {isLoadingMore && <LoadingSpinner />}
          </InfiniteScrollTrigger>
        )}
      </GridContainer>
    </>
  );
}