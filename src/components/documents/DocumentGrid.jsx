'use client';

import styled from 'styled-components';
import DocumentCard from './DocumentCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  opacity: 0.8;
`;

const EmptyText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin: 0;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
  max-width: 400px;
`;

const LoadingState = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-color: #f0f0f0;
    }
    50% {
      background-color: #e0e0e0;
    }
    100% {
      background-color: #f0f0f0;
    }
  }

  height: 300px;
`;

const ErrorState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-radius: 16px;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  opacity: 0.8;
`;

const ErrorText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #d32f2f;
  margin: 0;
`;

export default function DocumentGrid({
  documents = [],
  isLoading = false,
  error = null,
  onView,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <GridContainer>
        <LoadingState>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </LoadingState>
      </GridContainer>
    );
  }

  if (error) {
    return (
      <GridContainer>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>Error loading documents</ErrorText>
          <EmptySubtext>Please try again later or contact support</EmptySubtext>
        </ErrorState>
      </GridContainer>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>No documents found</EmptyText>
          <EmptySubtext>Try adjusting your search or filters to find what you&apos;re looking for</EmptySubtext>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </GridContainer>
  );
}
