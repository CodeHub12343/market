'use client'

import styled from 'styled-components'
import { ChevronRight, Clock, MessageCircle, Zap, TrendingUp } from 'lucide-react'
import { useRequests } from '@/hooks/useRequests'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'
import Link from 'next/link'

// ===== SECTION WRAPPER =====
const Section = styled.section`
  margin-bottom: 0;
`

// ===== SECTION HEADER =====
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

// ===== SECTION TITLE =====
const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

// ===== SEE ALL LINK =====
const SeeAllLink = styled(Link)`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }

  &:hover {
    gap: 6px;
    color: #666;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

// ===== REQUESTS GRID (CAROUSEL) =====
const RequestsContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
  }
`

// ===== REQUEST CARD =====
const RequestCard = styled(Link)`
  min-width: 280px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    min-width: 320px;
    padding: 18px;
    border-radius: 18px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  @media (min-width: 1024px) {
    min-width: 280px;
    padding: 16px;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: #e0e0e0;

    .request-icon {
      transform: scale(1.1) rotate(10deg);
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a1a1a 0%, #666 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`

// ===== BADGE SECTION =====
const BadgeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`

// ===== STATUS BADGE =====
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
  }

  @media (min-width: 1024px) {
    font-size: 10px;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`

// ===== PRIORITY BADGE =====
const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #e65100;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
  }

  @media (min-width: 1024px) {
    font-size: 10px;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`

// ===== REQUEST TITLE =====
const RequestTitle = styled.h3`
  font-size: 14px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  letter-spacing: -0.3px;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 10px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`

// ===== REQUEST DESCRIPTION =====
const RequestDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (min-width: 768px) {
    font-size: 13px;
    margin-bottom: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }
`

// ===== REQUEST FOOTER =====
const RequestFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`

// ===== OFFER COUNT =====
const OfferCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 12px;
  }

  svg {
    width: 14px;
    height: 14px;
    color: #666;
  }
`

// ===== TIME AGO =====
const TimeAgo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 11px;
  }

  svg {
    width: 13px;
    height: 13px;
  }
`

// ===== LOADING STATE =====
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`

// ===== SKELETON COMPONENTS =====
const keyframes = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`

const SkeletonCard = styled.div`
  min-width: 280px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  scroll-snap-align: start;
  border: 1.5px solid #f0f0f0;
  height: 280px;

  @media (min-width: 768px) {
    min-width: 320px;
    padding: 18px;
    border-radius: 18px;
    height: 300px;
  }

  @media (min-width: 1024px) {
    min-width: 280px;
    padding: 16px;
    height: 280px;
  }

  ${keyframes}
`

const SkeletonBadgeSection = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`

const SkeletonBadge = styled.div`
  width: 60px;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;

  @media (min-width: 768px) {
    height: 22px;
  }

  ${keyframes}
`

const SkeletonTitle = styled.div`
  width: 100%;
  height: 18px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    height: 20px;
  }

  ${keyframes}
`

const SkeletonDescription = styled.div`
  width: 100%;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 12px;
    width: 85%;
  }

  ${keyframes}
`

const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
`

const SkeletonText = styled.div`
  width: 50px;
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;

  @media (min-width: 768px) {
    height: 13px;
  }

  ${keyframes}
`

const SkeletonContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
  }
`

function SpecialOffersSkeleton() {
  return (
    <SkeletonContainer>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index}>
          <div>
            <SkeletonBadgeSection>
              <SkeletonBadge />
              <SkeletonBadge />
            </SkeletonBadgeSection>

            <SkeletonTitle />

            <SkeletonDescription />
            <SkeletonDescription />
          </div>

          <SkeletonFooter>
            <SkeletonText />
            <SkeletonText />
          </SkeletonFooter>
        </SkeletonCard>
      ))}
    </SkeletonContainer>
  )
}

// ===== UTILITY FUNCTION =====
const getTimeAgo = (date) => {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return then.toLocaleDateString()
}

export function SpecialOffers() {
  // Fetch requests from API
  const { data, isLoading, error } = useRequests(1, 6, {})

  // Extract requests from API response
  const requests = data?.requests || []

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>
            <Zap />
            Trending Requests
          </SectionTitle>
          <SeeAllLink href="/requests">
            See All
            <ChevronRight />
          </SeeAllLink>
        </SectionHeader>
        <SpecialOffersSkeleton />
      </Section>
    )
  }

  if (error) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>
            <Zap />
            Trending Requests
          </SectionTitle>
          <SeeAllLink href="/requests">
            See All
            <ChevronRight />
          </SeeAllLink>
        </SectionHeader>
        <ErrorAlert message="Failed to load requests" onClose={() => {}} />
      </Section>
    )
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <Zap />
          Trending Requests
        </SectionTitle>
        <SeeAllLink href="/requests">
          See All
          <ChevronRight />
        </SeeAllLink>
      </SectionHeader>
      <RequestsContainer>
        {requests.map((request) => (
          <RequestCard key={request._id} href={`/requests/${request._id}`}>
            <div>
              <BadgeSection>
                <StatusBadge>
                  <TrendingUp size={12} />
                  Open
                </StatusBadge>
                {request.category && (
                  <PriorityBadge>
                    <Zap size={12} />
                    Hot
                  </PriorityBadge>
                )}
              </BadgeSection>

              <RequestTitle>{request.title}</RequestTitle>

              {request.description && (
                <RequestDescription>{request.description}</RequestDescription>
              )}
            </div>

            <RequestFooter>
              <OfferCount className="request-icon">
                <MessageCircle />
                {request.analytics?.offersCount || 0}
              </OfferCount>
              <TimeAgo>
                <Clock />
                {getTimeAgo(request.createdAt)}
              </TimeAgo>
            </RequestFooter>
          </RequestCard>
        ))}
      </RequestsContainer>
    </Section>
  )
}