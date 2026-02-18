'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useMyShops, useDeleteShop } from '@/hooks/useShops';
import { BottomNav } from '@/components/bottom-nav';
import { ChevronLeft, Search, Plus, Star, MapPin, Zap, Shield, Truck } from 'lucide-react';
import ShopGrid from '@/components/shops/ShopGrid';

// Helper function to get full image URL
const getImageUrl = (logoPath) => {
  if (!logoPath) return null;
  
  // If it already starts with http, it's a full URL
  if (logoPath.startsWith('http')) {
    return logoPath;
  }
  
  // Remove /public/ prefix if present (backend returns /public/uploads/...)
  let cleanPath = logoPath;
  if (logoPath.startsWith('/public/')) {
    cleanPath = logoPath.replace('/public', '');
  }
  
  // Point to the backend server for file serving
  return `http://localhost:5000${cleanPath}`;
};

/* ============ PAGE LAYOUT ============ */
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

  @media (min-width: 1024px) {
    gap: 24px;
    padding: 32px 24px;
  }

  @media (min-width: 1440px) {
    padding: 32px 24px;
    grid-column: 1;
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
  }
`;

/* ============ HEADER SECTION ============ */
const HeaderWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  @media (min-width: 1024px) {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    margin: 0;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (min-width: 1024px) {
    margin-bottom: 0;
  }
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

  &:hover {
    background: rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    display: none;
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

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 14px;

  &:hover {
    background: #333333;
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    width: auto;
    padding: 0 16px;
    gap: 8px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

/* ============ SEARCH & FILTERS ============ */
const SearchWrapper = styled.div`
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: 12px 14px 12px 40px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    background: #ffffff;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
  }

  @media (min-width: 768px) {
    padding: 13px 16px 13px 40px;
    font-size: 14px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;
  }
`;

/* ============ FILTER CHIPS ============ */
const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 16px 16px 0 16px;
  margin: 0 -16px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 2px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    margin: 0;
    overflow-x: visible;
    margin-top: 16px;
  }
`;

const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${(props) => (props.$active ? '#1a1a1a' : '#f5f5f5')};
  color: ${(props) => (props.$active ? '#ffffff' : '#1a1a1a')};
  border: 1px solid ${(props) => (props.$active ? '#1a1a1a' : '#e5e5e5')};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? '#333333' : '#e5e5e5')};
    border-color: ${(props) => (props.$active ? '#333333' : '#d0d0d0')};
  }

  @media (min-width: 768px) {
    padding: 9px 16px;
    font-size: 13px;
  }
`;

/* ============ SHOPS GRID ============ */
const SectionWrapper = styled.div`
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 20px 0 12px 0;

  @media (min-width: 768px) {
    font-size: 16px;
    margin: 24px 0 16px 0;
  }

  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

const ShopsGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

/* ============ SHOP CARD ============ */
const ShopCardContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 8px 24px rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    border-radius: 12px;
  }
`;

const ShopCardImage = styled.div`
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    height: 160px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ShopCardContent = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 16px;
    gap: 10px;
  }
`;

const ShopCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ShopNameSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ShopName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const ShopBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: ${(props) => (props.$type === 'verified' ? '#e8f5e9' : '#fff3e0')};
  color: ${(props) => (props.$type === 'verified' ? '#2e7d32' : '#f57c00')};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ShopDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ShopInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const ShopInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;

  svg {
    width: 14px;
    height: 14px;
    color: #999;
    flex-shrink: 0;
  }
`;

const ShopRatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #ffc107;
  color: #1a1a1a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ShopActionButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: #333333;
  }

  @media (min-width: 768px) {
    padding: 11px;
    font-size: 13px;
  }
`;

/* ============ EMPTY STATE ============ */
const EmptyStateContainer = styled.div`
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

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
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 18px;
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

const EmptyStateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #333333;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ============ PAGINATION ============ */
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0;
    margin-top: 32px;
  }
`;

const PaginationButton = styled.button`
  padding: 10px 12px;
  background: ${(props) => (props.$active ? '#1a1a1a' : '#f5f5f5')};
  color: ${(props) => (props.$active ? '#ffffff' : '#1a1a1a')};
  border: 1px solid ${(props) => (props.$active ? '#1a1a1a' : '#e5e5e5')};
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$active ? '#333333' : '#e5e5e5')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ============ RIGHT PANEL CARD ============ */
const StatsCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatsCardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

const StatValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
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

