/**
 * Edit Profile Page - Mobile-first redesign with unique complex layouts
 * Matches dashboard design patterns and signup form styling
 */

'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { BottomNav } from '@/components/bottom-nav';
import { FaArrowLeft } from 'react-icons/fa';

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
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    gap: 20px;
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
    gap: 24px;
    max-width: 700px;
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

/* =================== HEADER SECTION =================== */
const HeaderCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 14px;
  padding: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 16px;
    gap: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const BackButton = styled.button`
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 12px;
    font-size: 20px;
  }

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
`;

const HeaderContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

export default function EditProfilePage() {
  const router = useRouter();

  const handleSave = () => {
    router.push('/profile');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="profile" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          {/* Header Card */}
          <HeaderCard>
            <BackButton onClick={handleCancel} title="Go back">
              <FaArrowLeft />
            </BackButton>
            <HeaderContent>
              <HeaderTitle>Edit Profile</HeaderTitle>
              <HeaderSubtitle>Update your information</HeaderSubtitle>
            </HeaderContent>
          </HeaderCard>

          {/* Profile Form */}
          <ProfileForm 
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </ContentArea>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="profile" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
