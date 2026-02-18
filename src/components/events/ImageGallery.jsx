'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { X, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react';
import { useEventImages, useDeleteEventImage } from '@/hooks/useEventMedia';

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #e5e7eb;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ImageThumbnail = styled.button`
  position: relative;
  aspect-ratio: 1;
  border: none;
  background: none;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    ${ImageOverlay} {
      opacity: 1;
    }
  }
`;

const OverlayButton = styled.button`
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
  height: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  ${props => props.side === 'left' ? 'left: 16px;' : 'right: 16px;'}

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const ModalControls = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.5);
  padding: 12px 16px;
  border-radius: 8px;
`;

const ModalButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImageGallery = ({ eventId, isOwner = false }) => {
  const { data: images = [], isLoading } = useEventImages(eventId);
  const { mutate: deleteImage } = useDeleteEventImage();
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (isLoading) {
    return <EmptyState>Loading gallery...</EmptyState>;
  }

  if (!images || images.length === 0) {
    return <EmptyState>No images yet. Event organizer can add images here.</EmptyState>;
  }

  const currentImage = selectedIndex !== null ? images[selectedIndex] : null;

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `event-image-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (index) => {
    if (confirm('Delete this image?')) {
      const image = images[index];
      deleteImage(
        { eventId, imageId: image._id || image.id },
        {
          onSuccess: () => {
            if (selectedIndex === index) {
              setSelectedIndex(null);
            }
          }
        }
      );
    }
  };

  const handlePrevious = () => {
    setSelectedIndex(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <GalleryContainer>
      <GalleryGrid>
        {images.map((image, index) => (
          <ImageThumbnail
            key={image._id || image.id}
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={image.url || image.src}
              alt={`Gallery image ${index + 1}`}
            />
            <ImageOverlay>
              <OverlayButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(image.url || image.src);
                }}
              >
                <Download />
              </OverlayButton>
              {isOwner && (
                <OverlayButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  <Trash2 />
                </OverlayButton>
              )}
            </ImageOverlay>
          </ImageThumbnail>
        ))}
      </GalleryGrid>

      {currentImage && (
        <Modal onClick={() => setSelectedIndex(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setSelectedIndex(null)}>
              <X />
            </ModalCloseButton>

            <NavigationButton
              side="left"
              onClick={handlePrevious}
              disabled={images.length <= 1}
            >
              <ChevronLeft />
            </NavigationButton>

            <ModalImage
              src={currentImage.url || currentImage.src}
              alt={`Gallery image ${selectedIndex + 1}`}
            />

            <NavigationButton
              side="right"
              onClick={handleNext}
              disabled={images.length <= 1}
            >
              <ChevronRight />
            </NavigationButton>

            <ModalControls>
              <ModalButton
                onClick={() => handleDownload(currentImage.url || currentImage.src)}
              >
                <Download />
              </ModalButton>
              {isOwner && (
                <ModalButton onClick={() => handleDelete(selectedIndex)}>
                  <Trash2 />
                </ModalButton>
              )}
              <span style={{ color: 'white', fontSize: '12px', marginLeft: '8px' }}>
                {selectedIndex + 1} / {images.length}
              </span>
            </ModalControls>
          </ModalContent>
        </Modal>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;
