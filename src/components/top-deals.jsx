"use client"

import { useState } from "react"
import styled from "styled-components"
import { Star, Heart, ChevronRight } from "lucide-react"
import { useProducts } from "@/hooks/useProducts"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import ErrorAlert from "@/components/common/ErrorAlert"

// ===== SKELETON CARD =====
const SkeletonCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 10px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 12px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    padding: 12px;
    border-radius: 14px;
  }
`

const SkeletonImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  overflow: hidden;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    margin-bottom: 12px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 10px;
    border-radius: 12px;
  }
`

const SkeletonText = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 2s infinite;
  margin-bottom: 6px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (min-width: 768px) {
    margin-bottom: 8px;
  }
`

const SkeletonTitle = styled(SkeletonText)`
  height: 16px;
  width: 100%;

  @media (min-width: 768px) {
    height: 18px;
  }
`

const SkeletonMeta = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 6px;

  @media (min-width: 768px) {
    gap: 8px;
    margin-bottom: 8px;
  }
`

const SkeletonTag = styled(SkeletonText)`
  height: 14px;
  width: 50px;
  flex-shrink: 0;
`

const SkeletonRating = styled(SkeletonText)`
  height: 14px;
  width: 40px;
  flex-shrink: 0;
`

const SkeletonPrice = styled(SkeletonText)`
  height: 18px;
  width: 80px;

  @media (min-width: 768px) {
    height: 20px;
  }
`

// ===== SKELETON GRID =====
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
`

// ===== SECTION WRAPPER =====
const Section = styled.section``

// ===== SECTION HEADER =====
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`

// ===== SECTION TITLE =====
const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`

// ===== SEE ALL LINK =====
const SeeAllLink = styled.a`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }

  &:hover {
    gap: 6px;
    color: #666;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

// ===== FILTERS CONTAINER =====
const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 10px;
    margin-bottom: 18px;
  }

  @media (min-width: 1024px) {
    gap: 8px;
  }
`

// ===== FILTER CHIP =====
const FilterChip = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid ${(props) => (props.$active ? "#1a1a1a" : "#e5e5e5")};
  background: ${(props) => (props.$active ? "#1a1a1a" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#1a1a1a")};
  letter-spacing: -0.2px;

  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    padding: 8px 16px;
    font-size: 12px;
  }

  &:hover {
    border-color: #1a1a1a;
    background: ${(props) => (props.$active ? "#1a1a1a" : "#f5f5f5")};
  }

  &:active {
    transform: scale(0.98);
  }
`

// ===== CARS GRID =====
const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
`

// ===== CAR CARD =====
const CarCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 12px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    padding: 12px;
    border-radius: 14px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #e5e5e5;
  }

  &:active {
    transform: translateY(-1px);
  }
`

// ===== IMAGE CONTAINER =====
const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 12px;
  overflow: hidden;

  @media (min-width: 768px) {
    margin-bottom: 12px;
    border-radius: 14px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 10px;
    border-radius: 12px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

// ===== FAVORITE BUTTON =====
const FavoriteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  @media (min-width: 768px) {
    width: 36px;
    height: 36px;
    top: 10px;
    right: 10px;
  }

  @media (min-width: 1024px) {
    width: 32px;
    height: 32px;
  }

  &:hover {
    transform: scale(1.1);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => (props.$active ? "#e53935" : "#999")};
    fill: ${(props) => (props.$active ? "#e53935" : "none")};
    transition: all 0.2s ease;

    @media (min-width: 768px) {
      width: 18px;
      height: 18px;
    }

    @media (min-width: 1024px) {
      width: 16px;
      height: 16px;
    }
  }
`

// ===== CAR NAME =====
const CarName = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  letter-spacing: -0.3px;

  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
`

// ===== CAR META =====
const CarMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;

  @media (min-width: 768px) {
    gap: 8px;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    gap: 6px;
    margin-bottom: 6px;
  }
`

// ===== RATING =====
const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #1a1a1a;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 11px;
  }

  svg {
    width: 12px;
    height: 12px;
    color: #ffc107;
    fill: #ffc107;

    @media (min-width: 768px) {
      width: 14px;
      height: 14px;
    }

    @media (min-width: 1024px) {
      width: 12px;
      height: 12px;
    }
  }
`

// ===== CONDITION TAG =====
const ConditionTag = styled.span`
  font-size: 9px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 5px;
  background: ${(props) =>
    props.$condition === "new" ? "#e8f5e9" : "#fff3e0"};
  color: ${(props) =>
    props.$condition === "new" ? "#2e7d32" : "#e65100"};
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (min-width: 768px) {
    font-size: 10px;
    padding: 4px 8px;
  }

  @media (min-width: 1024px) {
    font-size: 9px;
    padding: 3px 7px;
  }
`

// ===== CAR PRICE =====
const CarPrice = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`

// ===== FILTERS ARRAY =====
const filters = ["All", "Electronics", "Clothing", "Books", "Furniture"]

// ===== TOP DEALS COMPONENT =====
export function TopDeals() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [favorites, setFavorites] = useState([])

  // Fetch products from API
  const { data, isLoading, error } = useProducts(1, 6, {})

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  // Extract products from API response
  const products = data?.data?.products || []

  // Skeleton loader component
  const TopDealsSkeleton = () => (
    <SkeletonGrid>
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonImageContainer />
          <SkeletonTitle />
          <SkeletonMeta>
            <SkeletonRating />
            <SkeletonTag />
          </SkeletonMeta>
          <SkeletonPrice />
        </SkeletonCard>
      ))}
    </SkeletonGrid>
  )

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Top Deals</SectionTitle>
          <SeeAllLink href="/products">
            See All
            <ChevronRight />
          </SeeAllLink>
        </SectionHeader>
        <FiltersContainer>
          {filters.map((filter) => (
            <FilterChip
              key={filter}
              $active={false}
              disabled
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              {filter}
            </FilterChip>
          ))}
        </FiltersContainer>
        <TopDealsSkeleton />
      </Section>
    )
  }

  if (error) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Top Deals</SectionTitle>
          <SeeAllLink href="/products">
            See All
            <ChevronRight />
          </SeeAllLink>
        </SectionHeader>
        <ErrorAlert message="Failed to load products" onClose={() => {}} />
      </Section>
    )
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Top Deals</SectionTitle>
        <SeeAllLink href="/products">
          See All
          <ChevronRight />
        </SeeAllLink>
      </SectionHeader>
      <FiltersContainer>
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            $active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </FilterChip>
        ))}
      </FiltersContainer>
      <CarsGrid>
        {products.map((product) => (
          <CarCard key={product._id}>
            <ImageContainer>
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
              />
              <FavoriteButton
                $active={favorites.includes(product._id)}
                onClick={() => toggleFavorite(product._id)}
                aria-label={
                  favorites.includes(product._id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                title={
                  favorites.includes(product._id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Heart />
              </FavoriteButton>
            </ImageContainer>
            <CarName>{product.name}</CarName>
            <CarMeta>
              <Rating>
                <Star />
                {product.ratingsAverage || 4.5}
              </Rating>
              <ConditionTag $condition={product.condition}>
                {product.condition}
              </ConditionTag>
            </CarMeta>
            <CarPrice>₦{product.price?.toLocaleString()}</CarPrice>
          </CarCard>
        ))}
      </CarsGrid>
    </Section>
  )
}
