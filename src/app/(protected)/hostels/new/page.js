'use client';

import HostelForm from '@/components/hostels/HostelForm';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import styled from 'styled-components';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ===== PAGE WRAPPER =====
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

// ===== HEADER SECTION =====
const Header = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const BackBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:active {
    transform: scale(0.9);
  }

  @media (min-width: 768px) {
    &:hover {
      background: #e5e7eb;
    }
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
`;

// ===== FORM CONTAINER =====
const FormWrapper = styled.div`
  padding: 20px 16px;

  @media (min-width: 768px) {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    padding: 0;
    max-width: 700px;
    margin: 0;
  }
`;

export default function NewHostelPage() {
  useProtectedRoute();

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <BackBtn href="/hostels">
            <ChevronLeft />
          </BackBtn>
          <HeaderTitle>Add New Hostel</HeaderTitle>
        </Header>

        <ContentArea>
          <FormWrapper>
            <HostelForm />
          </FormWrapper>
        </ContentArea>
      </MainContent>
    </PageWrapper>
  );
}