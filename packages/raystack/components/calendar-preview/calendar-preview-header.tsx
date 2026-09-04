'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '~/icons';
import { IconButton } from '../icon-button';
import styles from './calendar-preview.module.css';
import { CalendarPreviewCaption } from './calendar-preview-caption';
import {
  useCalendarPreviewContext,
  useCalendarPreviewDaysContext
} from './calendar-preview-context';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { shiftMonths } from './date-adapter';

export type CalendarPreviewHeaderProps = useRender.ComponentProps<'div'>;

/**
 * The row above the grid. Composes the two nav buttons, the caption and the
 * reset when given no children.
 */
export function CalendarPreviewHeader({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewHeaderProps) {
  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.header, className),
        'data-slot': 'calendar-preview-header',
        children: children ?? (
          <>
            <CalendarPreviewPrevMonth />
            <CalendarPreviewCaption />
            <CalendarPreviewReset />
            <CalendarPreviewNextMonth />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  return element;
}

CalendarPreviewHeader.displayName = 'CalendarPreview.Header';

export type CalendarPreviewNavProps = useRender.ComponentProps<'button'>;

/**
 * Steps the view back one month.
 *
 * Never disabled by `minDate` — bounds limit selection, not navigation. It
 * goes inert only while the calendar is disabled or its grid is loading.
 */
export function CalendarPreviewPrevMonth(props: CalendarPreviewNavProps) {
  return (
    <CalendarPreviewNavButton
      {...props}
      delta={-1}
      slot='calendar-preview-prev-month'
      label='Previous month'
      icon={<ChevronLeftIcon />}
    />
  );
}

CalendarPreviewPrevMonth.displayName = 'CalendarPreview.PrevMonth';

/** Steps the view forward one month. Navigation is never clamped by `maxDate`. */
export function CalendarPreviewNextMonth(props: CalendarPreviewNavProps) {
  return (
    <CalendarPreviewNavButton
      {...props}
      delta={1}
      slot='calendar-preview-next-month'
      label='Next month'
      icon={<ChevronRightIcon />}
    />
  );
}

CalendarPreviewNextMonth.displayName = 'CalendarPreview.NextMonth';

interface NavButtonProps extends CalendarPreviewNavProps {
  delta: number;
  slot: string;
  label: string;
  icon: ReactNode;
}

function CalendarPreviewNavButton({
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
  const { month, setMonth, disabled } = useCalendarPreviewContext(
    'CalendarPreview.Header'
  );
  const days = useCalendarPreviewDaysContext();
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
