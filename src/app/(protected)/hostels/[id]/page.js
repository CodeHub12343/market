'use client';

import { useHostel, useDeleteHostel } from '@/hooks/useHostels';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrCreateChat } from '@/hooks/useChats';
import { isHostelOwner } from '@/utils/localStorage';
import HostelDetailSkeleton from '@/components/loaders/HostelDetailSkeleton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';
import styled from 'styled-components';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin, Users, Wifi, Phone, Mail, MessageCircle, MessageSquare, AlertCircle, Check, Star, Eye, Bookmark } from 'lucide-react';
import HostelReviewSection from '@/components/hostels/HostelReviewSection';
import HostelFavoriteButton from '@/components/hostels/HostelFavoriteButton';
import HostelImageGallery from '@/components/hostels/HostelImageGallery';
import RelatedHostels from '@/components/hostels/RelatedHostels';
import PopularHostels from '@/components/hostels/PopularHostels';
import PersonalizedHostelRecommendations from '@/components/hostels/PersonalizedHostelRecommendations';
import { BottomNav } from '@/components/bottom-nav';

// ===== PAGE WRAPPER =====
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    width: 80px;
    background: #ffffff;
    border-right: 1px solid #f0f0f0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

// ===== HEADER SECTION =====
const Header = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const BackBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:active {
    transform: scale(0.9);
  }

  @media (min-width: 768px) {
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.9);
  }

  @media (min-width: 768px) {
    &:hover {
      background: #e5e7eb;
    }
  }
`;

// ===== IMAGE GALLERY SECTION =====
const GallerySection = styled.div`
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
  padding: 0;

  @media (min-width: 1024px) {
    background: #f9f9f9;
    padding: 24px;
    border-radius: 16px;
  }
`;

// ===== CONTENT SECTION =====
const ContentSection = styled.div`
  padding: 20px 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const NameAndPrice = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;
`;

const HostelName = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    margin-top: 20px;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const MainPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const PriceLabel = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${(props) => {
    if (props.status === 'available') return '#d1fae5';
    if (props.status === 'pending-verification') return '#fef3c7';
    return '#fee2e2';
  }};
  color: ${(props) => {
    if (props.status === 'available') return '#047857';
    if (props.status === 'pending-verification') return '#b45309';
    return '#b91c1c';
  }};
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const HostelClass = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ===== INFO CARDS =====
const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d0d0d0;
  }

  .info-icon {
    font-size: 24px;
    margin-bottom: 10px;
    display: block;
  }

  .info-label {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .info-value {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 1.4;
    word-break: break-word;
  }

  @media (min-width: 768px) {
    padding: 18px;

    .info-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }

    .info-label {
      font-size: 12px;
      letter-spacing: 0.7px;
      margin-bottom: 8px;
    }

    .info-value {
      font-size: 15px;
    }
  }
`;

// ===== AMENITIES SECTION =====
const Section = styled.div`
  margin: 24px 0;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const AmenitiesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
`;

const AmenityItem = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-size: 13px;
  color: #0369a1;
  font-weight: 500;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 14px;
  }
`;

// ===== OWNER SECTION =====
const OwnerCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e8e8e8;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d0d0d0;
  }

  @media (min-width: 768px) {
    padding: 18px;
    gap: 16px;
    justify-content: flex-start;
  }
`;

const OwnerAvatar = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 22px;
  }
`;

const OwnerInfo = styled.div`
  flex: 1;
  display: block;
