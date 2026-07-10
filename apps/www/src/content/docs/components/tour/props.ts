import type React from 'react';

type TourTarget =
  | string
  | Element
  | React.RefObject<Element | null>
  | (() => Element | null);

export interface TourProps {
  /** Ordered list of steps that make up the tour. */
  steps: TourStep[];

  /** Whether the tour is currently open (controlled). */
  open?: boolean;

  /**
   * Whether the tour is initially open (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /** Called when the tour opens or closes. `status` is set when closing. */
  onOpenChange?: (
    open: boolean,
    details: { status?: 'finished' | 'skipped' | 'closed' }
  ) => void;

  /** Active step index (controlled). */
  stepIndex?: number;

  /**
   * Initially active step when uncontrolled.
   * @defaultValue 0
   */
  defaultStepIndex?: number;

  /** Called when the active step changes. */
  onStepChange?: (index: number, step: TourStep) => void;

  /** Receives every tour lifecycle event. */
  onEvent?: (event: TourEvent) => void;

  /** A ref populated with the imperative tour controls (`start`, `next`, `prev`, `go`, `skip`, `stop`). */
  actionsRef?: React.RefObject<TourActions | null>;

  /**
   * How long to wait for a step target to appear in the DOM before giving up, in ms.
   * @defaultValue 5000
   */
  targetTimeout?: number;

  /**
   * What to do when a step target cannot be found: skip to the next step or stop the tour.
   * @defaultValue 'skip'
   */
  targetNotFound?: 'skip' | 'stop';

  /**
   * How the popover card travels between steps. `fade` cross-fades it at each
   * target; `move` glides it smoothly from one target to the next. The spotlight
   * always cross-fades regardless — it never slides.
   * @defaultValue 'fade'
   */
  transition?: 'fade' | 'move';

  /**
   * Hide the dimmed overlay for the whole tour — only the popover shows and the page stays interactive.
   * @defaultValue false
   */
  disableOverlay?: boolean;

  /** Tour UI. Defaults to `<Tour.Overlay />` + `<Tour.Content />`. */
  children?: React.ReactNode;
}

export interface TourStep {
  /** Stable identifier reported in events. Falls back to the step index. */
  id?: string;

  /** Element to anchor and spotlight. Omit for a centered, detached step. */
  target?: TourTarget;

  /** Rendered by `Tour.Title` and the default layout. */
  title?: React.ReactNode;

  /** Rendered by `Tour.Description` and the default layout. */
  content?: React.ReactNode;

  /**
   * Side of the target to place the popover on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Alignment against the target.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end';

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

  /** Hide the dimmed overlay on this step, overriding the tour-level setting. */
  disableOverlay?: boolean;

  /** Element to scroll into view when it differs from the target. */
  scrollTarget?: TourTarget;

  /** Skip scrolling the target into view when the step activates. */
  disableScroll?: boolean;

  /** Arbitrary data echoed back in events and render props. */
  data?: unknown;
}

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

export interface TourEvent {
  /** `tour:start`, `step:active`, `error:target-not-found`, or `tour:end`. */
  type: 'tour:start' | 'step:active' | 'error:target-not-found' | 'tour:end';
  /** Index of the step the event relates to. */
  index: number;
  /** The step the event relates to (absent on some `tour:start`/`tour:end`). */
  step?: TourStep;
  /** On `tour:end`, how the tour ended. */
  status?: 'finished' | 'skipped' | 'closed';
}

export interface TourContentProps {
  /**
   * Default side of the target to place the card on; steps override.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Default alignment against the target; steps override.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Default distance to the target in pixels; steps override.
   * @defaultValue 12
   */
  sideOffset?: number;

  /**
   * Whether to render the pointing arrow.
   * @defaultValue false
   */
  showArrow?: boolean;

  /** Additional CSS class name. */
  className?: string;

  /** Additional inline styles. */
  style?: React.CSSProperties;

  /** Static nodes, or a render function receiving the active step and actions. */
  children?: React.ReactNode | ((props: unknown) => React.ReactNode);
}

export interface TourOverlayProps {
  /**
   * Space between the target and the spotlight edge in pixels; steps override.
   * @defaultValue 4
   */
  spotlightPadding?: number;

  /**
   * Spotlight corner radius in pixels; steps override.
   * @defaultValue 6
   */
  spotlightRadius?: number;

  /**
   * Allow pointer interaction with the spotlighted element; steps override.
   * @defaultValue false
   */
  spotlightClicks?: boolean;

  /** Additional CSS class name. */
  className?: string;
}

export interface TourProgressProps {
  /** Custom formatter, e.g. show "2/5" instead of "2 of 5". */
  format?: (index: number, total: number) => React.ReactNode;

  /** Additional CSS class name. */
  className?: string;
}
