// src/app/(protected)/services/new/page.js

'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import ServiceForm from '@/components/services/ServiceForm';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useCreateService } from '@/hooks/useServices';
import  {useToast}  from '@/context/ToastContext';
import { BottomNav } from '@/components/bottom-nav';
import { ChevronLeft } from 'lucide-react';

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
  padding-bottom: 120px;

  @media (min-width: 1024px) {
    margin-left: 80px;
    padding-bottom: 40px;
    background: #f9f9f9;
  }

  @media (min-width: 1440px) {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 1024px) {
    gap: 24px;
    padding: 32px 24px;
    grid-column: 1;
  }

  @media (min-width: 1440px) {
    padding: 32px 24px;
  }
`;

const HeaderSection = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 1024px) {
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    margin: -32px -24px 0 -24px;
  }
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (min-width: 1024px) {
    display: none;
  }

  &:hover {
    background: #f0f0f0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin: 4px 0 0 0;
`;

const RightPanel = styled.aside`
  display: none;

  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    grid-column: 2;
    background: #ffffff;
    border-left: 1px solid #f0f0f0;
    height: fit-content;
    position: sticky;
    top: 32px;
  }
`;

const SideCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
  }

  p {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
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

export default function CreateServicePage() {
  useProtectedRoute();
  const router = useRouter();
  const { addToast } = useToast();
  const createService = useCreateService();

  const handleSuccess = (newService) => {
    // Show success toast
    addToast({
      type: 'success',
      title: 'Service Created!',
      message: `"${newService.title}" has been successfully added to the marketplace.`,
      duration: 3000
    });

    // Redirect to services page after a brief delay
    setTimeout(() => {
      router.push('/services');
    }, 1000);
  };

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <ContentArea>
          <HeaderSection>
            <BackButton onClick={() => router.back()}>
              <ChevronLeft />
            </BackButton>
            <HeaderContent>
              <Title>Create New Service</Title>
              <Subtitle>List your service on the marketplace</Subtitle>
            </HeaderContent>
          </HeaderSection>

          <ServiceForm onSuccess={handleSuccess} />
        </ContentArea>

        <RightPanel>
          <SideCard>
            <h3>📋 Service Tips</h3>
            <p>Use a clear, descriptive title. Include your qualifications and experience level in the description.</p>
          </SideCard>

          <SideCard>
            <h3>💡 Pricing Guide</h3>
            <p>Set competitive prices based on your experience and market rates. You can adjust pricing later.</p>
          </SideCard>

          <SideCard>
            <h3>✨ Stand Out</h3>
            <p>Services with detailed descriptions and competitive pricing get more bookings. Be specific!</p>
          </SideCard>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="services" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}