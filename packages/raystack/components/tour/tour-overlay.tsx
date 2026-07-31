'use client';

import { cx } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import { rectsEqual, type SpotlightRect } from './utils';

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

function useSpotlightRect(element: Element | null): SpotlightRect | null {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!element) {
      setRect(null);
      return;
    }
    let frame = 0;
    const track = () => {
      if (element.isConnected) {
        const next = element.getBoundingClientRect();
        setRect(prev =>
          prev && rectsEqual(prev, next)
            ? prev
            : { x: next.x, y: next.y, width: next.width, height: next.height }
        );
      }
      frame = requestAnimationFrame(track);
    };
    track();
    return () => cancelAnimationFrame(frame);
  }, [element]);

  return element ? rect : null;
}

function useSpotlightFade(
  target: Element | null,
  { fade, revealed }: { fade: boolean; revealed: boolean }
) {
  const [displayed, setDisplayed] = useState<Element | null>(target);

  useEffect(() => {
    if (!fade || target == null || revealed || displayed == null) {
      setDisplayed(target);
    }
  }, [target, revealed, fade, displayed]);

  const shown = fade
    ? revealed && displayed === target && target != null
    : true;
  return { displayed: fade ? displayed : target, shown };
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
    disableOverlay: disableOverlayTour,
    revealed
  } = useTourContext('Tour.Overlay');
  const disabled = step?.disableOverlay ?? disableOverlayTour;
  const reducedMotion = usePrefersReducedMotion();
  const fade = !reducedMotion;

  const targeted =
    step != null && (step.target != null || step.spotlightTarget != null);

  const { displayed, shown } = useSpotlightFade(
    open && !disabled && targeted ? spotlightElement : null,
    { fade, revealed }
  );
  const rect = useSpotlightRect(displayed);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!open || disabled) {
      setEntered(false);
      return;
    }
    if (revealed) setEntered(true);
  }, [open, disabled, revealed]);

  if (!open || !mounted || disabled || !step) return null;
  // Requiring the live `spotlightElement` prevents an orphaned dim after a target unmounts.
  if (targeted && (!spotlightElement || !displayed || !rect)) return null;

  const padding = step.spotlightPadding ?? spotlightPadding;
  const radius = step.spotlightRadius ?? spotlightRadius;
  const spotlightClicks = step.spotlightClicks ?? spotlightClicksProp;

  const hole =
    targeted && rect
      ? {
          x: rect.x - padding,
          y: rect.y - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
        }
      : null;

  const holeOpen = fade ? shown : true;

  return createPortal(
    // `rest` spread first so consumers can't clobber the chrome attributes below.
    <div
      {...rest}
      aria-hidden
      data-slot='tour-overlay'
      data-status={status}
      data-entered={entered ? 'true' : 'false'}
      data-hole-open={holeOpen ? 'true' : 'false'}
      className={cx(styles.overlay, className)}
    >
      <div
        data-slot='tour-spotlight'
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
            : { left: '50%', top: '50%', width: 0, height: 0 }
        }
      />
      {hole && (
        <div
          data-slot='tour-spotlight-cover'
          className={styles.spotlightCover}
          style={{
            left: hole.x,
            top: hole.y,
            width: hole.width,
            height: hole.height,
            borderRadius: radius
          }}
        />
      )}
      {hole ? (
        <>
          {/* Hit strips block clicks around the hole; the center strip is
              dropped when spotlightClicks lets clicks through. */}
          <div
            data-slot='tour-overlay-hit'
            className={styles.overlayHit}
            style={{ top: 0, left: 0, right: 0, height: Math.max(hole.y, 0) }}
          />
          <div
            data-slot='tour-overlay-hit'
            className={styles.overlayHit}
            style={{
              top: hole.y,
              left: 0,
              width: Math.max(hole.x, 0),
              height: hole.height
            }}
          />
          <div
            data-slot='tour-overlay-hit'
            className={styles.overlayHit}
            style={{
              top: hole.y,
              left: hole.x + hole.width,
              right: 0,
              height: hole.height
            }}
          />
          <div
            data-slot='tour-overlay-hit'
            className={styles.overlayHit}
            style={{ top: hole.y + hole.height, left: 0, right: 0, bottom: 0 }}
          />
          {!(spotlightClicks && holeOpen) && (
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
        <div
          data-slot='tour-overlay-hit'
          className={styles.overlayHit}
          style={{ inset: 0 }}
        />
      )}
    </div>,
    document.body
  );
}

TourOverlay.displayName = 'Tour.Overlay';
