'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import CampusFilter from '@/components/common/CampusFilter';
import { useCampusFilter } from '@/hooks/useCampusFilter';
import { useAllCampuses } from '@/hooks/useCampuses';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentFilters from '@/components/documents/DocumentFilters';
import DocumentSearch from '@/components/documents/DocumentSearch';
import Modal from '@/components/common/Modal';

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

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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

const SidebarToggle = styled.button`
  display: none;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 12px;

  @media (max-width: 1023px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileSidebar = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 1023px) {
    display: ${(props) => (props.visible ? 'flex' : 'none')};
  }

  @media (min-width: 1024px) {
    display: none;
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

const SearchWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const DeleteModal = styled(Modal)``;

export default function DocumentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const campusFilter = useCampusFilter();
  const { data: allCampuses = [] } = useAllCampuses();
  const [filters, setFilters] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Enhanced filters with campus params
  const enhancedFilters = {
    ...filters,
    ...campusFilter.getFilterParams(),
  };

  const { data: documents = [], isLoading, error } = useDocuments(enhancedFilters);
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  const handleUploadClick = () => {
    router.push('/documents/new');
  };

  const handleViewDocument = (docId) => {
    router.push(`/documents/${docId}`);
  };

  const handleEditDocument = (docId) => {
    router.push(`/documents/${docId}/edit`);
  };

  const handleDeleteClick = (docId) => {
    setDeleteId(docId);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteDocument(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const handleFilterApply = (appliedFilters) => {
    setFilters(appliedFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
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
              📚 Documents
              <TitleBadge>{documents.length}</TitleBadge>
            </PageTitle>
          </div>
          <PrimaryButton onClick={handleUploadClick}>
            ➕ Upload
          </PrimaryButton>
        </HeaderContent>

        <SidebarToggle onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
          {showMobileSidebar ? '✕ Close Filters' : '🔍 Show Filters'}
        </SidebarToggle>
      </PageHeader>

      <MainLayout>
        {/* Sidebar Filters */}
        <Sidebar>
          <DocumentFilters
            onApply={handleFilterApply}
            onReset={handleFilterReset}
            initialFilters={filters}
          />
          
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

        {/* Mobile Sidebar */}
        <MobileSidebar visible={showMobileSidebar}>
          <DocumentFilters
            onApply={(appliedFilters) => {
              handleFilterApply(appliedFilters);
              setShowMobileSidebar(false);
            }}
            onReset={() => {
              handleFilterReset();
              setShowMobileSidebar(false);
            }}
            initialFilters={filters}
          />
        </MobileSidebar>

        {/* Main Content */}
        <Content>
          <SearchWrapper>
            <DocumentSearch />
          </SearchWrapper>

          <DocumentGrid
            documents={documents}
            isLoading={isLoading}
            error={error}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDelete={handleDeleteClick}
          />
        </Content>
      </MainLayout>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        title="Delete Document"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDangerous
      >
        <p style={{ margin: '0', color: '#666', lineHeight: '1.5' }}>
          Are you sure you want to delete this document? This action cannot be undone.
        </p>
      </DeleteModal>
    </PageWrapper>
  );
}
