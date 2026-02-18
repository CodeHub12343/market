'use client';

import styled from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';
import { useDownloadDocument } from '@/hooks/useDocuments';

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  }

  @media (min-width: 768px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
    }
  }
`;

const DocumentHeader = styled.div`
  padding: 12px;
  background: #1a1a1a;
  color: white;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }
`;

const FileIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const DocumentBody = styled.div`
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Description = styled.p`
  display: none;
  margin: 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    display: -webkit-box;
  }
`;

const Metadata = styled.div`
  display: none;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #777;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const MetadataItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
`;

const Badge = styled.span`
  background: #1a1a1a;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RatingContainer = styled.div`
  display: none;
  align-items: center;
  gap: 6px;
  font-size: 12px;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const Stars = styled.span`
  color: #ffc107;
  font-weight: 700;
  letter-spacing: 1px;
`;

const RatingText = styled.span`
  font-size: 11px;
  color: #999;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-top: auto;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    font-size: 12px;
    padding: 9px 12px;

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

const SecondaryButton = styled(Button)`
  background: #f5f5f5;
  color: #333;

  &:hover:not(:disabled) {
    background: #e8e8e8;
  }
`;

export default function DocumentCard({ document }) {
  const { mutate: downloadDocument, isPending: isDownloading } = useDownloadDocument();

  const handleDownload = (e) => {
    e.preventDefault();
    downloadDocument(document._id);
  };

  const getFileIcon = () => {
    const fileType = document.fileType || document.fileName?.split('.').pop()?.toLowerCase() || 'pdf';
    const icons = {
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'application/vnd.ms-powerpoint': '🎯',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '🎯',
      'text/plain': '📄',
      'application/zip': '🗜️',
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '🎯',
      'pptx': '🎯',
      'txt': '📄',
      'zip': '🗜️',
    };
    return icons[fileType] || '📎';
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const empty = 5 - fullStars - (hasHalf ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalf ? '⭐' : '') + '☆'.repeat(empty);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CardContainer>
      <DocumentHeader>
        <FileIcon>{getFileIcon()}</FileIcon>
        <Title title={document.title}>{document.title}</Title>
      </DocumentHeader>

      <DocumentBody>
        {document.description && (
          <Description title={document.description}>{document.description}</Description>
        )}

        <Metadata>
          {document.category && (
            <MetadataItem>
              📑 {document.category}
            </MetadataItem>
          )}
          {document.campus && (
            <MetadataItem title={typeof document.campus === 'string' ? document.campus : document.campus.name}>
              🏫 {typeof document.campus === 'string' ? document.campus.substring(0, 15) : document.campus.name?.substring(0, 15)}
            </MetadataItem>
          )}
        </Metadata>

        <Metadata>
          {document.fileSize && (
            <MetadataItem>
              💾 {formatFileSize(document.fileSize)}
            </MetadataItem>
          )}
          {document.version && (
            <MetadataItem>
              v{document.version}
            </MetadataItem>
          )}
        </Metadata>

        {(document.averageRating > 0 || document.ratingsCount > 0) && (
          <RatingContainer>
            <Stars>{renderStars(document.averageRating || 0)}</Stars>
            <RatingText>{(document.averageRating || 0).toFixed(1)}</RatingText>
            <RatingText>({document.ratingsCount || 0})</RatingText>
          </RatingContainer>
        )}

        <Metadata style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
          {document.downloads !== undefined && (
            <MetadataItem>
              📥 {document.downloads}
            </MetadataItem>
          )}
          {document.views !== undefined && (
            <MetadataItem>
              👁️ {document.views}
            </MetadataItem>
          )}
          {document.createdAt && (
            <MetadataItem>
              📅 {new Date(document.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </MetadataItem>
          )}
        </Metadata>
      </DocumentBody>

      <ActionButtons>
        <PrimaryButton
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download document"
        >
          {isDownloading ? '⏳' : '⬇️'} Download
        </PrimaryButton>
      </ActionButtons>
    </CardContainer>
  );
}