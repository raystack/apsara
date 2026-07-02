import type * as React from 'react';

/**
 * Reference to an element on the page. Accepts a CSS selector, an element,
 * a React ref or a function returning the element. Resolved lazily each time
 * the step activates, so refs and selectors can point at elements that mount
 * after the tour starts.
 */
export type TourTarget =
  | string
  | Element
  | React.RefObject<Element | null>
  | (() => Element | null);

export type TourSide = 'top' | 'right' | 'bottom' | 'left';
export type TourAlign = 'start' | 'center' | 'end';

/**
 * How the popover card travels between steps. The spotlight always cross-fades
 * (it never slides), regardless of this setting.
 * - `fade` (default): the card cross-fades at each target — it fades out, moves
 *   while hidden, and fades in once the target is in view. Best for targets that
 *   are far apart or need scrolling, where a glide reads as jank.
 * - `move`: the card glides smoothly from the previous target to the next,
 *   keeping a sense of spatial continuity. Best when consecutive targets sit
 *   close together.
 */
export type TourTransition = 'fade' | 'move';

export interface TourStep {
  /** Stable identifier reported in events. Falls back to the step index. */
  id?: string;
  /**
   * Element the step is anchored to and spotlights. Omit to render the step
   * centered in the viewport, detached from any element (welcome / finish
   * steps).
   */
  target?: TourTarget;
  /** Rendered by `Tour.Title` and the default popover layout. */
  title?: React.ReactNode;
  /** Rendered by `Tour.Description` and the default popover layout. */
  content?: React.ReactNode;
  /** Side of the target to place the popover on. @default 'bottom' */
  side?: TourSide;
  /** Alignment against the target. @default 'center' */
  align?: TourAlign;
  /** Distance between the target and the popover in pixels. */
  sideOffset?: number;
  /** Element to spotlight when it differs from the popover anchor. */
  spotlightTarget?: TourTarget;
  /** Space between the target and the spotlight edge in pixels. */
  spotlightPadding?: number;
  /** Spotlight corner radius in pixels. */
  spotlightRadius?: number;
  /** Allow pointer interaction with the spotlighted element. */
  spotlightClicks?: boolean;
  /**
   * Hide the dimmed overlay on this step, overriding the tour-level
   * `disableOverlay`. Without the overlay the whole page stays interactive.
   */
  disableOverlay?: boolean;
  /** Element to scroll into view when it differs from the target. */
  scrollTarget?: TourTarget;
  /** Skip scrolling the target into view when the step activates. */
  disableScroll?: boolean;
  /** Arbitrary data echoed back in events and render props. */
  data?: unknown;
}

/** How a tour ended, reported on `tour:end` and `onOpenChange`. */
export type TourEndStatus = 'finished' | 'skipped' | 'closed';

/**
 * `idle` — the tour is closed. `waiting` — the active step's target is not in
 * the DOM yet and the tour is observing for it to appear. `running` — the
 * target is resolved and the step is showing.
 */
export type TourStatus = 'idle' | 'waiting' | 'running';

export type TourEvent =
  | { type: 'tour:start'; index: number; step?: TourStep }
  | { type: 'step:active'; index: number; step: TourStep }
  | { type: 'error:target-not-found'; index: number; step: TourStep }
  | { type: 'tour:end'; index: number; status: TourEndStatus };

/** Imperative tour controls, also available through `useTour`. */
export interface TourActions {
  /** Open the tour, optionally at a given step. The only action that runs while closed. */
  start: (index?: number) => void;
  /** Advance to the next step; finishes the tour past the last step. */
  next: () => void;
  /** Return to the previous step. */
  prev: () => void;
  /** Jump to an arbitrary step. */
  go: (index: number) => void;
  /** End the tour with the `skipped` status. */
  skip: () => void;
  /** End the tour with the `closed` status. */
  stop: () => void;
}

/** Passed to a `Tour.Content` render function while a step is active. */
export interface TourRenderProps {
  step: TourStep;
  index: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  status: TourStatus;
  actions: TourActions;
}
