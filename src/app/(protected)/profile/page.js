/**
 * Profile View Page - Display complete user profile with unique complex mobile layouts
 * Matches dashboard design patterns and colors with mobile-first approach
 */

'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useAuth } from '@/hooks/useAuth';
import { FaMapPin, FaCalendarAlt, FaPhone, FaEdit, FaLink, FaBook, FaGraduationCap, FaFire, FaStar, FaUser, FaTrophy, FaArrowRight, FaCog } from 'react-icons/fa';
import { BottomNav } from '@/components/bottom-nav';

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

  @media (min-width: 1440px) {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
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
    grid-column: 1;
  }

  @media (min-width: 1440px) {
    padding: 32px 24px;
  }
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

/* =================== HERO SECTION =================== */
const HeroCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 28px;
    gap: 20px;
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
    pointer-events: none;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
    min-width: 100px;
    border-radius: 14px;
    border-width: 4px;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitials = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 40px;
  }
`;

const HeroInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeroTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 22px;
  }
`;

const HeroEmail = styled.p`
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const HeroQuickInfo = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const QuickInfoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(4px);

  svg {
    font-size: 12px;
  }

  @media (min-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    gap: 8px;

    svg {
      font-size: 14px;
    }
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  position: relative;
  z-index: 10;
  pointer-events: auto;

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 16px;
  }
`;

const EditButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: #1a1a1a;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  position: relative;
  z-index: 11;

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 12px 20px;
    border-radius: 10px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  }
`;

const SettingsButton = styled(EditButton)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

/* =================== STATS SECTION =================== */
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const StatBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 14px;
    gap: 10px;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-size: 16px;
  margin-bottom: 4px;

  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    font-size: 18px;
  }
`;

const StatBoxWithIcon = styled(StatBox)`
  position: relative;
`;

/* =================== INFO CARDS =================== */
const InfoSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    border-radius: 14px;
  }
`;

const InfoSectionHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    padding: 18px 20px;
    font-size: 15px;
    gap: 12px;
  }

  svg {
    font-size: 14px;
    color: #1a1a1a;

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #333;

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 14px 20px;
    font-size: 14px;
    gap: 14px;
  }

  svg {
    font-size: 16px;
    color: #666;
    min-width: 16px;

    @media (min-width: 768px) {
      font-size: 18px;
    }
  }

  .label {
    color: #666;
    font-weight: 500;
  }

  .value {
    color: #1a1a1a;
    font-weight: 600;
  }
`;

const EmptyInfo = styled.div`
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 12px;

  @media (min-width: 768px) {
    padding: 24px;
    font-size: 13px;
  }
`;

/* =================== BIO & LINKS SECTION =================== */
const BioCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 20px;
  }
`;

const BioTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 14px;
  }
`;

const BioContent = styled.p`
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin: 0;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 14px;
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 6px;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;

  svg {
    font-size: 13px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 8px;

    svg {
      font-size: 14px;
    }
  }

  @media (hover: hover) {
    &:hover {
      background: #1a1a1a;
      color: white;
    }
  }
`;

/* =================== COMPLETION SECTION =================== */
const CompletionCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  padding: 16px;

  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 20px;
  }
`;

const CompletionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    margin-bottom: 14px;
  }
`;

const CompletionLabel = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const CompletionValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 18px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 8px;
    border-radius: 4px;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #2d2d2d 0%, #1a1a1a 100%);
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 3px;

  @media (min-width: 768px) {
    border-radius: 4px;
  }
