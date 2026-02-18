'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { MapPin } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import HostelFavoriteButton from '@/components/hostels/HostelFavoriteButton';

// ===== CARD CONTAINER =====
const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    &:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
      transform: translateY(-4px);
    }
  }

  @media (min-width: 1024px) {
    &:hover {
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
      transform: translateY(-8px);
    }
  }
`;

// ===== IMAGE SECTION =====
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
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

const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${(props) => {
    if (props.status === 'available') return '#10b981';
    return '#ef4444';
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const RatingBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${(props) => (props.$liked ? '#ef4444' : '#d1d5db')};
    fill: ${(props) => (props.$liked ? '#ef4444' : 'none')};
    transition: all 0.2s ease;
  }

  &:hover svg {
    color: #ef4444;
  }
`;

// ===== CONTENT SECTION =====
const ContentWrapper = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 14px;
    -webkit-line-clamp: 1;
  }
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    color: #999;
  }

  @media (min-width: 768px) {
    font-size: 11px;

    svg {
      width: 12px;
      height: 12px;
    }
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

// ===== ACTION SECTION =====
const ActionSection = styled.div`
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

const ViewButton = styled(Link)`
  flex: 1;
  background: #1a1a1a;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  border: none;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 12px;

    &:hover {
      box-shadow: 0 8px 16px rgba(26, 26, 26, 0.3);
      transform: translateY(-1px);
      background: #333;
    }
  }

  svg {
    width: 0;
    height: 0;
    display: none;
  }
`;

export default function HostelCard({ hostel }) {
  const image = hostel?.thumbnail || hostel?.images?.[0] || '/placeholder.svg';
  const minPrice = hostel?.minPrice || 0;
  const location = hostel?.location?.address || 'Location not specified';

  return (
    <CardWrapper>
      {/* IMAGE SECTION */}
      <ImageContainer>
        <OptimizedImage
          src={image}
          alt={hostel.name}
          width={400}
          height={300}
          quality={75}
          objectFit="cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {hostel.status && hostel.status !== 'pending-verification' && (
          <StatusBadge status={hostel.status}>{hostel.status}</StatusBadge>
        )}
        <RatingBadge>
          ⭐ {hostel.ratingsAverage || 0} ({hostel.ratingsQuantity || 0})
        </RatingBadge>
        <HostelFavoriteButton
          hostelId={hostel._id}
          size="medium"
          variant="card"
        />
      </ImageContainer>

      {/* CONTENT SECTION */}
      <ContentWrapper>
        <div>
          <Title>{hostel.name}</Title>
          <LocationRow>
            <MapPin />
            <span>{location}</span>
          </LocationRow>
        </div>

        {/* PRICE & RATING */}
        <PriceRatingRow>
          <Price>₦{minPrice.toLocaleString()}</Price>
          {hostel.ratingsAverage && (
            <RatingStars title={`${hostel.ratingsAverage} stars (${hostel.ratingsQuantity || 0} reviews)`}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {hostel.ratingsAverage.toFixed(1)}
              {hostel.ratingsQuantity > 0 && (
                <ReviewCount>({hostel.ratingsQuantity})</ReviewCount>
              )}
            </RatingStars>
          )}
        </PriceRatingRow>
      </ContentWrapper>

      {/* ACTION SECTION */}
      <ActionSection>
        <ViewButton href={`/hostels/${hostel._id}`}>
          View Details
        </ViewButton>
      </ActionSection>
    </CardWrapper>
  );
}