`;

const OwnerName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const OwnerType = styled.p`
  font-size: 11px;
  color: #888;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const OwnerContact = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContactBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.2s ease;
  width: fit-content;

  svg {
    width: 14px;
    height: 14px;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    background: #ffffff;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  }
`;

// ===== ACTION BUTTONS =====
const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 12px;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 12px;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: inherit;
  background: #ffffff;
  color: #1a1a1a;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  svg {
    width: 16px;
    height: 16px;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 13px;
    font-weight: 600;
    gap: 8px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  ${(props) => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
        color: white;
        border: none;
        box-shadow: 0 2px 8px rgba(26, 26, 26, 0.15);
        
        @media (min-width: 768px) {
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
            box-shadow: 0 8px 16px rgba(26, 26, 26, 0.2);
          }
        }
      `;
    }
    if (props.variant === 'secondary') {
      return `
        background: #ffffff;
        color: #1a1a1a;
        border: 1.5px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        
        @media (min-width: 768px) {
          &:hover:not(:disabled) {
            background: #f9f9f9;
            border-color: #d1d5db;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        }
      `;
    }
    if (props.variant === 'danger') {
      return `
        background: #fee2e2;
        color: #dc2626;
        border: 1.5px solid #fca5a5;
        
        @media (min-width: 768px) {
          &:hover:not(:disabled) {
            background: #fecaca;
            border-color: #f87171;
          }
        }
      `;
    }
    return '';
  }}
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  color: #991b1b;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 100px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
`;

const RecommendationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid #f0f0f0;

  @media (min-width: 768px) {
    gap: 40px;
    margin-top: 48px;
  }
`;

