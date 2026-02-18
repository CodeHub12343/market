'use client';

import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Container = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 0 4px;
  margin-top: 12px;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 0;
    margin-top: 8px;
  }
`;

const ScrollContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 4px 0;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Thumbnail = styled.button`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid ${props => (props.$active ? '#1a1a1a' : '#f0f0f0')};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: #1a1a1a;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const NavButton = styled.button`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: #ffffff;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export default function HostelImageThumbnailCarousel({
  images = [],
  selectedIndex = 0,
  onSelectImage = () => {},
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Initial check and on mount
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Auto-scroll to selected thumbnail
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedThumbnail = scrollContainerRef.current.children[selectedIndex];
      if (selectedThumbnail) {
        setTimeout(() => {
          selectedThumbnail.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
          checkScroll();
        }, 50);
      }
    }
  }, [selectedIndex]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 100;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (!images || images.length <= 1) {
    return null;
  }

  return (
    <Container>
      <NavButton
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        title="Scroll left"
      >
        <ChevronLeft />
      </NavButton>

      <ScrollContainer ref={scrollContainerRef} onScroll={checkScroll}>
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            $active={index === selectedIndex}
            onClick={() => onSelectImage(index)}
            title={`Image ${index + 1}`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </Thumbnail>
        ))}
      </ScrollContainer>

      <NavButton
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        title="Scroll right"
      >
        <ChevronRight />
      </NavButton>
    </Container>
  );
}
