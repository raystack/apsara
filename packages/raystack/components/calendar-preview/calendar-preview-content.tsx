'use client';

import { cx } from 'class-variance-authority';
import {
  PopoverSurface,
  type PopoverSurfaceProps
} from '../popover/popover-surface';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export interface CalendarPreviewContentProps
  extends Omit<
    PopoverSurfaceProps,
    'positionerClassName' | 'positionerSlot' | 'popupSlot'
  > {}

/**
 * The portaled surface: `Portal > Positioner > Popup`, exported as `Content`
 * per the house convention. Positioner props (`side`, `align`, `sideOffset`)
 * are passed here directly; `ref`, `className`, and `style` land on the popup.
 *
 * The tree is `PopoverSurface`, shared with `Popover.Content`; what is left
 * here is only what differs — the positioning defaults and the focus rule.
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
 */
export function CalendarPreviewContent({
  className,
  initialFocus,
  ...props
}: CalendarPreviewContentProps) {
  const { triggerOwnsFocus } = useCalendarPreviewContext('Content');

  return (
    <PopoverSurface
      side='bottom'
      align='start'
      positionerClassName={styles.positioner}
      positionerSlot='calendar-preview-positioner'
      popupSlot='calendar-preview-content'
      className={cx(styles.content, className)}
      initialFocus={initialFocus ?? (triggerOwnsFocus ? false : undefined)}
      {...props}
    />
  );
}

CalendarPreviewContent.displayName = 'CalendarPreview.Content';
