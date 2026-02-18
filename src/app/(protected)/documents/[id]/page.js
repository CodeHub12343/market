'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDocument, useDownloadDocument, useRateDocument, useCommentDocument } from '@/hooks/useDocuments';
import Modal from '@/components/common/Modal';

const PageWrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 12px;

  @media (min-width: 480px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 13px;
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
    font-size: 14px;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const DocumentHeaderSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  color: white;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (min-width: 480px) {
    padding: 20px;
    gap: 16px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const FileIconWrapper = styled.div`
  font-size: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    font-size: 56px;
  }
`;

const HeaderDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const DocumentTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 20px;
  }

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  backdrop-filter: blur(10px);

  @media (min-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

const StatLabel = styled.div`
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;

  @media (min-width: 480px) {
    font-size: 11px;
  }
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 700;

  @media (min-width: 480px) {
    font-size: 16px;
  }
`;

const DocumentDescription = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.9;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;

  @media (min-width: 480px) {
    gap: 12px;
    padding: 20px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetadataItem = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;

  @media (min-width: 480px) {
    padding: 14px;
  }
`;

const MetadataLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;

  @media (min-width: 480px) {
    font-size: 12px;
  }
`;

const MetadataValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const MetadataIcon = styled.span`
  margin-right: 6px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  @media (min-width: 480px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 480px) {
    font-size: 15px;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px;

  @media (min-width: 480px) {
    gap: 12px;
    padding: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 480px) {
    font-size: 14px;
    padding: 14px 18px;
  }
`;

const PrimaryButton = styled(Button)`
  background: #1a1a1a;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    background: #0d0d0d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }

  @media (min-width: 768px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }
`;

const SecondaryButton = styled(Button)`
  background: #f0f0f0;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

const RatingSection = styled.div`
  padding: 16px;

  @media (min-width: 480px) {
    padding: 20px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const RatingButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 4px 8px;

  &:hover {
    transform: scale(1.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 480px) {
    font-size: 32px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 480px) {
    gap: 14px;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;
  background: white;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background: #f8f7ff;
  }

  @media (min-width: 480px) {
    font-size: 14px;
    padding: 14px;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;

  @media (min-width: 480px) {
    gap: 14px;
    margin-top: 20px;
  }
`;

const Comment = styled.div`
  background: #f8f7ff;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #1a1a1a;

  @media (min-width: 480px) {
    padding: 14px;
  }
`;

const CommentAuthor = styled.div`
  font-weight: 700;
  font-size: 12px;
  color: #1a1a1a;
  margin-bottom: 4px;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.5;

  @media (min-width: 480px) {
    font-size: 13px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1a1a1a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Sidebar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatBox = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  @media (min-width: 480px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
    grid-column: span 1;
  }
`;

const StatBoxValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;

  @media (min-width: 480px) {
    font-size: 24px;
  }
`;

const StatBoxLabel = styled.div`
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  @media (min-width: 480px) {
    font-size: 12px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;

  @media (min-width: 480px) {
    gap: 10px;
    padding: 20px;
  }
`;

const Tag = styled.span`
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  color: #1a1a1a;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #e0e0e0;

  @media (min-width: 480px) {
    font-size: 12px;
    padding: 7px 14px;
  }
`;

const ErrorSection = styled.div`
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 12px;
  padding: 16px;
  color: #d32f2f;
  text-align: center;
`;

const getFileIcon = (fileName) => {
  const ext = fileName?.split('.').pop()?.toLowerCase() || 'pdf';
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '🎯',
    pptx: '🎯',
    txt: '📄',
    zip: '🗜️',
  };
  return icons[ext] || '📎';
};

const renderStars = (rating) => {
  if (!rating) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = '★'.repeat(fullStars) + (hasHalf ? '½' : '');
  const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
  return stars + emptyStars;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: document, isLoading, error } = useDocument(documentId);
  const { mutate: downloadDocument, isPending: isDownloading } = useDownloadDocument();
  const { mutate: rateDoc, isPending: isRating } = useRateDocument();
  const { mutate: commentDoc, isPending: isCommenting } = useCommentDocument();

  if (isLoading) {
    return (
      <PageWrapper>
        <PageContainer>
          <LoadingState>
            <Spinner />
          </LoadingState>
        </PageContainer>
      </PageWrapper>
    );
  }

  if (error || !document) {
    return (
      <PageWrapper>
        <PageContainer>
          <Header>
            <BackButton onClick={() => router.back()}>← Back</BackButton>
          </Header>
          <ErrorSection>Error loading document. Please try again.</ErrorSection>
        </PageContainer>
      </PageWrapper>
    );
  }

  const handleDownload = () => {
    downloadDocument(documentId);
  };

  const handleRate = (value) => {
    setRating(value);
    rateDoc({ id: documentId, rating: value });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      commentDoc(
        { id: documentId, comment: comment.trim() },
        {
          onSuccess: () => {
            setComment('');
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 2000);
          },
        }
      );
    }
  };

  return (
    <PageWrapper>
      <PageContainer>
        <Header>
          <BackButton onClick={() => router.back()}>← Back</BackButton>
          <HeaderTitle>Document Details</HeaderTitle>
        </Header>

        <MainGrid>
          <ContentWrapper>
            {/* Document Header */}
            <DocumentCard>
              <DocumentHeaderSection>
                <FileIconWrapper>{getFileIcon(document.fileName)}</FileIconWrapper>
                <HeaderDetails>
                  <DocumentTitle>{document.title}</DocumentTitle>
                  {document.description && (
                    <DocumentDescription>{document.description}</DocumentDescription>
                  )}
                  <QuickStats>
                    <StatChip>
                      <StatValue>{document.downloads || 0}</StatValue>
                      <StatLabel>Downloads</StatLabel>
                    </StatChip>
                    <StatChip>
                      <StatValue>{document.ratingsCount || 0}</StatValue>
                      <StatLabel>Ratings</StatLabel>
                    </StatChip>
                    <StatChip>
                      <StatValue>{document.views || 0}</StatValue>
                      <StatLabel>Views</StatLabel>
                    </StatChip>
                  </QuickStats>
                </HeaderDetails>
              </DocumentHeaderSection>

              {/* Metadata Grid */}
              <MetadataGrid>
                {document.faculty && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>🏢</MetadataIcon>Faculty
                    </MetadataLabel>
                    <MetadataValue>
                      {typeof document.faculty === 'object'
                        ? document.faculty?.name || 'Faculty'
                        : document.faculty}
                    </MetadataValue>
                  </MetadataItem>
                )}
                {document.department && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>🏛️</MetadataIcon>Department
                    </MetadataLabel>
                    <MetadataValue>
                      {typeof document.department === 'object'
                        ? document.department?.name || 'Department'
                        : document.department}
                    </MetadataValue>
                  </MetadataItem>
                )}
                {document.campus && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>🌐</MetadataIcon>Campus
                    </MetadataLabel>
                    <MetadataValue>
                      {typeof document.campus === 'object'
                        ? document.campus?.name || 'Campus'
                        : document.campus}
                    </MetadataValue>
                  </MetadataItem>
                )}
                {document.courseCode && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>📚</MetadataIcon>Course Code
                    </MetadataLabel>
                    <MetadataValue>{document.courseCode}</MetadataValue>
                  </MetadataItem>
                )}
                {document.academicLevel && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>📊</MetadataIcon>Level
                    </MetadataLabel>
                    <MetadataValue>{document.academicLevel}</MetadataValue>
                  </MetadataItem>
                )}
                {document.category && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>🏷️</MetadataIcon>Category
                    </MetadataLabel>
                    <MetadataValue style={{ textTransform: 'capitalize' }}>
                      {document.category}
                    </MetadataValue>
                  </MetadataItem>
                )}
                {document.fileSize && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>💾</MetadataIcon>File Size
                    </MetadataLabel>
                    <MetadataValue>{formatFileSize(document.fileSize)}</MetadataValue>
                  </MetadataItem>
                )}
                {document.uploadedBy && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>👤</MetadataIcon>Uploaded By
                    </MetadataLabel>
                    <MetadataValue>{document.uploadedBy.fullName || 'Anonymous'}</MetadataValue>
                  </MetadataItem>
                )}
                {document.uploadedAt && (
                  <MetadataItem>
                    <MetadataLabel>
                      <MetadataIcon>📅</MetadataIcon>Date
                    </MetadataLabel>
                    <MetadataValue>
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </MetadataValue>
                  </MetadataItem>
                )}
              </MetadataGrid>

              {/* Action Buttons */}
              <ActionGrid>
                <PrimaryButton onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? '⏳' : '⬇️'} Download
                </PrimaryButton>
                <SecondaryButton>👁️ Preview</SecondaryButton>
              </ActionGrid>
            </DocumentCard>

            {/* Rating Section */}
            <SectionCard>
              <SectionTitle>⭐ Rate This Document</SectionTitle>
              <RatingSection>
                <RatingContainer>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <RatingButton
                      key={value}
                      onClick={() => handleRate(value)}
                      disabled={isRating}
                      title={`Rate ${value} stars`}
                    >
                      {value <= (rating || document.averageRating || 0) ? '★' : '☆'}
                    </RatingButton>
                  ))}
                </RatingContainer>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '12px', textAlign: 'center' }}>
                  {renderStars(document.averageRating)} ({document.ratingsCount || 0} ratings)
                </div>
              </RatingSection>
            </SectionCard>

            {/* Comments Section */}
            {document.allowComments && (
              <SectionCard>
                <SectionTitle>💬 Comments ({document.commentsCount || 0})</SectionTitle>
                <CommentForm onSubmit={handleComment}>
                  <CommentInput
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this document..."
                  />
                  <PrimaryButton
                    type="submit"
                    disabled={isCommenting || !comment.trim()}
                    style={{ width: '100%' }}
                  >
                    {isCommenting ? '⏳' : '💬'} Post Comment
                  </PrimaryButton>
                </CommentForm>

                {document.comments && document.comments.length > 0 && (
                  <>
                    <SectionTitle style={{ marginTop: '20px', borderBottomColor: '#f0f0f0' }}>
                      Recent Comments
                    </SectionTitle>
                    <CommentsList>
                      {document.comments.slice(0, 10).map((c, idx) => (
                        <Comment key={idx}>
                          <CommentAuthor>{c.author || 'Anonymous'}</CommentAuthor>
                          <CommentText>{c.text}</CommentText>
                        </Comment>
                      ))}
                    </CommentsList>
                  </>
                )}
              </SectionCard>
            )}

            {/* Tags Section */}
            {document.tags && document.tags.length > 0 && (
              <SectionCard>
                <SectionTitle>🏷️ Tags</SectionTitle>
                <TagsContainer>
                  {document.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </SectionCard>
            )}
          </ContentWrapper>

          {/* Sidebar */}
          <Sidebar>
            <StatBox>
              <StatBoxValue>{document.downloads || 0}</StatBoxValue>
              <StatBoxLabel>Downloads</StatBoxLabel>
            </StatBox>

            <StatBox>
              <StatBoxValue>{document.ratingsCount || 0}</StatBoxValue>
              <StatBoxLabel>Ratings</StatBoxLabel>
            </StatBox>

            <StatBox>
              <StatBoxValue>{document.views || 0}</StatBoxValue>
              <StatBoxLabel>Views</StatBoxLabel>
            </StatBox>
          </Sidebar>
        </MainGrid>

        {showSuccessModal && (
          <Modal title="Success" onConfirm={() => setShowSuccessModal(false)} hideCancel>
            <p>Comment added successfully!</p>
          </Modal>
        )}
      </PageContainer>
    </PageWrapper>
  );
}
