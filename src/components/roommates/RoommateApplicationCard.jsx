'use client'

import styled from 'styled-components'
import { CheckCircle, Clock, XCircle, User, Calendar, DollarSign } from 'lucide-react'

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 768px) {
    padding: 18px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Name = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
`

const Email = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
`

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'approved': return '#e8f5e9';
      case 'pending': return '#fff3e0';
      case 'rejected': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'approved': return '#2e7d32';
      case 'pending': return '#e65100';
      case 'rejected': return '#c62828';
      default: return '#666';
    }
  }};

  svg {
    width: 14px;
    height: 14px;
  }
`

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
`

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #666;
    flex-shrink: 0;
    margin-top: 1px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .label {
      font-size: 11px;
      color: #999;
      font-weight: 600;
      text-transform: uppercase;
    }

    .value {
      font-size: 13px;
      color: #1a1a1a;
      font-weight: 600;
    }
  }
`

const Message = styled.div`
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  border-left: 3px solid #1a1a1a;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;

    &:hover:not(:disabled) {
      background: #333;
    }
  ` : props.$danger ? `
    background: #ffebee;
    color: #c62828;
    border-color: #ef5350;

    &:hover:not(:disabled) {
      background: #ffcdd2;
    }
  ` : `
    background: white;
    color: #1a1a1a;

    &:hover:not(:disabled) {
      background: #f5f5f5;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export function RoommateApplicationCard({
  application,
  onApprove,
  onReject,
  isLoading = false,
  canManage = false
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />
      case 'pending': return <Clock />
      case 'rejected': return <XCircle />
      default: return <Clock />
    }
  }

  return (
    <Card>
      <Header>
        <HeaderLeft>
          <Avatar src={application.applicant?.avatar || '/default-avatar.svg'} alt={application.applicant?.fullName} />
          <HeaderContent>
            <Name>{application.applicant?.fullName}</Name>
            <Email>{application.applicant?.email}</Email>
          </HeaderContent>
        </HeaderLeft>
        <StatusBadge $status={application.status}>
          {getStatusIcon(application.status)}
          {application.status}
        </StatusBadge>
      </Header>

      <Details>
        <DetailItem>
          <DollarSign />
          <div>
            <div className="label">Budget</div>
            <div className="value">₦{application.budget?.toLocaleString()}</div>
          </div>
        </DetailItem>
        <DetailItem>
          <Calendar />
          <div>
            <div className="label">Move-In Date</div>
            <div className="value">{new Date(application.moveInDate).toLocaleDateString()}</div>
          </div>
        </DetailItem>
        <DetailItem>
          <User />
          <div>
            <div className="label">Duration</div>
            <div className="value">{application.duration === 'flexible' ? 'Flexible' : `${application.duration} months`}</div>
          </div>
        </DetailItem>
      </Details>

      {application.message && (
        <Message>{application.message}</Message>
      )}

      {canManage && application.status === 'pending' && (
        <Actions>
          <ActionButton
            $danger
            onClick={() => onReject?.(application._id)}
            disabled={isLoading}
          >
            Reject
          </ActionButton>
          <ActionButton
            $primary
            onClick={() => onApprove?.(application._id)}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Approve'}
          </ActionButton>
        </Actions>
      )}
    </Card>
  )
}
