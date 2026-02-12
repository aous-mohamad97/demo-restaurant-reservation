import React, { useId } from 'react';

const STAR_PATH =
  'M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showValue = false,
}) => {
  const halfStarId = useId();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const sizeClass = sizeClasses[size];

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${sizeClass} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className={`${sizeClass} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={halfStarId}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity={1} />
            </linearGradient>
          </defs>
          <path fill={`url(#${halfStarId})`} d={STAR_PATH} />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${sizeClass} text-gray-300 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
      )}
    </div>
  );
};

export default StarRating;
