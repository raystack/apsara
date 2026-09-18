import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';

export type CalendarPreviewLabelProps = useRender.ComponentProps<'span'>;

export function CalendarPreviewLabel({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewLabelProps) {
  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: mergeProps<'span'>(
      {
        className: cx(styles.label, className),
        'data-slot': 'calendar-preview-label',
        children: children ?? 'Date'
      } as useRender.ComponentProps<'span'>,
      props
    )
  });
}

CalendarPreviewLabel.displayName = 'CalendarPreview.Label';