`;

const LoadingPlaceholder = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { stats } = useProfileStats();

  if (!currentUser) {
    return (
      <PageWrapper>
        <MainContent>
          <ContentArea>
            <LoadingPlaceholder>Loading profile...</LoadingPlaceholder>
          </ContentArea>
        </MainContent>
        <BottomNavWrapper>
          <BottomNav active="profile" />
        </BottomNavWrapper>
      </PageWrapper>
    );
  }

  const joinDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Get user initials for avatar fallback
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageWrapper>
      <Sidebar>
        <BottomNav active="profile" />
      </Sidebar>

      <MainContent>
        <ContentArea>
          {/* ===== HERO SECTION ===== */}
          <HeroCard>
            <HeroContent>
              <AvatarContainer>
                {currentUser.avatar?.url ? (
                  <Avatar
                    src={currentUser.avatar.url}
                    alt={currentUser.fullName}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                {!currentUser.avatar?.url && (
                  <AvatarInitials>{getInitials(currentUser.fullName)}</AvatarInitials>
                )}
              </AvatarContainer>

              <HeroInfo>
                <div>
                  <HeroTitle>{currentUser.fullName}</HeroTitle>
                  <HeroEmail>{currentUser.email}</HeroEmail>
                </div>

                <HeroQuickInfo>
                  {currentUser.campus?.name && (
                    <QuickInfoBadge>
                      <FaMapPin />
                      {currentUser.campus.name}
                    </QuickInfoBadge>
                  )}
                  <QuickInfoBadge>
                    <FaCalendarAlt />
                    {joinDate}
                  </QuickInfoBadge>
                </HeroQuickInfo>
              </HeroInfo>
            </HeroContent>

            <HeroActions>
              <EditButton onClick={() => router.push('/profile/edit')}>
                <FaEdit /> Edit
              </EditButton>
              <SettingsButton onClick={() => router.push('/profile/settings')}>
                <FaCog /> Settings
              </SettingsButton>
            </HeroActions>
          </HeroCard>

          {/* ===== CONTACT INFO SECTION ===== */}
          <InfoSection>
            <InfoSectionHeader>
              <FaPhone />
              Contact Information
            </InfoSectionHeader>
            <InfoList>
              {currentUser.phoneNumber ? (
                <InfoItem>
                  <FaPhone />
                  <div>
                    <span className="label">Phone</span>
                    <br />
                    <span className="value">{currentUser.phoneNumber}</span>
                  </div>
                </InfoItem>
              ) : (
                <InfoItem>
                  <span style={{ color: '#999' }}>No phone number added</span>
                </InfoItem>
              )}
            </InfoList>
          </InfoSection>

          {/* ===== ACADEMIC INFO SECTION ===== */}
          <InfoSection>
            <InfoSectionHeader>
              <FaGraduationCap />
              Academic Information
            </InfoSectionHeader>
            <InfoList>
              {currentUser.campus?.name && (
                <InfoItem>
                  <FaMapPin />
                  <div>
                    <span className="label">Campus</span>
                    <br />
                    <span className="value">{currentUser.campus.name}</span>
                  </div>
                </InfoItem>
              )}
              {currentUser.department && (
                <InfoItem>
                  <FaBook />
                  <div>
                    <span className="label">Department</span>
                    <br />
                    <span className="value">{currentUser.department}</span>
                  </div>
                </InfoItem>
              )}
              {currentUser.graduationYear && (
                <InfoItem>
                  <FaGraduationCap />
                  <div>
                    <span className="label">Graduation Year</span>
                    <br />
                    <span className="value">{currentUser.graduationYear}</span>
                  </div>
                </InfoItem>
              )}
              {!currentUser.campus?.name && !currentUser.department && !currentUser.graduationYear && (
                <EmptyInfo>No academic information added</EmptyInfo>
              )}
            </InfoList>
          </InfoSection>

          {/* ===== BIO SECTION ===== */}
          {currentUser.bio && (
            <BioCard>
              <BioTitle>About You</BioTitle>
              <BioContent>{currentUser.bio}</BioContent>
            </BioCard>
          )}

          {/* ===== SOCIAL LINKS SECTION ===== */}
          {currentUser.socialLinks && currentUser.socialLinks.length > 0 && (
            <BioCard>
              <BioTitle>Social Links</BioTitle>
              <SocialLinks>
                {currentUser.socialLinks.map((link, idx) => (
                  <SocialLink key={idx} href={link} target="_blank" rel="noopener noreferrer">
                    <FaLink /> Visit
                  </SocialLink>
                ))}
              </SocialLinks>
            </BioCard>
          )}

          {/* ===== PROFILE COMPLETION SECTION ===== */}
          <CompletionCard>
            <CompletionHeader>
              <CompletionLabel>Profile Completion</CompletionLabel>
              <CompletionValue>{stats.profileCompletion}%</CompletionValue>
            </CompletionHeader>
            <ProgressBar>
              <ProgressFill percentage={stats.profileCompletion} />
            </ProgressBar>
          </CompletionCard>
        </ContentArea>

        <RightPanel>
          {/* Quick Stats for Desktop */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #f0f0f0',
            padding: '20px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: '0 0 16px 0'
            }}>
              Quick Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Total Listings</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{stats.totalPosts}</span>
              </div>
              <div style={{
                padding: '12px 0',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Total Reviews</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{stats.totalReviews}</span>
              </div>
              <div style={{
                padding: '12px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Profile Score</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{stats.profileCompletion}%</span>
              </div>
            </div>
          </div>
        </RightPanel>
      </MainContent>

      <BottomNavWrapper>
        <BottomNav active="profile" />
      </BottomNavWrapper>
    </PageWrapper>
  );
}
