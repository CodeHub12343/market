'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { useRequest, useRequestOffers, useDeleteRequest, useCloseRequest, useReopenRequest, useAcceptRequestOffer, useRejectRequestOffer, useToggleFavoriteRequest } from '@/hooks/useRequests';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useGetOrCreateChat } from '@/hooks/useChats';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { RequestDetailSkeleton } from '@/components/common/SkeletonLoaders';
import { ChevronLeft, Calendar, Zap, Users, TrendingUp, Heart, Share2, AlertCircle, MessageCircle, Clock, Copy, Check, X } from 'lucide-react';

// Helper function to format date as relative time
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

// ===== PAGE WRAPPER =====
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
`;

// ===== HEADER WITH BACK BUTTON =====
const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #1f2937;
  padding: 14px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    padding: 0 20px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 0 28px;
    gap: 16px;
  }
`;

// ===== MAIN CONTENT WITH TOP PADDING FOR FIXED HEADER =====
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 70px 16px 20px;
  margin-top: 0;

  @media (min-width: 640px) {
    padding: 70px 20px 28px;
  }

  @media (min-width: 1024px) {
    padding: 70px 28px 40px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    max-width: 1400px;
    margin: 0 auto;
  }

  > div:first-child {
    @media (min-width: 1024px) {
      grid-column: 1;
    }
  }

  > aside {
    @media (max-width: 1023px) {
      grid-column: 1 / -1;
    }

    @media (min-width: 1024px) {
      grid-column: 2;
      grid-row: 1;
    }
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(31, 41, 55, 0.1);
  color: #1f2937;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;

  @media (hover: hover) {
    &:hover {
      background: rgba(31, 41, 55, 0.15);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #1f2937;

  @media (min-width: 640px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

// ===== HERO SECTION =====
const HeroSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 250, 251, 0.8) 100%);
  border-radius: 14px;
  padding: 20px 16px;
  margin-top: 0;
  color: #1f2937;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    padding: 24px 20px;
    border-radius: 16px;
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    margin-top: 0;
    padding: 28px 24px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(31, 41, 55, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -5%;
    width: 200px;
    height: 200px;
    background: rgba(31, 41, 55, 0.03);
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 20px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  opacity: 0.9;

  @media (min-width: 640px) {
    font-size: 13px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

// ===== STATS GRID =====
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;

  @media (min-width: 640px) {
    gap: 14px;
    margin-top: 18px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: 640px) {
    padding: 14px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 16px;
  }
`;

const StatLabel = styled.div`
  font-size: 10px;
  opacity: 0.8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 11px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-top: 6px;

  @media (min-width: 640px) {
    font-size: 18px;
    margin-top: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

// ===== QUICK ACTIONS SECTION =====
const QuickActionsSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  margin-top: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
    margin-top: 18px;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const QuickActionButton = styled.button`
  padding: 12px 14px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  color: #1f2937;

  @media (min-width: 640px) {
    padding: 13px 16px;
    font-size: 13px;
    border-radius: 12px;
  }

  @media (hover: hover) {
    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  &:active {
    transform: scale(0.96);
  }

  ${({ variant }) => {
    if (variant === 'primary') {
      return `
        background: #1f2937;
        color: white;
        border-color: #1f2937;
        &:hover {
          background: #111827;
          border-color: #111827;
        }
      `;
    }
  }}

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ===== ACTION BAR (for mobile) =====
const ActionBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 0;

  @media (min-width: 640px) {
    gap: 12px;
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

// ===== CONTENT SECTIONS =====
const Section = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  margin-top: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
    margin-top: 18px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
    border-radius: 18px;
    margin-top: 20px;
    grid-column: 1;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 15px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const DescriptionText = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

// ===== DETAILS GRID =====
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

const DetailItem = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #f0f0f0;

  @media (min-width: 640px) {
    padding: 14px;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 16px;
  }
`;

const DetailLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 6px;

  @media (min-width: 640px) {
    font-size: 11px;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }
`;

const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

// ===== OFFERS SECTION =====
const OffersContainer = styled.div``;

const OfferCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1.5px solid #f0f0f0;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    padding: 16px;
    border-radius: 14px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    padding: 18px;
    border-radius: 16px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      border-color: #e5e5e5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }
`;

const OfferHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    margin-bottom: 14px;
  }
`;

const OfferPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 17px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const OfferBadge = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    if (props.status === 'accepted') return '#d1fae5';
    if (props.status === 'rejected') return '#fee2e2';
    return '#ecfdf5';
  }};
  color: ${props => {
    if (props.status === 'accepted') return '#065f46';
    if (props.status === 'rejected') return '#7f1d1d';
    return '#065f46';
  }};

  @media (min-width: 640px) {
    font-size: 11px;
  }
`;

const OfferMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;

  @media (min-width: 640px) {
    font-size: 13px;
    margin-bottom: 12px;
  }
`;

const OfferMessage = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  line-height: 1.5;

  @media (min-width: 640px) {
    font-size: 13px;
    padding: 12px;
  }
`;

// ===== OFFER ACTION BUTTONS =====
const OfferActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;

  @media (min-width: 640px) {
    gap: 10px;
    margin-top: 14px;
    padding-top: 14px;
  }
`;

const OfferActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  ${props => {
    if (props.$variant === 'accept') {
      return `
        background: #d1fae5;
        color: #065f46;
        border-color: #a7f3d0;
        &:hover { background: #a7f3d0; }
      `;
    }
    if (props.$variant === 'reject') {
      return `
        background: #fee2e2;
        color: #7f1d1d;
        border-color: #fecaca;
        &:hover { background: #fecaca; }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (min-width: 640px) {
    font-size: 12px;
    padding: 10px 14px;
  }
`;

// ===== SIDEBAR =====
const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;

  @media (min-width: 640px) {
    gap: 18px;
    margin-top: 18px;
  }

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 0;
  }
`;

const SidebarCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
    border-radius: 16px;
    position: sticky;
    top: 100px;
  }

  @media (min-width: 1440px) {
    top: 120px;
  }
`;

const SidebarTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 14px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SidebarButton = styled.button`
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #1f2937;

  ${({ variant }) => {
    if (variant === 'primary') {
      return `
        background: #1f2937;
        color: white;
        border-color: #1f2937;
        &:hover { background: #111827; border-color: #111827; }
      `;
    }
    if (variant === 'secondary') {
      return `
        background: #f3f4f6;
        color: #1f2937;
        border-color: #f3f4f6;
        &:hover { background: #e5e7eb; border-color: #e5e7eb; }
      `;
    }
  }}

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ===== REQUEST INFO DETAIL ITEMS FOR SIDEBAR =====
const RequestInfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #999;

  @media (min-width: 640px) {
    padding: 40px 20px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

// ===== SHARE MODAL =====
const ShareModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;

  @media (min-width: 640px) {
    align-items: center;
    justify-content: center;
  }
`;

const ShareContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px 16px 0 0;
  padding: 24px 20px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    border-radius: 16px;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ShareTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1f2937;
`;

const ShareOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const ShareButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;

  svg {
    width: 24px;
    height: 24px;
    color: #1f2937;
  }

  @media (hover: hover) {
    &:hover {
      border-color: #1f2937;
      background: #f3f4f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  transition: all 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  }
`;

export default function RequestDetailPage({ params: paramPromise }) {
  const params = use(paramPromise);
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  // State management
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedOfferForClose, setSelectedOfferForClose] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Data fetching
  const { data: requestData, isLoading: requestLoading, error: requestError } = useRequest(params.id);
  const { data: offers = [], isLoading: offersLoading } = useRequestOffers(params.id);

  // Mutations
  const deleteRequestMutation = useDeleteRequest();
  const closeRequestMutation = useCloseRequest();
  const reopenRequestMutation = useReopenRequest();
  const favoriteRequestMutation = useToggleFavoriteRequest();
  const acceptOfferMutation = useAcceptRequestOffer();
  const rejectOfferMutation = useRejectRequestOffer();
  const createChatMutation = useGetOrCreateChat();

  // Data processing
  const request = requestData?.request || requestData;
  const isOwner = user?._id === request?.requester?._id;
  const isFavorited = request?.favoritedBy?.includes(user?._id);

  // Handlers
  const handleDelete = async () => {
    try {
      setShowDeleteConfirm(false);
      await deleteRequestMutation.mutateAsync(params.id);
      toast.success('Request deleted successfully');
      setTimeout(() => router.push('/requests'), 500);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete request');
    }
  };

  const handleCloseRequest = async () => {
    try {
      setShowCloseConfirm(false);
      await closeRequestMutation.mutateAsync({
        id: params.id,
        closureData: {
          selectedOffer: selectedOfferForClose?._id
        }
      });
      toast.success('Request closed successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to close request');
    }
  };

  const handleReopenRequest = async () => {
    try {
      setShowReopenConfirm(false);
      await reopenRequestMutation.mutateAsync(params.id);
      toast.success('Request reopened successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to reopen request');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await favoriteRequestMutation.mutateAsync(params.id);
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error(error?.message || 'Failed to update favorite status');
    }
  };

  const handleShareRequest = async (platform) => {
    const requestUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this request: ${request.title}`;

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(requestUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast.success('Link copied to clipboard!');
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + requestUrl)}`, '_blank');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(requestUrl)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(requestUrl)}`, '_blank');
      }
      setShowShareModal(false);
    } catch (error) {
      toast.error('Failed to share request');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOfferMutation.mutateAsync({
        requestId: params.id,
        offerId
      });
      toast.success('Offer accepted successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to accept offer');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await rejectOfferMutation.mutateAsync({
        requestId: params.id,
        offerId
      });
      toast.success('Offer rejected');
    } catch (error) {
      toast.error(error?.message || 'Failed to reject offer');
    }
  };

  const handleCreateOffer = () => {
    router.push(`/requests/${params.id}/make-offer`);
  };

  const handleEditRequest = () => {
    router.push(`/requests/${params.id}/edit`);
  };

  const handleStartChat = () => {
    const requesterUserId = request?.requester?._id;
    if (!requesterUserId) {
      toast.error('Unable to start chat');
      return;
    }

    createChatMutation.mutate(requesterUserId, {
      onSuccess: (chat) => {
        router.push(`/messages?chatId=${chat._id}`);
        toast.success('Chat created! Redirecting...');
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to create chat');
      }
    });
  };

  if (requestLoading) {
    return (
      <PageContainer>
        <Header>
          <BackButton as={Link} href="/requests">
            <ChevronLeft size={20} />
          </BackButton>
          <HeaderTitle>Loading...</HeaderTitle>
        </Header>
        <MainContent style={{ paddingTop: '70px', paddingBottom: '20px' }}>
          <RequestDetailSkeleton />
        </MainContent>
      </PageContainer>
    );
  }

  if (requestError || !request) {
    return (
      <PageContainer>
        <Header>
          <BackButton as={Link} href="/requests">
            <ChevronLeft size={20} />
          </BackButton>
          <HeaderTitle>Request Not Found</HeaderTitle>
        </Header>
        <MainContent>
          <ErrorAlert message="Failed to load request details" />
        </MainContent>
      </PageContainer>
    );
  }

  const formattedPrice = request.formattedPrice || `₦${parseInt(request.desiredPrice).toLocaleString()}`;

  return (
    <PageContainer>
      <Header>
        <BackButton as={Link} href="/requests">
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>{request.title}</HeaderTitle>
      </Header>

      <MainContent>
        <div>
          {/* HERO SECTION */}
          <HeroSection>
            <HeroContent>
              <HeroTitle>{request.title}</HeroTitle>
              <HeroMeta>
                <span>📍 Posted by {request.requester?.fullName?.split(' ')[0]}</span>
                <span>⏱️ {formatDistanceToNow(new Date(request.createdAt))}</span>
              </HeroMeta>

              <StatsGrid>
                <StatCard>
                  <StatLabel>Views</StatLabel>
                  <StatValue>{request.analytics?.views || 0}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Offers</StatLabel>
                  <StatValue>{request.analytics?.offersCount || 0}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Status</StatLabel>
                  <StatValue style={{ textTransform: 'capitalize' }}>{request.status}</StatValue>
                </StatCard>
              </StatsGrid>

              <ActionBar>
                {!isOwner && (
                  <>
                    <QuickActionButton 
                      onClick={handleCreateOffer}
                      variant="primary"
                      aria-label="Make an offer"
                      title="Make an offer on this request"
                    >
                      Make Offer
                    </QuickActionButton>
                    <QuickActionButton 
                      onClick={handleStartChat}
                      disabled={createChatMutation.isPending}
                      aria-label="Message the requester"
                      title="Message the requester"
                    >
                      <MessageCircle size={16} />
                      Message
                    </QuickActionButton>
                  </>
                )}
                <QuickActionButton 
                  onClick={handleToggleFavorite}
                  disabled={favoriteRequestMutation.isPending}
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={16} fill={isFavorited ? '#dc2626' : 'none'} color={isFavorited ? '#dc2626' : 'currentColor'} />
                  Save Request
                </QuickActionButton>
                <QuickActionButton 
                  onClick={() => setShowShareModal(true)}
                  aria-label="Share request"
                  title="Share this request"
                >
                  <Share2 size={16} />
                  Share Request
                </QuickActionButton>
                {(request.whatsappNumber || request.requester?.whatsapp) && (
                  <QuickActionButton
                    as="a"
                    href={`https://wa.me/${request.whatsappNumber || request.requester?.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
                    aria-label="Contact on WhatsApp"
                  >
                    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.472 19.339c-.355-.177-2.096-1.034-2.419-1.153-.323-.118-.559-.177-.795.178-.237.355-.914 1.153-1.122 1.39-.207.237-.414.266-.769.089-.355-.178-1.5-.553-2.86-1.763-1.057-.943-1.77-2.104-1.98-2.459-.207-.355-.022-.546.155-.723.159-.158.355-.414.533-.62.178-.207.237-.355.355-.592.118-.237.06-.444-.03-.62-.089-.178-.795-1.92-1.089-2.63-.287-.691-.58-.597-.795-.608-.206-.009-.444-.011-.682-.011-.237 0-.62.089-.944.444-.323.355-1.23 1.202-1.23 2.927 0 1.726 1.26 3.393 1.435 3.627.177.237 2.484 3.797 6.021 5.17.842.29 1.498.463 2.01.592.844.214 1.613.184 2.22.112.677-.08 2.096-.857 2.393-1.687.296-.83.296-1.54.207-1.687-.089-.148-.323-.237-.677-.414z" fill="#fff"/></svg>
                    WhatsApp
                  </QuickActionButton>
                )}
              </ActionBar>
            </HeroContent>
          </HeroSection>

          {/* DESCRIPTION SECTION */}
          <Section>
            <SectionTitle>About Request</SectionTitle>
            <DescriptionText>{request.description}</DescriptionText>
          </Section>

          {/* BUDGET SECTION */}
          <Section>
            <SectionTitle>Budget & Timeline</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Budget Offered</DetailLabel>
                <DetailValue>{formattedPrice}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Time Remaining</DetailLabel>
                <DetailValue>{request.timeRemaining || 'N/A'} days</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Category</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>
                  {typeof request.category === 'object' && request.category?.name 
                    ? request.category.name 
                    : 'General'}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Priority</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>{request.priority || 'Medium'}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </Section>

          {/* OFFERS SECTION */}
          {offers.length > 0 && (
            <Section>
              <SectionTitle>
                💬 Offers ({offers.length})
              </SectionTitle>
              <OffersContainer>
                {offers.map((offer) => (
                  <OfferCard key={offer._id}>
                    <OfferHeader>
                      <div>
                        <OfferPrice>{offer.offerPrice ? `₦${parseInt(offer.offerPrice).toLocaleString()}` : 'N/A'}</OfferPrice>
                        <OfferMeta>
                          <span>by {offer.offerMakerName || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(offer.createdAt))}</span>
                        </OfferMeta>
                      </div>
                      <OfferBadge status={offer.status}>
                        {offer.status || 'Active'}
                      </OfferBadge>
                    </OfferHeader>
                    {offer.message && <OfferMessage>{offer.message}</OfferMessage>}

                    {/* Accept/Reject Buttons - Show for request owner */}
                    {isOwner && offer.status === 'pending' && (
                      <OfferActions>
                        <OfferActionButton
                          $variant="accept"
                          onClick={() => handleAcceptOffer(offer._id)}
                          disabled={acceptOfferMutation.isPending}
                        >
                          {acceptOfferMutation.isPending ? 'Accepting...' : 'Accept'}
                        </OfferActionButton>
                        <OfferActionButton
                          $variant="reject"
                          onClick={() => handleRejectOffer(offer._id)}
                          disabled={rejectOfferMutation.isPending}
                        >
                          {rejectOfferMutation.isPending ? 'Rejecting...' : 'Reject'}
                        </OfferActionButton>
                      </OfferActions>
                    )}
                  </OfferCard>
                ))}
              </OffersContainer>
            </Section>
          )}

          {offers.length === 0 && !offersLoading && (
            <Section>
              <SectionTitle>💬 Offers</SectionTitle>
              <EmptyState>
                <p>No offers yet. Be the first to make an offer!</p>
              </EmptyState>
            </Section>
          )}
        </div>

        {/* SIDEBAR */}
        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Contact</SidebarTitle>
            <SidebarContent>
              {(request.whatsappNumber || request.requester?.whatsapp) && (
                <SidebarButton
                  as="a"
                  href={`https://wa.me/${request.whatsappNumber || request.requester?.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
                  aria-label="Contact on WhatsApp"
                >
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.472 19.339c-.355-.177-2.096-1.034-2.419-1.153-.323-.118-.559-.177-.795.178-.237.355-.914 1.153-1.122 1.39-.207.237-.414.266-.769.089-.355-.178-1.5-.553-2.86-1.763-1.057-.943-1.77-2.104-1.98-2.459-.207-.355-.022-.546.155-.723.159-.158.355-.414.533-.62.178-.207.237-.355.355-.592.118-.237.06-.444-.03-.62-.089-.178-.795-1.92-1.089-2.63-.287-.691-.58-.597-.795-.608-.206-.009-.444-.011-.682-.011-.237 0-.62.089-.944.444-.323.355-1.23 1.202-1.23 2.927 0 1.726 1.26 3.393 1.435 3.627.177.237 2.484 3.797 6.021 5.17.842.29 1.498.463 2.01.592.844.214 1.613.184 2.22.112.677-.08 2.096-.857 2.393-1.687.296-.83.296-1.54.207-1.687-.089-.148-.323-.237-.677-.414z" fill="#fff"/></svg>
                  WhatsApp
                </SidebarButton>
              )}
              {!isOwner && (
                <SidebarButton 
                  variant="secondary" 
                  onClick={handleStartChat}
                  disabled={createChatMutation.isPending}
                  aria-label="Message the requester"
                >
                  {createChatMutation.isPending ? '💬 Connecting...' : '💬 Message Requester'}
                </SidebarButton>
              )}
              <SidebarButton 
                variant="secondary"
                onClick={handleToggleFavorite}
                disabled={favoriteRequestMutation.isPending}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? '❤️ Saved' : '🤍 Save Request'}
              </SidebarButton>
              <SidebarButton 
                variant="secondary"
                onClick={() => setShowShareModal(true)}
                aria-label="Share request"
              >
                Share Request
              </SidebarButton>
            </SidebarContent>
          </SidebarCard>

          {isOwner && (
            <SidebarCard>
              <SidebarTitle>Owner Actions</SidebarTitle>
              <SidebarContent>
                <SidebarButton variant="secondary" onClick={handleEditRequest}>
                  ✏️ Edit Request
                </SidebarButton>
                {request.status === 'open' && (
                  <SidebarButton
                    variant="secondary"
                    onClick={() => setShowCloseConfirm(true)}
                    disabled={closeRequestMutation.isPending}
                    aria-label="Close this request"
                  >
                    {closeRequestMutation.isPending ? 'Closing...' : '✓ Close Request'}
                  </SidebarButton>
                )}
                {request.status === 'closed' && (
                  <SidebarButton
                    variant="secondary"
                    onClick={() => setShowReopenConfirm(true)}
                    disabled={reopenRequestMutation.isPending}
                    aria-label="Reopen this request"
                    style={{ color: '#10b981' }}
                  >
                    {reopenRequestMutation.isPending ? 'Reopening...' : '↻ Reopen Request'}
                  </SidebarButton>
                )}
                <SidebarButton
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteRequestMutation.isPending}
                  style={{ color: '#dc2626' }}
                  aria-label="Delete request"
                >
                  {deleteRequestMutation.isPending ? 'Deleting...' : '🗑️ Delete Request'}
                </SidebarButton>
              </SidebarContent>
            </SidebarCard>
          )}

          <SidebarCard>
            <SidebarTitle>Request Info</SidebarTitle>
            <RequestInfoGrid>
              <div>
                <DetailLabel>Status</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize', color: request.status === 'closed' ? '#ef4444' : '#10b981' }}>
                  {request.status || 'Open'}
                </DetailValue>
              </div>
              <div>
                <DetailLabel>Posted</DetailLabel>
                <DetailValue>{new Date(request.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</DetailValue>
              </div>
              <div>
                <DetailLabel>Expires</DetailLabel>
                <DetailValue>{new Date(request.expiresAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</DetailValue>
              </div>
              <div>
                <DetailLabel>Category</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>
                  {typeof request.category === 'object' && request.category?.name 
                    ? request.category.name 
                    : 'General'}
                </DetailValue>
              </div>
            </RequestInfoGrid>
          </SidebarCard>
        </Sidebar>
      </MainContent>

      {/* CONFIRMATION DIALOGS */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Request?"
        description="This action cannot be undone. The request and all its offers will be permanently deleted."
        confirmText="Delete Request"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={deleteRequestMutation.isPending}
      />

      <ConfirmDialog
        isOpen={showCloseConfirm}
        title="Close Request?"
        description="Once closed, no new offers can be made on this request."
        confirmText="Close Request"
        cancelText="Cancel"
        confirmVariant="success"
        onConfirm={handleCloseRequest}
        onCancel={() => setShowCloseConfirm(false)}
        isLoading={closeRequestMutation.isPending}
      />

      <ConfirmDialog
        isOpen={showReopenConfirm}
        title="Reopen Request?"
        description="This request will be marked as open again and users can make new offers."
        confirmText="Reopen Request"
        cancelText="Cancel"
        confirmVariant="success"
        onConfirm={handleReopenRequest}
        onCancel={() => setShowReopenConfirm(false)}
        isLoading={reopenRequestMutation.isPending}
      />

      {/* SHARE MODAL */}
      {showShareModal && (
        <ShareModal onClick={() => setShowShareModal(false)}>
          <ShareContent onClick={(e) => e.stopPropagation()}>
            <ShareTitle>Share Request</ShareTitle>
            <ShareOptions>
              <ShareButton 
                onClick={() => handleShareRequest('copy')}
                aria-label="Copy request link"
                title="Copy link"
              >
                {copySuccess ? <Check size={24} /> : <Copy size={24} />}
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </ShareButton>
              <ShareButton 
                onClick={() => handleShareRequest('whatsapp')}
                aria-label="Share on WhatsApp"
                title="Share on WhatsApp"
              >
                💬
                WhatsApp
              </ShareButton>
              <ShareButton 
                onClick={() => handleShareRequest('twitter')}
                aria-label="Share on Twitter"
                title="Share on Twitter"
              >
                𝕏
                Twitter
              </ShareButton>
              <ShareButton 
                onClick={() => handleShareRequest('facebook')}
                aria-label="Share on Facebook"
                title="Share on Facebook"
              >
                f
                Facebook
              </ShareButton>
            </ShareOptions>
            <CloseButton onClick={() => setShowShareModal(false)}>
              Close
            </CloseButton>
          </ShareContent>
        </ShareModal>
      )}
    </PageContainer>
  );
}
