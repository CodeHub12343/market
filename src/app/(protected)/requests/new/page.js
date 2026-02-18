'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { useCreateRequest } from '@/hooks/useRequests';
import RequestForm from '@/components/requests/RequestForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ChevronLeft, Zap } from 'lucide-react';

// ===== PAGE CONTAINER =====
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    background: #ffffff;
  }
`;

// ===== HEADER WITH BACK BUTTON =====
const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 14px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 640px) {
    padding: 16px 20px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    padding: 20px 28px;
    gap: 16px;
  }
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;
  text-decoration: none;
  flex-shrink: 0;

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.2);
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

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 11px;
  opacity: 0.8;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

// ===== MAIN CONTENT =====
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

// ===== FORM WRAPPER =====
const FormWrapper = styled.div`
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  margin-top: 16px;

  @media (min-width: 640px) {
    margin-top: 20px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    margin-top: 0;
    border-radius: 18px;
  }
`;

// ===== HERO BANNER =====
const HeroBanner = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  padding: 16px;
  color: white;
  text-align: center;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
  }
`;

const HeroIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;

  @media (min-width: 640px) {
    font-size: 40px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const HeroTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px 0;

  @media (min-width: 640px) {
    font-size: 20px;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
    margin-bottom: 12px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 12px;
  opacity: 0.9;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

// ===== LOADING OVERLAY =====
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export default function NewRequestPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createRequestMutation = useCreateRequest();

  const handleSubmit = async (requestData) => {
    try {
      setError(null);
      setSuccess(null);

      await createRequestMutation.mutateAsync(requestData);

      setSuccess('Request posted successfully! Redirecting...');
      setTimeout(() => {
        router.push('/requests');
      }, 1500);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to create request. Please try again.';
      setError(errorMessage);
      console.error('Error creating request:', err);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton href="/requests">
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderContent>
          <HeaderTitle>Post a Request</HeaderTitle>
          <HeaderSubtitle>Tell sellers what you need</HeaderSubtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <FormWrapper>
          <HeroBanner>
            <HeroIcon>📋</HeroIcon>
            <HeroTitle>Create Your Request</HeroTitle>
            <HeroSubtitle>
              Be specific to get better offers from sellers
            </HeroSubtitle>
          </HeroBanner>

          <RequestForm
            onSubmit={handleSubmit}
            isLoading={createRequestMutation.isPending}
            error={error}
            success={success}
            onCancel={() => router.back()}
          />
        </FormWrapper>
      </MainContent>

      {createRequestMutation.isPending && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </PageContainer>
  );
}
