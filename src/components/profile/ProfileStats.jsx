/**
 * ProfileStats Component - Display user statistics
 */

'use client';

import styled from 'styled-components';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useFollowers, useFollowing } from '@/hooks/useFollowing';
import { useAuth } from '@/hooks/useAuth';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const ProgressSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.percentage}%;
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

export const ProfileStats = ({ userId = null, onStatClick }) => {
  const { user: currentUser } = useAuth();
  const { stats, isLoading } = useProfileStats();
  const { count: followersCount } = useFollowers(userId || currentUser?._id);
  const { count: followingCount } = useFollowing(userId || currentUser?._id);

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <StatsContainer>
        <StatCard onClick={() => onStatClick?.('posts')}>
          <StatValue>{stats.totalPosts}</StatValue>
          <StatLabel>Posts</StatLabel>
        </StatCard>

        <StatCard onClick={() => onStatClick?.('followers')}>
          <StatValue>{followersCount || stats.totalFollowers}</StatValue>
          <StatLabel>Followers</StatLabel>
        </StatCard>

        <StatCard onClick={() => onStatClick?.('following')}>
          <StatValue>{followingCount || stats.totalFollowing}</StatValue>
          <StatLabel>Following</StatLabel>
        </StatCard>

        <StatCard onClick={() => onStatClick?.('reviews')}>
          <StatValue>{stats.totalReviews}</StatValue>
          <StatLabel>Reviews</StatLabel>
        </StatCard>
      </StatsContainer>

      <ProgressSection>
        <ProgressLabel>Profile Completion</ProgressLabel>
        <ProgressBar>
          <ProgressFill percentage={stats.profileCompletion} />
        </ProgressBar>
        <ProgressText>{stats.profileCompletion}% complete</ProgressText>
      </ProgressSection>
    </div>
  );
};
