'use client';

import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useIsServiceFavorited, useToggleServiceFavorite } from '@/hooks/useServiceFavorites';
import { useState, useEffect } from 'react';

const FavoriteButtonContainer = styled.button`
  width: ${props => props.$size === 'large' ? '48px' : '40px'};
  height: ${props => props.$size === 'large' ? '48px' : '40px'};
  border-radius: 50%;
  background: ${props => props.$isFavorited ? 'rgba(220, 38, 38, 0.1)' : '#f5f5f5'};
  border: 1.5px solid ${props => props.$isFavorited ? '#dc2626' : '#e5e5e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;

  &:hover {
    background: ${props => props.$isFavorited ? 'rgba(220, 38, 38, 0.2)' : '#f0f0f0'};
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
    width: ${props => props.$size === 'large' ? '24px' : '20px'};
    height: ${props => props.$size === 'large' ? '24px' : '20px'};
    color: ${props => props.$isFavorited ? '#dc2626' : '#999'};
    transition: all 0.3s ease;
    ${props => props.$isFavorited ? 'fill: currentColor;' : ''}
  }
`;

const LoadingDot = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #dc2626;
  border-radius: 50%;
  top: -2px;
  right: -2px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8);
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  ${FavoriteButtonContainer}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #1a1a1a;
  }
`;

export default function ServiceFavoriteButton({
  serviceId,
  onFavoritedChange,
  size = 'medium',
  showTooltip = true,
  className
}) {
  const [optimisticFavorited, setOptimisticFavorited] = useState(null);
  
  // Fetch favorite status
  const { data: favoriteData = {}, isLoading: isFetching } = useIsServiceFavorited(serviceId);
  const isFavorited = optimisticFavorited ?? favoriteData.isFavorited ?? false;

  // Toggle favorite mutation
  const { mutate: toggleFavorite, isPending } = useToggleServiceFavorite();

  const isLoading = isFetching || isPending;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    setOptimisticFavorited(!isFavorited);

    try {
      toggleFavorite(serviceId, {
        onSuccess: () => {
          setOptimisticFavorited(null); // Let server state take over
          onFavoritedChange?.(!isFavorited);
        },
        onError: () => {
          // Revert optimistic update on error
          setOptimisticFavorited(null);
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setOptimisticFavorited(null);
    }
  };

  return (
    <FavoriteButtonContainer
      onClick={handleClick}
      disabled={isLoading}
      $isFavorited={isFavorited}
      $size={size}
      className={className}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart />
      {showTooltip && <Tooltip>{isFavorited ? 'Favorited' : 'Add to favorites'}</Tooltip>}
      {isLoading && <LoadingDot />}
    </FavoriteButtonContainer>
  );
}
