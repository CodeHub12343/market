"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useProductById, useDeleteProduct } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useGetOrCreateChat } from "@/hooks/useChats";
import ReviewSection from "@/components/reviews/ReviewSection";
import RecommendedProducts from "@/components/products/RecommendedProducts";
import RelatedProducts from "@/components/products/RelatedProducts";
import FrequentlyBoughtTogether from "@/components/products/FrequentlyBoughtTogether";
import { generateProductSchema, generateBreadcrumbSchema } from "@/utils/seo";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  MessageCircle, 
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  MessageSquare,
  ShoppingBag
} from "lucide-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

// Helper function to convert backend image paths to full URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  let cleanPath = imagePath;
  if (imagePath.startsWith('/public/')) {
    cleanPath = imagePath.replace('/public', '');
  }
  
  return `http://localhost:5000${cleanPath}`;
};

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 80px;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
  }
`;

const Sidebar = styled.aside`
  display: none;
`;

const MainContent = styled.main`
  width: 100%;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 40px 24px 60px;
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
    padding: 24px 16px 32px;
  }
`;

const HeroContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0;
    max-width: 100%;
  }
`;

// ===== IMAGE GALLERY SECTION =====
const GallerySection = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
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

const ImageGallery = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  overflow: hidden;

  @media (min-width: 768px) {
    aspect-ratio: 4/5;
  }

  @media (min-width: 1024px) {
    aspect-ratio: 3/4;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.$direction === "left" ? "left: 12px" : "right: 12px")};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #1a1a1a;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  z-index: 5;

  @media (min-width: 768px) {
    bottom: 16px;
    right: 16px;
    padding: 8px 14px;
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  background: #f8f8f8;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 16px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid ${(props) => (props.$active ? "#1a1a1a" : "transparent")};
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }

  &:hover {
    border-color: #1a1a1a;
  }
`;

// ===== HEADER SECTION =====
const HeaderSection = styled.div`
  padding: 16px;
  position: relative;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    background: transparent;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  display: inline-block;
  background: #000000;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
`;

const IconButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #000000;
    border-color: #000000;
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${(props) => (props.$active ? "#ff1744" : "currentColor")};
    fill: ${(props) => (props.$active ? "#ff1744" : "none")};
  }
`;

const ProductTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 28px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const CategoryBreadcrumb = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const RatingPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    margin-top: 16px;
    padding-top: 16px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #1a1a1a;

  svg {
    width: 16px;
    height: 16px;
    color: #ffc107;
    fill: #ffc107;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Price = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const StockStatus = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.$inStock ? "#e8f5e9" : "#ffebee")};
  color: ${(props) => (props.$inStock ? "#2e7d32" : "#c62828")};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (min-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

// ===== DESCRIPTION SECTION =====
const DescriptionSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;

  @media (min-width: 768px) {
    font-size: 15px;
    line-height: 1.7;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

// ===== SPECS SECTION =====
const SpecsSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
  }
`;

const SpecCard = styled.div`
  background: #f8f8f8;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 16px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const SpecLabel = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0 0 6px 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

const SpecValue = styled.p`
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

// ===== SELLER SECTION (Complex Mobile-First Redesign) =====
const SellerSection = styled.div`
  padding: 0;
  border-top: none;
  margin: 24px 0;
`;

const SellerCard = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 640px) {
    grid-template-columns: 100px 1fr auto;
    gap: 24px;
    align-items: center;
    padding: 28px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 120px 1fr 180px;
    gap: 32px;
    padding: 32px;
  }
`;

const SellerAvatarWrapper = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 640px) {
    justify-content: flex-start;
  }
`;

const SellerAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 640px) {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    font-size: 32px;
  }

  @media (min-width: 1024px) {
    width: 120px;
    height: 120px;
    border-radius: 24px;
    font-size: 40px;
  }
`;

const SellerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
    gap: 14px;
  }
`;

const SellerHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SellerName = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

const SellerMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 13px;
  color: #6b7280;

  @media (min-width: 640px) {
    justify-content: flex-start;
    font-size: 14px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(107, 114, 128, 0.08);
  border-radius: 8px;

  @media (min-width: 640px) {
    background: transparent;
    padding: 0;
  }
`;

const SellerStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  @media (min-width: 640px) {
    border: none;
    padding: 0;
    gap: 16px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 13px;
  }
