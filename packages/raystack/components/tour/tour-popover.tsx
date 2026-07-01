'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef
} from 'react';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';
import { TourDefaultLayout } from './tour-parts';
import type { TourAlign, TourRenderProps, TourSide } from './types';

export interface TourPopoverProps {
  /**
   * Default side of the target to place the popover on; steps can override.
   * @default 'bottom'
   */
  side?: TourSide;
  /** Default alignment against the target; steps can override. @default 'center' */
  align?: TourAlign;
  /** Default distance to the target in pixels; steps can override. @default 12 */
  sideOffset?: number;
  /** @default true */
  showArrow?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * Popover content: static nodes or a render function receiving the active
   * step. Defaults to the standard layout built from `Tour.Title`,
   * `Tour.Description`, `Tour.Progress` and the navigation buttons.
   */
  children?: ReactNode | ((props: TourRenderProps) => ReactNode);
}

export function TourPopover({
  side = 'bottom',
  align = 'center',
  sideOffset = 12,
  showArrow = true,
  className,
  style,
  children
}: TourPopoverProps) {
  const { popoverOpen, anchor, step, steps, index, status, actions } =
    useTourContext('Tour.Popover');
  const detached = step != null && step.target == null;
  const popupRef = useRef<HTMLDivElement>(null);

  // Detached steps anchor to the viewport center and open upwards, which
  // optically centers the popup while keeping it positioner-driven (so it
  // still glides to and from regular steps). The rect is read lazily, so the
  // positioner re-centers it on window resize.
  const centerAnchor = useMemo(
    () => ({
      getBoundingClientRect: () =>
        DOMRect.fromRect({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          width: 0,
          height: 0
        })
    }),
    []
  );

  // Keyboard continuity: the step content remounts on every step, so move
  // focus back into the card when the step changes (and on open). Steps that
  // invite page interaction (`spotlightClicks`) keep focus where it is.
  const spotlightClicks = step?.spotlightClicks ?? false;
  // biome-ignore lint/correctness/useExhaustiveDependencies: `index` is intentional — re-running on step change is how the card refocuses.
  useEffect(() => {
    if (!popoverOpen || spotlightClicks) return;
    popupRef.current?.focus({ preventScroll: true });
  }, [popoverOpen, index, spotlightClicks]);

  const renderProps: TourRenderProps | null = step
    ? {
        step,
        index,
        totalSteps: steps.length,
        isFirstStep: index <= 0,
        isLastStep: index >= steps.length - 1,
        status,
        actions
      }
    : null;

  return (
    <PopoverPrimitive.Root
      open={popoverOpen}
      modal={false}
      onOpenChange={(nextOpen, eventDetails) => {
        if (nextOpen) return;
        // Tours are persistent: outside presses and focus moves (e.g. into a
        // spotlighted input) must not dismiss the step. Escape still exits.
        if (eventDetails.reason === 'escape-key') actions.stop();
      }}
    >
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={detached ? centerAnchor : anchor}
          side={step?.side ?? (detached ? 'top' : side)}
          align={step?.align ?? align}
          sideOffset={step?.sideOffset ?? sideOffset}
          collisionPadding={12}
          className={styles.positioner}
        >
          <PopoverPrimitive.Popup
            ref={popupRef}
            className={cx(styles.popup, className)}
            style={style}
            data-detached={detached || undefined}
          >
            {showArrow && !detached && (
              <PopoverPrimitive.Arrow className={styles.arrow}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='10'
                  height='6'
                  viewBox='0 0 10 6'
                  fill='none'
                  aria-hidden='true'
                >
                  <path
                    d='M4.84682 5.97543L0 0H10L5.15318 5.97543C5.07309 6.07419 4.92691 6.07419 4.84682 5.97543Z'
                    fill='currentColor'
                  />
                </svg>
              </PopoverPrimitive.Arrow>
            )}
            {renderProps && (
              <div key={index} className={styles.stepContent}>
                {typeof children === 'function'
                  ? children(renderProps)
                  : (children ?? <TourDefaultLayout />)}
              </div>
            )}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

TourPopover.displayName = 'Tour.Popover';
