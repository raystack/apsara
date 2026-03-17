'use client';

import { Progress as ProgressPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useContext } from 'react';
import styles from './progress.module.css';
import { ProgressContext } from './progress-root';

export function ProgressTrack({
  className,
  children,
  ...props
}: ProgressPrimitive.Track.Props) {
  const { variant } = useContext(ProgressContext);

  if (variant === 'circular') {
    return (
      <ProgressPrimitive.Track
        className={cx(styles.circularSvg, className)}
        {...props}
        render={({ children: trackChildren, ...trackProps }) => (
          <svg viewBox='0 0 72 72' {...trackProps}>
            <circle className={styles.circularTrackCircle} />
            {trackChildren}
          </svg>
        )}
      >
        <ProgressPrimitive.Indicator
          render={() => <circle className={styles.circularIndicatorCircle} />}
        />
        {children}
      </ProgressPrimitive.Track>
    );
  }

  return (
    <ProgressPrimitive.Track className={cx(styles.track, className)} {...props}>
      <ProgressPrimitive.Indicator className={styles.indicator} />
      {children}
    </ProgressPrimitive.Track>
  );
}

ProgressTrack.displayName = 'Progress.Track';
