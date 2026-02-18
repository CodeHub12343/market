'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: ${props => props.$isLoading ? 'loading 1.5s infinite' : 'none'};

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const StyledImage = styled(Image)`
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isLoaded ? 1 : 0.7};
`;

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  quality = 75,
  objectFit = 'cover',
  objectPosition = 'center',
  sizes,
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);
  const [shouldLoadHighRes, setShouldLoadHighRes] = useState(priority);

  // ✅ Intersection Observer for lazy loading high-res
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadHighRes(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // ✅ Fallback for failed images
  if (error) {
    return (
      <ImageWrapper
        ref={containerRef}
        style={{
          aspectRatio: `${width} / ${height}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
        }}
      >
        <span style={{ color: '#999', fontSize: '14px' }}>
          Image unavailable
        </span>
      </ImageWrapper>
    );
  }

  return (
    <ImageWrapper ref={containerRef} style={{ aspectRatio: `${width} / ${height}` }}>
      <Skeleton $isLoading={!isLoaded} />
      
      {shouldLoadHighRes && (
        <StyledImage
          src={src || '/placeholder.png'}
          alt={alt}
          fill
          quality={quality}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          style={{
            objectFit,
            objectPosition,
          }}
          {...props}
        />
      )}
    </ImageWrapper>
  );
}
