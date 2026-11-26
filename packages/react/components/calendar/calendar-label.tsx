import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar.module.css';

export type CalendarLabelProps = useRender.ComponentProps<'span'>;

export function CalendarLabel({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarLabelProps) {
  const element = useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: mergeProps<'span'>(
      {
        className: cx(styles.label, className),
        'data-slot': 'calendar-label',
        children
      } as useRender.ComponentProps<'span'>,
      props
    )
  });

  return children == null && render == null ? null : element;
}

CalendarLabel.displayName = 'Calendar.Label';
