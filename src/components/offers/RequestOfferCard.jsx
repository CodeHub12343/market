'use client';

import styled from 'styled-components';

const CardContainer = styled.div`
  background: white;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
    transform: translateY(-4px);
  }

  &:focus-within {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
`;

const OfferTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const StatusBadge = styled.div`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `background: #fef3c7; color: #92400e;`;
      case 'accepted':
        return `background: #d1fae5; color: #065f46;`;
      case 'rejected':
        return `background: #fee2e2; color: #7f1d1d;`;
      default:
        return `background: #f3f4f6; color: #6b7280;`;
    }
  }}
`;

const SellerInfo = styled.div`
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  padding: 14px;
  border-radius: 10px;
  border-left: 4px solid #000;
`;

const SellerName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const SellerDetails = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OfferAmount = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #000;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  padding: 12px;
  border-radius: 8px;
  margin: 0;
`;

const OfferDescription = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.6;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid #000;
`;

const RequestInfo = styled.div`
  font-size: 12px;
  color: #777;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoItem = styled.div`
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ContactSection = styled.div`
  background: linear-gradient(135deg, #f0f9f7 0%, #e8f7f3 100%);
  border: 1px solid #c1e5de;
  border-radius: 10px;
  padding: 12px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: white;
  border: 1px solid #a8d5cc;
  border-radius: 8px;
  color: #065f46;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: #f0fffe;
    border-color: #6ee7b7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 95, 70, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 11px 14px;
  border: 1.5px solid #d5d5d5;
  border-radius: 8px;
  background: ${props => {
    if (props.danger) return '#fff5f5';
    if (props.success) return '#f0f9f7';
    return 'white';
  }};
  color: ${props => {
    if (props.danger) return '#dc2626';
    if (props.success) return '#059669';
    return '#1a1a1a';
  }};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.danger) return '#fee2e2';
      if (props.success) return '#d1fae5';
      return '#f8f8f8';
    }};
    border-color: ${props => {
      if (props.danger) return '#fca5a5';
      if (props.success) return '#6ee7b7';
      return '#999';
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function RequestOfferCard({ 
  offer, 
  isRequesterView = false, 
  onDelete,
  onAccept,
  onReject,
  isLoading = false
}) {
  // Get seller information
  const sellerName = offer?.seller?.fullName || 'Anonymous Seller';
  const sellerCampus = offer?.seller?.campus?.name || 'Unknown Campus';
  const sellerRole = offer?.seller?.role ? offer.seller.role.charAt(0).toUpperCase() + offer.seller.role.slice(1).replace('_', ' ') : 'User';
  const isAvailable = offer?.seller?.isAvailable !== false; // Default to true if not specified

  // Debug logging
  console.log('Offer data in card:', { 
    offerPrice: offer?.offerPrice, 
    amount: offer?.amount, 
    offer: offer 
  });

  const handleAcceptClick = (e) => {
    e.preventDefault();
    if (onAccept) onAccept();
  };

  const handleRejectClick = (e) => {
    e.preventDefault();
    if (onReject) onReject();
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (onDelete) onDelete();
  };

  const statusText = {
    pending: 'Awaiting response',
    accepted: 'Offer accepted',
    rejected: 'Offer rejected',
  };

  return (
    <CardContainer role="article" aria-label={`Offer for ${offer?.request?.title || 'request'}`}>
      <Header>
        <OfferTitle id={`offer-title-${offer._id}`}>
          {offer?.request?.title || 'Request Offer'}
        </OfferTitle>
        <StatusBadge 
          status={offer?.status}
          role="status"
          aria-label={statusText[offer?.status] || 'Unknown status'}
        >
          {offer?.status || 'pending'}
        </StatusBadge>
      </Header>

      {/* Seller Information Section */}
      <SellerInfo role="complementary" aria-labelledby={`seller-${offer._id}`}>
        <SellerName id={`seller-${offer._id}`}>👤 {sellerName}</SellerName>
        <SellerDetails>
          <InfoItem>
            <span>🏫</span>
            <span>{sellerCampus}</span>
          </InfoItem>
          <InfoItem>
            <span>🎓</span>
            <span>{sellerRole}</span>
          </InfoItem>
          <InfoItem>
            <span>{isAvailable ? '✅' : '❌'}</span>
            <span>{isAvailable ? 'Available' : 'Not Available'}</span>
          </InfoItem>
        </SellerDetails>
      </SellerInfo>

      <OfferAmount aria-label={`Offer price: ${offer?.offerPrice || offer?.amount ? parseInt(offer.offerPrice || offer.amount).toLocaleString() : '0'} Nigerian Naira`}>
        ₦{offer?.offerPrice || offer?.amount ? parseInt(offer.offerPrice || offer.amount).toLocaleString() : '0'}
      </OfferAmount>

      {offer?.offerDescription && (
        <OfferDescription>
          {offer.offerDescription}
        </OfferDescription>
      )}

      <RequestInfo>
        {offer?.request?.location?.address && (
          <InfoItem>
            <span>📍</span>
            <span>{offer.request.location.address}</span>
          </InfoItem>
        )}
        {offer?.createdAt && (
          <InfoItem>
            <span>📅</span>
            <span>Offered: {new Date(offer.createdAt).toLocaleDateString()}</span>
          </InfoItem>
        )}
      </RequestInfo>

      <ActionButtons role="group" aria-label="Offer actions">
        {isRequesterView && offer?.status === 'pending' && (
          <ButtonRow>
            <Button 
              success 
              onClick={handleAcceptClick}
              disabled={isLoading}
              aria-label={`Accept offer from ${sellerName}`}
              title="Accept this offer"
            >
              ✓ Accept
            </Button>
            <Button 
              danger 
              onClick={handleRejectClick}
              disabled={isLoading}
              aria-label={`Reject offer from ${sellerName}`}
              title="Reject this offer"
            >
              ✕ Reject
            </Button>
          </ButtonRow>
        )}
        
        {!isRequesterView && onDelete && offer?.status === 'pending' && (
          <Button 
            danger 
            onClick={handleDeleteClick}
            disabled={isLoading}
            aria-label="Withdraw this offer"
            title="Withdraw your offer"
          >
            🗑️ Withdraw Offer
          </Button>
        )}

        {offer?.status === 'accepted' && isRequesterView && (
          <div style={{ fontSize: '13px', color: '#065f46', fontWeight: 600, padding: '8px', textAlign: 'center', background: '#f0f9f7', borderRadius: '8px' }}>
            ✓ You accepted this offer
          </div>
        )}

        {offer?.status === 'accepted' && !isRequesterView && (
          <ContactSection>
            <ContactInfo>
              <span style={{fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px', display: 'block'}}>Accepted • Contact Requester</span>
              {offer?.request?.requester?.whatsapp && (
                <ContactButton
                  as="a"
                  href={`https://wa.me/${offer.request.requester.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                >
                  💬 WhatsApp: {offer.request.requester.whatsapp}
                </ContactButton>
              )}
              {offer?.request?.requester?.phoneNumber && (
                <ContactButton
                  as="a"
                  href={`tel:${offer.request.requester.phoneNumber}`}
                  title="Call requester"
                >
                  📞 {offer.request.requester.phoneNumber}
                </ContactButton>
              )}
            </ContactInfo>
          </ContactSection>
        )}

        {offer?.status === 'rejected' && isRequesterView && (
          <div style={{ fontSize: '13px', color: '#7f1d1d', fontWeight: 600, padding: '8px', textAlign: 'center', background: '#fee2e2', borderRadius: '8px' }}>
            ✕ You rejected this offer
          </div>
        )}
      </ActionButtons>
    </CardContainer>
  );
}
