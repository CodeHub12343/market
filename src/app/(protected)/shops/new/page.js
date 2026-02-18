'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import ShopForm from '@/components/shops/ShopForm';
import { ChevronLeft, Zap } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { useToast } from '@/context/ToastContext';

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
  color: #1a1a1a;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(26, 26, 26, 0.08);
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ============ CONTENT SECTION ============ */
const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 20px;

  @media (min-width: 768px) {
    padding: 24px 20px;
    gap: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px 24px;
    gap: 28px;
  }
`;

/* ============ INFO CARD ============ */
const InfoCard = styled.div`
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (min-width: 768px) {
    padding: 18px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.08);
  border-radius: 8px;
  color: #1a1a1a;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

/* ============ FORM CONTAINER ============ */
const FormContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 24px 20px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    padding: 28px;
    border: 1px solid #f0f0f0;
  }
`;

/* ============ BOTTOM NAV ============ */
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

export default function CreateShopPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleSuccess = () => {
    // Show success toast
    addToast({
      type: 'success',
      title: 'Shop Created!',
      message: 'Your shop has been successfully created. Let\'s add some products!',
      duration: 3000
    });

    // Redirect to products/new page after a brief delay
    setTimeout(() => {
      router.push('/products/new');
    }, 1000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <PageWrapper>
      <MainContent>
        {/* HEADER */}
        <HeaderWrapper>
          <HeaderTop>
            <BackButton onClick={handleCancel}>
              <ChevronLeft />
            </BackButton>
            <HeaderContent>
              <HeaderTitle>Create Your Shop</HeaderTitle>
              <HeaderSubtitle>Start selling on the marketplace</HeaderSubtitle>
            </HeaderContent>
          </HeaderTop>
        </HeaderWrapper>

        {/* CONTENT */}
        <ContentWrapper>
          {/* INFO CARD */}
          <InfoCard>
            <InfoIcon>
              <Zap />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>Get Started Today</InfoTitle>
              <InfoText>
                Fill in your shop details below to begin selling on our campus marketplace.
              </InfoText>
            </InfoContent>
          </InfoCard>

          {/* FORM */}
          <FormContainer>
            <ShopForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </FormContainer>
        </ContentWrapper>
      </MainContent>

      {/* BOTTOM NAV */}
      <BottomNavWrapper>
        <BottomNav active="shops" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}