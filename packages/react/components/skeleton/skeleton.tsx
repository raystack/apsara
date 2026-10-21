'use client';

import { cx } from 'class-variance-authority';
import { CSSProperties, createContext, ReactNode, useContext } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import styles from './skeleton.module.css';

export interface SkeletonProps {
  baseColor?: string;
  highlightColor?: string;
  width?: string | number;
  height?: string | number;
  /** Corner radius for this skeleton only. Overrides the theme's `radius`. */
  radius?: Radius;
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

export interface SkeletonProviderProps extends SkeletonProps {
  children: ReactNode;
}

const SkeletonBase = (props: SkeletonProps) => {
  const contextProps = useContext(SkeletonContext);

  const {
    baseColor,
    highlightColor,
    width,
    height = 'var(--rs-space-4)',
    radius,
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
    radiusStyle({ radius }),
    className
  );

  const Container = inline ? 'span' : 'div';
  const defaultWidth = inline ? '50px' : '100%';

  return (
    <Container
      className={containerClassName}
      aria-hidden='true'
      data-slot='skeleton'
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
          data-slot='skeleton-item'
          style={
            {
              width: width ?? defaultWidth,
              height,
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

SkeletonBase.displayName = 'Skeleton';

const Provider = ({ children, ...props }: SkeletonProviderProps) => {
  return <SkeletonContext value={props}>{children}</SkeletonContext>;
};

Provider.displayName = 'Skeleton.Provider';

export const Skeleton = Object.assign(SkeletonBase, { Provider });
