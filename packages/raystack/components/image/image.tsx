'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ComponentProps, SyntheticEvent, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '~/hooks';

import styles from './image.module.css';

const image = cva(styles.image, {
  variants: {
    fit: {
      contain: styles['image-contain'],
      cover: styles['image-cover'],
      fill: styles['image-fill']
    },
    radius: {
      none: styles['image-radius-none'],
      small: styles['image-radius-small'],
      medium: styles['image-radius-medium'],
      full: styles['image-radius-full']
    }
  },
  defaultVariants: {
    fit: 'cover',
    radius: 'none'
  }
});

interface ImageProps extends ComponentProps<'img'>, VariantProps<typeof image> {
  fallback?: string;
}

export function Image({
  alt = '',
  className,
  fit,
  radius,
  fallback,
  onError,
  onLoad,
  src,
  width,
  height,
  style,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: ImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const hasFallenBackRef = useRef(false);
  const [loadState, setLoadState] = useState<'static' | 'loading' | 'loaded'>(
    'static'
  );

  useIsomorphicLayoutEffect(() => {
    hasFallenBackRef.current = false;
    const node = imgRef.current;
    // Already-decoded (cached/SSR-painted) images stay visible — no fade.
    setLoadState(node && !node.complete ? 'loading' : 'static');
  }, [src]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoadState(prev => (prev === 'loading' ? 'loaded' : prev));
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallback && !hasFallenBackRef.current) {
      // One-shot: if the fallback itself errors, never re-assign it.
      hasFallenBackRef.current = true;
      event.currentTarget.src = fallback;
    } else {
      // No fallback (or the fallback failed): show the alt/broken rendering
      // instead of holding the img invisible.
      setLoadState('static');
    }
    onError?.(event);
  };

  const imageStyle = {
    width: width,
    height: height,
    ...style
  };

  return (
    <img
      data-slot='image'
      ref={imgRef}
      alt={alt}
      src={src}
      className={image({
        fit,
        radius,
        className: cx(
          loadState === 'loading' && styles['image-loading'],
          loadState === 'loaded' && styles['image-loaded'],
          className
        )
      })}
      onError={handleError}
      onLoad={handleLoad}
      style={imageStyle}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  );
}

Image.displayName = 'Image';
