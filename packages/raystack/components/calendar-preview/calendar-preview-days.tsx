'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useMemo, useState } from 'react';
import styles from './calendar-preview.module.css';
import {
  CalendarPreviewDaysContext,
  type CalendarPreviewDaysContextValue,
  useCalendarPreviewContext
} from './calendar-preview-context';
import { CalendarPreviewGrid } from './calendar-preview-grid';
import { CalendarPreviewHeader } from './calendar-preview-header';

export interface CalendarPreviewDaysProps
  extends useRender.ComponentProps<'div'> {
  /** @defaultValue 1 */
  numberOfMonths?: number;
}

/* Owns what the header and grid share, so two day views cannot disable each other. */
export function CalendarPreviewDays({
  numberOfMonths = 1,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewDaysProps) {
  const { disabled, readOnly, scale } = useCalendarPreviewContext(
    'CalendarPreview.Days'
  );
  const [busy, setBusy] = useState(false);

  const context = useMemo<CalendarPreviewDaysContextValue>(
    () => ({ numberOfMonths, busy, setBusy }),
    [numberOfMonths, busy]
  );

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.days, className),
        'data-slot': 'calendar-preview-days',
        'data-disabled': disabled || undefined,
        'data-readonly': readOnly || undefined,
        'data-busy': busy || undefined,
        /* Several months caption themselves inside the grid, so a `.Header` here would duplicate. */
        children: children ?? (
          <>
            {numberOfMonths <= 1 && <CalendarPreviewHeader />}
            <CalendarPreviewGrid />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  if (scale !== 'day') return null;

  return (
    <CalendarPreviewDaysContext value={context}>
      {element}
    </CalendarPreviewDaysContext>
  );
}

CalendarPreviewDays.displayName = 'CalendarPreview.Days';
