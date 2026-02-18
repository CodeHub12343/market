'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Heart, Share2, Flag, MessageCircle, Phone, Star, MapPin, Trash2 } from 'lucide-react'
import { setMetaTags, addStructuredData, generateRoommateMeta, generateRoommateSchema } from '@/utils/seoMetaTags'
import { useRoommateDetails } from '@/hooks/useRoommates'
import { useApplyToRoommate } from '@/hooks/useRoommateApplications'
import { RoommateGalleryCarousel } from '@/components/roommates/RoommateGalleryCarousel'
import { RoommateDetailsSection } from '@/components/roommates/RoommateDetailsSection'
import { RoommateApplicationForm } from '@/components/roommates/RoommateApplicationForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'
import RoommateDetailSkeleton from '@/components/loaders/RoommateDetailSkeleton'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`

const HeaderBar = styled.div`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #000000;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    gap: 12px;
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }

  &:hover {
    background: #f5f5f5;
    border-color: #000000;
    transform: scale(1.05);
  }

  &.primary {
    background: #000000;
    border-color: #000000;

    svg {
      color: white;
    }

    &:hover {
      background: #333333;
      border-color: #333333;
    }
  }
`

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;

  svg {
    width: 16px;
    height: 16px;
  }
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`

const GalleryCard = styled(Card)`
  padding: 0;
  overflow: hidden;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1a1a1a;
`

const RatingCard = styled(Card)`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%);
  border: 2px solid #f0f0f0;
  text-align: center;
  padding: 24px;
`

const RatingValue = styled.div`
  font-size: 42px;
  font-weight: 800;
  color: #fbbf24;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const ReviewCount = styled.div`
  font-size: 13px;
  color: #999;
  font-weight: 600;
`

const PriceCard = styled(Card)`
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  text-align: center;
  padding: 24px;
`

const PriceLabel = styled.div`
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
`

const Price = styled.div`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
`

const PriceNote = styled.div`
  font-size: 12px;
  opacity: 0.8;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 12px;
`

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: #000000;
  border: 2px solid #000000;
  box-shadow: none;

  &:hover {
    background: #f5f5f5;
  }
`

const InfoBadge = styled.div`
  display: inline-block;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.08) 100%);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`

