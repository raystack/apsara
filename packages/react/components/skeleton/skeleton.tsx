'use client';

import { cx } from 'class-variance-authority';
import { CSSProperties, createContext, ReactNode, useContext } from 'react';
import { type Radius, radiusStyle } from '../../shared/radius';
import styles from './skeleton.module.css';

export interface SkeletonProps {
  /**
   * Background color of each item.
   * @default "var(--rs-color-background-base-primary-hover)"
   */
  baseColor?: string;
  /**
   * Color of the shimmer.
   * @default "var(--rs-color-background-base-primary)"
   */
  highlightColor?: string;
  /** Width of each item. Defaults to `50px` when `inline`, otherwise `100%`. */
  width?: string | number;
  /**
   * Height of each item.
   * @default "var(--rs-space-4)"
   */
  height?: string | number;
  /** Corner radius for this skeleton only. Defaults to the theme's `radius`. */
  radius?: Radius;
  /**
   * Whether the items render as `inline-block` inside a `span`.
   * @default false
   */
  inline?: boolean;
  /**
   * Duration of one shimmer cycle, in seconds.
   * @default 1.5
   */
  duration?: number;
  /**
   * Whether the shimmer animation is off.
   * @default false
   */
  disableAnimation?: boolean;
  /**
   * Number of items to render.
   * @default 1
   */
  count?: number;
  /** Inline styles for each item. */
  style?: CSSProperties;
  /** CSS class applied to each item. */
  className?: string;
  /** Inline styles for the container: a `div`, or a `span` when `inline`. */
  containerStyle?: CSSProperties;
  /** CSS class applied to the container: a `div`, or a `span` when `inline`. */
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
    disableAnimation = false,
    style,
    className,
    containerStyle,
    containerClassName
  } = { ...contextProps, ...props };

  const skeletonClassName = cx(
    styles.skeleton,
    inline && styles.inline,
    !disableAnimation && styles.animate,
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
