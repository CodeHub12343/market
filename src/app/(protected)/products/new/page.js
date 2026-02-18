'use client';

import { useState } from 'react';
import ProductForm from '@/components/products/ProductForm';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    width: 80px;
    background: #ffffff;
    border-right: 1px solid #f0f0f0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding: 32px 24px;
  }
`;

const HeaderWrapper = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  @media (min-width: 1024px) {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 32px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

const BackButton = styled.button`
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
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1024px) {
    display: none;
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

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #999;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const FormWrapper = styled.div`
  padding: 16px;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const StepsIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0;
    margin-bottom: 32px;
  }
`;

const StepDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$active ? '#1a1a1a' : '#e5e5e5')};
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const InfoCard = styled.div`
  background: #f8f8f8;
  border-left: 4px solid #1a1a1a;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 0 16px 20px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (min-width: 768px) {
    padding: 16px 20px;
    margin: 0 0 24px 0;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    margin: 0 0 32px 0;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;

    @media (min-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;

  @media (min-width: 768px) {
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

import { BottomNav } from '@/components/bottom-nav';

export default function NewProductPage() {
  useProtectedRoute();
  const router = useRouter();

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="products" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          {/* HEADER */}
          <HeaderWrapper>
            <HeaderContent>
              <BackButton onClick={() => router.back()}>
                <ChevronLeft />
              </BackButton>
              <div>
                <PageTitle>Create Product</PageTitle>
                <PageSubtitle>Add a new item to your shop</PageSubtitle>
              </div>
            </HeaderContent>
          </HeaderWrapper>

          {/* STEPS INDICATOR */}
          <StepsIndicator>
            <StepDot $active={true} />
            <StepDot $active={false} />
            <StepDot $active={false} />
          </StepsIndicator>

          {/* INFO CARDS */}
          <InfoCard>
            <InfoIcon>
              <AlertCircle />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>Fill all required fields</InfoTitle>
              <InfoText>Marked with asterisk (*) are mandatory</InfoText>
            </InfoContent>
          </InfoCard>

          {/* FORM */}
          <FormWrapper>
            <ProductForm />
          </FormWrapper>
        </ContentArea>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="products" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}