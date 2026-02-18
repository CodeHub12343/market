'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Trash2, Plus, X } from 'lucide-react';
import { useEventVideos, useAddEventVideo, useDeleteEventVideo } from '@/hooks/useEventMedia';

const VideosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const VideoCard = styled.div`
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  position: relative;
  cursor: pointer;
  group: 'video';
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${VideoCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;

  svg {
    width: 32px;
    height: 32px;
    margin-left: 4px;
  }
`;

const VideoTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 12px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 14px;
    padding: 14px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;

  ${VideoCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.8);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 80vh;
`;

const IFrame = styled.iframe`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 12px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const AddVideoForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 15px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 16px;
  background: ${props => (props.secondary ? '#e5e7eb' : '#4f46e5')};
  color: ${props => (props.secondary ? '#333' : 'white')};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    font-size: 15px;
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

const getVideoEmbedUrl = (url) => {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URLSearchParams(url.split('?')[1]).get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // Check if it's already an embed URL
  return url;
};

const extractVideoId = (url) => {
  if (url.includes('youtu')) {
    return url.includes('youtu.be')
      ? url.split('/').pop()
      : new URLSearchParams(url.split('?')[1]).get('v');
  }
  return url.split('/').pop();
};

const VideoEmbed = ({ eventId, isOwner = false }) => {
  const { data: videos = [], isLoading } = useEventVideos(eventId);
  const { mutate: addVideo, isPending: isAdding } = useAddEventVideo();
  const { mutate: deleteVideo } = useDeleteEventVideo();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url.trim()) return;

    addVideo(
      {
        eventId,
        videoData: {
          title: formData.title || 'Event Video',
          url: formData.url,
          embedUrl: getVideoEmbedUrl(formData.url),
          thumbnail: `https://img.youtube.com/vi/${extractVideoId(formData.url)}/hqdefault.jpg`
        }
      },
      {
        onSuccess: () => {
          setFormData({ title: '', url: '' });
          setShowForm(false);
        }
      }
    );
  };

  if (isLoading) {
    return <EmptyState>Loading videos...</EmptyState>;
  }

  return (
    <VideosContainer>
      {isOwner && (
        <div>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={18} style={{ marginRight: '6px' }} />
              Add Video
            </Button>
          ) : (
            <AddVideoForm onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Video title (optional)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                type="url"
                placeholder="YouTube or Vimeo URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <ButtonGroup>
                <Button
                  secondary
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ title: '', url: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || !formData.url.trim()}>
                  {isAdding ? 'Adding...' : 'Add Video'}
                </Button>
              </ButtonGroup>
            </AddVideoForm>
          )}
        </div>
      )}

      {videos && videos.length > 0 ? (
        <VideoGrid>
          {videos.map((video) => (
            <VideoCard key={video._id || video.id}>
              <Thumbnail
                src={video.thumbnail || 'https://via.placeholder.com/640x360'}
                alt={video.title}
              />
              <PlayOverlay onClick={() => setSelectedVideo(video)}>
                <PlayButton />
              </PlayOverlay>
              <VideoTitle>{video.title}</VideoTitle>
              {isOwner && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this video?')) {
                      deleteVideo({ eventId, videoId: video._id || video.id });
                    }
                  }}
                >
                  <Trash2 />
                </DeleteButton>
              )}
            </VideoCard>
          ))}
        </VideoGrid>
      ) : (
        <EmptyState>
          {isOwner
            ? 'No videos yet. Add some event videos!'
            : 'No videos available for this event'}
        </EmptyState>
      )}

      {selectedVideo && (
        <Modal onClick={() => setSelectedVideo(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setSelectedVideo(null)}>
              <X />
            </CloseButton>
            <IFrame
              src={getVideoEmbedUrl(selectedVideo.url)}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </ModalContent>
        </Modal>
      )}
    </VideosContainer>
  );
};

export default VideoEmbed;
