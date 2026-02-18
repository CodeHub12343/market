'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRequests } from '@/hooks/useRequests';
import { useAuth } from '@/hooks/useAuth';
import CampusFilter from '@/components/common/CampusFilter';
import { useCampusFilter } from '@/hooks/useCampusFilter';
import { useAllCampuses } from '@/hooks/useCampuses';
import { useRequestCategories } from '@/hooks/useCategories';
import RequestGrid from '@/components/requests/RequestGrid';
import RequestSearchBar from '@/components/requests/RequestSearchBar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus, Sliders } from 'lucide-react';
import AdvancedRequestFilterModal from '@/components/requests/AdvancedRequestFilterModal';
import { BottomNav } from '@/components/bottom-nav';
import { useRouter } from 'next/navigation';

// ===== PAGE WRAPPER =====
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 80px;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 60px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const HeroContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  margin: 0;
  opacity: 0.95;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ControlsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  margin-bottom: 32px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: none;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightPanel = styled.aside`
  display: none;
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

const SearchWrapper = styled.div`
`;

const SectionWrapper = styled.div`
`;

const AdvancedFilterButton = styled.button`
  padding: 14px 24px;
  background: white;
  border: 2px solid #000000;
  border-radius: 12px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #000000;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AddRequestButton = styled(Link)`
  padding: 14px 24px;
  background: #000000;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ===== COMPONENT =====
export default function RequestsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();
  const { data: categories = [] } = useRequestCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const filters = {
    ...(searchQuery && { search: searchQuery }),
    ...appliedFilters,
    ...campusFilter.getFilterParams(),
  };

  const { data: requestsData, isLoading, error } = useRequests(
    currentPage,
    12,
    filters
  );

  if (authLoading) {
    return (
      <PageWrapper>
        <LoadingSpinner />
      </PageWrapper>
    );
  }

  const requests = requestsData?.requests || [];
  const pagination = requestsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find What You Need</HeroTitle>
          <HeroSubtitle>Browse requests from your campus and make competitive offers</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ContentWrapper>
          <ControlsSection>
            <SearchWrapper>
              <RequestSearchBar
                onSearch={(query) => {
                  setSearchQuery(query);
                  setCurrentPage(1);
                }}
                placeholder="Search requests..."
              />
            </SearchWrapper>
            <AdvancedFilterButton onClick={() => setIsFilterModalOpen(true)}>
              <Sliders size={20} />
              Filters
            </AdvancedFilterButton>
            <AddRequestButton href="/requests/new">
              <Plus size={20} />
              Post Request
            </AddRequestButton>
          </ControlsSection>

          {/* Campus Filter */}
          {/* <SectionWrapper>
            <CampusFilter
              showAllCampuses={campusFilter.showAllCampuses}
              selectedCampus={campusFilter.selectedCampus}
              campusName={campusFilter.campusName}
              userCampus={campusFilter.userCampus}
              allCampuses={Array.isArray(allCampuses) ? allCampuses : []}
              onToggleAllCampuses={campusFilter.toggleAllCampuses}
              onCampusChange={campusFilter.handleCampusChange}
              disabled={isLoading}
            />
          </SectionWrapper> */}

          <SectionWrapper>
            <RequestGrid
              requests={requests}
              isLoading={isLoading}
              error={error?.message}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
              userOwnedRequests={user?.requestIds || []}
              userFavorites={user?.favoriteRequestIds || []}
            />
          </SectionWrapper>
        </ContentWrapper>
      </MainContent>

      <AdvancedRequestFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(newFilters) => {
          setAppliedFilters(newFilters);
          setCurrentPage(1);
        }}
        filters={appliedFilters}
        isLoading={isLoading}
        categories={categories}
      />

      <BottomNavWrapper>
        <BottomNav active="requests" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
