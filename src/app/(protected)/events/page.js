'use client';

import { useAllEvents, useDeleteEvent, useSearchEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import EventGrid from '@/components/events/EventGrid';
import ErrorAlert from '@/components/common/ErrorAlert';
import { Plus, Sliders, X } from 'lucide-react';
import CampusFilter from '@/components/common/CampusFilter';
import { useCampusFilter } from '@/hooks/useCampusFilter';
import { useAllCampuses } from '@/hooks/useCampuses';
import EventSearchBar from '@/components/events/EventSearchBar';
import AdvancedEventSearchModal from '@/components/events/AdvancedEventSearchModal';
import { useEventCategories } from '@/hooks/useCategories';
import { BottomNav } from '@/components/bottom-nav';

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

const CreateEventButton = styled(Link)`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 12px;
  margin-top: 32px;

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 12px 0;
  }

  p {
    color: #6b7280;
    font-size: 16px;
    margin: 0 0 24px 0;
  }
`;

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();
  const { data: categories = [] } = useEventCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  
  // Enhanced filters with campus params and applied filters
  const enhancedFilters = {
    ...campusFilter.getFilterParams(),
    ...appliedFilters
  };
  
  const { data: events = [], isLoading, error } = useAllEvents(enhancedFilters);

  const handleAdvancedFiltersApply = useCallback((filters) => {
    setAppliedFilters(filters);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAdvancedSearchOpen(false);
  }, []);

  const handleRemoveFilter = useCallback((filterKey) => {
    setAppliedFilters(prev => {
      const updated = { ...prev };
      delete updated[filterKey];
      return updated;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setAppliedFilters({});
    setSearchTerm('');
  }, []);

  const hasActiveFilters = Object.keys(appliedFilters).length > 0 || searchTerm !== '';
  // When user types a search term, query the server for results; otherwise use local events
  const { data: searchResults = [], isLoading: isSearching } = useSearchEvents(searchTerm, enhancedFilters);

  const sourceEvents = searchTerm ? searchResults : events;

  // Server already applies filters, so no additional client-side filtering needed
  const filteredEvents = sourceEvents;

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Discover & Join Events</HeroTitle>
          <HeroSubtitle>Find the best events happening around your campus</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ContentWrapper>
          <ControlsSection>
            <SearchWrapper>
              <EventSearchBar
                onSearch={(query) => {
                  setSearchTerm(query);
                }}
                placeholder="Search events by name, location..."
              />
            </SearchWrapper>
            <AdvancedFilterButton onClick={() => setIsAdvancedSearchOpen(true)}>
              <Sliders size={20} />
              Filters
            </AdvancedFilterButton>
            <CreateEventButton href="/events/new">
              <Plus size={20} />
              Create Event
            </CreateEventButton>
          </ControlsSection>

          {/* Campus Filter */}
        {/*   <SectionWrapper>
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

          {/* Applied Filters Display */}
          {hasActiveFilters && (
            <SectionWrapper>
              <AppliedFiltersContainer>
                {searchTerm && (
                  <FilterTag>
                    Search: {searchTerm}
                    <ClearButton onClick={() => setSearchTerm('')}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.category && (
                  <FilterTag>
                    Category: {appliedFilters.category}
                    <ClearButton onClick={() => handleRemoveFilter('category')}>×</ClearButton>
                  </FilterTag>
                )}
                {appliedFilters.location && (
                  <FilterTag>
                    Location: {appliedFilters.location}
                    <ClearButton onClick={() => handleRemoveFilter('location')}>×</ClearButton>
                  </FilterTag>
                )}
                {hasActiveFilters && (
                  <ClearAllButton onClick={handleClearAllFilters}>Clear All</ClearAllButton>
                )}
              </AppliedFiltersContainer>
            </SectionWrapper>
          )}

          <SectionWrapper>
            {error ? (
              <ErrorAlert
                message={error?.message || 'Failed to load events'}
                onClose={() => {}}
              />
            ) : filteredEvents.length === 0 && !isLoading ? (
              <EmptyState>
                <h3>{searchTerm ? 'No events found' : 'No events yet'}</h3>
                <p>{searchTerm ? `Try adjusting your search terms` : 'Create the first event or wait for others to create one'}</p>
                <CreateEventButton href="/events/new">
                  <Plus size={18} />
                  Create Event
                </CreateEventButton>
              </EmptyState>
            ) : (
              <EventGrid events={filteredEvents} isLoading={isLoading} />
            )}
          </SectionWrapper>
        </ContentWrapper>
      </MainContent>

      <AdvancedEventSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={handleCloseModal}
        onApply={handleAdvancedFiltersApply}
        filters={appliedFilters}
        isLoading={isLoading}
        categories={categories}
      />

      <BottomNavWrapper>
        <BottomNav active="events" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
