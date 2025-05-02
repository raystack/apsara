import { CSSProperties } from 'react';
import { clsx } from 'clsx';
import styles from './skeleton.module.css';
import { Flex } from '../flex';

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
  containerStyle?: CSSProperties;
  containerClassName?: string;
}

export const Skeleton = ({
  baseColor,
  highlightColor,
  width = "100%",
  height = 'var(--rs-space-4)',
  borderRadius = 'var(--rs-radius-2)',
  inline = false,
  duration = 1.5,
  count = 1,
  enableAnimation = true,
  style,
  className,
  containerStyle,
  containerClassName,
}: SkeletonStyleProps) => {
  const skeletonClassName = clsx(
    styles.skeleton,
    enableAnimation && styles.animate,
    className
  );

  return (
    <Flex
      align="center"
      className={containerClassName} 
      style={{
        display: inline ? 'inline-block' : 'block',
        ...containerStyle
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={skeletonClassName}
          style={{
            width,
            height,
            borderRadius,
            '--skeleton-base-color': baseColor,
            '--skeleton-highlight-color': highlightColor,
            '--skeleton-duration': `${duration}s`,
            ...style
          } as CSSProperties}
        />
      ))}
    </Flex>
  );
}; 