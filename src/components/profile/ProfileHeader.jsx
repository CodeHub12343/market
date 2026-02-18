/**
 * ProfileHeader Component - Display user profile header with avatar and name
 */

'use client';

import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const AvatarContainer = styled.div`
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
`;

const UserBio = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const UserMeta = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;

  svg {
    width: 16px;
    height: 16px;
    color: #999;
  }
`;

export function ProfileHeader({ user, isOwnProfile }) {
  if (!user) return null;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <HeaderContainer>
      <AvatarContainer>
        <Avatar title={user.fullName}>
          {user.avatar?.url ? (
            <img src={user.avatar.url} alt={user.fullName} />
          ) : (
            getInitials(user.fullName)
          )}
        </Avatar>
      </AvatarContainer>

      <UserInfo>
        <UserName>{user.fullName}</UserName>
        <UserEmail>{user.email}</UserEmail>
        {user.bio && <UserBio>{user.bio}</UserBio>}
        
        <UserMeta>
          {user.campus && (
            <MetaItem>
              <span>🏫</span>
              <span>{user.campus?.name || 'Campus'}</span>
            </MetaItem>
          )}
          {user.role && (
            <MetaItem>
              <span>👤</span>
              <span>{user.role}</span>
            </MetaItem>
          )}
          {user.createdAt && (
            <MetaItem>
              <span>📅</span>
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </MetaItem>
          )}
        </UserMeta>
      </UserInfo>
    </HeaderContainer>
  );
}
