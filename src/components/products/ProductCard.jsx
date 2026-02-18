'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Heart, Edit } from 'lucide-react';
import styled from 'styled-components';
import { useToggleFavorite, useIsFavorited } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';

const CardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    border-radius: 16px;
    border: 1px solid #e8e8e8;
  }

  @media (min-width: 1024px) {
    border-radius: 20px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: #1a1a1a;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16/12;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    aspect-ratio: 4/3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
  justify-content: space-between;
  align-items: flex-start;

  @media (min-width: 768px) {
    top: 12px;
    left: 12px;
    right: 12px;
    gap: 8px;
  }
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const ConditionBadge = styled.span`
  background-color: #1a1a1a;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

const PopularBadge = styled.span`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    bottom: 12px;
    right: 12px;
  }

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    background: white;
  }

  svg {
    width: 18px;
    height: 18px;
    color: ${(props) => (props.$active ? '#e53935' : '#999')};
    fill: ${(props) => (props.$active ? '#e53935' : 'none')};
    transition: all 0.2s ease;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ShopName = styled.span`
  font-size: 11px;
  color: #666;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
`;

const ViewDetailsButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 12px;
  }

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
`;

const EditButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #f5f5f5;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  &:hover {
    border-color: #1a1a1a;
    background: #f0f0f0;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PriceRatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;

const Price = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
  margin-left: auto;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  svg {
    width: 12px;
    height: 12px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ReviewCount = styled.span`
  font-size: 10px;
  color: #999;
`;

export default function ProductCard({ product, onEdit }) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavoriteMutation = useToggleFavorite();
  const { data: isFavoritedFromQuery } = useIsFavorited(product._id, 'Product', !!user);

  // Sync local state with query result
  useEffect(() => {
    if (isFavoritedFromQuery !== undefined) {
      setIsFavorited(isFavoritedFromQuery);
    }
  }, [isFavoritedFromQuery]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to add to favorites');
      return;
    }

    try {
      await toggleFavoriteMutation.mutateAsync({
        itemId: product._id,
        itemType: 'Product',
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const defaultImage = product?.images?.[0] || '/placeholder.svg';

  return (
    <CardContainer>
      {/* IMAGE SECTION */}
      <ImageWrapper>
        <img
          src={defaultImage}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <BadgeContainer>
          <BadgeGroup>
            {product.category && (
              <ConditionBadge>
                {product.category.name || product.category}
              </ConditionBadge>
            )}
          </BadgeGroup>
        </BadgeContainer>
        <FavoriteButton
          $active={isFavorited}
          onClick={handleFavorite}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart />
        </FavoriteButton>
      </ImageWrapper>

      {/* CONTENT SECTION */}
      <ContentSection>
        <ProductName title={product.name}>{product.name}</ProductName>
        <ShopName title={product.shop?.name}>{product.shop?.name || 'Shop'}</ShopName>

        {/* PRICE & RATING */}
        <PriceRatingRow>
          <Price>₦{product.price?.toLocaleString()}</Price>
          {product.ratingsAverage ? (
            <RatingStars title={`${product.ratingsAverage} stars (${product.ratingsQuantity || 0} reviews)`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.ratingsAverage.toFixed(1)}
              {product.ratingsQuantity > 0 && (
                <ReviewCount>({product.ratingsQuantity})</ReviewCount>
              )}
            </RatingStars>
          ) : null}
        </PriceRatingRow>
      </ContentSection>

      {/* BUTTONS */}
      <ButtonContainer>
        <ViewDetailsButton href={`/products/${product._id}`}>
          View Details
        </ViewDetailsButton>
        {onEdit && (
          <EditButton onClick={() => onEdit(product._id)} title="Edit product">
            <Edit />
            Edit
          </EditButton>
        )}
      </ButtonContainer>
    </CardContainer>
  );
}