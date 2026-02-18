'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
`

const MainImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  ${props => props.$position === 'left' ? 'left: 12px;' : 'right: 12px;'}

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #1a1a1a;
  }
`

const ImageCounter = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
`

const Thumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 2px;
  }
`

const Thumbnail = styled.button`
  min-width: 80px;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  border: 2px solid ${props => props.$active ? '#1a1a1a' : '#e0e0e0'};
  padding: 0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  scroll-snap-align: start;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: #1a1a1a;
  }
`

const ImageCount = styled.div`
  text-align: center;
  padding: 8px;
  background: #f9f9f9;
  font-size: 12px;
  color: #666;
  font-weight: 600;
`

export function RoommateGalleryCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <CarouselContainer>
        <MainImage>
          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
            <div>No images available</div>
          </div>
        </MainImage>
      </CarouselContainer>
    )
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index)
  }

  const currentImage = typeof images[currentIndex] === 'string' 
    ? images[currentIndex] 
    : images[currentIndex]?.url || '/default-avatar.svg'

  return (
    <div>
      <CarouselContainer>
        <MainImage>
          <img
            src={currentImage}
            alt={`Image ${currentIndex + 1}`}
            onError={(e) => {
              e.target.src = '/default-avatar.svg'
            }}
          />
          {images.length > 1 && (
            <>
              <NavigationButton $position="left" onClick={handlePrevious}>
                <ChevronLeft />
              </NavigationButton>
              <NavigationButton $position="right" onClick={handleNext}>
                <ChevronRight />
              </NavigationButton>
              <ImageCounter>
                {currentIndex + 1} / {images.length}
              </ImageCounter>
            </>
          )}
        </MainImage>
      </CarouselContainer>

      {images.length > 1 && (
        <>
          <Thumbnails>
            {images.map((image, index) => {
              const imageUrl = typeof image === 'string' ? image : image?.url || '/default-avatar.svg'
              return (
                <Thumbnail
                  key={index}
                  $active={index === currentIndex}
                  onClick={() => handleThumbnailClick(index)}
                  title={`Image ${index + 1}`}
                >
                  <img
                    src={imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => {
                      e.target.src = '/default-avatar.svg'
                    }}
                  />
                </Thumbnail>
              )
            })}
          </Thumbnails>
          <ImageCount>
            {images.length} image{images.length !== 1 ? 's' : ''}
          </ImageCount>
        </>
      )}
    </div>
  )
}
