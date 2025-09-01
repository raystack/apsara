'use client';

import { cx } from 'class-variance-authority';
import { CSSProperties, createContext, useContext } from 'react';
import styles from './skeleton.module.css';

export interface SkeletonProps {
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

const SkeletonContext = createContext<SkeletonProps | null>(null);

interface SkeletonProviderProps extends SkeletonProps {
  children: React.ReactNode;
}

const SkeletonBase = (props: SkeletonProps) => {
  const contextProps = useContext(SkeletonContext);

  const {
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
    containerClassName
  } = { ...contextProps, ...props };

  const skeletonClassName = cx(
    styles.skeleton,
    inline && styles.inline,
    enableAnimation && styles.animate,
    className
  );

  const Container = inline ? 'span' : 'div';
  const defaultWidth = inline ? '50px' : '100%';

  return (
    <Container
      className={containerClassName}
      style={{
        display: inline ? 'inline-block' : 'flex',
        flexDirection: !inline ? 'column' : undefined,
        gap: !inline && count > 1 ? 'var(--rs-space-3)' : undefined,
        ...containerStyle
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={skeletonClassName}
          style={
            {
              width: width ?? defaultWidth,
              height,
              borderRadius,
              '--skeleton-base-color': baseColor,
              '--skeleton-highlight-color': highlightColor,
              '--skeleton-duration': `${duration}s`,
              ...style
            } as CSSProperties
          }
        />
      ))}
    </Container>
  );
};

const Provider = ({ children, ...props }: SkeletonProviderProps) => {
  return (
    <SkeletonContext.Provider value={props}>
      {children}
    </SkeletonContext.Provider>
  );
};

export const Skeleton = Object.assign(SkeletonBase, { Provider });
