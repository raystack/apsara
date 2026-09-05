'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useMemo, useState } from 'react';
import styles from './calendar-preview.module.css';
import {
  type CalendarPreviewDaysContextValue,
  CalendarPreviewDaysProvider,
  useCalendarPreviewContext
} from './calendar-preview-context';
import { CalendarPreviewGrid } from './calendar-preview-grid';
import { CalendarPreviewHeader } from './calendar-preview-header';

export interface CalendarPreviewDaysProps
  extends useRender.ComponentProps<'div'> {
  /**
   * How many months the grid shows side by side.
   * @defaultValue 1
   */
  numberOfMonths?: number;
}

/* Owns what the header and grid share, so two day views in one tree cannot
   disable each other's navigation. */
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
        'data-scale': scale,
        'data-disabled': disabled || undefined,
        'data-readonly': readOnly || undefined,
        'data-busy': busy || undefined,
        /* Several months caption themselves inside the grid, so a `.Header`
           here would be a second, redundant row. */
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

  /* A sibling of the period views, gating the same way, so `.Panel` can mount
     all five and only the active one renders. */
  if (scale !== 'day') return null;

  return (
    <CalendarPreviewDaysProvider value={context}>
      {element}
    </CalendarPreviewDaysProvider>
  );
}

CalendarPreviewDays.displayName = 'CalendarPreview.Days';
