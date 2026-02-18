// src/app/(protected)/services/[id]/page.js

'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter, useParams } from 'next/navigation';
import { setMetaTags, addStructuredData, generateServiceMeta, generateServiceSchema } from '@/utils/seoMetaTags';
import { useService, useDeleteService, useRateService } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useGetOrCreateChat } from '@/hooks/useChats';
import ServiceReviewSection from '@/components/service-reviews/ServiceReviewSection';
import ServiceImageGallery from '@/components/services/ServiceImageGallery';
import ServiceOptionSelector from '@/components/services/ServiceOptionSelector';
import ServiceFavoriteButton from '@/components/services/ServiceFavoriteButton';
import RelatedServices from '@/components/services/RelatedServices';
import PopularServices from '@/components/services/PopularServices';
import PersonalizedServiceRecommendations from '@/components/services/PersonalizedServiceRecommendations';
import ServiceDetailSkeleton from '@/components/loaders/ServiceDetailSkeleton';
import { BottomNav } from '@/components/bottom-nav';
import { Star, Heart, MapPin, Clock, DollarSign, ChevronLeft, Edit2, Trash2, MessageCircle, MessageSquare } from 'lucide-react';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

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
  padding-bottom: 120px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }

  @media (min-width: 1440px) {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: calc(60px + 16px);

  @media (min-width: 1024px) {
    margin-bottom: 0;
    gap: 24px;
    padding: 32px 24px;
    grid-column: 1;
  }

  @media (min-width: 1440px) {
    padding: 32px 24px;
  }
`;

const ImageGallery = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  overflow: hidden;

  @media (min-width: 768px) {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: #666;
  font-size: 64px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    display: none;
  }

  &:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  background: #ffffff;
  padding: 40px 16px;
  color: #1a1a1a;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 60px 24px;
  }

  @media (min-width: 1024px) {
    padding: 80px 32px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -1px;
  margin: 0 0 16px 0;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 36px;
  }

  @media (min-width: 1024px) {
    font-size: 42px;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const NotificationPreferencesSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const PreferenceLabel = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;

  small {
    font-size: 12px;
    color: #999;
    font-weight: 400;
  }
`;

const CheckBox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #1a1a1a;
`;

const PreferencesButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const PrefsButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: ${props => props.$primary ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.$primary ? '#ffffff' : '#1a1a1a'};
  border: 1px solid ${props => props.$primary ? '#1a1a1a' : '#e5e5e5'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$primary ? '#333333' : '#f0f0f0'};
    border-color: ${props => props.$primary ? '#333333' : '#d5d5d5'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.$isFavorite ? '#ff4444' : '#999'};
    fill: ${props => props.$isFavorite ? '#ff4444' : 'none'};
  }
`;

const TitleSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 1024px) {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    margin: -32px -24px 0 -24px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 36px;
    margin-bottom: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 42px;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const PriceAmount = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const PricePeriod = styled.span`
  font-size: 14px;
  color: #999;
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fff8e1;
  border-radius: 6px;
  border: 1px solid #ffe082;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;

  svg {
    width: 14px;
    height: 14px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const RatingText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const DescriptionSection = styled.div`
  padding: 20px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 28px 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 14px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.7;
  margin: 0;
  font-weight: 400;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 28px 32px;
  }
`;

const InfoCard = styled.div`
  padding: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d0d0d0;
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

const InfoLabel = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 12px;
    margin-bottom: 10px;
  }
`;

const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ProviderSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const ProviderCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const ProviderAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ProviderMeta = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const MessageButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #000000;
  border: 2px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #333333;
    border-color: #333333;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #ffffff;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-top: auto;

  @media (min-width: 1024px) {
    position: relative;
    top: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  background: ${props => props.$primary ? '#000000' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#000000'};
  border: 2px solid ${props => props.$primary ? '#000000' : '#000000'};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$primary ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'};

  &:hover {
    background: ${props => props.$primary ? '#333333' : '#f5f5f5'};
    border-color: ${props => props.$primary ? '#333333' : '#333333'};
    transform: translateY(-2px);
    box-shadow: ${props => props.$primary ? '0 8px 24px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.08)'};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DetailsSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;
    flex-shrink: 0;
  }
`;

