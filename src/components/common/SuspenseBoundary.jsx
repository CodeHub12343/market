'use client';

import React, { Suspense } from 'react';
import styled from 'styled-components';

// ✅ Skeleton loaders for different content types
export const ListSkeleton = () => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        style={{
          height: '100px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
          borderRadius: '8px',
        }}
      />
    ))}
  </div>
);

export const GridSkeleton = ({ columns = 3 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
      gap: '1.5rem',
    }}
  >
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        style={{
          height: '300px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
          borderRadius: '8px',
        }}
      />
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        style={{
          height: '60px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
          borderRadius: '4px',
        }}
      />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div
      style={{
        height: '200px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
        borderRadius: '8px',
      }}
    />
    <div
      style={{
        height: '20px',
        width: '80%',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
        borderRadius: '4px',
      }}
    />
    <div
      style={{
        height: '16px',
        width: '60%',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
        borderRadius: '4px',
      }}
    />
  </div>
);

const ErrorContainer = styled.div`
  padding: 2rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  margin: 1rem 0;

  h3 {
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

// ✅ Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Suspense boundary error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h3>⚠️ Something went wrong</h3>
          <p>
            {this.state.error?.message || 'Failed to load content. Please try refreshing.'}
          </p>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// ✅ Combined Suspense Boundary with Error Handling
export function SuspenseBoundary({
  children,
  fallback = <GridSkeleton />,
  errorFallback = null,
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <GridSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default SuspenseBoundary;
