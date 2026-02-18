'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useRelatedProducts } from '@/hooks/useRecommendations';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

const Section = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  margin-top: 24px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f5f5f5;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
`;

const ProductCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: white;
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => (props.$active ? '#e53935' : '#999')};
    fill: ${(props) => (props.$active ? '#e53935' : 'none')};
  }
`;

const Info = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
`;

const Name = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const Price = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #666;

  svg {
    width: 10px;
    height: 10px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ViewButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 6px;
  background: #1a1a1a;
  color: white;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  transition: background 0.2s ease;
  margin-top: auto;

  &:hover {
    background: #333;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px 16px;
  color: #999;
  font-size: 13px;
`;

export default function RelatedProducts({ productId, categoryId, limit = 6 }) {
  const { data: products = [], isLoading } = useRelatedProducts(productId, categoryId, limit);
  const [favorites, setFavorites] = useState(new Set());

  const handleFavorite = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (isLoading) {
    return (
      <Section>
        <Title>Similar Products</Title>
        <LoadingContainer>Loading similar products...</LoadingContainer>
      </Section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Section>
      <Title>Similar Products in {categoryId?.name || 'This Category'}</Title>

      <ProductsGrid>
        {products.slice(0, limit).map((product) => (
          <ProductCard key={product._id}>
            <ImageWrapper>
              <img
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
              />
              <FavoriteButton
                $active={favorites.has(product._id)}
                onClick={(e) => handleFavorite(e, product._id)}
                title="Add to favorites"
              >
                <Heart />
              </FavoriteButton>
            </ImageWrapper>

            <Info>
              <Name title={product.name}>{product.name}</Name>
              <Price>₦{product.price?.toLocaleString()}</Price>

              {product.ratingsAverage && (
                <RatingRow>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {product.ratingsAverage.toFixed(1)}
                </RatingRow>
              )}

              <ViewButton href={`/products/${product._id}`}>
                View
              </ViewButton>
            </Info>
          </ProductCard>
        ))}
      </ProductsGrid>
    </Section>
  );
}
