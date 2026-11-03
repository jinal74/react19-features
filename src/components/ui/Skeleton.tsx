import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable Dark-Theme Skeleton Component:
 * Provides smooth pulsing placeholder UI during Suspense fallbacks.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius,
  style,
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};
