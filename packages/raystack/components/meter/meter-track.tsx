'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ElementRef, forwardRef, useContext } from 'react';
import styles from './meter.module.css';
import { MeterContext } from './meter-root';

export const MeterTrack = forwardRef<
  ElementRef<typeof MeterPrimitive.Track>,
  MeterPrimitive.Track.Props
>(({ className, children, ...props }, ref) => {
  const { variant } = useContext(MeterContext);

  if (variant === 'circular') {
    return (
      <MeterPrimitive.Track
        ref={ref}
        className={cx(styles.circularSvg, className)}
        {...props}
        render={({ children: trackChildren, ...trackProps }) => (
          <svg viewBox='0 0 72 72' {...trackProps}>
            <circle className={styles.circularTrackCircle} />
            {trackChildren}
          </svg>
        )}
      >
        <MeterPrimitive.Indicator
          render={() => <circle className={styles.circularIndicatorCircle} />}
        />
        {children}
      </MeterPrimitive.Track>
    );
  }

  return (
    <MeterPrimitive.Track
      ref={ref}
      className={cx(styles.track, className)}
      {...props}
    >
      <MeterPrimitive.Indicator className={styles.indicator} />
      {children}
    </MeterPrimitive.Track>
  );
});

MeterTrack.displayName = 'MeterTrack';
