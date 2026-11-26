import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { Tabs } from '../tabs';
import styles from './calendar.module.css';
import { useCalendarContext } from './calendar-context';
import type { Scale } from './lib/scale';

const LABELS: Record<Scale, string> = {
  day: 'Day',
  month: 'Month',
  quarter: 'Quarter',
  'half-year': 'Half-year',
  year: 'Year'
};

export type CalendarScalesProps = useRender.ComponentProps<'div'>;

export function CalendarScales({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarScalesProps) {
  const { scales, scale, switchScale, disabled } =
    useCalendarContext('Calendar.Scales');

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.scales, className),
        'data-slot': 'calendar-scales',
        children: children ?? (
          <Tabs
            size='small'
            variant='standalone'
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
                  data-slot='calendar-scale'
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

CalendarScales.displayName = 'Calendar.Scales';

export interface CalendarScaleProps extends useRender.ComponentProps<'button'> {
  value: Scale;
}

export function CalendarScale({
  value,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarScaleProps) {
  const { scale, switchScale, disabled } = useCalendarContext('Calendar.Scale');

  return useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className,
        'data-slot': 'calendar-scale',
        'data-scale': value,
        /* Says it is pressed rather than claiming a `tab` role with no tablist around it. */
        'aria-pressed': scale === value,
        'data-active': scale === value || undefined,
        disabled,
        onClick: () => switchScale(value),
        children: children ?? LABELS[value]
      } as useRender.ComponentProps<'button'>,
      props
    )
  });
}

CalendarScale.displayName = 'Calendar.Scale';
