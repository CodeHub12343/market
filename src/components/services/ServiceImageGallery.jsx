'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import ImageThumbnailCarousel from './ImageThumbnailCarousel';

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

export default function ServiceImageGallery({
  images = [],
  alt = 'Service image',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[currentIndex] || null;
  const hasMultiple = images.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (index) => {
    setCurrentIndex(index);
  };

  const handleOpenLightbox = () => {
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <Container>
        <MainImageContainer>
          {currentImage ? (
            <>
              <img src={currentImage} alt={alt} />

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
            <ImageThumbnailCarousel
              images={images}
              selectedIndex={currentIndex}
              onSelectImage={handleSelectImage}
            />
          </ThumbnailSection>
        )}
      </Container>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={currentIndex}
          onClose={handleCloseLightbox}
          alt={alt}
        />
      )}
    </>
  );
}
