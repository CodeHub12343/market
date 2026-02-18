'use client';

import { use, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/bottom-nav';
import { FaMapPin, FaCalendarAlt, FaPhone, FaLink, FaBook, FaGraduationCap, FaStar, FaUser, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
  cursor: pointer;
  margin: 16px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  @media (min-width: 768px) {
    margin: 24px;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 16px;
  text-align: center;
  position: relative;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);

  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 60px;
  }
`;

const ProfileName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const ProfileRole = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ContentArea = styled.div`
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  color: #555;

  svg {
    width: 18px;
    height: 18px;
    color: #667eea;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    font-size: 15px;
    padding: 14px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #f0f0f0;

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (min-width: 768px) {
    .stat-value {
      font-size: 28px;
    }

    .stat-label {
      font-size: 13px;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 16px;
  color: #666;
`;

const ErrorContainer = styled.div`
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 8px;
  padding: 16px;
  color: #c62828;
  margin: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

export default function UserProfilePage({ params }) {
  const router = useRouter();
  const { userId } = use(params);
  const { user: currentUser } = useAuth();
  const { profile, isLoading, isError, error } = useProfile(userId);

  if (isLoading) {
    return (
      <PageWrapper>
        <MainContent>
          <LoadingContainer>Loading profile...</LoadingContainer>
        </MainContent>
      </PageWrapper>
    );
  }

  if (isError || !profile) {
    return (
      <PageWrapper>
        <MainContent>
          <BackButton onClick={() => router.back()}>
            <FaArrowLeft /> Back
          </BackButton>
          <ErrorContainer>
            <FaUser size={20} />
            <div>{error?.message || 'User profile not found'}</div>
          </ErrorContainer>
        </MainContent>
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper>
        <Sidebar />
        <MainContent>
          <BackButton onClick={() => router.back()}>
            <FaArrowLeft /> Back
          </BackButton>

          {/* HEADER SECTION */}
          <HeaderSection>
            <ProfileImage>
              {profile.firstName?.charAt(0).toUpperCase() || 'U'}
            </ProfileImage>
            <ProfileName>
              {profile.firstName} {profile.lastName}
              {profile.isVerified && <FaCheckCircle size={20} />}
            </ProfileName>
            <ProfileRole>
              {profile.accountType === 'seller' ? '🏪 Seller' : '👤 Buyer'}
            </ProfileRole>
          </HeaderSection>

          <ContentArea>
            {/* BASIC INFO */}
            <Section>
              <SectionTitle>
                <FaUser /> Basic Information
              </SectionTitle>
              <InfoGrid>
                {profile.email && (
                  <InfoItem>
                    <span>✉️</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>Email</div>
                      {profile.email}
                    </div>
                  </InfoItem>
                )}
                {profile.phone && (
                  <InfoItem>
                    <FaPhone />
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>Phone</div>
                      {profile.phone}
                    </div>
                  </InfoItem>
                )}
                {profile.location && (
                  <InfoItem>
                    <FaMapPin />
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>Location</div>
                      {profile.location}
                    </div>
                  </InfoItem>
                )}
                {profile.dateOfBirth && (
                  <InfoItem>
                    <FaCalendarAlt />
                    <div>
                      <div style={{ fontSize: '12px', color: '#999' }}>Joined</div>
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </div>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>

            {/* EDUCATION INFO */}
            {(profile.institution || profile.course) && (
              <Section>
                <SectionTitle>
                  <FaGraduationCap /> Education
                </SectionTitle>
                <InfoGrid>
                  {profile.institution && (
                    <InfoItem>
                      <FaBook />
                      <div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Institution</div>
                        {profile.institution}
                      </div>
                    </InfoItem>
                  )}
                  {profile.course && (
                    <InfoItem>
                      <FaGraduationCap />
                      <div>
                        <div style={{ fontSize: '12px', color: '#999' }}>Course</div>
                        {profile.course}
                      </div>
                    </InfoItem>
                  )}
                </InfoGrid>
              </Section>
            )}

            {/* STATS */}
            <Section>
              <SectionTitle>Statistics</SectionTitle>
              <StatsGrid>
                <StatCard>
                  <div className="stat-value">{profile.ratingsCount || 0}</div>
                  <div className="stat-label">Reviews</div>
                </StatCard>
                <StatCard>
                  <div className="stat-value">{profile.followersCount || 0}</div>
                  <div className="stat-label">Followers</div>
                </StatCard>
                <StatCard>
                  <div className="stat-value">{profile.followingCount || 0}</div>
                  <div className="stat-label">Following</div>
                </StatCard>
                <StatCard>
                  <div className="stat-value">{profile.averageRating?.toFixed(1) || '0'}</div>
                  <div className="stat-label">Rating</div>
                </StatCard>
              </StatsGrid>
            </Section>

            {/* BIO */}
            {profile.bio && (
              <Section>
                <SectionTitle>About</SectionTitle>
                <div style={{ color: '#555', lineHeight: '1.6', fontSize: '14px' }}>
                  {profile.bio}
                </div>
              </Section>
            )}
          </ContentArea>
        </MainContent>
      </PageWrapper>
      <BottomNav />
    </>
  );
}
