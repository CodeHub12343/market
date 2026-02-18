'use client';

import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToggleFavorite, useIsFavorited } from '@/hooks/useHostelFavorites';

const FavoriteButtonWrapper = styled.div`
  display: inline-flex;
`;

const Button = styled.button`
  width: ${props => {
    switch (props.$size) {
      case 'small':
        return '32px';
      case 'medium':
        return '40px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small':
        return '32px';
      case 'medium':
        return '40px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: ${props => {
      switch (props.$size) {
        case 'small':
          return '16px';
        case 'medium':
          return '20px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
    height: ${props => {
      switch (props.$size) {
        case 'small':
          return '16px';
        case 'medium':
          return '20px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }};
    color: ${props => props.$isFavorite ? '#ff4444' : '#d1d5db'};
    fill: ${props => props.$isFavorite ? '#ff4444' : 'none'};
    transition: all 0.3s ease;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #1a1a1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function HostelFavoriteButton({
  hostelId,
  size = 'medium',
  showLabel = false,
  onFavoritedChange,
  initialFavorited = false,
  className,
  variant = 'card' // card, detail, inline
}) {
  const [optimisticFavorited, setOptimisticFavorited] = useState(initialFavorited);
  
  // Fetch favorite status
  const { data: isFavoritedData = {} } = useIsFavorited(hostelId);
  const isFavoritedFromServer = isFavoritedData.isFavorited !== undefined 
    ? isFavoritedData.isFavorited 
    : optimisticFavorited;

  // Toggle favorite mutation
  const toggleFavoriteMutation = useToggleFavorite();

  useEffect(() => {
    setOptimisticFavorited(isFavoritedFromServer);
  }, [isFavoritedFromServer]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Optimistic update
      const newFavoritedStatus = !optimisticFavorited;
      setOptimisticFavorited(newFavoritedStatus);

      // Mutate
      await toggleFavoriteMutation.mutateAsync(hostelId);

      // Notify parent component if callback provided
      if (onFavoritedChange) {
        onFavoritedChange(newFavoritedStatus);
      }
    } catch (error) {
      // Rollback on error
      setOptimisticFavorited(!optimisticFavorited);
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <FavoriteButtonWrapper className={className}>
      <Button
        $size={size}
        $isFavorite={optimisticFavorited}
        onClick={handleToggleFavorite}
        disabled={toggleFavoriteMutation.isPending}
        title={optimisticFavorited ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={optimisticFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {toggleFavoriteMutation.isPending ? (
          <LoadingSpinner />
        ) : (
          <Heart />
        )}
      </Button>
      {showLabel && (
        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
          {optimisticFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </FavoriteButtonWrapper>
  );
}
