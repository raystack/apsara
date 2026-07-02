'use client';

import { cx } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

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

/**
 * Whether two rects match within half a pixel on every side. Shared with the
 * root's reveal loop, which feeds it `DOMRect`s (`x`/`y` mirror `left`/`top`).
 */
export function rectsEqual(a: SpotlightRect, b: SpotlightRect) {
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

/**
 * Tracks an element's viewport rect with a frame loop, so the spotlight
 * follows through scrolling (any container), resizes and CSS animations — e.g.
 * a dialog's entry transform, which fires no scroll/resize events. Re-renders
 * only when the rect actually changes.
 *
 * When the element changes the previous rect is intentionally kept until the
 * next one is measured, so `move` mode glides between steps instead of blinking
 * and `fade` mode never collapses the hole to `0,0` mid-swap. A disconnected
 * element is skipped (rect frozen at its last good value) rather than collapsed,
 * which would flash the whole screen dim.
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

/**
 * Cross-fade controller for the spotlight cutout. It holds the currently
 * displayed element (so its hole stays put while it closes) and swaps to the
 * next target only once the tour reports it `revealed`. Because `revealed`
 * already waits out the close (see the root's reveal gate), the reposition lands
 * while the cutout is covered by the dim and is never seen — the hole then fades
 * back open on the exact frame the popover reveals. A vanished target
 * (`target == null`) is dropped at once, so no orphaned hole lingers.
 *
 * `shown` is whether the cutout should currently be open (clear); when it is
 * false the cover patch dims the hole closed while the surrounding dim persists.
 */
function useSpotlightFade(
  target: Element | null,
  { fade, revealed }: { fade: boolean; revealed: boolean }
) {
  const [displayed, setDisplayed] = useState<Element | null>(target);

  useEffect(() => {
    // Adopt the target when it is settled (revealed), when fade is off, when it
    // has gone (null), or when nothing is shown yet (first step — it mounts
    // hidden and then fades in). Otherwise keep the old hole to fade it out.
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
  // The spotlight cutout always cross-fades between targets (never slides),
  // whatever the tour's `transition` mode — that setting only affects the
  // popover. The dim backdrop itself never disappears once the tour is running;
  // only the cutout closes and reopens.
  const fade = !reducedMotion;

  // A step is "targeted" when it points at or spotlights an element. Detached
  // steps (welcome/finish) dim the whole viewport with no cutout.
  const targeted =
    step != null && (step.target != null || step.spotlightTarget != null);

  const { displayed, shown } = useSpotlightFade(
    open && !disabled && targeted ? spotlightElement : null,
    { fade, revealed }
  );
  const rect = useSpotlightRect(displayed);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The dim fades in once, when the first step reveals, and then persists for
  // the rest of the tour — between steps only the cutout closes and reopens, so
  // the backdrop never flashes away. Reset on close so it fades in again on the
  // next open.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!open || disabled) {
      setEntered(false);
      return;
    }
    if (revealed) setEntered(true);
  }, [open, disabled, revealed]);

  if (!open || !mounted || disabled || !step) return null;
  // A targeted step with no measured rect is still resolving (or its target
  // just unmounted). Requiring the *live* target (`spotlightElement`) to exist
  // is what prevents an orphaned dim from lingering after a target disappears.
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

  // Whether the cutout should currently be open (clear). Between steps it
  // closes — a cover patch dims the hole shut while the backdrop stays put — and
  // reopens once the next target settles. Detached steps have no cutout.
  const holeOpen = fade ? shown : true;

  return createPortal(
    <div
      aria-hidden
      data-status={status}
      data-entered={entered ? 'true' : 'false'}
      data-hole-open={holeOpen ? 'true' : 'false'}
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
            : // Detached step: collapse the hole so the shadow dims everything.
              { left: '50%', top: '50%', width: 0, height: 0 }
        }
      />
      {hole && (
        // Fills the cutout with the same dim so the hole can fade shut and back
        // open without the surrounding backdrop ever disappearing.
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
          {/* Hit strips block clicks around the hole. The strip over the hole
              is dropped when spotlightClicks lets clicks reach the target. */}
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
