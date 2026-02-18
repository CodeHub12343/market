'use client';

import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  margin-top: 24px;

  @media (min-width: 640px) {
    gap: 12px;
    padding: 28px 20px;
    margin-top: 28px;
  }

  @media (min-width: 1024px) {
    padding: 32px 28px;
    margin-top: 32px;
  }
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: ${props => props.$active ? '#1a1a1a' : 'white'};
  color: ${props => props.$active ? 'white' : '#1a1a1a'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  font-family: inherit;

  &:hover:not(:disabled) {
    border-color: #1a1a1a;
    background: ${props => props.$active ? '#333' : '#f9f9f9'};
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 640px) {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
`;

const PageInfo = styled.div`
  font-size: 13px;
  color: #666;
  text-align: center;
  min-width: 150px;

  @media (min-width: 640px) {
    font-size: 14px;
    min-width: 200px;
  }

  strong {
    color: #1a1a1a;
    font-weight: 600;
  }
`;

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false,
  itemsPerPage,
  totalItems
}) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationContainer role="navigation" aria-label="Pagination">
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        aria-label="Go to previous page"
        title="Previous page"
      >
        <ChevronLeft size={18} />
      </PaginationButton>

      {startPage > 1 && (
        <>
          <PaginationButton
            onClick={() => handlePageClick(1)}
            disabled={isLoading}
            aria-label="Go to page 1"
          >
            1
          </PaginationButton>
          {startPage > 2 && (
            <span style={{ color: '#999', fontSize: '14px' }}>...</span>
          )}
        </>
      )}

      {pageNumbers.map(pageNumber => (
        <PaginationButton
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          disabled={isLoading}
          $active={pageNumber === currentPage}
          aria-current={pageNumber === currentPage ? 'page' : undefined}
          aria-label={`Go to page ${pageNumber}`}
        >
          {pageNumber}
        </PaginationButton>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span style={{ color: '#999', fontSize: '14px' }}>...</span>
          )}
          <PaginationButton
            onClick={() => handlePageClick(totalPages)}
            disabled={isLoading}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </PaginationButton>
        </>
      )}

      <PaginationButton
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Go to next page"
        title="Next page"
      >
        <ChevronRight size={18} />
      </PaginationButton>

      <PageInfo aria-live="polite" aria-atomic="true">
        Showing <strong>{startItem}-{endItem}</strong> of <strong>{totalItems}</strong>
      </PageInfo>
    </PaginationContainer>
  );
}
