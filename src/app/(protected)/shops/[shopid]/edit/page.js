'use client';

import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import ShopForm from '@/components/shops/ShopForm';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { useShopById } from '@/hooks/useShops';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';

/* ============ PAGE LAYOUT ============ */
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    background: #f9f9f9;
    padding-bottom: 40px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/* ============ HEADER SECTION ============ */
const HeaderWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 40;

  @media (min-width: 768px) {
    padding: 20px 24px;
  }

  @media (min-width: 1024px) {
    padding: 24px 32px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.05);
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(26, 26, 26, 0.1);
    border-color: #d0d0d0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const BottomNavWrapper = styled.div`
  @media (max-width: 1023px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 24px;
`;

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.shopid;

  const { data: shop, isLoading, error } = useShopById(shopId);

  if (isLoading) {
    return (
      <PageWrapper>
        <MainContent>
          <HeaderWrapper>
            <HeaderTop>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <HeaderTitle>Edit Shop</HeaderTitle>
              <div style={{ width: '40px' }} />
            </HeaderTop>
          </HeaderWrapper>
          <ContentWrapper>
            <CenteredContent>
              <LoadingSpinner />
            </CenteredContent>
          </ContentWrapper>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav active="shops" />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  if (error || !shop) {
    return (
      <PageWrapper>
        <MainContent>
          <HeaderWrapper>
            <HeaderTop>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <HeaderTitle>Edit Shop</HeaderTitle>
              <div style={{ width: '40px' }} />
            </HeaderTop>
          </HeaderWrapper>
          <ContentWrapper>
            <CenteredContent>
              <ErrorAlert
                message={error?.message || 'Shop not found'}
                onRetry={() => router.back()}
              />
            </CenteredContent>
          </ContentWrapper>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav active="shops" />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <MainContent>
        <HeaderWrapper>
          <HeaderTop>
            <BackButton onClick={() => router.back()}>
              <ChevronLeft />
            </BackButton>
            <HeaderTitle>Edit Shop</HeaderTitle>
            <div style={{ width: '40px' }} />
          </HeaderTop>
        </HeaderWrapper>
        <ContentWrapper>
          <ShopForm initialData={shop} shopId={shopId} isEditing={true} />
        </ContentWrapper>
      </MainContent>
      <BottomNavWrapper>
        <BottomNav active="shops" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
