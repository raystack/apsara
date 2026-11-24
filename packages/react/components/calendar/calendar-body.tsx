import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import styles from './calendar.module.css';
import { useCalendarContext } from './calendar-context';
import { CalendarInput } from './calendar-input';
import { CalendarLabel } from './calendar-label';
import { CalendarPanel } from './calendar-panel';
import { CalendarReset } from './calendar-reset';
import { CalendarScales } from './calendar-scales';
import { CalendarSeparator } from './calendar-separator';

export interface CalendarBodyProps extends useRender.ComponentProps<'div'> {
  label?: ReactNode;
  /**
   * Shows the calendar icon in the date input.
   * @default false
   */
  showCalendarIcon?: boolean;
}

export function CalendarBody({
  label,
  showCalendarIcon = false,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarBodyProps) {
  const { scale, dropDraft } = useCalendarContext('Calendar.Body');

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.body, className),
        'data-slot': 'calendar-body',
        /* Escape drops the draft on its way to Base UI, which closes on it. */
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Escape') dropDraft();
        },
        children: children ?? (
          <>
            <CalendarLabel>{label}</CalendarLabel>
            <CalendarInput trailingIcon={showCalendarIcon ? undefined : null} />
            <CalendarScales />
            {scale !== 'day' && <CalendarReset />}
            <CalendarSeparator />
            <CalendarPanel />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarBody.displayName = 'Calendar.Body';
