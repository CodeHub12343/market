'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';

// Helper function to get full image URL
const getImageUrl = (logoPath) => {
  if (!logoPath) return null;
  
  // If it already starts with http, it's a full URL (external or already absolute)
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // Remove /public/ prefix if present (backend returns /public/uploads/...)
  let cleanPath = logoPath;
  if (logoPath.startsWith('/public/')) {
    cleanPath = logoPath.replace('/public', '');
  }
  
  // Now cleanPath is like /uploads/shops/...
  // Point to the backend server for file serving
  return `http://localhost:5000${cleanPath}`;
};

const CardContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const ShopImage = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  overflow: hidden;
  background-size: cover;
  background-position: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StoreBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const CampusBadge = styled.span`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const ShopName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ShopDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

const StatItem = styled.div`
  text-align: center;

  .stat-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #3b82f6;
  }
`;

const LocationText = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '📍';
  }
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;

  .stars {
    color: #fbbf24;
    font-size: 14px;
  }

  .rating-text {
    font-size: 13px;
    color: #4b5563;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled(Link)`
  flex: 1;
  background-color: #3b82f6;
  color: white;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background-color: #2563eb;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }

  ${props => props.$variant === 'primary' && `
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;

    &:hover {
      background-color: #2563eb;
      border-color: #2563eb;
    }
  `}

  ${props => props.$variant === 'danger' && `
    background-color: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;

    &:hover {
      background-color: #fecaca;
      border-color: #dc2626;
    }
  `}
`;

export default function ShopCard({ shop, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  // Debug logging
  console.log('ShopCard received shop:', {
    id: shop._id,
    name: shop.name,
    logo: shop.logo,
    campus: shop.campus,
    hasLogo: !!shop.logo
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${shop.name}"?`)) {
      onDelete(shop._id);
    }
  };

  return (
    <CardContainer>
      <ShopImage>
        {shop.logo ? (
          <Image 
            src={getImageUrl(shop.logo)}
            alt={shop.name}
            fill
            style={{ objectFit: 'cover' }}
            priority={false}
            unoptimized={true}
          />
        ) : (
          '🏪'
        )}
        <StoreBadge>SHOP</StoreBadge>
        {shop.campus && (
          <CampusBadge title={shop.campus.name}>
            {shop.campus.shortCode || shop.campus.name}
          </CampusBadge>
        )}
      </ShopImage>

      <ContentSection>
        <ShopName>{shop.name}</ShopName>

        <ShopDescription>{shop.description}</ShopDescription>

        <StatsContainer>
          <StatItem>
            <div className="stat-label">Products</div>
            <div className="stat-value">{shop.products || 0}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">Rating</div>
            <div className="stat-value">{shop.rating || '4.5'}</div>
          </StatItem>
        </StatsContainer>

        {shop.location && (
          <LocationText>{shop.location}</LocationText>
        )}

        {shop.rating && (
          <RatingWrapper>
            <span className="stars">★★★★★</span>
            <p className="rating-text">
              {shop.rating} ({shop.reviewCount || 0} reviews)
            </p>
          </RatingWrapper>
        )}

        <ButtonGroup>
          <ViewButton href={`/shops/${shop._id}`}>
            View Shop
          </ViewButton>

          {(onEdit || onDelete) && (
            <>
              {onEdit && (
                <ActionButton
                  $variant="primary"
                  onClick={() => onEdit(shop._id)}
                >
                  Edit
                </ActionButton>
              )}
              {onDelete && (
                <ActionButton
                  $variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </ActionButton>
              )}
            </>
          )}
        </ButtonGroup>
      </ContentSection>
    </CardContainer>
  );
}