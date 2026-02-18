'use client';

import styled from 'styled-components';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;

  @media (max-width: 640px) {
    background: rgba(0, 0, 0, 0.98);
  }
`;

const Container = styled.div`
  position: relative;
  width: 90%;
  height: 90vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 640px) {
    width: 100%;
    height: 100%;
    max-width: none;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    cursor: ${props => (props.$canZoom ? 'zoom-in' : 'default')};
    transition: transform 0.3s ease;
    transform: scale(${props => props.$zoom});
    user-select: none;

    @media (max-width: 640px) {
      max-height: calc(100vh - 60px);
    }
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 10;

  @media (max-width: 640px) {
    bottom: 16px;
    gap: 8px;
    padding: 8px;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 640px) {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.$direction === 'left' ? 'left: 20px;' : 'right: 20px;')}
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 640px) {
    ${props => (props.$direction === 'left' ? 'left: 8px;' : 'right: 8px;')}
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;

  @media (max-width: 640px) {
    top: 12px;
    left: 12px;
    font-size: 12px;
    padding: 8px 12px;
  }
`;

export default function ImageLightbox({
  images = [],
  initialIndex = 0,
  onClose,
  alt = 'Service image'
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setZoom(1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setZoom(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && zoom === 1) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (hasMultiple) handlePrevious(e);
        break;
      case 'ArrowRight':
        if (hasMultiple) handleNext(e);
        break;
      default:
        break;
    }
  };

  return (
    <Overlay onClick={handleOverlayClick} onKeyDown={handleKeyDown} tabIndex={0}>
      <Container>
        <ImageInfo>
          {currentIndex + 1} / {images.length}
        </ImageInfo>

        <ImageContainer $zoom={zoom} $canZoom={zoom < 3}>
          <img
            src={currentImage}
            alt={`${alt} ${currentIndex + 1}`}
            draggable={false}
          />
        </ImageContainer>

        {hasMultiple && (
          <>
            <NavigationButton
              $direction="left"
              onClick={handlePrevious}
              title="Previous image (←)"
            >
              <ChevronLeft />
            </NavigationButton>
            <NavigationButton
              $direction="right"
              onClick={handleNext}
              title="Next image (→)"
            >
              <ChevronRight />
            </NavigationButton>
          </>
        )}

        <Controls>
          <ControlButton
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            title="Zoom out"
          >
            <ZoomOut />
          </ControlButton>
          <ControlButton
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            title="Zoom in"
          >
            <ZoomIn />
          </ControlButton>
        </Controls>

        <CloseButton onClick={onClose} title="Close (Esc)">
          <X />
        </CloseButton>
      </Container>
    </Overlay>
  );
}
