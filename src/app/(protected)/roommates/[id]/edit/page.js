'use client'

import styled from 'styled-components'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import useRoommateDetail from '@/hooks/useRoommates'
import { useUpdateRoommate } from '@/hooks/useRoommates'
import { RoommateForm } from '@/components/roommates/RoommateForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorAlert from '@/components/common/ErrorAlert'

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: 768px) {
    padding: 32px 24px;
  }
`

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2196f3;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 24px;
  transition: all 0.2s ease;

  &:hover {
    gap: 12px;
    color: #1976d2;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 32px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const CardWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;

  @media (min-width: 768px) {
    padding: 32px;
  }
`

export default function EditRoommatePage() {
  const router = useRouter()
  const params = useParams()
  const roommateId = params.id

  const { data: roommate, isLoading, error } = useRoommateDetail(roommateId)
  const { mutate: updateRoommate, isPending: isUpdating } = useUpdateRoommate()

  if (isLoading) {
    return (
      <PageContainer>
        <BackButton href={`/roommates/${roommateId}`}>
          <ArrowLeft /> Back to Listing
        </BackButton>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  if (error || !roommate) {
    return (
      <PageContainer>
        <BackButton href="/my-roommates">
          <ArrowLeft /> Back to My Listings
        </BackButton>
        <ErrorAlert
          message={error?.message || 'Roommate listing not found'}
          onRetry={() => router.push('/my-roommates')}
        />
      </PageContainer>
    )
  }

  const handleSubmit = (formData) => {
    updateRoommate(
      { id: roommateId, ...formData },
      {
        onSuccess: () => {
          router.push(`/roommates/${roommateId}`)
        },
        onError: (error) => {
          console.error('Update failed:', error)
        },
      }
    )
  }

  const initialData = {
    title: roommate?.title || '',
    description: roommate?.description || '',
    location: roommate?.location || '',
    rent: roommate?.rent || '',
    roomType: roommate?.roomType || 'shared',
    roommateCount: roommate?.roommateCount || 1,
    amenities: roommate?.amenities || [],
    availableFrom: roommate?.availableFrom || '',
    images: roommate?.images || [],
  }

  return (
    <PageContainer>
      <BackButton href={`/roommates/${roommateId}`}>
        <ArrowLeft /> Back to Listing
      </BackButton>

      <Title>Edit Roommate Listing</Title>

      <CardWrapper>
        <RoommateForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          isEditMode={true}
        />
      </CardWrapper>
    </PageContainer>
  )
}
