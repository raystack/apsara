'use client';

import { cx } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';

export interface TourOverlayProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Space between the target and the spotlight edge in pixels; steps can
   * override. @default 4
   */
  spotlightPadding?: number;
  /** Spotlight corner radius in pixels; steps can override. @default 6 */
  spotlightRadius?: number;
  /**
   * Allow pointer interaction with the spotlighted element; steps can
   * override. @default false
   */
  spotlightClicks?: boolean;
}

interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function rectsEqual(a: SpotlightRect, b: SpotlightRect) {
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

/**
 * Tracks an element's viewport rect with a frame loop, so the spotlight
 * follows through scrolling (any container), resizes and CSS animations —
 * e.g. a dialog's entry transform, which fires no scroll/resize events.
 * Re-renders only when the rect actually changes.
 */
function useSpotlightRect(element: Element | null): SpotlightRect | null {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!element) {
      setRect(null);
      return;
    }
    let frame = 0;
    const track = () => {
      const next = element.getBoundingClientRect();
      setRect(prev =>
        prev && rectsEqual(prev, next)
          ? prev
          : { x: next.x, y: next.y, width: next.width, height: next.height }
      );
      frame = requestAnimationFrame(track);
    };
    track();
    return () => cancelAnimationFrame(frame);
  }, [element]);

  return element ? rect : null;
}

export function TourOverlay({
  spotlightPadding = 4,
  spotlightRadius = 6,
  spotlightClicks: spotlightClicksProp = false,
  className,
  ...rest
}: TourOverlayProps) {
  const {
    open,
    step,
    status,
    spotlightElement,
    disableOverlay: disableOverlayTour
  } = useTourContext('Tour.Overlay');
  const disabled = step?.disableOverlay ?? disableOverlayTour;
  const rect = useSpotlightRect(open && !disabled ? spotlightElement : null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted || disabled) return null;

  const padding = step?.spotlightPadding ?? spotlightPadding;
  const radius = step?.spotlightRadius ?? spotlightRadius;
  const spotlightClicks = step?.spotlightClicks ?? spotlightClicksProp;

  const hole = rect
    ? {
        x: rect.x - padding,
        y: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    : null;

  return createPortal(
    <div
      aria-hidden
      data-status={status}
      className={cx(styles.overlay, className)}
      {...rest}
    >
      <div
        className={styles.spotlight}
        style={
          hole
            ? {
                left: hole.x,
                top: hole.y,
                width: hole.width,
                height: hole.height,
                borderRadius: radius
              }
            : // No spotlight (detached step or target still resolving):
              // collapse the hole so the shadow dims the whole viewport.
              { left: '50%', top: '50%', width: 0, height: 0 }
        }
      />
      {hole ? (
        <>
          <div
            className={styles.overlayHit}
            style={{ top: 0, left: 0, right: 0, height: Math.max(hole.y, 0) }}
          />
          <div
            className={styles.overlayHit}
            style={{
              top: hole.y,
              left: 0,
              width: Math.max(hole.x, 0),
              height: hole.height
            }}
          />
          <div
            className={styles.overlayHit}
            style={{
              top: hole.y,
              left: hole.x + hole.width,
              right: 0,
              height: hole.height
            }}
          />
          <div
            className={styles.overlayHit}
            style={{ top: hole.y + hole.height, left: 0, right: 0, bottom: 0 }}
          />
          {!spotlightClicks && (
            <div
              className={styles.overlayHit}
              style={{
                top: hole.y,
                left: hole.x,
                width: hole.width,
                height: hole.height
              }}
            />
          )}
        </>
      ) : (
        <div className={styles.overlayHit} style={{ inset: 0 }} />
      )}
    </div>,
    document.body
  );
}

TourOverlay.displayName = 'Tour.Overlay';
