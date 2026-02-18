// src/app/(protected)/services/[id]/edit/page.js

'use client';

import styled from 'styled-components';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ServiceForm from '@/components/services/ServiceForm';
import {useProtectedRoute} from '@/hooks/useProtectedRoute';
import { useService } from '@/hooks/useServices';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  padding-bottom: 80px; /* For bottom nav */
`;

const Header = styled.div`
  max-width: 800px;
  margin: 0 auto 24px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

export default function EditServicePage() {
  useProtectedRoute();
  const router = useRouter();
  const params = useParams();

  const { data: serviceData, isLoading, error, isError } = useService(params.id);

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <LoadingSpinner />
        </Header>
      </PageContainer>
    );
  }

  if (isError || !serviceData?.data) {
    return (
      <PageContainer>
        <Header>
          <Title>Service not found</Title>
          <BackButton href="/services">← Back to Services</BackButton>
        </Header>
      </PageContainer>
    );
  }

  const service = serviceData.data;

  const handleSuccess = () => {
    router.push(`/services/${service._id}`);
  };

  return (
    <PageContainer>
      <Header>
        <BackButton href={`/services/${service._id}`}>← Back to Service</BackButton>
        <Title>Edit Service</Title>
        <Subtitle>
          Update your service details
        </Subtitle>
      </Header>

      <ServiceForm initialService={service} onSuccess={handleSuccess} />
    </PageContainer>
  );
}