`;

const SellerActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    justify-self: end;
    align-self: center;
    min-width: 160px;
  }
`;

const SellerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 640px) {
    width: 100%;
    padding: 12px 14px;
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    padding: 13px 16px;
    font-size: 13px;
  }

  &:hover:not(:disabled) {
    border-color: #1a1a1a;
    background: #f9f9f9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SellerButtonPrimary = styled(SellerButton)`
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;

  &:hover:not(:disabled) {
    background: #333;
  }

  &[href*="wa.me"] {
    background: #25d366 !important;
    border-color: #25d366 !important;
    color: white !important;
  }

  &[href*="wa.me"]:hover {
    background: #1ecc4f !important;
    border-color: #1ecc4f !important;
  }
`;

// ===== TRUST SECTION =====
const TrustSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
`;

const TrustCard = styled.div`
  background: #f8f8f8;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
    gap: 12px;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const TrustLabel = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  font-weight: 500;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

// ===== ACTION BUTTONS =====
const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  bottom: 70px;
  z-index: 8;
  background: white;
  padding: 16px;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 20px;
    gap: 16px;
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    position: static;
    bottom: auto;
    padding: 0;
    border: none;
    background: transparent;
    margin-top: 32px;
    gap: 16px;
  }
`;

const PrimaryActionButton = styled.button`
  flex: 1;
  padding: 14px 16px;
  border: ${(props) => (props.$primary ? "none" : "2px solid #000000")};
  border-radius: 12px;
  background: ${(props) => (props.$primary ? "#000000" : "white")};
  color: ${(props) => (props.$primary ? "white" : "#000000")};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: ${(props) => (props.$primary ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.06)")};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 16px 20px;
    font-size: 15px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 16px 24px;
    font-size: 16px;
    border-radius: 12px;
  }

  &:hover:not(:disabled) {
    ${(props) =>
      props.$primary
        ? "background: #333333; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); transform: translateY(-2px);"
        : "border-color: #000000; background: #f5f5f5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"}
  }

  svg {
    width: 18px;
    height: 18px;
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 16px;
  color: #666;
`;

const SkeletonLoading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`;

const SkeletonImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonMainImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonThumbnails = styled.div`
  display: flex;
  gap: 8px;
`;

const SkeletonThumbnail = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonTitle = styled.div`
  width: 100%;
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonPrice = styled.div`
  width: 150px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > div {
    width: 100%;
    height: 12px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    &:last-child {
      width: 80%;
    }
  }
`;

const SkeletonButton = styled.div`
  width: 100%;
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ErrorContainer = styled.div`
  padding: 16px;
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 8px;
  color: #c62828;
  margin: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Helper function to convert backend image paths to full URLs

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { user, isLoading: userLoading } = useAuth();
  const createChatMutation = useGetOrCreateChat();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: product, isLoading, error, isRefetching } = useProductById(id);
  const deleteProduct = useDeleteProduct();
  
  // Reset image index when product data refreshes (e.g., after update)
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
    }
  }, [product?._id, product?.images?.length]);

  // Debug logging
  console.log("User from auth:", user);
  if (product) {
    console.log("Product loaded:", product);
    console.log("Product images:", product.images);
    console.log("Product price:", product.price);
    console.log("Product name:", product.name);
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <Sidebar>
          <BottomNav active="products" />
        </Sidebar>
        <MainContent>
          <ContentArea>
            <HeroSection>
              <HeroContent>
                <HeroTitle>Loading product details...</HeroTitle>
              </HeroContent>
            </HeroSection>
            <ContentWrapper>
              <SkeletonLoading>
                <SkeletonImageGallery>
                  <SkeletonMainImage />
                  <SkeletonThumbnails>
                    <SkeletonThumbnail />
                    <SkeletonThumbnail />
                    <SkeletonThumbnail />
                    <SkeletonThumbnail />
                  </SkeletonThumbnails>
                </SkeletonImageGallery>
                <SkeletonContent>
                  <SkeletonTitle style={{ width: '80%' }} />
                  <SkeletonPrice />
                  <SkeletonDescription>
                    <div />
                    <div />
                    <div />
                    <div />
                  </SkeletonDescription>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <SkeletonButton style={{ flex: 1 }} />
                    <SkeletonButton style={{ flex: 1 }} />
                  </div>
                </SkeletonContent>
              </SkeletonLoading>
            </ContentWrapper>
          </ContentArea>
        </MainContent>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <MainContent>
          <ContentArea>
            <HeroSection>
              <HeroContent>
                <HeroTitle>Product Details</HeroTitle>
              </HeroContent>
            </HeroSection>
            <ContentWrapper>
              <ErrorContainer>
                <AlertCircle size={20} />
                {error ? `Error: ${error.message || "Failed to load product"}` : "Product not found"}
              </ErrorContainer>
            </ContentWrapper>
          </ContentArea>
        </MainContent>
      </PageWrapper>
    );
  }

  // Handle nested product structure
  const actualProduct = product?.product || product;
  
  // Get images array - images should be Cloudinary URLs already
  const images = Array.isArray(actualProduct?.images) && actualProduct.images.length > 0 
    ? actualProduct.images.filter(img => img && typeof img === 'string') // Filter to ensure valid strings
    : ["/placeholder.svg"];
  
  const currentImage = images[currentImageIndex];
  
  console.log("actualProduct:", actualProduct);
  console.log("images array from product:", images);
  console.log("currentImageIndex:", currentImageIndex);
  console.log("currentImage:", currentImage);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageSelect = (index) => {
    setCurrentImageIndex(index);
  };

  // Check if current user is the product owner
  // Prefer backend-provided `isOwner` if available, otherwise compare against known owner fields.
  const isOwner = (() => {
    if (!user) return false;

    // If backend included isOwner flag, trust it
    if (actualProduct?.isOwner === true) return true;

    const userId = String(user._id);

    // Shop owner may be populated as object or be an id string
    const shopOwnerId = actualProduct?.shop?.owner?._id || actualProduct?.shop?.owner;
    if (shopOwnerId && String(shopOwnerId) === userId) return true;

    // Other possible creator fields
    const creatorId = actualProduct?.createdBy?._id || actualProduct?.createdBy || actualProduct?.seller?._id || actualProduct?.seller || actualProduct?.userId;
    if (creatorId && String(creatorId) === userId) return true;

    // Fallback: localStorage for newly-created products (client-only)
    if (typeof window !== 'undefined') {
      try {
        const myCreatedProducts = JSON.parse(localStorage.getItem('myCreatedProducts') || '{}');
        if (myCreatedProducts && myCreatedProducts[actualProduct?._id]) return true;
      } catch (e) {
        // ignore parse errors
      }
    }

    return false;
  })();

  // Handle delete product
  const handleDelete = async () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(actualProduct._id);
        router.push('/products');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Handle edit product
  const handleEdit = () => {
    router.push(`/products/${actualProduct._id}/edit`);
  };

  // Handle message/contact seller
  const handleContactSeller = () => {
    // Get the shop owner's user ID (not the shop ID itself)
    const sellerId = actualProduct.shop?.owner?._id || 
                    actualProduct.shop?.owner ||
                    actualProduct.seller?._id ||
                    actualProduct.createdBy?._id ||
                    actualProduct.createdBy;

    if (!sellerId) {
      alert('Seller information not available');
      return;
    }

    if (sellerId === user?._id) {
      alert("You can't message yourself");
      return;
    }

    createChatMutation.mutate(sellerId, {
      onSuccess: (chat) => {
        console.log('✅ Chat created:', chat._id);
        router.push(`/messages/${chat._id}`);
      },
      onError: (error) => {
        console.error('❌ Failed to create chat:', error);
        alert(error.message || 'Failed to start chat');
      }
    });
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="products" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          <HeroSection>
            <HeroContent>
              <HeroTitle>{actualProduct.name}</HeroTitle>
            </HeroContent>
          </HeroSection>

          <ContentWrapper>
            {/* GALLERY */}
            <GallerySection>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <ImageGallery>
                <ImageCarousel>
                  <img src={currentImage} alt={actualProduct.name} />
                  {images.length > 1 && (
                    <>
                      <CarouselButton
                        $direction="left"
                        onClick={handlePrevImage}
                        title="Previous image"
                      >
                        <ChevronLeft />
                      </CarouselButton>
                      <CarouselButton
                        $direction="right"
                        onClick={handleNextImage}
                        title="Next image"
                      >
                        <ChevronRight />
                      </CarouselButton>
                    </>
                  )}
                  {images.length > 0 && (
                    <ImageCounter>
                      {currentImageIndex + 1} / {images.length}
                    </ImageCounter>
                  )}
                </ImageCarousel>
              </ImageGallery>

              {images.length > 1 && (
                <ImageThumbnails>
                  {images.map((image, index) => (
                    <Thumbnail
                      key={index}
                      src={image}
                      alt={`${actualProduct.name} ${index + 1}`}
                      $active={currentImageIndex === index}
                      onClick={() => handleImageSelect(index)}
                    />
                  ))}
                </ImageThumbnails>
              )}
            </GallerySection>

            {/* HEADER */}
            <HeaderSection>
              <HeaderTop>
                <Badge>{actualProduct.condition || "Good"}</Badge>
                <IconButtons>
                  <IconButton
                    $active={isFavorited}
                    onClick={() => setIsFavorited(!isFavorited)}
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart />
                  </IconButton>
                  <IconButton title="Share product">
                    <Share2 />
                  </IconButton>
                </IconButtons>
              </HeaderTop>

              <ProductTitle>{actualProduct.name}</ProductTitle>
              <CategoryBreadcrumb>{actualProduct.category?.name || actualProduct.category}</CategoryBreadcrumb>

              <RatingPrice>
                {actualProduct.ratingsAverage && (
                  <Rating title={`Rated ${actualProduct.ratingsAverage} stars (${actualProduct.ratingsQuantity} reviews)`}>
                    <Star size={16} />
                    {actualProduct.ratingsAverage.toFixed(1)}
                  </Rating>
                )}
                <Price>₦{actualProduct.price?.toLocaleString()}</Price>
                <StockStatus $inStock={actualProduct.stock > 0}>
                  <Check size={14} />
                  {actualProduct.stock > 0
                    ? `${actualProduct.stock} in stock`
                    : "Out of stock"}
                </StockStatus>
              </RatingPrice>
            </HeaderSection>

            {/* DESCRIPTION */}
            <DescriptionSection>
              <SectionTitle>Description</SectionTitle>
              <Description>{actualProduct.description}</Description>
            </DescriptionSection>

            {/* SPECS */}
            <SpecsSection>
              <SectionTitle>Details</SectionTitle>
              <SpecsGrid>
                <SpecCard>
                  <SpecLabel>Condition</SpecLabel>
                  <SpecValue>{actualProduct.condition ? actualProduct.condition.charAt(0).toUpperCase() + actualProduct.condition.slice(1) : "Good"}</SpecValue>
                </SpecCard>
                <SpecCard>
                  <SpecLabel>Category</SpecLabel>
                  <SpecValue>{actualProduct.category?.name || "N/A"}</SpecValue>
                </SpecCard>
                <SpecCard>
                  <SpecLabel>Campus</SpecLabel>
                  <SpecValue>{actualProduct.campus?.shortCode || "Main"}</SpecValue>
                </SpecCard>
                <SpecCard>
                  <SpecLabel>Posted</SpecLabel>
                <SpecValue>
                  {actualProduct.createdAt
                    ? new Date(actualProduct.createdAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </SpecValue>
              </SpecCard>
              <SpecCard>
                <SpecLabel>Views</SpecLabel>
                <SpecValue>{actualProduct.analytics?.views || 0}</SpecValue>
              </SpecCard>
              <SpecCard>
                <SpecLabel>Status</SpecLabel>
                <SpecValue>{actualProduct.status === "active" ? "Active" : "Inactive"}</SpecValue>
              </SpecCard>
            </SpecsGrid>
          </SpecsSection>

          {/* SELLER */}
          <SellerSection>
            <SellerCard>
              {/* AVATAR */}
              <SellerAvatarWrapper>
                <SellerAvatar>
                  {actualProduct.shop?.logo ? (
                    <Image
                      src={getImageUrl(actualProduct.shop.logo)}
                      alt={actualProduct.shop.name || 'Shop'}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={true}
                    />
                  ) : (
                    actualProduct.shop?.name?.charAt(0).toUpperCase() || "S"
                  )}
                </SellerAvatar>
              </SellerAvatarWrapper>

              {/* INFO */}
              <SellerInfo>
                <SellerHeader>
                  <SellerName>{actualProduct.shop?.name || "Seller Shop"}</SellerName>
                  <SellerMeta>
                    <MetaItem>🏪 {actualProduct.shop?.campus?.shortCode || actualProduct.campus?.shortCode || 'On campus'}</MetaItem>
                    {actualProduct.shop?.isVerified && <MetaItem>✓ Verified</MetaItem>}
                    <MetaItem>⭐ {actualProduct.shop?.ratingsAverage?.toFixed(1) || '4.5'}</MetaItem>
                  </SellerMeta>
                </SellerHeader>

                {/* STATS */}
                <SellerStats>
                  <StatItem>
                    <StatValue>{actualProduct.shop?.ratingsQuantity || 0}</StatValue>
                    <StatLabel>Reviews</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{actualProduct.analytics?.views || 0}</StatValue>
                    <StatLabel>Views</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{actualProduct.shop?.productCount || 0}</StatValue>
                    <StatLabel>Items</StatLabel>
                  </StatItem>
                </SellerStats>
              </SellerInfo>

              {/* ACTIONS */}
              <SellerActions>
                {actualProduct.shop?.whatsappNumber ? (
                  <SellerButtonPrimary
                    as="a"
                    href={`https://wa.me/${String(actualProduct.shop.whatsappNumber).replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Contact via WhatsApp: ${actualProduct.shop.whatsappNumber}`}
                    aria-label="Contact seller on WhatsApp"
                  >
                    <MessageSquare size={16} />
                    WhatsApp
                  </SellerButtonPrimary>
                ) : (
                  <SellerButtonPrimary as="a" aria-disabled="true" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <MessageSquare size={16} />
                    WhatsApp
                  </SellerButtonPrimary>
                )}

                <SellerButton
                  onClick={() => {
                    if (!user) return router.push('/login');
                    handleContactSeller();
                  }}
                  disabled={createChatMutation.isPending}
                >
                  <MessageCircle size={16} />
                  {createChatMutation.isPending ? 'Creating...' : 'Message'}
                </SellerButton>

                <SellerButton
                  onClick={() => router.push(`/shops/${actualProduct.shop?._id}`)}
                  title="View full shop profile"
                >
                  <ShoppingBag size={16} />
                  Visit Shop
                </SellerButton>
              </SellerActions>
            </SellerCard>
          </SellerSection>

          {/* TRUST BADGES */}
          <TrustSection>
            <SectionTitle>Why Buy From This Seller?</SectionTitle>
            <TrustGrid>
              <TrustCard>
                <Shield size={24} />
                <TrustLabel>Verified Seller</TrustLabel>
              </TrustCard>
              <TrustCard>
                <Truck size={24} />
                <TrustLabel>Campus Pickup</TrustLabel>
              </TrustCard>
              <TrustCard>
                <RotateCcw size={24} />
                <TrustLabel>Easy Returns</TrustLabel>
              </TrustCard>
            </TrustGrid>
          </TrustSection>

          {/* ACTION BUTTONS */}
          <ActionSection>
            {isOwner ? (
              <>
               {/*  <PrimaryActionButton $primary onClick={handleEdit}>
                  Edit Product
                </PrimaryActionButton> */}
                <PrimaryActionButton onClick={handleDelete} disabled={deleteProduct.isPending}>
                  {deleteProduct.isPending ? 'Deleting...' : 'Delete Product'}
                </PrimaryActionButton>
              </>
            ) : (
              <>
                <PrimaryActionButton>
                  <ShoppingCart />
                  Add to Cart
                </PrimaryActionButton>
                <PrimaryActionButton 
                  $primary
                  onClick={handleContactSeller}
                  disabled={createChatMutation.isPending}
                >
                  <MessageCircle />
                  {createChatMutation.isPending ? 'Creating...' : 'Contact Seller'}
                </PrimaryActionButton>
              </>
            )}
          </ActionSection>
          </ContentWrapper>

          {/* REVIEWS SECTION */}
          <ReviewSection productId={actualProduct._id} type="product" style={{ marginBottom: '24px' }} />
        </ContentArea>
      </MainContent>

      {/* SEO - Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateProductSchema(actualProduct, actualProduct.shop)
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Products', url: '/products' },
              { name: actualProduct.category?.name || 'Category', url: `/products?category=${actualProduct.category?._id}` },
              { name: actualProduct.name, url: `/products/${actualProduct._id}` },
            ])
          ),
        }}
      />

      <BottomNavWrapper>
        <BottomNav active="products" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}