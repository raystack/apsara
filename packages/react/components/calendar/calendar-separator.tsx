import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar.module.css';

export type CalendarSeparatorProps = useRender.ComponentProps<'div'>;

export function CalendarSeparator({
  className,
  render,
  ref,
  ...props
}: CalendarSeparatorProps) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.separator, className),
        'data-slot': 'calendar-separator',
        role: 'separator'
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarSeparator.displayName = 'Calendar.Separator';
