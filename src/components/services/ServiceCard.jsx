// src/components/services/ServiceCard.jsx

import styled from 'styled-components';
import Link from 'next/link';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryById } from '@/services/categories';

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
  }

  @media (min-width: 768px) {
    border-radius: 12px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  overflow: hidden;

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

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 48px;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: ${props => {
    switch (props.$status) {
      case 'available':
        return '#d4edda';
      case 'on-demand':
        return '#fff3cd';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'available':
        return '#155724';
      case 'on-demand':
        return '#856404';
      default:
        return '#666';
    }
  }};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$isFavorite ? '#ff4444' : '#999'};
    fill: ${props => props.$isFavorite ? '#ff4444' : 'none'};
  }
`;

const ContentContainer = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProviderName = styled.div`
  font-size: 11px;
  color: #999;
  margin: 0;
`;

const PriceRatingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`;

const PriceAmount = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

const PricePeriod = styled.span`
  font-size: 11px;
  color: #999;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 11px;
  color: #666;

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

const ViewDetailsButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #333333;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

export default function ServiceCard({ service }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine if category is an ID (string without spaces and looks like MongoDB ObjectId)
  const categoryId = typeof service?.category === 'string' && service.category.length === 24 
    ? service.category 
    : null;

  // Fetch category details if we only have an ID - MUST be called before early return
  const { data: categoryData } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Safely get category name from various possible formats - MUST be before early return
  const categoryName = useMemo(() => {
    if (!service) return null;
    
    // If we have category data from the ID lookup
    if (categoryData) {
      const catData = typeof categoryData === 'object' ? categoryData : {};
      return catData.name || catData.data?.name || null;
    }
    
    // If category is an object with name property
    if (typeof service.category === 'object' && service.category?.name) {
      return service.category.name;
    }
    
    // If category is already a string name (not an ID)
    if (typeof service.category === 'string' && service.category.length !== 24) {
      return service.category;
    }
    
    return null;
  }, [service, categoryData]);

  // Safely get shop name - MUST be before early return
  const shopName = useMemo(() => {
    if (!service) return null;
    
    if (typeof service.shop === 'object' && service.shop?.name) {
      return service.shop.name;
    }
    if (typeof service.shop === 'string' && service.shop.length !== 24) {
      return service.shop;
    }
    return null;
  }, [service]);

  // Safety check - ensure service is a valid object, not a React element or invalid type
  if (!service || typeof service !== 'object' || service.$$typeof) return null;

  const getProviderInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  return (
    <Card>
      <ImageContainer>
        {service.images && Array.isArray(service.images) && service.images.length > 0 ? (
          <img src={String(service.images[0])} alt={String(service.title || 'Service')} />
        ) : (
          <PlaceholderImage>📦</PlaceholderImage>
        )}
        {categoryName && (
          <CategoryBadge>{String(categoryName)}</CategoryBadge>
        )}
        <FavoriteButton
          $isFavorite={isFavorite}
          onClick={() => setIsFavorite(!isFavorite)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart />
        </FavoriteButton>
      </ImageContainer>

      <ContentContainer>
        <div>
          <Title>{String(service.title || 'Untitled Service')}</Title>
          {shopName && (
            <ProviderName>{String(shopName)}</ProviderName>
          )}
        </div>

        <PriceRatingRow>
          <Price>
            <PriceAmount>₦{Number(service.price || 0).toLocaleString()}</PriceAmount>
            {service.durationUnit && (
              <PricePeriod>/{String(service.durationUnit)}</PricePeriod>
            )}
          </Price>
          {typeof service.ratingsAverage === 'number' && service.ratingsAverage > 0 && (
            <RatingStars title={`${service.ratingsAverage} stars (${service.ratingsQuantity || 0} reviews)`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {service.ratingsAverage.toFixed(1)}
              {service.ratingsQuantity > 0 && (
                <ReviewCount>({service.ratingsQuantity})</ReviewCount>
              )}
            </RatingStars>
          )}
        </PriceRatingRow>

        {service._id && (
          <ViewDetailsButton href={`/services/${service._id}`}>
            View Details
            <ArrowRight />
          </ViewDetailsButton>
        )}
      </ContentContainer>
    </Card>
  );
}
