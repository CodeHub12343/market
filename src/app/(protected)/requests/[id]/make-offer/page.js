'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { useRequest } from '@/hooks/useRequests';
import { useCreateRequestOffer } from '@/hooks/useRequestOffers';
import OfferForm from '@/components/offers/RequestOfferForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import { ChevronLeft, Zap, MapPin, Calendar, DollarSign } from 'lucide-react';

// ===== PAGE CONTAINER =====
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    background: #ffffff;
  }
`;

// ===== HEADER WITH BACK BUTTON =====
const Header = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 14px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: 640px) {
    padding: 16px 20px;
  }

  @media (min-width: 1024px) {
    padding: 20px 28px;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;
  text-decoration: none;
  margin-bottom: 8px;

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

// ===== MAIN CONTENT =====
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 28px;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
  }
`;

// ===== REQUEST SUMMARY CARD =====
const RequestSummaryCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 16px;
  border-left: 4px solid #1a1a1a;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 640px) {
    padding: 16px;
    margin-bottom: 20px;
    border-left-width: 5px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 100px;
    margin-bottom: 0;
    grid-column: 2;
    grid-row: 1;
    height: fit-content;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 15px;
    margin-bottom: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const SummaryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    gap: 10px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: #666;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #999;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const BudgetDisplay = styled.div`
  background: #f8f8f8;
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 10px;
  border: 1px solid #f0f0f0;

  @media (min-width: 640px) {
    padding: 12px 14px;
    margin-top: 12px;
  }

  @media (min-width: 1024px) {
    padding: 14px 16px;
  }
`;

const BudgetLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin-bottom: 4px;

  @media (min-width: 640px) {
    font-size: 11px;
  }
`;

const BudgetValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

// ===== FORM WRAPPER =====
const FormWrapper = styled.div`
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;

  @media (min-width: 640px) {
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    border-radius: 18px;
    grid-column: 1;
    grid-row: 1;
  }
`;

// ===== HERO BANNER =====
const HeroBanner = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  padding: 16px;
  color: white;
  text-align: center;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

const HeroIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;

  @media (min-width: 640px) {
    font-size: 40px;
    margin-bottom: 10px;
  }

  @media (min-width: 1024px) {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

const HeroTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;

  @media (min-width: 640px) {
    font-size: 18px;
    margin-bottom: 6px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 11px;
  opacity: 0.85;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 13px;
  }
`;

// ===== LOADING OVERLAY =====
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export default function MakeOfferPage({ params: paramPromise }) {
  const params = use(paramPromise);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { data: request, isLoading: requestLoading, error: requestError } = useRequest(params.id);
  const createOfferMutation = useCreateRequestOffer();

  const handleSubmit = async (offerData) => {
    try {
      setError(null);
      setSuccess(null);

      await createOfferMutation.mutateAsync(offerData);

      setSuccess('Offer sent successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/requests/${params.id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to send offer. Please try again.';
      setError(errorMessage);
      console.error('Error creating offer:', err);
    }
  };

  if (requestLoading) {
    return (
      <PageContainer>
        <Header>
          <BackButton href={`/requests/${params.id}`}>
            <ChevronLeft size={20} />
          </BackButton>
          <HeaderTitle>Make an Offer</HeaderTitle>
        </Header>
        <MainContent style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner />
        </MainContent>
      </PageContainer>
    );
  }

  if (requestError || !request) {
    return (
      <PageContainer>
        <Header>
          <BackButton href={`/requests/${params.id}`}>
            <ChevronLeft size={20} />
          </BackButton>
          <HeaderTitle>Error</HeaderTitle>
        </Header>
        <MainContent>
          <ErrorAlert message="Failed to load request" />
        </MainContent>
      </PageContainer>
    );
  }

  const formattedPrice = request.formattedPrice || `₦${parseInt(request.desiredPrice).toLocaleString()}`;

  return (
    <PageContainer>
      <Header>
        <BackButton href={`/requests/${params.id}`}>
          <ChevronLeft size={20} />
        </BackButton>
        <HeaderTitle>Make an Offer</HeaderTitle>
      </Header>

      <MainContent>
        <FormWrapper>
          <HeroBanner>
            <HeroIcon>✨</HeroIcon>
            <HeroTitle>Send Your Best Offer</HeroTitle>
            <HeroSubtitle>Make your pitch stand out to the requester</HeroSubtitle>
          </HeroBanner>

          <OfferForm
            requestId={params.id}
            request={request}
            onSubmit={handleSubmit}
            isLoading={createOfferMutation.isPending}
            error={error}
            success={success}
            onCancel={() => router.back()}
          />
        </FormWrapper>

        <RequestSummaryCard>
          <SummaryTitle>{request.title}</SummaryTitle>
          <SummaryDetails>
            <SummaryItem>
              <MapPin size={16} />
              <span>{request.location?.address || 'Location not specified'}</span>
            </SummaryItem>
            <SummaryItem>
              <Calendar size={16} />
              <span>Needed by {new Date(request.requiredDate).toLocaleDateString()}</span>
            </SummaryItem>
            <SummaryItem>
              <Zap size={16} />
              <span>{request.status === 'open' ? 'Open' : request.status} • {request.analytics?.offersCount || 0} offers</span>
            </SummaryItem>
          </SummaryDetails>
          <BudgetDisplay>
            <BudgetLabel>Budget</BudgetLabel>
            <BudgetValue>{formattedPrice}</BudgetValue>
          </BudgetDisplay>
        </RequestSummaryCard>
      </MainContent>

      {createOfferMutation.isPending && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </PageContainer>
  );
}
