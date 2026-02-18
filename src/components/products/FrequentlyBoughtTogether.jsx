'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useFrequentlyBoughtTogether } from '@/hooks/useRecommendations';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const Section = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e8ecff;
  margin-top: 24px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Badge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const ProductItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  @media (min-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 100%;
    aspect-ratio: 1;
    height: auto;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
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
    width: 14px;
    height: 14px;
    color: ${(props) => (props.$active ? '#e53935' : '#999')};
    fill: ${(props) => (props.$active ? '#e53935' : 'none')};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

const Name = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 11px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const Price = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #666;
  display: none;

  @media (min-width: 640px) {
    display: flex;
  }

  svg {
    width: 10px;
    height: 10px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ViewLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.2s ease;
  margin-top: auto;

  &:hover {
    background: #764ba2;
  }

  @media (min-width: 640px) {
    width: 100%;
    font-size: 10px;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  color: #999;
  font-size: 13px;
`;

export default function FrequentlyBoughtTogether({ productId, limit = 4 }) {
  const { data: products = [], isLoading } = useFrequentlyBoughtTogether(productId, limit);
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
          <Badge>🛍️ Popular</Badge>
          <Title>Customers Also Bought</Title>
        </Header>
        <LoadingContainer>Loading products...</LoadingContainer>
      </Section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Section>
      <Header>
        <Badge>🛍️ Popular</Badge>
        <Title>Customers Also Bought</Title>
      </Header>

      <ProductsContainer>
        {products.slice(0, limit).map((product) => (
          <ProductItem key={product._id}>
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

            <Content>
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

              <ViewLink href={`/products/${product._id}`}>
                <ShoppingCart />
                View
              </ViewLink>
            </Content>
          </ProductItem>
        ))}
      </ProductsContainer>
    </Section>
  );
}
