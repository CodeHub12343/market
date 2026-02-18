// src/app/(protected)/services/page.js

'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Plus, Settings } from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';
import ServiceSearchBar from '@/components/services/ServiceSearchBar';
import AdvancedServiceSearchModal from '@/components/services/AdvancedServiceSearchModal';
import CampusFilter from '@/components/common/CampusFilter';
import { useAllServices } from '@/hooks/useServices';
import { useCampusFilter } from '@/hooks/useCampusFilter';
import { useAllCampuses } from '@/hooks/useCampuses';
import { useServiceLocations } from '@/hooks/useServiceSearch';
import { useServiceCategories } from '@/hooks/useCategories';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { BottomNav } from '@/components/bottom-nav';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 80px;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
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

const SearchWrapper = styled.div`
`;

const RightPanel = styled.aside`
  display: none;
`;

const HeaderSection = styled.div`
  display: none;
`;

const BackButton = styled.button`
  display: none;
`;

const HeaderContent = styled.div`
  display: none;
`;

const Title = styled.h1`
  display: none;
`;

const AddServiceButton = styled.button`
  padding: 14px 24px;
  background: #000000;
  color: white;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;

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

const SearchFilterSection = styled.div`
  display: none;
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
  justify-content: center;
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
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const GridSection = styled.div``;

const ErrorContainer = styled.div`
  padding: 24px;
  background: white;
  border: 2px solid #fee;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #c33;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  strong {
    display: block;
    margin-bottom: 8px;
    font-weight: 700;
  }

  @media (min-width: 1024px) {
    padding: 20px 24px;
    font-size: 13px;
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

export default function ServicesPage() {
  useProtectedRoute();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});

  // Campus filtering
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();

  // Fetch available locations and categories
  const { data: locationsData = {} } = useServiceLocations();
  const locations = locationsData.locations || [];
  const { data: categoriesData = [] } = useServiceCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Merge campus filter with other filters
  const enhancedFilters = {
    page,
    limit: 12,
    sort,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategories.length > 0 && { category: selectedCategories.join(',') }),
    ...(activeFilter === 'active' && { active: true }),
    ...(activeFilter === 'inactive' && { active: false }),
    ...advancedFilters,
    ...campusFilter.getFilterParams()
  };

  // DEBUG: Log filters and auth state
  if (typeof window !== 'undefined') {
    if (searchQuery) {
      console.log('🔍 SEARCH QUERY CHANGED:', searchQuery);
    }
    console.log('📋 Services Page Filters:', {
      searchQuery,
      enhancedFilters,
      showAllCampuses: campusFilter.showAllCampuses,
      userCampus: campusFilter.userCampus,
      campusFilterParams: campusFilter.getFilterParams()
    });
  }

  const { data, isLoading, error } = useAllServices(enhancedFilters);

  const services = data?.data?.services || [];
  const pagination = data?.data?.pagination;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleAdvancedSearch = (filters) => {
    console.log('🔎 ADVANCED SEARCH APPLIED ON SERVICES PAGE');
    console.log('   📋 Advanced Filters:', filters);
    console.log('   💾 Updating state and resetting to page 1');
    setAdvancedFilters(filters);
    setPage(1);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Explore Exceptional Services</HeroTitle>
          <HeroSubtitle>Discover and book services from your campus community</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ContentWrapper>
          <ControlsSection>
            <SearchWrapper>
              <ServiceSearchBar
                onSearch={handleSearch}
                placeholder="Search services, providers, categories..."
              />
            </SearchWrapper>
            <AdvancedFilterButton onClick={() => setShowAdvancedSearch(true)}>
              <Settings size={20} />
              Filters
            </AdvancedFilterButton>
            <AddServiceButton onClick={() => router.push('/services/new')}>
              <Plus size={20} />
              Add Service
            </AddServiceButton>
          </ControlsSection>

          {/* Campus Filter */}
         {/*  <SectionWrapper>
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
            {error && (
              <ErrorContainer>
                <strong>⚠️ Error loading services:</strong>
                {error?.message || (typeof error === 'string' ? error : JSON.stringify(error))}
              </ErrorContainer>
            )}

            {!error && !isLoading && services.length === 0 && (
              <ErrorContainer style={{background: '#fff8f0', border: '2px solid #ffd4b0', color: '#cc6600'}}>
                <strong>No services found</strong>
                Try adjusting your filters
              </ErrorContainer>
            )}

            {(services.length > 0 || isLoading) && (
              <ServiceGrid
                services={services}
                loading={isLoading}
                error={error}
                pagination={pagination}
                onPageChange={setPage}
              />
            )}
          </SectionWrapper>
        </ContentWrapper>
      </MainContent>

      <AdvancedServiceSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        filters={advancedFilters}
        locations={locations}
        categories={categories}
      />

      <BottomNavWrapper>
        <BottomNav active="services" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
