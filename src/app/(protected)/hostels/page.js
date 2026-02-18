'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Sliders } from 'lucide-react';
import HostelGrid from '@/components/hostels/HostelGrid';
import { useAllHostels, useDeleteHostel } from '@/hooks/useHostels';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useHostelCategories } from '@/hooks/useCategories';
import { BottomNav } from '@/components/bottom-nav';
import HostelSearchBar from '@/components/hostels/HostelSearchBar';
import AdvancedHostelSearchModal from '@/components/hostels/AdvancedHostelSearchModal';

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

const AddHostelButton = styled(Link)`
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

const AppliedFiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  align-items: center;
`;

const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  color: #0369a1;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 8px 14px;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #0369a1;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: #0284c7;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ClearAllButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #666;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    color: #1a1a1a;
  }

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 8px 14px;
  }
`;

// ===== PAGINATION =====
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
`;

const PaginationButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 18px;
    font-size: 14px;

    &:hover:not(:disabled) {
      border-color: #3b82f6;
      background: #f0f9ff;
      color: #0369a1;
    }
  }
`;

const PaginationInfo = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

// ===== STATS CARD =====
export default function HostelsPage() {
  useProtectedRoute();
  const router = useRouter();
  const { user } = useAuth();
  
  // Restrict to user's campus - do not allow toggling to show all
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sort: '-createdAt'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    category: null,
    priceRange: { min: null, max: null },
    rating: null,
    amenities: [],
    roomTypes: [],
    occupancy: [],
    roomPriceRange: { min: null, max: null },
    sortBy: '-createdAt'
  });

  // Enhanced filters - automatically restricted to user's campus by backend
  const enhancedFilters = {
    ...filters,
    ...(searchQuery && { search: searchQuery }),
    // Merge applied filters from advanced search modal
    ...(appliedFilters.category && { category: appliedFilters.category }),
    ...(appliedFilters.priceRange.min && { minPrice: appliedFilters.priceRange.min }),
    ...(appliedFilters.priceRange.max && { maxPrice: appliedFilters.priceRange.max }),
    ...(appliedFilters.rating && { minRating: appliedFilters.rating }),
    ...(appliedFilters.amenities.length > 0 && { amenities: appliedFilters.amenities.join(',') }),
    ...(appliedFilters.roomTypes.length > 0 && { roomTypes: appliedFilters.roomTypes.join(',') }),
    ...(appliedFilters.occupancy.length > 0 && { occupancy: appliedFilters.occupancy.join(',') }),
    ...(appliedFilters.roomPriceRange.min && { roomMinPrice: appliedFilters.roomPriceRange.min }),
    ...(appliedFilters.roomPriceRange.max && { roomMaxPrice: appliedFilters.roomPriceRange.max }),
    ...(appliedFilters.sortBy && { sort: appliedFilters.sortBy })
    // Backend automatically restricts to user's campus - no need to pass allCampuses
  };

  const { data, isLoading, error, isError } = useAllHostels(enhancedFilters);
  const { data: categories = [] } = useHostelCategories();

  // Debug: log the filters being sent to backend
  if (typeof window !== 'undefined') {
    console.log('🏨 Hostels Page Filters:', {
      searchQuery,
      appliedFilters,
      enhancedFilters
    });
  }

  const deleteHostel = useDeleteHostel();

  // Handle search submission
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Handle suggestion/history selection
  const handleSuggestionSelect = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Handle advanced filters
  const handleApplyAdvancedFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    setIsAdvancedSearchOpen(false);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setAppliedFilters({
      category: null,
      priceRange: { min: null, max: null },
      rating: null,
      amenities: [],
      roomTypes: [],
      occupancy: [],
      roomPriceRange: { min: null, max: null },
      sortBy: '-createdAt'
    });
    setSearchQuery('');
    setFilters({
      page: 1,
      limit: 12,
      sort: '-createdAt'
    });
  };

  const hostels = data?.data?.hostels || data?.data || [];
  const pagination = data?.data?.pagination;
  const stats = {
    total: hostels.length,
    available: hostels.filter(h => h.availabilityStatus === 'available').length,
    pending: hostels.filter(h => h.status === 'pending-verification').length
  };

  const handleDelete = async (id) => {
    try {
      await deleteHostel.mutateAsync(id);
    } catch (err) {
      alert('Failed to delete hostel');
    }
  };

  const handleEdit = (id) => {
    router.push(`/hostels/${id}/edit`);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Your Perfect Hostel</HeroTitle>
          <HeroSubtitle>Discover comfortable accommodation within your campus community</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ContentWrapper>
          <ControlsSection>
            <SearchWrapper>
              <HostelSearchBar
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="Search hostels, locations, features..."
              />
            </SearchWrapper>
            <AdvancedFilterButton onClick={() => setIsAdvancedSearchOpen(true)}>
              <Sliders size={20} />
              Filters
            </AdvancedFilterButton>
            <AddHostelButton href="/hostels/new">
              <Plus size={20} />
              Add Hostel
            </AddHostelButton>
          </ControlsSection>

          <SectionWrapper>
            {/* Applied Filters Display */}
            {(searchQuery || appliedFilters.category || appliedFilters.priceRange.min || appliedFilters.rating || appliedFilters.amenities.length > 0 || appliedFilters.roomTypes.length > 0 || appliedFilters.occupancy.length > 0 || appliedFilters.roomPriceRange.min) && (
              <AppliedFiltersContainer>
                {searchQuery && (
                  <FilterTag>
                    Search: {searchQuery}
                    <ClearButton onClick={() => setSearchQuery('')}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.category && (
                  <FilterTag>
                    Category: {categories.find(c => c._id === appliedFilters.category)?.name || appliedFilters.category}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, category: null }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.priceRange.min && (
                  <FilterTag>
                    Price: ₦{appliedFilters.priceRange.min.toLocaleString()}{appliedFilters.priceRange.max ? `-₦${appliedFilters.priceRange.max.toLocaleString()}` : '+'}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, priceRange: { min: null, max: null } }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.rating && (
                  <FilterTag>
                    Rating: {appliedFilters.rating}+ ⭐
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, rating: null }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.amenities.length > 0 && (
                  <FilterTag>
                    Amenities: {appliedFilters.amenities.length}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, amenities: [] }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.roomTypes.length > 0 && (
                  <FilterTag>
                    Room: {appliedFilters.roomTypes.join(', ')}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, roomTypes: [] }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.occupancy.length > 0 && (
                  <FilterTag>
                    Occupancy: {appliedFilters.occupancy.join(', ')}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, occupancy: [] }))}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.roomPriceRange.min && (
                  <FilterTag>
                    Room Price: ₦{appliedFilters.roomPriceRange.min.toLocaleString()}{appliedFilters.roomPriceRange.max ? `-₦${appliedFilters.roomPriceRange.max.toLocaleString()}` : '+'}
                    <ClearButton onClick={() => setAppliedFilters(prev => ({ ...prev, roomPriceRange: { min: null, max: null } }))}>×</ClearButton>
                  </FilterTag>
                )}
                {(searchQuery || appliedFilters.category || appliedFilters.priceRange.min || appliedFilters.rating || appliedFilters.amenities.length > 0 || appliedFilters.roomTypes.length > 0 || appliedFilters.occupancy.length > 0 || appliedFilters.roomPriceRange.min) && (
                  <ClearAllButton onClick={handleClearAllFilters}>Clear All</ClearAllButton>
                )}
              </AppliedFiltersContainer>
            )}
          </SectionWrapper>

          <SectionWrapper>
            <HostelGrid
              hostels={Array.isArray(hostels) ? hostels : []}
              loading={isLoading}
              error={isError ? error : null}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isEmpty={!isLoading && hostels.length === 0}
            />

            {pagination && hostels.length > 0 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                >
                  Previous
                </PaginationButton>
                <PaginationInfo>
                  Page {filters.page} of {pagination.pages || 1}
                </PaginationInfo>
                <PaginationButton
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            )}
          </SectionWrapper>
        </ContentWrapper>
      </MainContent>

      <AdvancedHostelSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplyFilters={handleApplyAdvancedFilters}
        initialFilters={appliedFilters}
      />

      <BottomNavWrapper>
        <BottomNav active="hostels" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
