import { CSSProperties } from 'react';
import { clsx } from 'clsx';
import styles from './skeleton.module.css';

export interface SkeletonStyleProps {
  baseColor?: string;
  highlightColor?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  inline?: boolean;
  duration?: number;
  enableAnimation?: boolean;
  count?: number;
  style?: CSSProperties;
  className?: string;
}

export const Skeleton = ({
  baseColor,
  highlightColor,
  width = "100%",
  height = 'var(--rs-space-2)',
  borderRadius = 'var(--rs-radius-2)',
  inline = false,
  duration = 1.5,
  count = 1,
  enableAnimation = true,
  style,
  className,
}: SkeletonStyleProps) => {
  const skeletonClassName = clsx(
    styles.skeleton,
    enableAnimation && styles.animate,
    className
  );

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={skeletonClassName}
          style={{
            width,
            height,
            borderRadius,
            display: inline ? 'inline-block' : 'block',
            '--skeleton-base-color': baseColor,
            '--skeleton-highlight-color': highlightColor,
            '--skeleton-duration': `${duration}s`,
            ...style
          } as CSSProperties}
        />
      ))}
    </>
  );
}; 