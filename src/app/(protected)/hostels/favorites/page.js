'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Trash2 } from 'lucide-react';
import { useFavoriteHostels, useDeleteFavorite, useFavoriteStats } from '@/hooks/useHostelFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { BottomNav } from '@/components/bottom-nav';
import HostelGrid from '@/components/hostels/HostelGrid';

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

const HeaderSection = styled.div`
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

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    display: none;
  }

  &:hover {
    background: #ececec;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const FilterSection = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 1024px) {
    padding: 0;
    gap: 16px;
  }
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 12px;

  svg {
    width: 16px;
    height: 16px;
    color: #999;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 8px;
    font-size: 14px;
    outline: none;
    color: #1a1a1a;

    &::placeholder {
      color: #999;
    }
  }
`;

const SortSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const GridSection = styled.div`
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const StatsCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 16px 0;
  }

  p {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 14px;
    margin: 0 0 24px 0;
  }
`;

const BrowseButton = styled.a`
  display: inline-block;
  padding: 12px 24px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #333333;
    transform: translateY(-2px);
  }
`;

export default function FavoriteHostelsPage() {
  useProtectedRoute();
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [page, setPage] = useState(1);

  const { data: favoritesData = {}, isLoading, error } = useFavoriteHostels({
    page,
    limit: 12,
    sort: sortBy,
    search: searchQuery
  });

  const { data: statsData = {} } = useFavoriteStats();
  const deleteFavoriteMutation = useDeleteFavorite();

  const favorites = favoritesData.data || favoritesData.hostels || [];
  const pagination = favoritesData.pagination;
  const stats = statsData.data || statsData;

  const handleDelete = async (hostelId) => {
    if (typeof window !== 'undefined' && confirm('Remove from favorites?')) {
      try {
        await deleteFavoriteMutation.mutateAsync(hostelId);
      } catch (error) {
        console.error('Failed to delete favorite:', error);
        alert('Failed to remove from favorites');
      }
    }
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="hostels" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          <HeaderSection>
            <HeaderContent>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <Title>❤️ Favorite Hostels</Title>
            </HeaderContent>
          </HeaderSection>

          <FilterSection>
            <SearchBox>
              <Search />
              <input
                type="text"
                placeholder="Search favorite hostels..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </SearchBox>

            <SortSelect
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="-createdAt">Recently Favorited</option>
              <option value="name">Name (A-Z)</option>
              <option value="-rating">Top Rated</option>
              <option value="price">Price (Low-High)</option>
              <option value="-price">Price (High-Low)</option>
            </SortSelect>
          </FilterSection>

          {favorites.length > 0 ? (
            <GridSection>
              <HostelGrid
                hostels={favorites}
                loading={isLoading}
                error={error}
                pagination={pagination}
                onPageChange={setPage}
              />
            </GridSection>
          ) : (
            <EmptyState>
              <h2>No Favorite Hostels Yet</h2>
              <p>Hostels you favorite will appear here for easy access later.</p>
              <BrowseButton href="/hostels">Browse Hostels</BrowseButton>
            </EmptyState>
          )}
        </ContentArea>

        <RightPanel>
          <StatsCard>
            <h3>❤️ Favorite Stats</h3>
            <StatRow>
              <StatLabel>Total Favorites</StatLabel>
              <StatValue>{stats.totalFavorites || 0}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>By Type</StatLabel>
              <StatValue>
                {stats.favoritesByType?.boys || 0} boys, {stats.favoritesByType?.girls || 0} girls
              </StatValue>
            </StatRow>
            {stats.mostFavoritedHostels?.length > 0 && (
              <StatRow>
                <StatLabel>Most Saved</StatLabel>
                <StatValue>{stats.mostFavoritedHostels[0]?.name}</StatValue>
              </StatRow>
            )}
          </StatsCard>

          <StatsCard>
            <h3>💡 Pro Tip</h3>
            <p>Save your favorite hostels to compare amenities, prices, and reviews. You can organize them by type and rating.</p>
          </StatsCard>

          <StatsCard>
            <h3>🔔 Stay Updated</h3>
            <p>Get notifications when your favorite hostels have new reviews, price changes, or availability updates.</p>
          </StatsCard>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="hostels" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
