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

export interface TourContentProps {
  /**
   * Default side of the target to place the card on; steps can override.
   * @default 'bottom'
   */
  side?: TourSide;
  /** Default alignment against the target; steps can override. @default 'center' */
  align?: TourAlign;
  /** Default distance to the target in pixels; steps can override. @default 12 */
  sideOffset?: number;
  /** Whether to render the pointing arrow. @default false */
  showArrow?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * Card content: static nodes or a render function receiving the active
   * step. Defaults to the standard layout built from `Tour.Title`,
   * `Tour.Description`, `Tour.Progress` and the navigation buttons.
   */
  children?: ReactNode | ((props: TourRenderProps) => ReactNode);
}

export function TourContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 12,
  showArrow = false,
  className,
  style,
  children
}: TourContentProps) {
  const {
    popoverOpen,
    anchor,
    step,
    steps,
    index,
    status,
    actions,
    transition,
    revealed
  } = useTourContext('Tour.Content');
  const detached = step != null && step.target == null;
  const popupRef = useRef<HTMLDivElement>(null);

  const visible = transition !== 'fade' || revealed;

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

  const spotlightClicks = step?.spotlightClicks ?? false;
  // biome-ignore lint/correctness/useExhaustiveDependencies: `index` is intentional — re-running on step change is how the card refocuses.
  useEffect(() => {
    if (!popoverOpen || !visible || spotlightClicks) return;
    popupRef.current?.focus({ preventScroll: true });
  }, [popoverOpen, visible, index, spotlightClicks]);

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
        // Tours are persistent — only Escape dismisses, not outside press/focus.
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
          data-transition={transition}
        >
          <PopoverPrimitive.Popup
            ref={popupRef}
            className={cx(styles.popup, className)}
            style={style}
            data-detached={detached || undefined}
            data-transition={transition}
            data-visible={visible ? 'true' : 'false'}
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

TourContent.displayName = 'Tour.Content';
