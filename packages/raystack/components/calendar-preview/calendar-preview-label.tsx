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
  const element = useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: mergeProps<'span'>(
      {
        className: cx(styles.label, className),
        'data-slot': 'calendar-preview-label',
        children
      } as useRender.ComponentProps<'span'>,
      props
    )
  });

  return children == null && render == null ? null : element;
}

CalendarPreviewLabel.displayName = 'CalendarPreview.Label';
