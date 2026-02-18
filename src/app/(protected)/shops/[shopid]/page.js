'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { setMetaTags, addStructuredData, generateShopMeta, generateProductSchema } from '@/utils/seoMetaTags';
import { useShopById, useDeleteShop } from '@/hooks/useShops';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useGetOrCreateChat } from '@/hooks/useChats';
import { BottomNav } from '@/components/bottom-nav';
import ProductCardSkeleton from '@/components/loaders/ProductCardSkeleton';
import { ShopDetailsSkeleton } from '@/components/loaders/ShopDetailsSkeleton';
import { ChevronLeft, Edit2, Trash2, Star, MapPin, Tag, ShoppingBag, DollarSign, Clock, MessageCircle, MessageSquare, Eye } from 'lucide-react';

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

// Helper to safely get nested values
const getValue = (obj, path, defaultValue = 'N/A') => {
  try {
    const value = path.split('.').reduce((current, prop) => current?.[prop], obj);
    return value || defaultValue;
  } catch {
    return defaultValue;
  }
};

/* ============ PAGE LAYOUT ============ */
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/* ============ HEADER SECTION ============ */
const HeaderWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 40;

  @media (min-width: 768px) {
    padding: 20px 24px;
  }

  @media (min-width: 1024px) {
    padding: 24px 32px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.05);
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  color: #1a1a1a;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.05);
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  color: #1a1a1a;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(26, 26, 26, 0.08);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const DeleteButton = styled(IconButton)`
  color: #dc2626;
  border-color: #fecaca;
  background: rgba(220, 38, 38, 0.05);

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    border-color: #fca5a5;
  }
`;

/* ============ CONTENT SECTION ============ */
const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 20px;

  @media (min-width: 768px) {
    padding: 24px 20px;
    gap: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px 24px;
    gap: 28px;
  }
`;

/* ============ HERO SECTION ============ */
const HeroCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  border-radius: 16px;
  padding: 24px 16px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 28px 24px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    gap: 20px;
  }
`;

const CampusBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  backdrop-filter: blur(4px);

  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #2a2a2a 0%, #404040 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 13px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    height: 240px;
  }

  @media (min-width: 1024px) {
    height: 280px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ShopName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

const ShopDescription = styled.p`
  font-size: 13px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const ShopMeta = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ============ INFO CARDS GRID ============ */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const InfoCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 18px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(26, 26, 26, 0.08);
  border-radius: 8px;
  color: #1a1a1a;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const InfoCardTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const InfoCardValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const InfoCardSubtext = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ============ DETAILS SECTION ============ */
const DetailsSection = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 24px 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 14px 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const BadgeCategory = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #1a1a1a;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  @media (min-width: 768px) {
    padding: 5px 12px;
    font-size: 13px;
  }
`;

/* ============ ACTION BUTTONS ============ */
const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const EditButtonFull = styled.button`
  padding: 14px 16px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #333333;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 768px) {
    padding: 16px;
    font-size: 15px;
  }
`;

const DeleteButtonFull = styled(EditButtonFull)`
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid #fecaca;

  &:hover {
    background: rgba(220, 38, 38, 0.15);
    border-color: #fca5a5;
  }
`;

/* ============ LOADING & ERROR STATES ============ */
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 80px 20px;
    gap: 20px;
  }
`;

const EmptyStateIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const EmptyStateText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  max-width: 300px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

/* ============ BOTTOM NAV ============ */
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

/* ============ PRODUCTS & SERVICES SECTION ============ */
const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
`;

const ItemCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ItemImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
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

const ItemInfo = styled.div`
  padding: 12px;
