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
    <MeterPrimitive.Track className={cx(styles.track, className)} {...props}>
      <MeterPrimitive.Indicator className={styles.indicator} />
      {children}
    </MeterPrimitive.Track>
  );
}

MeterTrack.displayName = 'Meter.Track';
