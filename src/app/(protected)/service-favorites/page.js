'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Grid, List, Search } from 'lucide-react';
import { useServiceFavorites, useSearchServiceFavorites } from '@/hooks/useServiceFavorites';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { BottomNav } from '@/components/bottom-nav';

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
  gap: 24px;
  padding: 16px;

  @media (min-width: 1024px) {
    padding: 32px 24px;
  }
`;

const HeaderSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin: -16px -16px 0 -16px;

  @media (min-width: 1024px) {
    margin: -32px -24px 0 -24px;
    padding: 20px 24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  flex-shrink: 0;

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

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 28px;
  }

  svg {
    color: #dc2626;
  }
`;

const BadgeCount = styled.span`
  background: #dc2626;
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewToggleButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$active ? '#f0f0f0' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#e5e5e5' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #e5e5e5;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #666;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  background: #f9f9f9;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: #ffffff;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 15px;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #999;
  pointer-events: none;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #e5e5e5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  background: #f5f5f5;
`;

const ServiceContent = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ServiceTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ServiceCategory = styled.span`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const ServiceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
`;

const ServicePrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ServiceRating = styled.span`
  font-size: 12px;
  color: #ffa500;
  font-weight: 600;
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background: #ffe5e5;
  color: #dc2626;
  border: 1px solid #ffc5c5;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 8px;

  &:hover {
    background: #ffd1d1;
    border-color: #ffb0b0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0 0 16px 0;
  }
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const BrowseButton = styled.button`
  padding: 10px 24px;
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
    transform: translateY(-2px);
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

const LoadingGrid = styled(Grid)`
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const SkeletonCard = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  height: 250px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% {
      background: #f5f5f5;
    }
    50% {
      background: #e5e5e5;
    }
  }
`;

export default function ServiceFavoritesPage() {
  useProtectedRoute();
  const router = useRouter();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fetch favorited services
  const { data: favoritesData = {}, isLoading } = searchQuery
    ? useSearchServiceFavorites(searchQuery, { page, limit: 12 }, true)
    : useServiceFavorites({ page, limit: 12 }, true);

  const services = favoritesData.services || [];
  const pagination = favoritesData.pagination || {};

  const handleServiceClick = (serviceId) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="services" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          <HeaderSection>
            <HeaderContent>
              <HeaderLeft>
                <BackButton onClick={() => router.back()}>
                  <ChevronLeft />
                </BackButton>
                <Title>
                  <Heart width={24} height={24} />
                  Favorite Services
                  <BadgeCount>{pagination.total || 0}</BadgeCount>
                </Title>
              </HeaderLeft>
              <HeaderRight>
                <ViewToggleButton
                  $active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid />
                </ViewToggleButton>
                <ViewToggleButton
                  $active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List />
                </ViewToggleButton>
              </HeaderRight>
            </HeaderContent>
          </HeaderSection>

          <FilterSection>
            <SearchContainer>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search favorite services..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </SearchContainer>
          </FilterSection>

          {isLoading ? (
            <LoadingGrid>
              {[...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </LoadingGrid>
          ) : services.length > 0 ? (
            <>
              <Grid>
                {services.map((service) => (
                  <ServiceCard key={service._id}>
                    <ServiceImage
                      src={service.images?.[0] || '/images/service-placeholder.png'}
                      alt={service.title}
                      onClick={() => handleServiceClick(service._id)}
                    />
                    <ServiceContent>
                      <ServiceTitle onClick={() => handleServiceClick(service._id)}>
                        {service.title}
                      </ServiceTitle>
                      <ServiceCategory>{service.category?.name || 'Service'}</ServiceCategory>
                      <ServiceMeta>
                        <ServicePrice>₦{service.price?.toLocaleString()}</ServicePrice>
                        {service.rating && (
                          <ServiceRating>⭐ {service.rating.toFixed(1)}</ServiceRating>
                        )}
                      </ServiceMeta>
                      <DeleteButton
                        onClick={() => {
                          // TODO: Implement delete from favorites
                          // deleteServiceFavorite(service._id)
                        }}
                      >
                        Remove
                      </DeleteButton>
                    </ServiceContent>
                  </ServiceCard>
                ))}
              </Grid>

              {pagination.pages && pagination.pages > 1 && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      style={{
                        padding: '8px 12px',
                        background: page === i + 1 ? '#1a1a1a' : '#f5f5f5',
                        color: page === i + 1 ? '#ffffff' : '#1a1a1a',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>💔</EmptyIcon>
              <h3>No Favorite Services Yet</h3>
              <p>Start adding services to your favorites to save them for later</p>
              <BrowseButton onClick={() => router.push('/services')}>
                Browse Services
              </BrowseButton>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="services" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
