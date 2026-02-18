'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useMySentOffers, useDeleteRequestOffer } from '@/hooks/useRequestOffers';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/errorHandler';
import RequestOfferCard from '@/components/offers/RequestOfferCard.jsx';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { TrendingUp, Send, CheckCircle2, XCircle, Clock } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 60px 20px;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const HeaderIcon = styled.div`
  font-size: 36px;
  line-height: 1;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  margin: 12px 0 0 0;
  opacity: 0.85;
  font-weight: 400;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-top: 2px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 0;
`;

const Tab = styled.button`
  padding: 12px 20px;
  border: none;
  background: ${props => props.$active ? '#000000' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${props => props.$active ? '#000000' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$active ? 'white' : '#333'};
  }

  ${props => props.$active && `
    box-shadow: inset 0 -3px 0 0 #000;
  `}
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
`;

const EmptyTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #888;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 40px;
`;

export default function MyOffersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOfferToDelete, setSelectedOfferToDelete] = useState(null);

  const { data: offers = [], isLoading } = useMySentOffers();
  const deleteOfferMutation = useDeleteRequestOffer();

  if (authLoading) {
    return (
      <PageContainer>
        <LoadingContainer style={{ paddingTop: '100px' }}>
          <LoadingSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Filter offers by status - ensure offers is an array
  const allOffers = Array.isArray(offers) ? offers : (offers?.offers || []);
  const pendingOffers = allOffers.filter(o => o.status === 'pending');
  const acceptedOffers = allOffers.filter(o => o.status === 'accepted');
  const rejectedOffers = allOffers.filter(o => o.status === 'rejected');

  const displayOffers = 
    activeTab === 'all' ? allOffers :
    activeTab === 'pending' ? pendingOffers :
    activeTab === 'accepted' ? acceptedOffers :
    rejectedOffers;

  const handleDelete = async (offerId) => {
    setSelectedOfferToDelete(offerId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOfferToDelete) return;

    try {
      await deleteOfferMutation.mutateAsync(selectedOfferToDelete);
      toast.success('Offer withdrawn successfully.');
      setShowDeleteConfirm(false);
      setSelectedOfferToDelete(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderTop>
            <HeaderIcon>📨</HeaderIcon>
            <div>
              <Title>My Offers</Title>
              <Subtitle>Track and manage all your offers</Subtitle>
            </div>
          </HeaderTop>
          
          <StatsContainer>
            <StatCard>
              <StatIcon>
                <Send size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>{allOffers.length}</StatValue>
                <StatLabel>Total Offers</StatLabel>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIcon>
                <Clock size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>{pendingOffers.length}</StatValue>
                <StatLabel>Pending</StatLabel>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIcon>
                <CheckCircle2 size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>{acceptedOffers.length}</StatValue>
                <StatLabel>Accepted</StatLabel>
              </StatContent>
            </StatCard>

            <StatCard>
              <StatIcon>
                <XCircle size={20} />
              </StatIcon>
              <StatContent>
                <StatValue>{rejectedOffers.length}</StatValue>
                <StatLabel>Rejected</StatLabel>
              </StatContent>
            </StatCard>
          </StatsContainer>
        </HeaderContent>
      </Header>

      <ContentContainer>
        {/* Tabs */}
        <TabsContainer>
          <Tab 
            $active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            All ({allOffers.length})
          </Tab>
          <Tab 
            $active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingOffers.length})
          </Tab>
          <Tab 
            $active={activeTab === 'accepted'} 
            onClick={() => setActiveTab('accepted')}
          >
            Accepted ({acceptedOffers.length})
          </Tab>
          <Tab 
            $active={activeTab === 'rejected'} 
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({rejectedOffers.length})
          </Tab>
        </TabsContainer>

        {/* Offers Grid */}
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : displayOffers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              {activeTab === 'pending' ? '⏳' : activeTab === 'accepted' ? '✅' : activeTab === 'rejected' ? '❌' : '📭'}
            </EmptyIcon>
            <EmptyTitle>
              {activeTab === 'pending' && 'No Pending Offers'}
              {activeTab === 'accepted' && 'No Accepted Offers'}
              {activeTab === 'rejected' && 'No Rejected Offers'}
              {activeTab === 'all' && 'No Offers Yet'}
            </EmptyTitle>
            <EmptyText>
              {activeTab === 'all' && 'Start making offers on requests to see them here'}
            </EmptyText>
          </EmptyState>
        ) : (
          <GridContainer>
            {displayOffers.map(offer => (
              <RequestOfferCard
                key={offer._id}
                offer={offer}
                isRequesterView={false}
                onDelete={() => handleDelete(offer._id)}
                isLoading={deleteOfferMutation.isPending}
              />
            ))}
          </GridContainer>
        )}
      </ContentContainer>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Withdraw Offer?"
        description="Are you sure you want to withdraw this offer? This action cannot be undone."
        confirmText="Withdraw"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deleteOfferMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedOfferToDelete(null);
        }}
      />
    </PageContainer>
  );
}
