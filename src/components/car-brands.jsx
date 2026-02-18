"use client"

import styled from "styled-components"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  Wrench,
  Home,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Tag,
  Grid3x3,
} from "lucide-react"

// ===== BRANDS GRID =====
const BrandsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(8, 1fr);
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`

// ===== BRAND ITEM BUTTON =====
const BrandItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 6px;
  border-radius: 12px;

  @media (min-width: 768px) {
    gap: 8px;
    padding: 8px;
  }

  @media (min-width: 1024px) {
    padding: 8px;
  }

  &:hover {
    transform: translateY(-6px);
    background: #f5f5f5;

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`

// ===== BRAND ICON CIRCLE =====
const BrandIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  @media (min-width: 1024px) {
    width: 52px;
    height: 52px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, #e5e5e5, #f0f0f0) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: intersect;
    -webkit-mask-composite: source-out;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transition: all 0.2s ease;

    @media (min-width: 768px) {
      width: 28px;
      height: 28px;
    }

    @media (min-width: 1024px) {
      width: 24px;
      height: 24px;
    }
  }
`

// ===== BRAND NAME TEXT =====
const BrandName = styled.span`
  font-size: 10px;
  color: #1a1a1a;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.3px;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  @media (min-width: 1024px) {
    font-size: 10px;
  }
`

// ===== BRANDS ARRAY =====
const brands = [
  { name: "Products", icon: ShoppingBag, route: "/products" },
  { name: "Services", icon: Wrench, route: "/services" },
  { name: "Hostels", icon: Home, route: "/hostels" },
  { name: "Roommates", icon: Users, route: "/roommates" },
  { name: "Events", icon: Calendar, route: "/events" },
  { name: "Roommates-Application", icon: Users, route: "/roommate-applications" },
  { name: "Received-Offers", icon: Tag, route: "/received-offers" },
  { name: "Requests", icon: Grid3x3, route: "/requests" },
]

// ===== CAR BRANDS COMPONENT =====
export function CarBrands() {
  const router = useRouter()

  const handleBrandClick = (route) => {
    router.push(route)
  }

  return (
    <BrandsGrid>
      {brands.map((brand) => {
        const IconComponent = brand.icon
        return (
          <BrandItem
            key={brand.name}
            onClick={() => handleBrandClick(brand.route)}
            title={brand.name}
            aria-label={brand.name}
          >
            <BrandIcon>
              <IconComponent size={24} color="#1a1a1a" strokeWidth={1.8} />
            </BrandIcon>
            <BrandName>{brand.name}</BrandName>
          </BrandItem>
        )
      })}
    </BrandsGrid>
  )
}