`;

const ItemName = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ItemPrice = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
`;

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopid;

  console.log('ShopDetailPage: Current params:', params);
  console.log('ShopDetailPage: Extracted shopId:', shopId);

  const { data: shop, isLoading, error } = useShopById(shopId);
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 100, { shop: shopId });
  const deleteShop = useDeleteShop();

  // Auth + chat
  const { user, isLoading: userLoading } = useAuth();
  const createChatMutation = useGetOrCreateChat();
  
  // ✅ SEO: Set meta tags and structured data
  useEffect(() => {
    if (shop) {
      const meta = generateShopMeta(shop);
      setMetaTags(meta);
      if (shop.products?.[0]) {
        const cleanup = addStructuredData(generateProductSchema(shop.products[0], shop._id));
        return cleanup;
      }
    }
  }, [shop]);

  // Extract products array from nested response
  let products = [];
  if (productsData?.data?.products && Array.isArray(productsData.data.products)) {
    products = productsData.data.products;
  } else if (Array.isArray(productsData?.data)) {
    products = productsData.data;
  } else if (Array.isArray(productsData)) {
    products = productsData;
  }

  // Debug logging
  console.log('=== SHOP PRODUCTS DEBUG ===');
  console.log('Shop ID:', shopId);
  console.log('Products Loading:', productsLoading);
  console.log('User Auth:', !!user);
  console.log('Raw Products Data:', productsData);
  console.log('Products Data keys:', productsData ? Object.keys(productsData) : 'null');
  console.log('Extracted Products Array:', products);
  console.log('Products Length:', products.length);
  console.log('========================');

  console.log('ShopDetailPage: Shop data:', shop);
  console.log('ShopDetailPage: Shop object keys:', shop ? Object.keys(shop) : 'N/A');
  console.log('ShopDetailPage: Is loading:', isLoading);
  console.log('ShopDetailPage: Error:', error);

  // Determine ownership - prefer backend flag if present
  const isOwner = (() => {
    if (!user || !shop) return false;
    if (shop.isOwner === true) return true;
    const userId = String(user._id);
    const ownerId = shop?.owner?._id || shop?.owner;
    if (ownerId && String(ownerId) === userId) return true;
    return false;
  })();

  const handleContactShop = () => {
    const sellerId = shop?.owner?._id || shop?.owner;
    if (!sellerId) return alert('Seller information not available');
    if (String(sellerId) === String(user?._id)) return alert("You can't message yourself");

    createChatMutation.mutate(sellerId, {
      onSuccess: (chat) => {
        console.log('✅ Chat created:', chat._id);
        router.push(`/messages/${chat._id}`);
      },
      onError: (error) => {
        console.error('❌ Failed to create chat:', error);
        alert(error.message || 'Failed to start chat');
      }
    });
  };

  const handleEdit = () => {
    router.push(`/shops/${shopId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
      try {
        await deleteShop.mutateAsync(shopId);
        alert('Shop deleted successfully');
        router.push('/shops');
      } catch (err) {
        alert('Failed to delete shop');
      }
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <MainContent>
          <HeaderWrapper>
            <HeaderTop>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <HeaderTitle>Shop Details</HeaderTitle>
              <div style={{ width: '40px' }} />
            </HeaderTop>
          </HeaderWrapper>
          <ContentWrapper>
            <ShopDetailsSkeleton />
          </ContentWrapper>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav active="shops" />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  if (error || !shop) {
    return (
      <PageWrapper>
        <MainContent>
          <HeaderWrapper>
            <HeaderTop>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <HeaderTitle>Shop Details</HeaderTitle>
              <div style={{ width: '40px' }} />
            </HeaderTop>
          </HeaderWrapper>
          <EmptyState>
            <EmptyStateIcon>
              <ShoppingBag />
            </EmptyStateIcon>
            <EmptyStateTitle>Shop Not Found</EmptyStateTitle>
            <EmptyStateText>The shop you&apos;re looking for doesn&apos;t exist or has been deleted.</EmptyStateText>
          </EmptyState>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav active="shops" />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  const rating = shop.ratingsAverage || 4.5;
  const ratingStars = Math.round(rating);

  // Debug logging
  console.log('=== SHOP DATA DEBUG ===');
  console.log('shop._id:', shop._id);
  console.log('shop.name:', shop.name);
  console.log('shop.description:', shop.description);
  console.log('shop.logo:', shop.logo);
  console.log('shop.campus:', shop.campus);
  console.log('shop.category:', shop.category);
  console.log('shop.location:', shop.location);
  console.log('shop.isActive:', shop.isActive);
  console.log('shop.ratingsAverage:', shop.ratingsAverage);
  console.log('shop.createdAt:', shop.createdAt);
  console.log('shop keys:', Object.keys(shop));
  console.log('========================');

  return (
    <PageWrapper>
      <MainContent>
        {/* HEADER */}
        <HeaderWrapper>
          <HeaderTop>
            <BackButton onClick={() => router.back()}>
              <ChevronLeft />
            </BackButton>
            <HeaderTitle>{shop.name}</HeaderTitle>
            <ActionButtons>
              {isOwner ? (
                <>
                  <IconButton onClick={handleEdit} title="Edit shop">
                    <Edit2 />
                  </IconButton>
                  <DeleteButton onClick={handleDelete} title="Delete shop">
                    <Trash2 />
                  </DeleteButton>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      if (!user) return router.push('/login');
                      handleContactShop();
                    }}
                    title="Message shop"
                  >
                    <MessageCircle />
                  </IconButton>
                  {shop?.whatsappNumber && (
                    <IconButton
                      as="a"
                      href={`https://wa.me/${shop.whatsappNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Contact via WhatsApp: ${shop.whatsappNumber}`}
                      style={{ background: '#25D366', color: 'white', border: 'none' }}
                    >
                      <MessageSquare />
                    </IconButton>
                  )}
                </>
              )}
            </ActionButtons>
          </HeaderTop>
        </HeaderWrapper>

        {/* CONTENT */}
        <ContentWrapper>
          {/* HERO CARD */}
          <HeroCard>
            <HeroImage>
              {shop.logo ? (
                <Image 
                  src={getImageUrl(shop.logo)}
                  alt={shop.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={true}
                  unoptimized={true}
                />
              ) : (
                'No Image'
              )}
              {shop.campus && (
                <CampusBadge>
                  {shop.campus.shortCode || shop.campus.name}
                </CampusBadge>
              )}
            </HeroImage>
            <HeroContent>
              <ShopName>{shop.name}</ShopName>
              <ShopDescription>{shop.description}</ShopDescription>
              <ShopMeta>
                <MetaItem>
                  <Star size={16} fill="currentColor" />
                  {ratingStars > 0 ? (
                    <>
                      {'★'.repeat(ratingStars)}
                      {ratingStars < 5 && '☆'.repeat(5 - ratingStars)}
                    </>
                  ) : (
                    'No ratings'
                  )}
                </MetaItem>
                {shop.campus && (
                  <MetaItem>
                    <Tag size={16} />
                    {shop.campus.shortCode || shop.campus.name}
                  </MetaItem>
                )}
                {shop.location && (
                  <MetaItem>
                    <MapPin size={16} />
                    {shop.location}
                  </MetaItem>
                )}
                {shop.isVerified && (
                  <MetaItem style={{ color: '#2e7d32', opacity: 1 }}>
                    ✓ Verified
                  </MetaItem>
                )}
              </ShopMeta>
            </HeroContent>
          </HeroCard>

          {/* INFO GRID */}
          <InfoGrid>
            <InfoCard>
              <InfoCardHeader>
                <InfoCardIcon>
                  <ShoppingBag />
                </InfoCardIcon>
                <InfoCardTitle>Products</InfoCardTitle>
              </InfoCardHeader>
              <InfoCardValue>{shop.productCount || 0}</InfoCardValue>
              <InfoCardSubtext>Active products in shop</InfoCardSubtext>
            </InfoCard>

            <InfoCard>
              <InfoCardHeader>
                <InfoCardIcon>
                  <Star />
                </InfoCardIcon>
                <InfoCardTitle>Rating</InfoCardTitle>
              </InfoCardHeader>
              <InfoCardValue>{rating.toFixed(1)}</InfoCardValue>
              <InfoCardSubtext>Out of 5.0</InfoCardSubtext>
            </InfoCard>

            <InfoCard>
              <InfoCardHeader>
                <InfoCardIcon>
                  <Eye />
                </InfoCardIcon>
                <InfoCardTitle>Views</InfoCardTitle>
              </InfoCardHeader>
              <InfoCardValue>{shop.views || 0}</InfoCardValue>
              <InfoCardSubtext>Shop views</InfoCardSubtext>
            </InfoCard>
          </InfoGrid>

          {/* DETAILS SECTION */}
          <DetailsSection>
            <SectionTitle>
              <MapPin size={18} />
              Shop Information
            </SectionTitle>
            <DetailsList>
              <DetailItem>
                <DetailLabel>Campus</DetailLabel>
                <DetailValue>{shop.campus ? shop.campus.name : 'Not specified'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <BadgeCategory>{shop.category || 'General'}</BadgeCategory>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>{shop.location || 'Not specified'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Rating</DetailLabel>
                <DetailValue>{rating.toFixed(1)}/5.0</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Created</DetailLabel>
                <DetailValue>
                  {shop.createdAt
                    ? new Date(shop.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <BadgeCategory style={{ background: shop.isActive ? '#e8f5e9' : '#ffe5e5', color: shop.isActive ? '#2e7d32' : '#dc2626' }}>
                  {shop.isActive ? 'Active' : 'Inactive'}
                </BadgeCategory>
              </DetailItem>
            </DetailsList>
          </DetailsSection>

          {/* ACTION BUTTONS */}
          <ButtonGroup>
            {isOwner ? (
              <>
                <EditButtonFull onClick={handleEdit}>
                  <Edit2 size={16} />
                  Edit Shop
                </EditButtonFull>
                <DeleteButtonFull onClick={handleDelete}>
                  <Trash2 size={16} />
                  Delete
                </DeleteButtonFull>
              </>
            ) : (
              <>
                <EditButtonFull
                  onClick={() => {
                    if (!user) return router.push('/login');
                    handleContactShop();
                  }}
                >
                  <MessageCircle size={16} />
                  Contact Shop
                </EditButtonFull>
                {shop?.whatsappNumber ? (
                  <DeleteButtonFull
                    as="a"
                    href={`https://wa.me/${shop.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#25D366', color: 'white', border: 'none' }}
                  >
                    <MessageSquare size={16} />
                    WhatsApp
                  </DeleteButtonFull>
                ) : (
                  <DeleteButtonFull disabled style={{ opacity: 0.6 }}>
                    <MessageSquare size={16} />
                    WhatsApp
                  </DeleteButtonFull>
                )}
              </>
            )}
          </ButtonGroup>

          {/* PRODUCTS SECTION */}
          {(productsLoading || !productsLoading) && (
            <DetailsSection>
              <SectionTitle>
                <ShoppingBag size={18} />
                Products ({!productsLoading ? products.length : '...'})
              </SectionTitle>
              <ItemsGrid>
                {productsLoading ? (
                  // Show skeleton loaders while loading
                  Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))
                ) : products.length > 0 ? (
                  // Show actual products
                  products.map((product) => (
                    <ItemCard 
                      key={product._id}
                      onClick={() => router.push(`/products/${product._id}`)}
                    >
                      <ItemImage>
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`}
                            alt={product.name}
                          />
                        ) : (
                          <ShoppingBag size={40} color="#ccc" />
                        )}
                      </ItemImage>
                      <ItemInfo>
                        <ItemName>{product.name}</ItemName>
                        <ItemPrice>₦{product.price?.toLocaleString()}</ItemPrice>
                      </ItemInfo>
                    </ItemCard>
                  ))
                ) : null}
              </ItemsGrid>
              {!productsLoading && products.length === 0 && (
                <NoItemsMessage>
                  <p>No products from this shop yet.</p>
                </NoItemsMessage>
              )}
            </DetailsSection>
          )}
        </ContentWrapper>
      </MainContent>

      {/* BOTTOM NAV */}
      <BottomNavWrapper>
        <BottomNav active="shops" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}