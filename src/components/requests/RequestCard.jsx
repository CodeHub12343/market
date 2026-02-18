'use client';

import styled from 'styled-components';
import Link from 'next/link';

// Helper to format relative time
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

// ===== MAIN CARD CONTAINER =====
const Card = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%);
  border-radius: 14px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 280px;

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
    min-height: 300px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
    border-radius: 18px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      border-color: #1f2937;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      transform: translateY(-6px);
      background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%);
    }
  }
`;

// ===== HEADER WITH CATEGORY AND STATUS =====
const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`;

// ===== IMAGE CONTAINER =====
const ImageContainer = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: 640px) {
    height: 180px;
    margin-bottom: 14px;
    border-radius: 12px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// ===== TITLE =====
const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;

  @media (min-width: 640px) {
    font-size: 16px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

// ===== CATEGORY BADGE =====
const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-transform: capitalize;
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 640px) {
    font-size: 12px;
    padding: 5px 12px;
  }
`;

// ===== STATUS BADGE =====
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: ${props => {
    switch(props.status) {
      case 'open': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'accepted': return '#bfdbfe';
      case 'closed': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'open': return '#047857';
      case 'pending': return '#92400e';
      case 'accepted': return '#1e40af';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  }};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 640px) {
    font-size: 12px;
    padding: 5px 12px;
  }
`;

// ===== PRICE SECTION =====
const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 14px;

  @media (min-width: 640px) {
    margin-bottom: 16px;
  }
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;

  @media (min-width: 640px) {
    font-size: 20px;
  }
`;

// ===== META INFO GRID =====
const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  flex: 1;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #6b7280;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const MetaIcon = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937;
  flex-shrink: 0;

  svg {
    width: 13px;
    height: 13px;
  }
`;

// ===== FOOTER =====
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;

  @media (min-width: 640px) {
    padding-top: 14px;
  }
`;

const TimeAgo = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 12px;
  }
`;

const OffersCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #1f2937;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;

  @media (min-width: 640px) {
    padding: 6px 12px;
    font-size: 12px;
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

export default function RequestCard({ request }) {
  if (!request) return null;

  const offerCount = request.analytics?.offersCount || 0;
  const formattedPrice = request.formattedPrice || (request.desiredPrice ? `₦${Number(request.desiredPrice).toLocaleString()}` : '');
  
  // Handle category - can be an object with name or just a string/ID
  const categoryName = typeof request.category === 'object' && request.category?.name 
    ? request.category.name 
    : 'General';

  const statusMap = {
    'open': 'Open',
    'pending': 'Pending',
    'accepted': 'Accepted',
    'closed': 'Closed'
  };

  const status = request.status || 'open';
  const statusLabel = statusMap[status] || 'Open';

  return (
    <Card href={`/requests/${request._id}`}>
      <CardHeader>
        <CategoryBadge>{categoryName}</CategoryBadge>
        <StatusBadge status={status}>{statusLabel}</StatusBadge>
      </CardHeader>

      {request.images && request.images.length > 0 && (
        <ImageContainer>
          <img src={request.images[0]} alt={request.title} onError={(e) => { e.target.style.display = 'none'; }} />
        </ImageContainer>
      )}

      <Title>{request.title}</Title>

      {(request.desiredPrice || request.formattedPrice) && (
        <PriceSection>
          <Price>{formattedPrice}</Price>
        </PriceSection>
      )}

      <MetaGrid>
        <MetaItem>
          <MetaIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </MetaIcon>
          <span>{formatDistanceToNow(request.createdAt)} ago</span>
        </MetaItem>
        {request.location?.address && (
          <MetaItem>
            <MetaIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </MetaIcon>
            <span>{request.location.address}</span>
          </MetaItem>
        )}
        {request.requester && request.requester.fullName && (
          <MetaItem>
            <MetaIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </MetaIcon>
            <span>by {request.requester.fullName.split(' ')[0]}</span>
          </MetaItem>
        )}
      </MetaGrid>

      <Footer>
        <OffersCount>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <span>{offerCount} {offerCount === 1 ? 'offer' : 'offers'}</span>
        </OffersCount>
      </Footer>
    </Card>
  );
}