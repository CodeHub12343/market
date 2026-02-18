'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOffersReceivedByMe, useAcceptRequestOffer, useRejectRequestOffer } from '@/hooks/useRequestOffers';
import { useToast } from '@/hooks/useToast';
import CampusFilter from '@/components/common/CampusFilter';
import { useCampusFilter } from '@/hooks/useCampusFilter';
import { useAllCampuses } from '@/hooks/useCampuses';
import RequestOfferCard from '@/components/offers/RequestOfferCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9f9f9;
  padding-bottom: 100px;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
  }
`;

const PageHeader = styled.div`
  background: white;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 24px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    padding: 32px 24px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  @media (min-width: 768px) {
    align-items: center;
    gap: 16px;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const TitleBadge = styled.span`
  background: #1a1a1a;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }

  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  flex: 1;

  @media (min-width: 768px) {
    padding: 20px 24px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 280px 1fr;
    padding: 24px;
    gap: 24px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: 300px 1fr;
    gap: 28px;
  }
`;

const Sidebar = styled.div`
  display: none;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
  height: fit-content;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  grid-column: 1 / -1;

  @media (min-width: 768px) {
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-column: 2;
    gap: 24px;
  }
`;

const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
`;

const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
  max-width: 400px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`;

const ErrorContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #fee;
  background: #fef2f2;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ErrorIcon = styled.div`
  color: #dc2626;
  font-size: 20px;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  color: #991b1b;
  font-size: 14px;
`;


export default function ReceivedOffersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Enhanced filters with campus params
  const enhancedFilters = {
    ...campusFilter.getFilterParams(),
  };

  const { data, isLoading, error } = useOffersReceivedByMe(page, limit, enhancedFilters);
  const acceptOfferMutation = useAcceptRequestOffer();
  const rejectOfferMutation = useRejectRequestOffer();
  
  const offers = data?.offers || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleViewOffer = (offerId) => {
    router.push(`/offers/${offerId}`);
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOfferMutation.mutateAsync(offerId);
      toast.success('Offer accepted! The seller has been notified.');
    } catch (err) {
      toast.error(err?.message || 'Failed to accept offer');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await rejectOfferMutation.mutateAsync(offerId);
      toast.success('Offer rejected');
    } catch (err) {
      toast.error(err?.message || 'Failed to reject offer');
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <HeaderContent>
          <BackButton onClick={() => router.back()}>
            ← Back
          </BackButton>
          <div>
            <PageTitle>
              💰 Received Offers
              <TitleBadge>{totalCount}</TitleBadge>
            </PageTitle>
          </div>
        </HeaderContent>
      </PageHeader>

      <MainLayout>
        {/* Sidebar */}
        <Sidebar>
          <CampusFilter
            showAllCampuses={campusFilter.showAllCampuses}
            selectedCampus={campusFilter.selectedCampus}
            campusName={campusFilter.campusName}
            userCampus={campusFilter.userCampus}
            allCampuses={Array.isArray(allCampuses) ? allCampuses : []}
            onToggleAllCampuses={campusFilter.toggleAllCampuses}
            onCampusChange={campusFilter.handleCampusChange}
            disabled={isLoading}
          />
        </Sidebar>

        {/* Main Content */}
        <Content>
          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorIcon>
                <AlertCircle size={20} />
              </ErrorIcon>
              <ErrorMessage>
                Failed to load offers. Please try again later.
              </ErrorMessage>
            </ErrorContainer>
          ) : offers.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyTitle>No offers received</EmptyTitle>
              <EmptyText>
                You haven&apos;t received any offers yet. Create a request to start receiving offers from other users.
              </EmptyText>
            </EmptyState>
          ) : (
            <>
              <OffersGrid>
                {offers.map((offer) => (
                  <RequestOfferCard
                    key={offer._id}
                    offer={offer}
                    isRequesterView={true}
                    onAccept={() => handleAcceptOffer(offer._id)}
                    onReject={() => handleRejectOffer(offer._id)}
                    onView={() => handleViewOffer(offer._id)}
                    isLoading={acceptOfferMutation.isPending || rejectOfferMutation.isPending}
                  />
                ))}
              </OffersGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  flexWrap: 'wrap'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      style={{
                        padding: '8px 12px',
                        border: pageNum === page ? 'none' : '1px solid #e0e0e0',
                        background: pageNum === page ? '#1a1a1a' : 'white',
                        color: pageNum === page ? 'white' : '#333',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: pageNum === page ? '600' : '400',
                        fontSize: '14px',
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </Content>
      </MainLayout>
    </PageWrapper>
  );
}