const DetailLabel = styled.span`
  color: #999;
  font-size: 13px;
  flex: 1;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ReviewsSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const ReviewCard = styled.div`
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewerName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 8px;

  svg {
    width: 12px;
    height: 12px;
    color: #ffc107;
    fill: #ffc107;
  }
`;

const ReviewText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const ReviewFormSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

const StarRatingInput = styled.div`
  display: flex;
  gap: 6px;
`;

const StarButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$filled ? '#ffc107' : '#e5e5e5'};
    fill: ${props => props.$filled ? '#ffc107' : 'none'};
    transition: all 0.2s ease;
  }
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  color: #1a1a1a;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitReviewButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333333;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const RightPanel = styled.aside`
  display: none;

  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    grid-column: 2;
    background: #ffffff;
    border-left: 1px solid #f0f0f0;
    height: fit-content;
    position: sticky;
    top: 32px;
  }
`;

const SideCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const BottomNavWrapper = styled.div`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export default function ServiceDetailsPage() {
  useProtectedRoute();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: serviceData, isLoading, error, refetch } = useService(params.id);
  const deleteServiceMutation = useDeleteService();
  const rateServiceMutation = useRateService();
  const createChatMutation = useGetOrCreateChat();
  
  // ✅ SEO: Set meta tags and structured data
  useEffect(() => {
    if (serviceData?.data) {
      const service = serviceData.data;
      const meta = generateServiceMeta(service);
      setMetaTags(meta);
      const cleanup = addStructuredData(generateServiceSchema(service));
      return cleanup;
    }
  }, [serviceData]);
  
  const service = serviceData?.data;
  const reviews = service?.reviews || [];
  const isOwner = user?._id === service?.provider?._id || user?._id === service?.shop?._id;

  const handleDelete = async () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteServiceMutation.mutateAsync(service._id);
        router.push('/services');
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/services/${service._id}/edit`);
  };

  const handleBookService = () => {
    // Get the provider's user ID from service.shop.owner
    const providerId = service.shop?.owner?._id || 
                      service.shop?.owner || 
                      service.provider?._id ||
                      service.provider;
    
    if (!providerId) {
      alert('Provider information not available');
      return;
    }
    
    if (providerId === user?._id) {
      alert("You can't message yourself");
      return;
    }
    
    createChatMutation.mutate(providerId, {
      onSuccess: (chat) => {
        router.push(`/messages/${chat._id}`);
      },
      onError: (error) => {
        alert(error.message || 'Failed to start chat');
      }
    });
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Sidebar />
        <MainContent>
          <ContentArea>
            <ServiceDetailSkeleton />
          </ContentArea>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  if (error || !service) {
    return (
      <PageWrapper>
        <Sidebar />
        <MainContent>
          <ContentArea>
            <TitleSection>
              <Title>Service not found</Title>
            </TitleSection>
          </ContentArea>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

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
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <ContentArea>
          <ServiceImageGallery
            images={
              service.images && Array.isArray(service.images) && service.images.length > 0
                ? service.images
                : []
            }
            alt={service.title}
          />

          <HeroSection>
            <HeroContent>
              {service.category && typeof service.category === 'object' && service.category.name ? (
                <CategoryBadge style={{ background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }}>{service.category.name}</CategoryBadge>
              ) : service.category && typeof service.category === 'string' && service.category.length !== 24 ? (
                <CategoryBadge style={{ background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }}>{service.category}</CategoryBadge>
              ) : null}
              
              <HeroTitle>{service.title}</HeroTitle>

              <HeroMeta>
                <div style={{ fontSize: '32px', fontWeight: 900 }}>₦{Number(service.price || 0).toLocaleString()}</div>
                {service.durationUnit && (
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>/{service.durationUnit}</div>
                )}
                {service.ratingsAverage && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginLeft: 'auto'
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.round(service.ratingsAverage) ? '#ffc107' : 'rgba(255, 255, 255, 0.3)'}
                          color={i < Math.round(service.ratingsAverage) ? '#ffc107' : 'rgba(255, 255, 255, 0.3)'}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      {service.ratingsAverage.toFixed(1)} ({service.ratingsQuantity})
                    </span>
                  </div>
                )}
              </HeroMeta>
            </HeroContent>
          </HeroSection>

          <TitleSection style={{ display: 'none' }}></TitleSection>

          {service.description && (
            <DescriptionSection>
              <SectionTitle>About this service</SectionTitle>
              <Description>{service.description}</Description>
            </DescriptionSection>
          )}

          <InfoGrid>
            {service.duration && (
              <InfoCard>
                <InfoLabel>Duration</InfoLabel>
                <InfoValue>{service.duration}h</InfoValue>
              </InfoCard>
            )}
            {service.location && (
              <InfoCard>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>
                  {typeof service.location === 'string'
                    ? service.location
                    : service.location?.address || 'On-site'}
                </InfoValue>
              </InfoCard>
            )}
            <InfoCard>
              <InfoLabel>Booking</InfoLabel>
              <InfoValue>
                {service.bookingType ? (
                  service.bookingType === 'available' ? '✓ Available Now' : 
                  service.bookingType === 'on-demand' ? '⚡ On Demand' :
                  '📅 By Appointment'
                ) : '✓ Ready'}
              </InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Views</InfoLabel>
              <InfoValue>{service.analytics?.views || 0}</InfoValue>
            </InfoCard>
          </InfoGrid>

          {/* Availability Schedule Section */}
          {service.availability && (service.availability.days?.length > 0 || service.availability.startTime || service.availability.endTime) && (
            <InfoGrid>
              {service.availability.days && service.availability.days.length > 0 && (
                <InfoCard style={{ gridColumn: '1 / -1' }}>
                  <InfoLabel>Available Days</InfoLabel>
                  <InfoValue>
                    {service.availability.days
                      .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                      .join(', ')}
                  </InfoValue>
                </InfoCard>
              )}
              {service.availability.startTime && (
                <InfoCard>
                  <InfoLabel>Opens</InfoLabel>
                  <InfoValue>{service.availability.startTime}</InfoValue>
                </InfoCard>
              )}
              {service.availability.endTime && (
                <InfoCard>
                  <InfoLabel>Closes</InfoLabel>
                  <InfoValue>{service.availability.endTime}</InfoValue>
                </InfoCard>
              )}
              {service.maxBookings && (
                <InfoCard>
                  <InfoLabel>Max Bookings</InfoLabel>
                  <InfoValue>{service.maxBookings}</InfoValue>
                </InfoCard>
              )}
            </InfoGrid>
          )}

          {/* Service Settings Section */}
          {service.settings && (
            <InfoGrid>
              {service.settings.allowInstantBooking && (
                <InfoCard>
                  <InfoLabel>Booking</InfoLabel>
                  <InfoValue>⚡ Instant Booking</InfoValue>
                </InfoCard>
              )}
              {service.settings.requireApproval && (
                <InfoCard>
                  <InfoLabel>Approval</InfoLabel>
                  <InfoValue>📋 Approval Required</InfoValue>
                </InfoCard>
              )}
              {service.settings.cancellationPolicy && (
                <InfoCard>
                  <InfoLabel>Cancellation</InfoLabel>
                  <InfoValue>
                    {service.settings.cancellationPolicy === 'flexible' ? '✓ Flexible' :
                     service.settings.cancellationPolicy === 'moderate' ? '⏱ 24h Notice' :
                     '🔒 Strict'}
                  </InfoValue>
                </InfoCard>
              )}
            </InfoGrid>
          )}

          {service.provider && (
            <ProviderSection>
              <SectionTitle>Service Provider</SectionTitle>
              <ProviderCard>
                <ProviderAvatar>
                  {getProviderInitials(
                    typeof service.provider === 'object' 
                      ? (service.provider.fullName || 'Provider')
                      : 'Provider'
                  )}
                </ProviderAvatar>
                <ProviderInfo>
                  <ProviderName>
                    {typeof service.provider === 'object' 
                      ? (service.provider.fullName || 'Unknown Provider')
                      : 'Unknown Provider'}
                  </ProviderName>
                  <ProviderMeta>Verified seller • {service.analytics?.views || 0} views</ProviderMeta>
                </ProviderInfo>
                <MessageButton 
                  title="Message provider"
                  onClick={handleBookService}
                  disabled={createChatMutation.isPending}
                >
                  <MessageCircle />
                </MessageButton>
                {service.whatsappNumber && (
                  <MessageButton
                    as="a"
                    href={`https://wa.me/${String(service.whatsappNumber).replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contact via WhatsApp"
                  >
                    <MessageSquare />
                  </MessageButton>
                )}
              </ProviderCard>
            </ProviderSection>
          )}

          {!isOwner && (
            <ServiceOptionSelector
              serviceId={service._id}
              onOptionSelect={(option) => {
                console.log('Selected option:', option);
              }}
            />
          )}

          <ActionButtons>
            {isOwner ? (
              <>
                <ActionButton $primary onClick={handleEdit}>
                  <Edit2 />
                  Edit Service
                </ActionButton>
                <ActionButton onClick={handleDelete} disabled={deleteServiceMutation.isPending}>
                  <Trash2 />
                  {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
                </ActionButton>
              </>
            ) : null}
          </ActionButtons>

          {/* Notification Preferences */}

          {(service.location || service.duration || service.durationUnit) && (
            <DetailsSection>
              <SectionTitle>Service Details</SectionTitle>
              {service.location && (
                <DetailRow>
                  <MapPin />
                  <DetailLabel>Location</DetailLabel>
                  <DetailValue>
                    {typeof service.location === 'string'
                      ? service.location
                      : service.location?.address || 'On-site'}
                  </DetailValue>
                </DetailRow>
              )}
              {service.duration && (
                <DetailRow>
                  <Clock />
                  <DetailLabel>Duration</DetailLabel>
                  <DetailValue>{service.duration} {service.durationUnit}</DetailValue>
                </DetailRow>
              )}
              {service.durationUnit && (
                <DetailRow>
                  <DollarSign />
                  <DetailLabel>Price Period</DetailLabel>
                  <DetailValue>{service.durationUnit}</DetailValue>
                </DetailRow>
              )}
            </DetailsSection>
          )}

          {service.reviews && service.reviews.length > 0 && (
            <ReviewsSection>
              <SectionTitle>Customer Reviews</SectionTitle>
              {service.reviews.slice(0, 3).map((review, idx) => (
                <ReviewCard key={idx}>
                  <ReviewHeader>
                    <ReviewerName>{review.reviewerName || 'Anonymous'}</ReviewerName>
                    <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                  </ReviewHeader>
                  {review.rating && (
                    <ReviewRating>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill={i < review.rating ? '#ffc107' : '#f0f0f0'} />
                      ))}
                    </ReviewRating>
                  )}
                  <ReviewText>{review.comment}</ReviewText>
                </ReviewCard>
              ))}
            </ReviewsSection>
          )}

          {/* NEW COMPLETE REVIEW SECTION */}
          <ServiceReviewSection serviceId={service._id} />

          {/* RECOMMENDATIONS SECTION */}
          {/* Related Services - Same category or similar services */}
         
        </ContentArea>

        <RightPanel>
          <SideCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>📋 Service Info</h3>
              {!isOwner && (
                <ServiceFavoriteButton
                  serviceId={service._id}
                  size="medium"
                  onFavoritedChange={setIsFavorite}
                />
              )}
            </div>
            <p>This premium service is designed to meet high standards. Check the details above for more information about availability and pricing.</p>
          </SideCard>

          <SideCard>
            <h3>💡 Quick Tip</h3>
            <p>Verify provider credentials and read customer reviews before booking to ensure quality service.</p>
          </SideCard>

          <SideCard>
            <h3>✨ Why Book</h3>
            <p>Reliable service • Verified providers • Secure payments • Customer support</p>
          </SideCard>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="services" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}