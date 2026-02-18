'use client'

import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useCreateRoommate } from '@/hooks/useRoommates'
import { useToast } from '@/hooks/useToast'
import { RoommateForm } from '@/components/roommates/RoommateForm'

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
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 500px;
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

export default function CreateRoommatePage() {
  const router = useRouter()
  const toast = useToast()
  const { mutate: createRoommate, isPending: isCreating } = useCreateRoommate()

  const handleSubmit = (formData) => {
    createRoommate(formData, {
      onSuccess: (newRoommate) => {
        toast.success('🎉 Roommate listing created successfully!')
        setTimeout(() => {
          router.push('/roommates')
        }, 500)
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to create listing')
        console.error('Creation failed:', error)
      },
    })
  }

  return (
    <PageContainer>
      <BackButton href="/my-roommates">
        <ArrowLeft /> Back to My Listings
      </BackButton>

      <Title>Create a New Roommate Listing</Title>
      <Subtitle>
        Help students find the perfect room to rent. Fill out the form below with details
        about your property.
      </Subtitle>

      <CardWrapper>
        <RoommateForm
          onSubmit={handleSubmit}
          isLoading={isCreating}
          isEditMode={false}
        />
      </CardWrapper>
    </PageContainer>
  )
}
