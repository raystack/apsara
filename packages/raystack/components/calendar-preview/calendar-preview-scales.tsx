import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Tabs } from '../tabs';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import type { Scale } from './lib/scale';

const LABELS: Record<Scale, string> = {
  day: 'Day',
  month: 'Month',
  quarter: 'Quarter',
  halfYear: 'Half-year',
  year: 'Year'
};

export type CalendarPreviewScalesProps = useRender.ComponentProps<'div'>;

/**
 * The scale switcher. Renders nothing when only one scale is offered, which is
 * what keeps a plain day calendar from growing a one-tab row.
 */
export function CalendarPreviewScales({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewScalesProps) {
  const { scales, scale, switchScale, disabled } = useCalendarPreviewContext(
    'CalendarPreview.Scales'
  );

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.scales, className),
        'data-slot': 'calendar-preview-scales',
        children: children ?? (
          <Tabs
            value={scale}
            onValueChange={next => switchScale(next as Scale)}
          >
            <Tabs.List>
              {scales.map(one => (
                <Tabs.Tab
                  key={one}
                  value={one}
                  disabled={disabled}
                  className={styles.scale}
                  data-slot='calendar-preview-scale'
                  data-scale={one}
                >
                  {LABELS[one]}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  return scales.length > 1 ? element : null;
}

CalendarPreviewScales.displayName = 'CalendarPreview.Scales';

export interface CalendarPreviewScaleProps
  extends useRender.ComponentProps<'button'> {
  value: Scale;
}

/** One scale. Only needed to relabel or reorder what `.Scales` renders. */
export function CalendarPreviewScale({
  value,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewScaleProps) {
  const { scale, switchScale, disabled } = useCalendarPreviewContext(
    'CalendarPreview.Scale'
  );

  return useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: cx(styles.scale, className),
        'data-slot': 'calendar-preview-scale',
        'data-scale': value,
        'data-active': scale === value || undefined,
        disabled,
        onClick: () => switchScale(value),
        children: children ?? LABELS[value]
      } as useRender.ComponentProps<'button'>,
      props
    )
  });
}

CalendarPreviewScale.displayName = 'CalendarPreview.Scale';
