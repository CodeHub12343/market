'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, MessageCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMyApplications, useUpdateApplicationStatus } from '@/hooks/useRoommateApplications'
import { RoommateApplicationCard } from '@/components/roommates/RoommateApplicationCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 80px;

  @media (min-width: 1024px) {
    padding-bottom: 40px;
  }
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const FilterTab = styled.button`
  padding: 12px 18px;
  background: white;
  border: 2px solid ${props => (props.$active ? '#000000' : '#e5e5e5')};
  border-radius: 12px;
  color: ${props => (props.$active ? 'white' : '#1a1a1a')};
  background: ${props => (props.$active ? '#000000' : 'white')};
  font-weight: ${props => (props.$active ? '700' : '600')};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: #000000;
    ${props => !props.$active && 'background: #f5f5f5;'}
    transform: translateY(-2px);
  }
`

const TabCount = styled.span`
  padding: 3px 8px;
  background: ${props => props.$active ? 'rgba(255,255,255,0.3)' : '#f0f0f0'};
  border-radius: 6px;
  font-size: 12px;
  color: ${props => (props.$active ? 'white' : '#666')};
  font-weight: 700;
`

const ApplicationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Section = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.3px;

  svg {
    width: 20px;
    height: 20px;
    color: #000000;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: #999;
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`

const EmptyIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
`

const EmptyButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 13px 24px;
  background: #000000;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #000000;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`

const StatLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export default function RoommateApplicationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const { data, isLoading, error, refetch } = useMyApplications()
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus()

  const applications = (data?.applications || [])

  // Enforce role-based visibility: only show applications relevant to user's role
  const visibleApplications = applications.filter(app => {
    const userId = user?._id?.toString()
    const applicantId = app.applicant?._id?.toString()
    const landlordId = app.landlord?._id?.toString()
    
    // Show if user is the applicant (sent apps) OR user is the landlord (received apps)
    return userId === applicantId || userId === landlordId
  })

  // Determine type for each application
  const appsWithType = visibleApplications.map(app => ({
    ...app,
    type: app.applicant?._id === user?._id ? 'sent' : 'received'
  }))

  console.log('Apps with type:', appsWithType)

  const handleApprove = (applicationId) => {
    console.log('✅ Approve clicked for:', applicationId)
    updateStatus(
      { applicationId, status: 'approved' },
      { 
        onSuccess: () => {
          console.log('✅ Approve SUCCESS - refetching data')
          refetch()
        },
        onError: (error) => {
          console.error('❌ Approve ERROR:', error)
        }
      }
    )
  }

  const handleReject = (applicationId) => {
    console.log('❌ Reject clicked for:', applicationId)
    updateStatus(
      { applicationId, status: 'rejected' },
      { 
        onSuccess: () => {
          console.log('❌ Reject SUCCESS - refetching data')
          refetch()
        },
        onError: (error) => {
          console.error('❌ Reject ERROR:', error)
        }
      }
    )
  }

  const sentApps = appsWithType.filter(app => app.type === 'sent')
  const receivedApps = appsWithType.filter(app => app.type === 'received')

  const pendingApps = appsWithType.filter(app => app.status === 'pending')
  const approvedApps = appsWithType.filter(app => app.status === 'approved')
  const rejectedApps = appsWithType.filter(app => app.status === 'rejected')

  let displayedApps = appsWithType

  if (activeTab === 'sent') {
    displayedApps = sentApps
  } else if (activeTab === 'received') {
    displayedApps = receivedApps
  } else if (activeTab === 'pending') {
    displayedApps = pendingApps
  } else if (activeTab === 'approved') {
    displayedApps = approvedApps
  } else if (activeTab === 'rejected') {
    displayedApps = rejectedApps
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <PageContainer>
          <Title>Roommate Applications</Title>
          <LoadingSpinner />
        </PageContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageContainer>
        <Title>Roommate Applications</Title>

        {error && (
          <ErrorAlert
            message={error?.message || 'Failed to load applications'}
            onRetry={() => refetch()}
          />
        )}

      {appsWithType.length > 0 && (
        <StatsGrid>
          <StatCard>
            <StatValue>{appsWithType.length}</StatValue>
            <StatLabel>Total Applications</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{pendingApps.length}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{approvedApps.length}</StatValue>
            <StatLabel>Approved</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{rejectedApps.length}</StatValue>
            <StatLabel>Rejected</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {appsWithType.length > 0 && (
        <FilterTabs>
          <FilterTab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All <TabCount $active={activeTab === 'all'}>{appsWithType.length}</TabCount>
          </FilterTab>
          <FilterTab $active={activeTab === 'sent'} onClick={() => setActiveTab('sent')}>
            Sent <TabCount $active={activeTab === 'sent'}>{sentApps.length}</TabCount>
          </FilterTab>
          <FilterTab
            $active={activeTab === 'received'}
            onClick={() => setActiveTab('received')}
          >
            Received <TabCount $active={activeTab === 'received'}>{receivedApps.length}</TabCount>
          </FilterTab>
          <FilterTab
            $active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          >
            <Clock /> Pending <TabCount $active={activeTab === 'pending'}>{pendingApps.length}</TabCount>
          </FilterTab>
          <FilterTab
            $active={activeTab === 'approved'}
            onClick={() => setActiveTab('approved')}
          >
            <CheckCircle /> Approved <TabCount $active={activeTab === 'approved'}>{approvedApps.length}</TabCount>
          </FilterTab>
          <FilterTab
            $active={activeTab === 'rejected'}
            onClick={() => setActiveTab('rejected')}
          >
            <XCircle /> Rejected <TabCount $active={activeTab === 'rejected'}>{rejectedApps.length}</TabCount>
          </FilterTab>
        </FilterTabs>
      )}

      {displayedApps.length > 0 ? (
        <ApplicationsList>
          {displayedApps.map(application => (
            <RoommateApplicationCard
              key={application._id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
              canManage={application.type === 'received'}
              isLoading={isPending}
            />
          ))}
        </ApplicationsList>
      ) : (
        <EmptyState>
          <EmptyIcon>📨</EmptyIcon>
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
            {appsWithType.length === 0
              ? 'No applications yet'
              : `No ${activeTab} applications`}
          </h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            {appsWithType.length === 0
              ? 'Applications you send or receive will appear here'
              : `You don't have any ${activeTab} applications in this category`}
          </p>
          {appsWithType.length === 0 && (
            <EmptyButton href="/roommates">
              Browse Roommate Listings
            </EmptyButton>
          )}
        </EmptyState>
      )}
      </PageContainer>
    </PageWrapper>
  )
}
