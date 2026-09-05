import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useEffect, useMemo, useRef } from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { dayKey, monthShortNames, monthStart, yearOf } from './date-adapter';
import { anchorOf, periodOf, type Scale } from './lib/scale';

export type CalendarPreviewPeriodViewProps = useRender.ComponentProps<'div'>;

interface Cell {
  key: string;
  label: string;
  /** The day this cell stands for, before `trailingValue` is applied. */
  date: Date;
}

const MONTHS = monthShortNames();

function cellsFor(scale: Scale, year: number): Cell[] {
  if (scale === 'month') {
    return MONTHS.map((label, index) => ({
      key: `${year}-${index}`,
      label,
      date: monthStart(year, index)
    }));
  }
  if (scale === 'quarter') {
    return [0, 1, 2, 3].map(q => ({
      key: `${year}-q${q}`,
      label: `Q${q + 1}`,
      date: monthStart(year, q * 3)
    }));
  }
  if (scale === 'halfYear') {
    return [0, 1].map(h => ({
      key: `${year}-h${h}`,
      label: `H${h + 1}`,
      date: monthStart(year, h * 6)
    }));
  }
  return [{ key: `${year}`, label: String(year), date: monthStart(year, 0) }];
}

/**
 * One scale's period list.
 *
 * Every year is a heading inside a single scrolling column rather than a page
 * of its own, so the whole list scrolls past the bounds — periods outside them
 * render disabled rather than being cut off.
 */
function PeriodView({
  scale: viewScale,
  columns,
  slot,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewPeriodViewProps & {
  scale: Scale;
  columns: number;
  slot: string;
}) {
  const {
    scale,
    scaleDraft,
    value,
    yearRange,
    selectPeriod,
    isPeriodAvailable,
    trailingValue,
    today,
    timeZone,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Periods');

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = yearRange.from; y <= yearRange.to; y += 1) list.push(y);
    return list;
  }, [yearRange]);

  /* Compared as day-keys so a re-rendered Date never counts as a change. The
     draft wins: it is what the user is looking at after a scale switch. */
  const activeYear = yearOf(
    scaleDraft?.date ??
      (value && !(value instanceof Date) && 'date' in value
        ? (value as { date: string }).date
        : dayKey(today, timeZone))
  );

  const selectedKey =
    scaleDraft?.date ??
    (value && !(value instanceof Date) && 'date' in value
      ? (value as { date: string }).date
      : null);

  /* A twenty-year list otherwise opens on its first year. Optional-called
     because jsdom does not implement scrollIntoView. */
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'start' });
  }, []);

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.periods, className),
        'data-slot': slot,
        'data-scale': viewScale,
        children: children ?? (
          <>
            {years.map(year => (
              <div
                key={year}
                ref={year === activeYear ? activeRef : undefined}
                className={styles['period-group']}
                data-slot='calendar-preview-period-group'
              >
                <div
                  className={styles['period-year']}
                  data-slot='calendar-preview-period-year'
                >
                  {year}
                </div>
                <div
                  className={styles['period-cells']}
                  style={
                    { '--rs-period-columns': columns } as React.CSSProperties
                  }
                >
                  {cellsFor(viewScale, year).map(cell => {
                    const produced = anchorOf(
                      periodOf(cell.date, viewScale),
                      trailingValue
                    );
                    const unavailable = !isPeriodAvailable(
                      cell.date,
                      viewScale
                    );
                    return (
                      <button
                        key={cell.key}
                        type='button'
                        className={styles.period}
                        data-slot='calendar-preview-period'
                        data-scale={viewScale}
                        data-selected={produced === selectedKey || undefined}
                        data-unavailable={unavailable || undefined}
                        disabled={disabled || unavailable}
                        aria-current={produced === selectedKey || undefined}
                        onClick={() => {
                          if (readOnly) return;
                          selectPeriod(cell.date, viewScale);
                        }}
                      >
                        {cell.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  /* Sibling views all mount; each gates on the active scale, so `.Quarters`
     can stand alone with no day grid in the tree. */
  return scale === viewScale ? element : null;
}

export function CalendarPreviewMonths(props: CalendarPreviewPeriodViewProps) {
  return (
    <PeriodView
      {...props}
      scale='month'
      columns={3}
      slot='calendar-preview-months'
    />
  );
}
CalendarPreviewMonths.displayName = 'CalendarPreview.Months';

export function CalendarPreviewQuarters(props: CalendarPreviewPeriodViewProps) {
  return (
    <PeriodView
      {...props}
      scale='quarter'
      columns={4}
      slot='calendar-preview-quarters'
    />
  );
}
CalendarPreviewQuarters.displayName = 'CalendarPreview.Quarters';

export function CalendarPreviewHalfYears(
  props: CalendarPreviewPeriodViewProps
) {
  return (
    <PeriodView
      {...props}
      scale='halfYear'
      columns={2}
      slot='calendar-preview-half-years'
    />
  );
}
CalendarPreviewHalfYears.displayName = 'CalendarPreview.HalfYears';

export function CalendarPreviewYears(props: CalendarPreviewPeriodViewProps) {
  return (
    <PeriodView
      {...props}
      scale='year'
      columns={1}
      slot='calendar-preview-years'
    />
  );
}
CalendarPreviewYears.displayName = 'CalendarPreview.Years';
