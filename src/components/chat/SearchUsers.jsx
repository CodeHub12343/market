'use client';

import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { useSearchUsers } from '@/hooks/useChats';
import { useGetOrCreateChat } from '@/hooks/useChats';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Container = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const UserResult = styled.div`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingContainer = styled.div`
  padding: 16px;
  text-align: center;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding: 0 4px;
`;

export default function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const { data: searchResults = [], isLoading: isSearching } = useSearchUsers(
    searchQuery,
    !!searchQuery && searchQuery.length > 1
  );
  
  const { mutateAsync: getOrCreateChat, isPending: isCreating } = useGetOrCreateChat();

  const handleUserSelect = useCallback(async (userId) => {
    try {
      console.log('🔍 Selected user:', userId);
      const chat = await getOrCreateChat(userId);
      
      console.log('📦 Returned chat object:', JSON.stringify(chat, null, 2));
      
      // Validate chat object and ID
      if (!chat) {
        console.error('❌ Chat is null/undefined');
        throw new Error('Chat object is null or undefined');
      }
      
      const chatId = chat._id || chat.id;
      
      if (!chatId) {
        console.error('❌ Chat has no ID:', chat);
        throw new Error('Failed to create chat - no ID');
      }
      
      console.log('✅ Navigating to chat:', chatId);
      setSearchQuery('');
      router.push(`/messages/${chatId}`);
    } catch (error) {
      console.error('❌ Error creating chat:', error.message || error);
      // Could show toast notification here
    }
  }, [getOrCreateChat, router]);

  const getInitials = (user) => {
    if (!user) return '?';
    const name = user.fullName || user.name || '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const showResults = searchQuery.length > 1 && (isSearching || searchResults.length > 0);

  return (
    <Container>
      <SearchInputWrapper>
        <SearchInput
          type="text"
          placeholder="Search for people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
        
        {showResults && (
          <ResultsContainer>
            {isSearching ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : searchResults.length > 0 ? (
              <>
                <Title>People</Title>
                {searchResults.map(user => (
                  <UserResult
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                    style={{ pointerEvents: isCreating ? 'none' : 'auto', opacity: isCreating ? 0.6 : 1 }}
                  >
                    <UserAvatar>{getInitials(user)}</UserAvatar>
                    <UserInfo>
                      <UserName>{user.fullName || user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserResult>
                ))}
              </>
            ) : (
              <NoResults>No users found matching "{searchQuery}"</NoResults>
            )}
          </ResultsContainer>
        )}
      </SearchInputWrapper>
    </Container>
  );
}
