import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';

export type CalendarPreviewSeparatorProps = useRender.ComponentProps<'div'>;

export function CalendarPreviewSeparator({
  className,
  render,
  ref,
  ...props
}: CalendarPreviewSeparatorProps) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.separator, className),
        'data-slot': 'calendar-preview-separator',
        role: 'separator'
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarPreviewSeparator.displayName = 'CalendarPreview.Separator';
