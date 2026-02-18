'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, Trash2, Heart, Image as ImageIcon } from 'lucide-react';
import {
  useAttendeePhotos,
  useUploadAttendeePhotos,
  useDeleteAttendeePhoto,
  useLikeAttendeePhoto
} from '@/hooks/useEventMedia';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9fafb;

  &:hover {
    border-color: #4f46e5;
    background: #f3f4f6;
  }

  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 56px;
    margin-bottom: 16px;
  }
`;

const UploadText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;

  strong {
    color: #4f46e5;
    font-weight: 600;
  }

  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  ${props => props.liked && `
    background: rgba(239, 68, 68, 0.8);

    &:hover {
      background: rgba(239, 68, 68, 0.9);
    }
  `}
`;

const PhotoMeta = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 12px 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 14px 10px;
  }
`;

const LikeCount = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 48px 24px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 14px;
  }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #4f46e5;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const AttendeePhotoUpload = ({ eventId, isAttendee = false, eventPassed = false }) => {
  const { data: photos = [], isLoading } = useAttendeePhotos(eventId);
  const { mutate: uploadPhotos, isPending: isUploading } = useUploadAttendeePhotos();
  const { mutate: deletePhoto } = useDeleteAttendeePhoto();
  const { mutate: likePhoto } = useLikeAttendeePhoto();
  const fileInputRef = useRef(null);
  const [userPhotos, setUserPhotos] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    uploadPhotos({
      eventId,
      files
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (photoId) => {
    if (confirm('Delete this photo?')) {
      deletePhoto({ eventId, photoId });
    }
  };

  const handleLike = (photoId) => {
    likePhoto({ eventId, photoId });
  };

  const totalLikes = photos.reduce((sum, photo) => sum + (photo.likes || 0), 0);

  return (
    <Container>
      {isLoading && <EmptyState>Loading photos...</EmptyState>}

      {!isLoading && (
        <>
          {isAttendee && eventPassed && (
            <UploadArea
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                uploadPhotos({ eventId, files });
              }}
            >
              <HiddenInput
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <UploadIcon>
                <ImageIcon size={48} color="#d1d5db" />
              </UploadIcon>
              <UploadText>
                <strong>Click to upload</strong> or drag and drop
                <br />
                PNG, JPG, GIF (max 10 files)
              </UploadText>
            </UploadArea>
          )}

          {photos.length > 0 && (
            <>
              <Stats>
                <StatCard>
                  <StatValue>{photos.length}</StatValue>
                  <StatLabel>Total Photos</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{totalLikes}</StatValue>
                  <StatLabel>Total Likes</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{new Set(photos.map(p => p.uploadedBy?.name)).size}</StatValue>
                  <StatLabel>Contributors</StatLabel>
                </StatCard>
              </Stats>

              <PhotoGrid>
                {photos.map((photo) => (
                  <PhotoCard key={photo._id || photo.id}>
                    <PhotoImage
                      src={photo.url || photo.src}
                      alt="Attendee photo"
                    />
                    <PhotoMeta>
                      <LikeCount>
                        <Heart size={14} fill="white" />
                        {photo.likes || 0}
                      </LikeCount>
                    </PhotoMeta>
                    <PhotoOverlay>
                      <PhotoActions>
                        <ActionButton
                          onClick={() => handleLike(photo._id || photo.id)}
                          liked={photo.liked}
                        >
                          <Heart fill={photo.liked ? 'white' : 'none'} />
                        </ActionButton>
                        {(isAttendee || photo.uploadedBy?._id === userPhotos) && (
                          <ActionButton
                            onClick={() => handleDelete(photo._id || photo.id)}
                          >
                            <Trash2 />
                          </ActionButton>
                        )}
                      </PhotoActions>
                    </PhotoOverlay>
                  </PhotoCard>
                ))}
              </PhotoGrid>
            </>
          )}

          {!isLoading && photos.length === 0 && (
            <EmptyState>
              {isAttendee && eventPassed
                ? 'No event photos yet. Share your memories!'
                : 'Attendees will share photos here after the event.'}
            </EmptyState>
          )}
        </>
      )}
    </Container>
  );
};

export default AttendeePhotoUpload;