export default function ShopsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { data, isLoading, error } = useMyShops();

  const deleteShop = useDeleteShop();

  // Extract shops from nested data structure
  let shops = [];
  if (data && Array.isArray(data)) {
    shops = data;
  } else if (data?.shops && Array.isArray(data.shops)) {
    shops = data.shops;
  } else if (data?.data?.shops && Array.isArray(data.data.shops)) {
    shops = data.data.shops;
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this shop?')) {
      try {
        await deleteShop.mutateAsync(id);
        alert('Shop deleted successfully');
      } catch (err) {
        alert('Failed to delete shop');
      }
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // No pagination needed for user's own shops
    }
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="shops" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          {/* HEADER SECTION */}
          <HeaderWrapper>
            <HeaderTop>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <HeaderTitle>Shops</HeaderTitle>
              <CreateButton href="/shops/new">
                <Plus />
                <span style={{ display: 'none' }}>Create</span>
              </CreateButton>
            </HeaderTop>
          </HeaderWrapper>

          {/* SEARCH & FILTERS */}
          <SearchWrapper>
            <SearchContainer>
              <SearchInputWrapper>
                <SearchIcon>
                  <Search />
                </SearchIcon>
                <SearchInputField
                  type="text"
                  placeholder="Search shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </SearchInputWrapper>
            </SearchContainer>

            {/* FILTER CHIPS */}
            <FilterContainer>
              <FilterChip
                $active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All Shops
              </FilterChip>
              <FilterChip
                $active={filter === 'verified'}
                onClick={() => setFilter('verified')}
              >
                <Shield style={{ width: '14px', height: '14px' }} />
                Verified
              </FilterChip>
              <FilterChip
                $active={filter === 'trending'}
                onClick={() => setFilter('trending')}
              >
                <Zap style={{ width: '14px', height: '14px' }} />
                Trending
              </FilterChip>
              <FilterChip
                $active={filter === 'new'}
                onClick={() => setFilter('new')}
              >
                New
              </FilterChip>
            </FilterContainer>
          </SearchWrapper>

          {/* SHOPS GRID OR EMPTY STATE */}
          {shops.length === 0 && !isLoading ? (
            <SectionWrapper>
              <EmptyStateContainer>
                <EmptyStateIcon>
                  <Search />
                </EmptyStateIcon>
                <EmptyStateTitle>No Shops Found</EmptyStateTitle>
                <EmptyStateText>
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Discover amazing shops and create your own'}
                </EmptyStateText>
                {!searchQuery && (
                  <EmptyStateButton href="/shops/new">
                    <Plus />
                    Create Your Shop
                  </EmptyStateButton>
                )}
              </EmptyStateContainer>
            </SectionWrapper>
          ) : (
            <>
              <SectionWrapper>
                <SectionTitle>
                  {searchQuery ? `Search Results (${shops.length})` : 'My Shops'}
                </SectionTitle>
                <ShopsGridContainer>
                  {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: '#999' }}>
                      Loading shops...
                    </div>
                  ) : (
                    shops.map((shop) => (
                      <ShopCardContainer key={shop._id} href={`/shops/${shop._id}`}>
                        <ShopCardImage>
                          {shop.logo ? (
                            <Image 
                              src={getImageUrl(shop.logo)}
                              alt={shop.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized={true}
                            />
                          ) : (
                            'No Image'
                          )}
                        </ShopCardImage>
                        <ShopCardContent>
                          <ShopCardHeader>
                            <ShopNameSection>
                              <ShopName>{shop.name}</ShopName>
                              {shop.isVerified && (
                                <ShopBadge $type="verified">
                                  <Shield style={{ width: '12px', height: '12px' }} />
                                  Verified
                                </ShopBadge>
                              )}
                            </ShopNameSection>
                          </ShopCardHeader>

                          <ShopDescription>{shop.description}</ShopDescription>

                          <ShopInfoGrid>
                            <ShopInfoItem>
                              <Star style={{ width: '14px', height: '14px', color: '#ffc107' }} />
                              {shop.ratingsAverage || 0} ({shop.ratingsQuantity || 0})
                            </ShopInfoItem>
                            <ShopInfoItem>
                              <MapPin style={{ width: '14px', height: '14px' }} />
                              {shop.campus?.shortCode || 'N/A'}
                            </ShopInfoItem>
                          </ShopInfoGrid>

                          <ShopActionButton onClick={(e) => {
                            e.preventDefault();
                            router.push(`/shops/${shop._id}`);
                          }}>
                            View Details →
                          </ShopActionButton>
                        </ShopCardContent>
                      </ShopCardContainer>
                    ))
                  )}
                </ShopsGridContainer>
              </SectionWrapper>
            </>
          )}
        </ContentArea>

        {/* RIGHT PANEL FOR LARGE SCREENS */}
        <RightPanel>
          <StatsCard>
            <StatsCardTitle>Your Shop Stats</StatsCardTitle>
            <StatItem>
              <StatLabel>Total Shops</StatLabel>
              <StatValue>{shops.length}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Verified Shops</StatLabel>
              <StatValue>{shops.filter((s) => s.isVerified).length}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Average Rating</StatLabel>
              <StatValue>
                {shops.length > 0
                  ? (
                      shops.reduce((acc, s) => acc + (s.ratingsAverage || 0), 0) /
                      shops.length
                    ).toFixed(1)
                  : 'N/A'}
              </StatValue>
            </StatItem>
          </StatsCard>

          <StatsCard>
            <StatsCardTitle>Quick Actions</StatsCardTitle>
            <ShopActionButton
              onClick={() => router.push('/shops/new')}
              style={{ marginTop: '0', padding: '12px' }}
            >
              + Create Shop
            </ShopActionButton>
          </StatsCard>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="shops" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}