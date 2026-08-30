'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export interface CalendarPreviewContentProps
  extends Omit<
      PopoverPrimitive.Positioner.Props,
      'render' | 'className' | 'style' | 'ref'
    >,
    PopoverPrimitive.Popup.Props {}

/**
 * The portaled surface: `Portal > Positioner > Popup`, exported as `Content`
 * per the house convention. Positioner props (`side`, `align`, `sideOffset`)
 * are passed here directly; `ref`, `className`, and `style` land on the popup.
 *
 * `side` defaults to `bottom-start` — date inputs conventionally drop down,
 * and the old family's `top` default collided with on-screen keyboards.
 *
 * `initialFocus` defaults to declining focus whenever a typed field is
 * composed inside `.Trigger` — the RFC's headline shape, and the one
 * `FilterChip` uses. Taking focus into the popup there sends the user's
 * keystrokes to the grid, where Enter selects a day instead of committing what
 * they typed. A default that every correct use had to override was the wrong
 * default; a plain button trigger still gets the focus move it should.
 *
 * Known limitation, shared with Apsara's own `Popover.Content`: anything not
 * destructured above lands on the positioner, so a popup-only prop such as
 * `id` reaches the wrong element. Partitioning by an enumerated key list was
 * tried and rejected — Base UI has 20 positioning props and a minor bump that
 * adds one would misroute it silently, which is worse than the limitation.
 */
export function CalendarPreviewContent({
  ref,
  className,
  style,
  render,
  children,
  initialFocus,
  finalFocus,
  ...positionerProps
}: CalendarPreviewContentProps) {
  const { triggerOwnsFocus } = useCalendarPreviewContext('Content');

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side='bottom'
        align='start'
        sideOffset={4}
        collisionPadding={3}
        className={styles.positioner}
        data-slot='calendar-preview-positioner'
        {...positionerProps}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cx(styles.content, className)}
          style={style}
          render={render}
          initialFocus={initialFocus ?? (triggerOwnsFocus ? false : undefined)}
          finalFocus={finalFocus}
          data-slot='calendar-preview-content'
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

CalendarPreviewContent.displayName = 'CalendarPreview.Content';