export default function RoommateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roommateId = params.id
  const [isFavorited, setIsFavorited] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const { data: roommate, isLoading, error } = useRoommateDetails(roommateId)
  const { mutate: applyMutation, isPending: isApplying } = useApplyToRoommate()
  
  // ✅ Debug: Log isOwner status
  useEffect(() => {
    if (roommate) {
      console.log('🏠 Roommate data:', roommate)
      console.log('✅ isOwner:', roommate?.isOwner)
      console.log('📍 Poster ID:', roommate?.poster?._id)
    }
  }, [roommate])
  
  // ✅ SEO: Set meta tags and structured data
  useEffect(() => {
    if (roommate) {
      const meta = generateRoommateMeta(roommate)
      setMetaTags(meta)
      const cleanup = addStructuredData(generateRoommateSchema(roommate))
      return cleanup
    }
  }, [roommate])

  if (isLoading) {
    return (
      <PageContainer>
        <RoommateDetailSkeleton />
      </PageContainer>
    )
  }

  if (error || !roommate) {
    return (
      <PageContainer>
        <HeaderBar>
          <HeaderContent>
            <BackButton href="/roommates">
              <ArrowLeft /> Back
            </BackButton>
          </HeaderContent>
        </HeaderBar>
        <ContentWrapper>
          <ErrorAlert
            message={error?.message || 'Roommate listing not found'}
            onRetry={() => router.push('/roommates')}
          />
        </ContentWrapper>
      </PageContainer>
    )
  }

  const handleApply = (applicationData) => {
    applyMutation(
      { roommateId, applicationData },
      {
        onSuccess: () => {
          setShowApplicationForm(false)
        },
      }
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: roommate?.title,
        text: `Check out this room listing: ${roommate?.title}`,
        url: window.location.href,
      })
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roommate-listings/${roommateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          router.push('/roommates')
        } else {
          alert('Failed to delete listing')
        }
      } catch (error) {
        console.error('Error deleting listing:', error)
        alert('Error deleting listing')
      }
    }
  }

  const handleMessageLandlord = () => {
    const whatsappNumber = roommate?.contact?.whatsapp || roommate?.contact?.phoneNumber || ''
    const title = roommate?.title || 'Room'
    
    if (!whatsappNumber) {
      alert('Contact information not available')
      return
    }

    // Format phone number for WhatsApp (remove spaces, dashes, +)
    const formattedNumber = whatsappNumber.replace(/[\s\-\+]/g, '')
    
    // WhatsApp Web URL (for web browsers)
    const message = `Hi, I'm interested in the room: ${title}`
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleCallLandlord = () => {
    const phoneNumber = roommate?.contact?.phoneNumber || roommate?.contact?.whatsapp || ''
    
    if (!phoneNumber) {
      alert('Phone number not available')
      return
    }

    // Format phone number for tel: link (remove spaces, dashes, but keep +)
    const formattedNumber = phoneNumber.replace(/[\s\-]/g, '')
    
    // Open phone dialer
    window.location.href = `tel:${formattedNumber}`
  }

  return (
    <PageContainer>
      <HeaderBar>
        <HeaderContent>
          <BackButton href="/roommates">
            <ArrowLeft /> Back to Listings
          </BackButton>
          <ActionButtons>
            <IconButton
              onClick={() => setIsFavorited(!isFavorited)}
              className={isFavorited ? 'primary' : ''}
              title="Add to favorites"
            >
              <Heart />
            </IconButton>
            <IconButton onClick={handleShare} title="Share listing">
              <Share2 />
            </IconButton>
            {roommate?.isOwner && (
              <>
                <IconButton
                  as={Link}
                  href={`/roommates/${roommateId}/edit`}
                  title="Edit listing"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  title="Delete listing"
                  style={{ color: '#e53935' }}
                >
                  <Trash2 />
                </IconButton>
              </>
            )}
            <IconButton title="Report listing">
              <Flag />
            </IconButton>
          </ActionButtons>
        </HeaderContent>
      </HeaderBar>

      <ContentWrapper>
        <div style={{ marginBottom: '32px' }}>
          <Title>{roommate?.title}</Title>
          {roommate?.location && (
            <LocationInfo>
              <MapPin />
              {roommate.location.address}, {roommate.location.city}
            </LocationInfo>
          )}
        </div>

        <MainGrid>
          <LeftSection>
            {roommate?.images && (
              <GalleryCard>
                <RoommateGalleryCarousel images={roommate.images} />
              </GalleryCard>
            )}

            {!showApplicationForm ? (
              <RoommateDetailsSection
                roommate={roommate}
                onApply={() => setShowApplicationForm(true)}
                onMessage={handleMessageLandlord}
                onCall={handleCallLandlord}
                isApplied={false}
                isLoading={isApplying}
              />
            ) : (
              <Card>
                <CardTitle>Apply for This Room</CardTitle>
                <RoommateApplicationForm
                  roommateId={roommateId}
                  onSubmit={handleApply}
                  onCancel={() => setShowApplicationForm(false)}
                  isLoading={isApplying}
                />
              </Card>
            )}
          </LeftSection>

          <RightSection>
            {roommate?.rating && (
              <RatingCard>
                <CardTitle>Rating</CardTitle>
                <RatingValue>
                  <span>{roommate.rating.toFixed(1)}</span>
                  <Star size={28} fill="#fbbf24" stroke="#fbbf24" />
                </RatingValue>
                <ReviewCount>
                  Based on {roommate.reviewCount || 0} reviews
                </ReviewCount>
              </RatingCard>
            )}

            <PriceCard>
              <PriceLabel>Monthly Rent</PriceLabel>
              <Price>₦{roommate?.budget?.minPrice?.toLocaleString() || '0'}</Price>
              <PriceNote>
                {roommate?.roomType} • Available now
              </PriceNote>
            </PriceCard>

            <Card>
              <InfoBadge>Contact Information</InfoBadge>
              <ActionGroup>
                <PrimaryButton onClick={handleMessageLandlord}>
                  <MessageCircle /> Message Landlord
                </PrimaryButton>
                <SecondaryButton onClick={handleCallLandlord}>
                  <Phone /> Call Landlord
                </SecondaryButton>
              </ActionGroup>
            </Card>

            {roommate?.isOwner && (
              <Card>
                <InfoBadge>Listing Actions</InfoBadge>
                <ActionGroup>
                  <PrimaryButton
                    onClick={() => router.push(`/roommates/${roommateId}/edit`)}
                  >
                    <Edit /> Edit Listing
                  </PrimaryButton>
                  <SecondaryButton onClick={handleDelete} style={{ color: '#e53935', borderColor: '#e53935' }}>
                    <Trash2 /> Delete Listing
                  </SecondaryButton>
                </ActionGroup>
              </Card>
            )}
          </RightSection>
        </MainGrid>
      </ContentWrapper>
    </PageContainer>
  )
}
