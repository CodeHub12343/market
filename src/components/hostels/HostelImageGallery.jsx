'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import HostelImageThumbnailCarousel from './HostelImageThumbnailCarousel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;

  @media (min-width: 768px) {
    border-radius: 16px;
  }
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (min-width: 768px) {
    aspect-ratio: 4 / 3;
  }

  @media (min-width: 1024px) {
    aspect-ratio: 1 / 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.$direction === 'left' ? 'left: 12px;' : 'right: 12px;')}
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 5;

  &:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      width: 18px;
      height: 18px;
    }

    ${props => (props.$direction === 'left' ? 'left: 8px;' : 'right: 8px;')}
  }
`;

const LightboxButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 8px;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    top: 8px;
    right: 8px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  z-index: 5;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 5px 10px;
    bottom: 8px;
    left: 8px;
  }
`;

const ThumbnailSection = styled.div`
  padding: 12px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 16px;
  }
`;

// ===== LIGHTBOX STYLES =====
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
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    background: rgba(0, 0, 0, 0.98);
  }
`;

const LightboxContainer = styled.div`
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

const LightboxImageContainer = styled.div`
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

const LightboxControls = styled.div`
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

const LightboxButton2 = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 20;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    top: 16px;
    right: 16px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LightboxNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => (props.$direction === 'left' ? 'left: 16px;' : 'right: 16px;')}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    ${props => (props.$direction === 'left' ? 'left: 12px;' : 'right: 12px;')}

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LightboxCounter = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  z-index: 20;

  @media (max-width: 640px) {
    top: 16px;
    left: 16px;
    font-size: 12px;
  }
`;

export default function HostelImageGallery({
  images = [],
  alt = 'Hostel image',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const currentImage = images[currentIndex] || null;
  const hasMultiple = images.length > 1;

  // Close lightbox on escape key
  useEffect(() => {
    if (lightboxOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setLightboxOpen(false);
        }
      };

      const handleArrow = (e) => {
        if (e.key === 'ArrowLeft') {
          handlePreviousLightbox();
        } else if (e.key === 'ArrowRight') {
          handleNextLightbox();
        }
      };

      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', handleArrow);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('keydown', handleArrow);
        document.body.style.overflow = 'unset';
      };
    }
  }, [lightboxOpen, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousLightbox = () => {
    setLightboxZoom(1);
    handlePrevious();
  };

  const handleNextLightbox = () => {
    setLightboxZoom(1);
    handleNext();
  };

  const handleSelectImage = (index) => {
    setCurrentIndex(index);
  };

  const handleOpenLightbox = () => {
    setLightboxOpen(true);
    setLightboxZoom(1);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setLightboxZoom(1);
  };

  const handleZoomIn = () => {
    setLightboxZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setLightboxZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseLightbox();
    }
  };

  return (
    <>
      <Container>
        <MainImageContainer>
          {currentImage ? (
            <>
              <img src={currentImage} alt={alt} loading="lazy" />

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

              <LightboxButton
                onClick={handleOpenLightbox}
                title="View full screen"
              >
                <Maximize2 />
              </LightboxButton>

              {hasMultiple && (
                <ImageCounter>
                  {currentIndex + 1} / {images.length}
                </ImageCounter>
              )}
            </>
          ) : (
            <ImagePlaceholder>No image available</ImagePlaceholder>
          )}
        </MainImageContainer>

        {hasMultiple && (
          <ThumbnailSection>
            <HostelImageThumbnailCarousel
              images={images}
              selectedIndex={currentIndex}
              onSelectImage={handleSelectImage}
            />
          </ThumbnailSection>
        )}
      </Container>

      {lightboxOpen && currentImage && (
        <Overlay onClick={handleOverlayClick}>
          <LightboxContainer>
            <CloseButton onClick={handleCloseLightbox} title="Close (Esc)">
              <X />
            </CloseButton>

            <LightboxCounter>
              {currentIndex + 1} / {images.length}
            </LightboxCounter>

            <LightboxImageContainer $zoom={lightboxZoom} $canZoom={lightboxZoom < 3}>
              <img src={currentImage} alt={alt} loading="lazy" />
            </LightboxImageContainer>

            {hasMultiple && (
              <>
                <LightboxNavButton
                  $direction="left"
                  onClick={handlePreviousLightbox}
                  title="Previous (←)"
                >
                  <ChevronLeft />
                </LightboxNavButton>
                <LightboxNavButton
                  $direction="right"
                  onClick={handleNextLightbox}
                  title="Next (→)"
                >
                  <ChevronRight />
                </LightboxNavButton>
              </>
            )}

            <LightboxControls>
              <LightboxButton2
                onClick={handleZoomOut}
                disabled={lightboxZoom <= 1}
                title="Zoom out"
              >
                <ZoomOut />
              </LightboxButton2>
              <LightboxButton2 disabled title={`Zoom: ${Math.round(lightboxZoom * 100)}%`}>
                {Math.round(lightboxZoom * 100)}%
              </LightboxButton2>
              <LightboxButton2
                onClick={handleZoomIn}
                disabled={lightboxZoom >= 3}
                title="Zoom in"
              >
                <ZoomIn />
              </LightboxButton2>
            </LightboxControls>
          </LightboxContainer>
        </Overlay>
      )}
    </>
  );
}
