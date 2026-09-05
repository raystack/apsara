import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { CalendarPreviewDays } from './calendar-preview-days';
import {
  CalendarPreviewHalfYears,
  CalendarPreviewMonths,
  CalendarPreviewQuarters,
  CalendarPreviewYears
} from './calendar-preview-periods';

export type CalendarPreviewPanelProps = useRender.ComponentProps<'div'>;

/**
 * The view container. Mounts all five views when childless; each one gates on
 * the active scale itself, so a consumer can mount `.Quarters` alone with no
 * day grid in the tree.
 */
export function CalendarPreviewPanel({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewPanelProps) {
  const { scale } = useCalendarPreviewContext('CalendarPreview.Panel');

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.panel, className),
        'data-slot': 'calendar-preview-panel',
        'data-scale': scale,
        children: children ?? (
          <>
            <CalendarPreviewDays />
            <CalendarPreviewMonths />
            <CalendarPreviewQuarters />
            <CalendarPreviewHalfYears />
            <CalendarPreviewYears />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarPreviewPanel.displayName = 'CalendarPreview.Panel';
