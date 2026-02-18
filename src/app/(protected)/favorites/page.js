'use client';

import { useFavoritesByType, useDeleteFavorite } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Heart } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const MaxWidth = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: #e53935;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const CountBadge = styled.span`
  background: #1a1a1a;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
`;

const ProductCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: #1a1a1a;
  }
`;

const ProductImage = styled.div`
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

const ProductInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

const ShopName = styled.p`
  font-size: 11px;
  color: #999;
  margin: 0 0 8px 0;
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const ViewButton = styled(Link)`
  flex: 1;
  padding: 8px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #666;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
`;

const EmptyAction = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }
`;

export default function FavoritesPage() {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const { data: favorites = [], isLoading } = useFavoritesByType('Product');
  const deleteAvoriteMutation = useDeleteFavorite();

  const handleDelete = async (favoriteId) => {
    if (window.confirm('Remove this product from favorites?')) {
      try {
        await deleteAvoriteMutation.mutateAsync(favoriteId);
        setSuccessMessage('Product removed from favorites');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting favorite:', error);
      }
    }
  };

  if (!user) {
    return (
      <PageContainer>
        <MaxWidth>
          <EmptyState>
            <EmptyIcon>❤️</EmptyIcon>
            <EmptyText>Please log in to view your favorites</EmptyText>
            <EmptyAction href="/login">Log In</EmptyAction>
          </EmptyState>
        </MaxWidth>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <MaxWidth>
          <LoadingContainer>Loading your favorites...</LoadingContainer>
        </MaxWidth>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MaxWidth>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title>
              <Heart size={28} />
              My Favorites
            </Title>
            <CountBadge>{favorites.length} items</CountBadge>
          </div>
          <Subtitle>Products you've saved for later</Subtitle>
        </Header>

        {successMessage && (
          <div
            style={{
              background: '#dcfce7',
              border: '1px solid #16a34a',
              color: '#15803d',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            {successMessage}
          </div>
        )}

        {favorites.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💝</EmptyIcon>
            <EmptyText>You haven't added any favorites yet</EmptyText>
            <EmptyAction href="/products">Browse Products</EmptyAction>
          </EmptyState>
        ) : (
          <GridContainer>
            {favorites.map((favorite) => {
              const product = favorite.item;
              const defaultImage = product?.images?.[0] || '/placeholder.svg';

              return (
                <ProductCard key={favorite._id}>
                  <ProductImage>
                    <img
                      src={defaultImage}
                      alt={product?.title || product?.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </ProductImage>

                  <ProductInfo>
                    <ProductName title={product?.title || product?.name}>
                      {product?.title || product?.name}
                    </ProductName>
                    <ShopName title={product?.seller?.fullName || 'Shop'}>
                      {product?.seller?.fullName || 'Shop'}
                    </ShopName>
                    <Price>
                      ₦{product?.price?.toLocaleString() || 'N/A'}
                    </Price>

                    <Actions>
                      <ViewButton href={`/products/${product._id}`}>
                        View Details
                      </ViewButton>
                      <DeleteButton
                        onClick={() => handleDelete(favorite._id)}
                        title="Remove from favorites"
                        disabled={deleteAvoriteMutation.isPending}
                      >
                        <Trash2 />
                      </DeleteButton>
                    </Actions>
                  </ProductInfo>
                </ProductCard>
              );
            })}
          </GridContainer>
        )}
      </MaxWidth>
    </PageContainer>
  );
}
