'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Tabs } from '../tabs';
import styles from './calendar-preview.module.css';
import type { CalendarGranularity } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';

/** Fixed order and wording, matching the design. */
const GRANULARITY_LABELS: Record<CalendarGranularity, string> = {
  day: 'Day',
  month: 'Month',
  quarter: 'Quarter',
  'half-year': 'Half-year',
  year: 'Year'
};

const GRANULARITY_ORDER: CalendarGranularity[] = [
  'day',
  'month',
  'quarter',
  'half-year',
  'year'
];

export interface CalendarPreviewGranularityTabsProps
  extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Override the label for one or more granularities. */
  labels?: Partial<Record<CalendarGranularity, string>>;
}

/**
 * Day | Month | Quarter | Half-year | Year, as Apsara `Tabs`. Renders nothing
 * unless the root offers more than one granularity, so it can sit in a shared
 * composition without appearing on single-granularity pickers.
 *
 * The tabs are `variant='standalone'` because the design's cells are that
 * variant — the same one its month and quarter grids use.
 */
export function CalendarPreviewGranularityTabs({
  className,
  labels,
  ...props
}: CalendarPreviewGranularityTabsProps) {
  const { granularity, setGranularity, granularities, disabled } =
    useCalendarPreviewContext('GranularityTabs');

  if (granularities.length <= 1) return null;

  // Always rendered in the canonical order, whatever order the prop gave.
  const ordered = GRANULARITY_ORDER.filter(item =>
    granularities.includes(item)
  );

  return (
    /*
     * The slot sits on a wrapper: `Tabs` spreads `...props` last, so passing
     * `data-slot` to it would overwrite its own `data-slot="tabs"`.
     */
    <div
      className={cx(styles.granularity, className)}
      data-slot='calendar-preview-granularity'
      {...props}
    >
      <Tabs
        variant='standalone'
        size='medium'
        value={granularity}
        onValueChange={next => setGranularity(next as CalendarGranularity)}
      >
        <Tabs.List>
          {ordered.map(item => (
            <Tabs.Tab key={item} value={item} disabled={disabled}>
              {labels?.[item] ?? GRANULARITY_LABELS[item]}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
}

CalendarPreviewGranularityTabs.displayName = 'CalendarPreview.GranularityTabs';
