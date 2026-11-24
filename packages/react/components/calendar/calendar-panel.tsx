import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar.module.css';
import { useCalendarContext } from './calendar-context';
import { CalendarDays } from './calendar-days';
import {
  CalendarHalfYears,
  CalendarMonths,
  CalendarQuarters,
  CalendarYears
} from './calendar-periods';

export type CalendarPanelProps = useRender.ComponentProps<'div'>;

/* Each view gates on the scale itself, so `.Quarters` can be mounted alone. */
export function CalendarPanel({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPanelProps) {
  const { scale } = useCalendarContext('Calendar.Panel');

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.panel, className),
        'data-slot': 'calendar-panel',
        'data-scale': scale,
        children: children ?? (
          <>
            <CalendarDays />
            <CalendarMonths />
            <CalendarQuarters />
            <CalendarHalfYears />
            <CalendarYears />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarPanel.displayName = 'Calendar.Panel';
