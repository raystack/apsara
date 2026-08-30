'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Button } from '../button';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export interface CalendarPreviewFooterProps extends ComponentProps<'div'> {}

/** Action row. Holds `.Apply` and `.Cancel`, or anything else. */
export function CalendarPreviewFooter({
  className,
  ...props
}: CalendarPreviewFooterProps) {
  return (
    <div
      className={cx(styles.footer, className)}
      data-slot='calendar-preview-footer'
      {...props}
    />
  );
}

CalendarPreviewFooter.displayName = 'CalendarPreview.Footer';

export type CalendarPreviewApplyProps = ComponentProps<typeof Button>;

/**
 * Commits buffered edits and closes the popover. Only meaningful under
 * `commit='explicit'`; under `'immediate'` the value is already committed, so
 * this is just a close button and is disabled by nothing.
 */
export function CalendarPreviewApply({
  className,
  children = 'Apply',
  disabled,
  onClick,
  ...props
}: CalendarPreviewApplyProps) {
  const {
    applyValue,
    setOpen,
    commitMode,
    hasPendingChanges,
    disabled: rootDisabled
  } = useCalendarPreviewContext('Apply');

  return (
    <Button
      size='small'
      disabled={
        disabled ??
        (rootDisabled || (commitMode === 'explicit' && !hasPendingChanges))
      }
      className={className}
      data-slot='calendar-preview-apply'
      onClick={event => {
        applyValue();
        setOpen(false);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

CalendarPreviewApply.displayName = 'CalendarPreview.Apply';

export type CalendarPreviewCancelProps = ComponentProps<typeof Button>;

/** Discards buffered edits and closes the popover. */
export function CalendarPreviewCancel({
  className,
  children = 'Cancel',
  onClick,
  ...props
}: CalendarPreviewCancelProps) {
  const { cancelValue, setOpen } = useCalendarPreviewContext('Cancel');

  return (
    <Button
      size='small'
      variant='outline'
      color='neutral'
      className={className}
      data-slot='calendar-preview-cancel'
      onClick={event => {
        cancelValue();
        setOpen(false);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

CalendarPreviewCancel.displayName = 'CalendarPreview.Cancel';
