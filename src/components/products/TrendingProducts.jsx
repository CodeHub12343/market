'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useTrendingRecommendations } from '@/hooks/useRecommendations';
import { Heart, TrendingUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Section = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrendingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

const ViewAllButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.2s ease;

  &:hover {
    gap: 8px;
  }

  @media (min-width: 768px) {
    font-size: 13px;
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
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
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
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const TrendingBadgeOnCard = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  z-index: 2;
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 3;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => (props.$active ? '#e53935' : '#999')};
    fill: ${(props) => (props.$active ? '#e53935' : 'none')};
    transition: all 0.2s ease;
  }
`;

const Info = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

const Name = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;

  svg {
    width: 12px;
    height: 12px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #1a1a1a;
  color: white;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  transition: background 0.2s ease;
  margin-top: auto;

  &:hover {
    background: #333;
  }

  @media (min-width: 768px) {
    font-size: 12px;
    padding: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 13px;
`;

export default function TrendingProducts({ limit = 6 }) {
  const { data: recommendations = [], isLoading } = useTrendingRecommendations({
    limit: limit * 2, // Fetch extra to account for filtering
  });
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
        <Header>
          <TitleWrapper>
            <TrendingBadge>
              <TrendingUp />
              Trending
            </TrendingBadge>
            <Title>Popular Right Now</Title>
          </TitleWrapper>
        </Header>
        <LoadingContainer>Loading trending products...</LoadingContainer>
      </Section>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Extract products from recommendations
  const products = recommendations
    .map((rec) => rec.product || rec)
    .filter((p) => p && p._id)
    .slice(0, limit);

  if (products.length === 0) {
    return null;
  }

  return (
    <Section>
      <Header>
        <TitleWrapper>
          <TrendingBadge>
            <TrendingUp />
            Trending
          </TrendingBadge>
          <Title>Popular Right Now</Title>
        </TitleWrapper>
        <ViewAllButton href="/products?trending=true">
          View All
          <ChevronRight size={14} />
        </ViewAllButton>
      </Header>

      <ProductsGrid>
        {products.map((product) => (
          <ProductCard key={product._id}>
            <ImageWrapper>
              <TrendingBadgeOnCard>🔥 Trending</TrendingBadgeOnCard>
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
                View Product
              </ViewButton>
            </Info>
          </ProductCard>
        ))}
      </ProductsGrid>
    </Section>
  );
}
