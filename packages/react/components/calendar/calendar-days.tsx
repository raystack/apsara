'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useMemo, useState } from 'react';
import styles from './calendar.module.css';
import {
  CalendarDaysContext,
  type CalendarDaysContextValue,
  useCalendarContext
} from './calendar-context';
import { CalendarGrid } from './calendar-grid';
import { CalendarHeader } from './calendar-header';

export interface CalendarDaysProps extends useRender.ComponentProps<'div'> {
  /** @defaultValue 1 */
  numberOfMonths?: number;
}

/* Owns what the header and grid share, so two day views cannot disable each other. */
export function CalendarDays({
  numberOfMonths = 1,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarDaysProps) {
  const { disabled, readOnly, scale } = useCalendarContext('Calendar.Days');
  const [busy, setBusy] = useState(false);

  const context = useMemo<CalendarDaysContextValue>(
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
        'data-slot': 'calendar-days',
        'data-disabled': disabled || undefined,
        'data-readonly': readOnly || undefined,
        'data-busy': busy || undefined,
        /* Several months caption themselves inside the grid, so a `.Header` here would duplicate. */
        children: children ?? (
          <>
            {numberOfMonths <= 1 && <CalendarHeader />}
            <CalendarGrid />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  if (scale !== 'day') return null;

  return <CalendarDaysContext value={context}>{element}</CalendarDaysContext>;
}

CalendarDays.displayName = 'Calendar.Days';
