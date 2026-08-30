'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export interface CalendarPreviewTriggerProps
  extends PopoverPrimitive.Trigger.Props {}

/**
 * Anchors the popover. Renders a `div`, not a `<button>` — the trigger wraps
 * the typed input, and a button may not contain one.
 *
 * Opening is Base UI's job. Nothing here calls `setOpen` from a focus handler,
 * which is the race that cost the old family three suppression branches.
 */
export function CalendarPreviewTrigger({
  className,
  render = <div />,
  nativeButton = false,
  disabled,
  ...props
}: CalendarPreviewTriggerProps) {
  const { disabled: rootDisabled } = useCalendarPreviewContext('Trigger');
  const isDisabled = disabled ?? rootDisabled;

  return (
    <PopoverPrimitive.Trigger
      className={cx(styles.trigger, className)}
      render={render}
      disabled={isDisabled}
      data-disabled={isDisabled || undefined}
      // Tells Base UI to supply button semantics itself rather than assume a
      // native <button>, which this part deliberately never renders.
      nativeButton={nativeButton}
      data-slot='calendar-preview-trigger'
      {...props}
    />
  );
}

CalendarPreviewTrigger.displayName = 'CalendarPreview.Trigger';
