"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAllProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useCategories";
import { useCampusFilter } from "@/hooks/useCampusFilter";
import { useAllCampuses } from "@/hooks/useCampuses";
import ProductGrid from "@/components/products/ProductGrid";
import AdvancedProductSearchModal from "@/components/products/AdvancedProductSearchModal";
import ProductSearchBar from '@/components/products/ProductSearchBar';
import CampusFilter from "@/components/common/CampusFilter";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/bottom-nav";
import { Plus, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import styled from "styled-components";

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

const AddProductButton = styled(Link)`
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

const SearchWrapper = styled.div`
`;

const SectionWrapper = styled.div`
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const FilterChip = styled.button`
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid ${(props) => (props.$active ? "#000000" : "#e5e5e5")};
  background: ${(props) => (props.$active ? "#000000" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#1a1a1a")};
  flex-shrink: 0;

  @media (min-width: 768px) {
    padding: 12px 22px;
    font-size: 14px;
  }

  &:hover {
    border-color: #000000;
    background: ${(props) => (props.$active ? "#000000" : "transparent")};
  }
`;

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

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 1024px) {
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &::before {
    content: '';
    display: block;
    aspect-ratio: 1 / 1;
    background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  &::after {
    content: '';
    flex: 1;
    background: #f9f9f9;
    animation: shimmerContent 2s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes shimmerContent {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.9;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  padding: 0;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover:not(:disabled) {
    background-color: #000000;
    border-color: #000000;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PaginationInfo = styled.span`
  font-size: 15px;
  color: #000000;
  font-weight: 600;
  min-width: 150px;
  text-align: center;
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

const categoryFilters = ["All", "Electronics", "Clothing", "Books", "Furniture"];

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sortBy: '-createdAt',
  });
  
  const { user, token, isLoading: authLoading } = useAuth();
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();
  const { data: categoriesData = [] } = useProductCategories();

  // Log categories on load
  useEffect(() => {
    if (categoriesData.length > 0) {
      console.log('📂 Categories loaded on products page:', categoriesData.map(c => ({ id: c._id, name: c.name })));
    }
  }, [categoriesData]);

  // Debug: Check backend status on mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/debug/status');
        const data = await response.json();
        console.log('🔍 Backend Status:', data);
      } catch (err) {
        console.log('Backend debug endpoint not available:', err.message);
      }
    };
    checkBackendStatus();
  }, []);

  // Debug: Log campus filter state
  useEffect(() => {
    console.log('👤 User campus:', user?.campus);
    console.log('🏫 Campus filter state:', {
      showAllCampuses: campusFilter.showAllCampuses,
      selectedCampus: campusFilter.selectedCampus,
      userCampus: campusFilter.userCampus,
      filterParams: campusFilter.getFilterParams()
    });
  }, [user?.campus, campusFilter.showAllCampuses, campusFilter.selectedCampus]);

  // Merge campus filter with other filters
  const enhancedFilters = {
    ...filters,
    ...campusFilter.getFilterParams()
  };

  const { data, isLoading, error } = useAllProducts(page, 12, enhancedFilters);

  // Extract products from nested data structure
  let products = [];
  if (Array.isArray(data)) {
    products = data;
  } else if (data?.data?.products && Array.isArray(data.data.products)) {
    products = data.data.products;
  } else if (data?.products && Array.isArray(data.products)) {
    products = data.products;
  } else if (data?.data && Array.isArray(data.data)) {
    products = data.data;
  } else if (data?.result && Array.isArray(data.result)) {
    products = data.result;
  } else if (data?.results && Array.isArray(data.results)) {
    products = data.results;
  }
  
  console.log('🎯 Current filters:', filters);
  console.log('📦 Raw API response data:', data);
  console.log('📊 Extracted products count:', products.length);
  console.log('⚠️ Error state:', error);

  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id) => {
    try {
      await deleteProduct.mutateAsync(id);
      alert("Product deleted successfully");
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleApplyFilters = (activeFilters) => {
    const categoryName = activeFilters.category ? 
      categoriesData.find(c => c._id === activeFilters.category)?.name : 'ALL';
    console.log('✅ Filters applied on products page:', {
      ...activeFilters,
      categoryName
    });
    setFilters(activeFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sortBy: '-createdAt',
    };
    console.log('Resetting filters to:', defaultFilters);
    setFilters(defaultFilters);
    setPage(1);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Discover Amazing Products</HeroTitle>
          <HeroSubtitle>Buy and sell items within your campus community</HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ContentWrapper>
          <ControlsSection>
            <SearchWrapper>
              <ProductSearchBar 
                onSearch={(query) => {
                  setFilters({ ...filters, search: query });
                  setPage(1);
                }}
                placeholder="Search products, brands, categories..."
              />
            </SearchWrapper>
            <AdvancedFilterButton onClick={() => setShowAdvancedSearch(true)}>
              <Settings size={20} />
              Filters
            </AdvancedFilterButton>
            <AddProductButton href="/products/new">
              <Plus size={20} />
              Sell Item
            </AddProductButton>
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
                <strong>⚠️ Error loading products:</strong>
                {error?.message || (typeof error === 'string' ? error : JSON.stringify(error))}
                <br />
                <small>Check browser console for more details</small>
              </ErrorContainer>
            )}

            {!error && isLoading && products.length === 0 && (
              <LoadingGrid>
                {[...Array(12)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </LoadingGrid>
            )}

            {!error && !isLoading && products.length === 0 && (
              <ErrorContainer style={{background: '#fff8f0', border: '2px solid #ffd4b0', color: '#cc6600'}}>
                <strong>No products found</strong>
                Try adjusting your filters
              </ErrorContainer>
            )}

            {products.length > 0 && (
              <ProductGrid
                products={products}
                isLoading={isLoading}
                error={error}
                onDelete={handleDelete}
              />
            )}

            {data?.results && products.length > 0 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Previous page"
                >
                  <ChevronLeft />
                </PaginationButton>
                <PaginationInfo>
                  Page {page} • {products.length} items
                </PaginationInfo>
                <PaginationButton
                  onClick={() => setPage((p) => p + 1)}
                  disabled={products.length < 12}
                  title="Next page"
                >
                  <ChevronRight />
                </PaginationButton>
              </PaginationContainer>
            )}
          </SectionWrapper>
        </ContentWrapper>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="products" />
      </BottomNavWrapper>

      <AdvancedProductSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleApplyFilters}
        filters={filters}
        categories={categoriesData}
        isLoading={isLoading}
      />
    </PageWrapper>
  );
}
