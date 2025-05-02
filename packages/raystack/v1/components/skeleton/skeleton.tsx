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
  containerStyle?: CSSProperties;
  containerClassName?: string;
}

export const Skeleton = ({
  baseColor,
  highlightColor,
  width,
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
    inline && styles.inline,
    enableAnimation && styles.animate,
    className
  );

  const Container = inline ? 'span' : 'div';

  const defaultWidth = inline ? '100px' : '100%';

  return (
    <Container
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
            width: width ?? defaultWidth,
            height,
            borderRadius,
            marginBottom: i !== count - 1 && !inline ? 'var(--rs-space-3)' : undefined,
            '--skeleton-base-color': baseColor,
            '--skeleton-highlight-color': highlightColor,
            '--skeleton-duration': `${duration}s`,
            ...style
          } as CSSProperties}
        />
      ))}
    </Container>
  );
}; 