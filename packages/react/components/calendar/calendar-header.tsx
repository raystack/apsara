'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar.module.css';
import { CalendarCaption } from './calendar-caption';
import { useCalendarContext, useCalendarDaysContext } from './calendar-context';
import { CalendarReset } from './calendar-reset';
import { shiftMonths } from './date-adapter';

export type CalendarHeaderProps = useRender.ComponentProps<'div'>;

/* Source order is tab order, so the row needs no CSS reordering. */
export function CalendarHeader({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarHeaderProps) {
  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.header, className),
        'data-slot': 'calendar-header',
        children: children ?? (
          <>
            <CalendarCaption />
            <CalendarReset />
            <CalendarPrevMonth />
            <CalendarNextMonth />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  return element;
}

CalendarHeader.displayName = 'Calendar.Header';

export type CalendarNavProps = useRender.ComponentProps<'button'>;

/* Never disabled by `minDate`: bounds limit selection, not navigation. */
export function CalendarPrevMonth(props: CalendarNavProps) {
  return (
    <CalendarNavButton
      {...props}
      delta={-1}
      slot='calendar-prev-month'
      label='Previous month'
      icon={<ChevronLeftIcon />}
    />
  );
}

CalendarPrevMonth.displayName = 'Calendar.PrevMonth';

export function CalendarNextMonth(props: CalendarNavProps) {
  return (
    <CalendarNavButton
      {...props}
      delta={1}
      slot='calendar-next-month'
      label='Next month'
      icon={<ChevronRightIcon />}
    />
  );
}

CalendarNextMonth.displayName = 'Calendar.NextMonth';

interface NavButtonProps extends CalendarNavProps {
  delta: number;
  slot: string;
  label: string;
  icon: ReactNode;
}

function CalendarNavButton({
  delta,
  slot,
  label,
  icon,
  className,
  children,
  render,
  ref,
  ...props
}: NavButtonProps) {
  const { month, setMonth, disabled } = useCalendarContext('Calendar.Header');
  const days = useCalendarDaysContext();
  const inert = disabled || (days?.busy ?? false);

  return useRender({
    defaultTagName: 'button',
    ref,
    render: render ?? <IconButton size={3} />,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: cx(styles['nav-button'], className),
        'data-slot': slot,
        'aria-label': label,
        disabled: inert,
        onClick: () => setMonth(shiftMonths(month, delta)),
        children: children ?? icon
      } as useRender.ComponentProps<'button'>,
      props
    )
  });
}
