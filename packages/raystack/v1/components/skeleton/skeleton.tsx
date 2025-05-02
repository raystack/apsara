import { CSSProperties } from 'react';
import styles from './skeleton.module.css';

export interface SkeletonStyleProps {
  baseColor?: string;
  highlightColor?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  inline?: boolean;
  duration?: number;
  direction?: 'ltr' | 'rtl';
  enableAnimation?: boolean;
  count?: number;
  style?: CSSProperties;
  className?: string;
}

export const Skeleton = ({
  width,
  height,
  borderRadius = 'var(--rs-radius-1)',
  inline = false,
  count = 1,
  enableAnimation = true,
  style,
  className,
}: SkeletonStyleProps) => {
  const skeletonClassName = [
    styles.skeleton,
    enableAnimation && styles.animate,
    className
  ].filter(Boolean).join(' ');

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
            ...style
          }}
        />
      ))}
    </>
  );
}; 