import React, { useState } from 'react';
import { PLACEHOLDER_IMAGE_URL } from '../../constants';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  variant?: 'card' | 'hero';
  placeholderUrl?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  variant = 'card',
  placeholderUrl = PLACEHOLDER_IMAGE_URL,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderUrl;
  };

  if (variant === 'hero') {
    const currentImage = images[currentIndex % images.length];
    return (
      <div className="relative">
        <div className="relative h-48 sm:h-64 md:h-80">
          <img
            src={currentImage}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {hasMultiple && variant === 'hero' && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 sm:p-3 bg-gray-50">
            {images.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative h-16 sm:h-20 rounded-md overflow-hidden border ${
                  idx === currentIndex ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
                }`}
                aria-label={`Thumbnail ${idx + 1}`}
              >
                <img src={img} alt={`${alt} thumbnail ${idx + 1}`} className="w-full h-full object-cover" onError={handleImageError} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Card variant: fixed height so layout is stable when images load or fail
  return (
    <div className="w-full sm:w-64 h-full flex-shrink-0 relative bg-gray-100">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {(images.length > 0 ? images : [placeholderUrl]).map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 min-w-full">
              <img
                src={image}
                alt={`${alt} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="eager"
              />
            </div>
          ))}
        </div>
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