// ===== COMPONENT =====
export default function HostelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { data: hostel, isLoading, error } = useHostel(params.id);
  const deleteHostel = useDeleteHostel();
  const createChatMutation = useGetOrCreateChat();

  if (isLoading) {
    return (
      <PageWrapper>
        <MainContent>
          <ContentArea>
            <HostelDetailSkeleton />
          </ContentArea>
        </MainContent>
      </PageWrapper>
    );
  }

  // Extract hostel data
  const actualHostel = hostel?.hostel || hostel;

  if (error || !actualHostel?._id) {
    return (
      <PageWrapper>
        <MainContent>
          <ContentArea>
            <Header>
              <BackBtn href="/hostels">
                <ChevronLeft />
              </BackBtn>
              <HeaderTitle>Hostel Details</HeaderTitle>
            </Header>
            <ContentSection>
              <ErrorContainer>
                <AlertCircle />
                <div>Hostel not found</div>
              </ErrorContainer>
            </ContentSection>
          </ContentArea>
        </MainContent>
      </PageWrapper>
    );
  }

  const hostelId = actualHostel._id || actualHostel.id;
  const isOwner = user?._id === actualHostel.owner?._id;
  const images = actualHostel.images?.length > 0 ? actualHostel.images : [actualHostel.thumbnail];

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this hostel?')) {
      try {
        await deleteHostel.mutateAsync(hostelId);
        router.push('/hostels');
      } catch (err) {
        alert('Failed to delete hostel');
      }
    }
  };

  const handleInquire = () => {
    // Get the owner's user ID from hostel.owner
    const ownerId = actualHostel.owner?._id || actualHostel.owner;
    
    if (!ownerId) {
      alert('Owner information not available');
      return;
    }
    
    if (ownerId === user?._id) {
      alert("You can't message yourself");
      return;
    }
    
    createChatMutation.mutate(ownerId, {
      onSuccess: (chat) => {
        router.push(`/messages/${chat._id}`);
      },
      onError: (error) => {
        alert(error.message || 'Failed to start chat');
      }
    });
  };

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <GallerySection>
          <HostelImageGallery images={images} alt={actualHostel.name} />
        </GallerySection>

        <Header>
          <BackBtn href="/hostels">
            <ChevronLeft />
          </BackBtn>
          <HeaderTitle>Hostel Details</HeaderTitle>
          <HeaderActions>
          </HeaderActions>
        </Header>

        <ContentArea>
          <ContentSection>
            {/* Name & Price */}
            <NameAndPrice>
              <HostelName>{actualHostel.name}</HostelName>
              <HostelClass>{actualHostel.hostelClass}</HostelClass>
              <PriceSection>
                <PriceInfo>
                  <MainPrice>₦{(actualHostel.minPrice || 0).toLocaleString()}</MainPrice>
                  <PriceLabel>/month</PriceLabel>
                </PriceInfo>
                <StatusBadge status={actualHostel.status}>
                  <Check size={14} />
                  {actualHostel.status === 'available' ? 'Available' : actualHostel.status === 'pending-verification' ? 'Pending Verification' : 'Unavailable'}
                </StatusBadge>
              </PriceSection>
            </NameAndPrice>



            {/* Info Cards */}
            <InfoCardsGrid>
              <InfoCard>
                <div className="info-icon">📍</div>
                <div className="info-label">Location</div>
                <div className="info-value">{actualHostel.location?.address || 'Not specified'}</div>
              </InfoCard>
              <InfoCard>
                <div className="info-icon">🏫</div>
                <div className="info-label">Campus</div>
                <div className="info-value">{actualHostel.location?.campus?.name || actualHostel.location?.campus || 'Not specified'}</div>
              </InfoCard>
              <InfoCard>
                <div className="info-icon">🛏️</div>
                <div className="info-label">Room Type</div>
                <div className="info-value">{actualHostel.roomTypes?.[0]?.type || 'Not specified'}</div>
              </InfoCard>
              <InfoCard>
                <div className="info-icon">👥</div>
                <div className="info-label">Capacity</div>
                <div className="info-value">{actualHostel.roomTypes?.[0]?.occupancy || actualHostel.displayCapacity || 'N/A'}</div>
              </InfoCard>
            </InfoCardsGrid>

            {/* Description */}
            {actualHostel.description && (
              <Section>
                <SectionTitle>About</SectionTitle>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{actualHostel.description}</p>
              </Section>
            )}

            {/* Amenities */}
            {actualHostel.amenities?.length > 0 && (
              <Section>
                <SectionTitle>Amenities</SectionTitle>
                <AmenitiesList>
                  {actualHostel.amenities.map((amenity, idx) => (
                    <AmenityItem key={idx}>{amenity}</AmenityItem>
                  ))}
                </AmenitiesList>
              </Section>
            )}

            {/* Owner Info */}
            {actualHostel.owner && (
              <Section>
                <SectionTitle>Owner</SectionTitle>
                <OwnerCard>
                  <OwnerAvatar>{actualHostel.owner.fullName?.charAt(0)}</OwnerAvatar>
                  <OwnerInfo>
                    <OwnerName>{actualHostel.owner.fullName}</OwnerName>
                    <OwnerType>{actualHostel.ownerType}</OwnerType>
                    <OwnerContact>
                      {actualHostel.contact?.phoneNumber && (
                        <ContactBtn href={`tel:${actualHostel.contact.phoneNumber}`}>
                          <Phone />
                          Call
                        </ContactBtn>
                      )}
                      {actualHostel.contact?.email && (
                        <ContactBtn href={`mailto:${actualHostel.contact.email}`}>
                          <Mail />
                          Email
                        </ContactBtn>
                      )}
                    </OwnerContact>
                  </OwnerInfo>
                </OwnerCard>
              </Section>
            )}

            {/* Action Buttons */}
            <ActionButtons>
              <ActionBtn 
                variant="primary"
                onClick={handleInquire}
                disabled={createChatMutation.isPending}
              >
                <MessageCircle />
                <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                  {createChatMutation.isPending ? 'Connecting...' : 'Inquire'}
                </span>
              </ActionBtn>
              {actualHostel.contact?.whatsappNumber && (
                <ActionBtn
                  as="a"
                  href={`https://wa.me/${actualHostel.contact.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  title="WhatsApp"
                >
                  <MessageSquare />
                </ActionBtn>
              )}
              {!isOwner && (
                <HostelFavoriteButton
                  hostelId={hostelId}
                  size="medium"
                  showLabel={false}
                  variant="detail"
                />
              )}
              {isOwner && (
                <>
                  <ActionBtn
                    variant="secondary"
                    onClick={() => router.push(`/hostels/${hostelId}/edit`)}
                    title="Edit hostel"
                  >
                    Edit
                  </ActionBtn>
                  <ActionBtn 
                    variant="danger" 
                    onClick={handleDelete}
                    title="Delete hostel"
                  >
                    Delete
                  </ActionBtn>
                </>
              )}
            </ActionButtons>

            {/* REVIEWS SECTION */}
            <HostelReviewSection hostelId={actualHostel._id} />

          
          </ContentSection>
        </ContentArea>
      </MainContent>

      {/* BOTTOM NAVIGATION */}
      <BottomNav active="hostels" />
    </PageWrapper>
  );
}
