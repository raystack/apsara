'use client';

import { cx } from 'class-variance-authority';
import {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import { FADE_OUT_MS, rectsEqual, type SpotlightRect } from './utils';

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

  const active = open && !disabled && step != null;
  // Requiring the live `spotlightElement` prevents an orphaned dim after a target unmounts.
  const orphaned =
    active && targeted && (!spotlightElement || !displayed || !rect);

  // Frozen copy of the last-painted dim so it can fade out in place after close.
  const exitFrameRef = useRef<{
    hole: { x: number; y: number; width: number; height: number } | null;
    radius: number;
  } | null>(null);

  const [exiting, setExiting] = useState(false);
  // Tracks whether we last painted a real, live spotlight (not an orphaned
  // gap) — only that state has a valid frame worth fading out from.
  const wasShowingRef = useRef(false);
  useEffect(() => {
    if (active && !orphaned) {
      wasShowingRef.current = true;
      setExiting(false);
      return;
    }
    if (orphaned) {
      // Mid-tour orphan: hide instantly (no stale frame to fade from later).
      wasShowingRef.current = false;
      setExiting(false);
      return;
    }
    if (!wasShowingRef.current) return;
    wasShowingRef.current = false;
    if (reducedMotion) return; // exits are instant under reduced motion
    setExiting(true);
    const timer = setTimeout(() => setExiting(false), FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [active, orphaned, reducedMotion]);

  if (!mounted) return null;
  if (!active) {
    // Closing: hold the dim for one fade, mirroring the entry.
    if (!exiting || exitFrameRef.current == null) return null;
    const frame = exitFrameRef.current;
    return createPortal(
      <div
        {...rest}
        aria-hidden
        data-status={status}
        data-entered='false'
        data-hole-open='true'
        className={cx(styles.overlay, className)}
      >
        <div
          className={styles.spotlight}
          style={
            frame.hole
              ? {
                  left: frame.hole.x,
                  top: frame.hole.y,
                  width: frame.hole.width,
                  height: frame.hole.height,
                  borderRadius: frame.radius
                }
              : { left: '50%', top: '50%', width: 0, height: 0 }
          }
        />
      </div>,
      document.body
    );
  }
  if (orphaned) return null;

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

  exitFrameRef.current = { hole, radius };

  const holeOpen = fade ? shown : true;

  return createPortal(
    // `rest` spread first so consumers can't clobber the chrome attributes below.
    <div
      {...rest}
      aria-hidden
      data-status={status}
      data-entered={entered ? 'true' : 'false'}
      data-hole-open={holeOpen ? 'true' : 'false'}
      className={cx(styles.overlay, className)}
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
            : { left: '50%', top: '50%', width: 0, height: 0 }
        }
      />
      {hole && (
        <div
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
        <div className={styles.overlayHit} style={{ inset: 0 }} />
      )}
    </div>,
    document.body
  );
}

TourOverlay.displayName = 'Tour.Overlay';
