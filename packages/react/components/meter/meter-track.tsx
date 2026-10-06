'use client';

import { Meter as MeterPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useContext } from 'react';
import styles from './meter.module.css';
import { MeterContext } from './meter-root';

export function MeterTrack({
  className,
  children,
  ...props
}: MeterPrimitive.Track.Props) {
  const { variant } = useContext(MeterContext);

  if (variant === 'circular') {
    return (
      <MeterPrimitive.Track
        className={cx(styles.circularSvg, className)}
        data-slot='meter-track'
        {...props}
        render={({ children: trackChildren, ...trackProps }) => (
          <svg viewBox='0 0 72 72' {...trackProps}>
            <circle
              className={styles.circularTrackCircle}
              data-slot='meter-track-circle'
            />
            {trackChildren}
          </svg>
        )}
      >
        <MeterPrimitive.Indicator
          render={() => (
            <circle
              className={styles.circularIndicatorCircle}
              data-slot='meter-indicator'
            />
          )}
        />
        {children}
      </MeterPrimitive.Track>
    );
  }

  return (
    <MeterPrimitive.Track
      className={cx(styles.track, className)}
      data-slot='meter-track'
      {...props}
    >
      <MeterPrimitive.Indicator
        className={styles.indicator}
        style={{ width: '100%' }}
        data-slot='meter-indicator'
      />
      {children}
    </MeterPrimitive.Track>
  );
}

MeterTrack.displayName = 'Meter.Track';
