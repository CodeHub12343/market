'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Search, MessageCircle, Plus, X, Users } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import SearchUsers from '@/components/chat/SearchUsers';
import CreateGroupChatModal from '@/components/chat/CreateGroupChatModal';
import { BottomNav } from '@/components/bottom-nav';

// ===== PAGE LAYOUT =====
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
  display: flex;
  flex-direction: column;
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
  gap: 0;
  flex: 1;

  @media (min-width: 1024px) {
    gap: 24px;
    padding: 32px 24px;
  }

  @media (min-width: 1440px) {
    grid-column: 1;
  }
`;

// ===== HEADER SECTION =====
const HeaderSection = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    padding: 20px 24px;
  }

  @media (min-width: 1024px) {
    margin: -32px -24px 0 -24px;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 0;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.15);
  }

  @media (min-width: 768px) {
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ===== SEARCH AND FILTERS SECTION =====
const SearchFilterSection = styled.div`
  padding: 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    padding: 16px 24px;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    background: transparent;
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    width: 18px;
    height: 18px;
    color: #999;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
  }

  @media (min-width: 768px) {
    padding: 11px 12px 11px 40px;
    font-size: 15px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const QuickActionButton = styled.button`
  flex: 1;
  min-width: 120px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:active {
    transform: scale(0.98);
    background: #f9f9f9;
  }

  @media (min-width: 768px) {
    flex: initial;
    min-width: auto;
    font-size: 14px;
    padding: 11px 16px;

    &:hover {
      border-color: #1a1a1a;
      background: #f9f9f9;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ===== TABS SECTION =====
const TabsSection = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #f0f0f0;
  background: white;
  padding: 0 16px;
  overflow-x: auto;

  @media (min-width: 768px) {
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    margin-bottom: 16px;
  }

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 2px;
  }
`;

const Tab = styled.button`
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;

  &:active {
    color: #1a1a1a;
  }

  ${(props) =>
    props.$active &&
    `
    color: #1a1a1a;
    border-bottom-color: #1a1a1a;
  `}

  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 14px;

    &:hover {
      color: #1a1a1a;
    }
  }
`;

// ===== CHAT LIST SECTION =====
const ChatListSection = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;

  @media (min-width: 1024px) {
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
  }
`;

// ===== EMPTY STATE =====
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
  text-align: center;
  gap: 16px;

  @media (min-width: 768px) {
    min-height: 600px;
    padding: 60px 40px;
    gap: 20px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 56px;
  opacity: 0.6;

  @media (min-width: 768px) {
    font-size: 64px;
  }
`;

const EmptyTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  max-width: 300px;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

// ===== RIGHT PANEL (Desktop) =====
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

const PanelCard = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 12px 0;
  }

  p {
    margin: 8px 0;
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
`;

// ===== BOTTOM NAV WRAPPER =====
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

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearchUsers, setShowSearchUsers] = useState(false);

  return (
    <>
      <PageWrapper>
        <Sidebar>
          <BottomNav active="messages" />
        </Sidebar>

        <MainContent>
          <ContentArea>
            {/* HEADER */}
            <HeaderSection>
              <HeaderTitle>Messages</HeaderTitle>
              <HeaderActions>
                <ActionButton
                  onClick={() => setShowSearchUsers(true)}
                  title="Search users"
                >
                  <Search />
                </ActionButton>
                <ActionButton
                  onClick={() => setShowCreateGroup(true)}
                  title="Create group"
                >
                  <Plus />
                </ActionButton>
              </HeaderActions>
            </HeaderSection>

            {/* SEARCH AND FILTERS */}
            <SearchFilterSection>
              <SearchInputWrapper>
                <Search />
                <SearchInput
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInputWrapper>

              <QuickActions>
                <QuickActionButton onClick={() => setShowSearchUsers(true)}>
                  <Plus size={16} />
                  Add User
                </QuickActionButton>
                <QuickActionButton onClick={() => setShowCreateGroup(true)}>
                  <Users size={16} />
                  Group Chat
                </QuickActionButton>
              </QuickActions>
            </SearchFilterSection>

            {/* TABS */}
            <TabsSection>
              <Tab
                $active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              >
                All Messages
              </Tab>
            </TabsSection>

            {/* CHAT LIST */}
            <ChatListSection>
              <ChatList
                searchQuery={searchQuery}
                filterType={activeTab}
              />
            </ChatListSection>
          </ContentArea>

          {/* RIGHT PANEL */}
          <RightPanel>
            <PanelCard>
              <h3>💬 Quick Tips</h3>
              <p>Search for users to start a new conversation</p>
              <p>Create group chats to message multiple people at once</p>
            </PanelCard>

            <PanelCard>
              <h3>⏱️ Status</h3>
              <p>Active now</p>
              <p style={{ color: '#999', marginTop: '12px', fontSize: '12px' }}>
                Your availability status
              </p>
            </PanelCard>
          </RightPanel>
        </MainContent>
      </PageWrapper>

      {/* MODALS */}
      {showSearchUsers && (
        <SearchUsersModal onClose={() => setShowSearchUsers(false)} />
      )}

      <CreateGroupChatModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />

      {/* BOTTOM NAV */}
      <BottomNavWrapper>
        <BottomNav active="messages" />
      </BottomNavWrapper>
    </>
  );
}

// ===== SEARCH USERS MODAL =====
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;

  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

const ModalContainer = styled.div`
  background: white;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 768px) {
    width: 90%;
    max-width: 500px;
    border-radius: 16px;
    padding: 24px;
    max-height: 80vh;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background: #e5e5e5;
  }

  @media (min-width: 768px) {
    &:hover {
      background: #e5e5e5;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }
`;

function SearchUsersModal({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Find Users</h2>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </ModalHeader>

        <SearchInputWrapper style={{ marginBottom: '16px' }}>
          <Search />
          <SearchInput
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SearchInputWrapper>

        <SearchUsers />
      </ModalContainer>
    </ModalBackdrop>
  );
}
