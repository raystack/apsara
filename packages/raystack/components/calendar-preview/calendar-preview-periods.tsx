import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { useEffect, useMemo, useRef } from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { isScaleValue } from './calendar-preview-root';
import {
  type DayKey,
  dayKey,
  dayKeyFromParts,
  monthShortNames,
  yearOf
} from './date-adapter';
import { anchorOf, periodOf, type Scale } from './lib/scale';

export type CalendarPreviewPeriodViewProps = useRender.ComponentProps<'div'>;

interface Cell {
  key: string;
  label: string;
  /* A timeless day, not an instant: "August 2026" is a calendar period, and
     keying it from a local `Date` read it a month early west of the zone. */
  date: DayKey;
}

const MONTHS = monthShortNames();

/* A month out of `dayKeyFromParts`' range has no cell rather than a bad one. */
function cellsFor(scale: Scale, year: number): Cell[] {
  const at = (key: string, label: string, month: number): Cell | null => {
    const date = dayKeyFromParts(year, month, 1);
    return date === null ? null : { key, label, date };
  };

  let cells: (Cell | null)[];
  if (scale === 'month') {
    cells = MONTHS.map((label, index) =>
      at(`${year}-${index}`, label, index + 1)
    );
  } else if (scale === 'quarter') {
    cells = [0, 1, 2, 3].map(q => at(`${year}-q${q}`, `Q${q + 1}`, q * 3 + 1));
  } else if (scale === 'halfYear') {
    cells = [0, 1].map(h => at(`${year}-h${h}`, `H${h + 1}`, h * 6 + 1));
  } else {
    cells = [at(`${year}`, String(year), 1)];
  }
  return cells.filter((cell): cell is Cell => cell !== null);
}

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
    month,
    timeZone,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Periods');

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = yearRange.from; y <= yearRange.to; y += 1) list.push(y);
    return list;
  }, [yearRange]);

  const activeYear = yearOf(
    scaleDraft?.date ??
      (isScaleValue(value) ? value.date : dayKey(month, timeZone))
  );

  const selected = scaleDraft ?? (isScaleValue(value) ? value : null);
  const selectedKey = selected?.scale === viewScale ? selected.date : null;

  const isActive = scale === viewScale;

  /* All five views mount at once and four render nothing, so the inactive ones
     build no cells at all. The rest is date maths over every cell in the
     range — a year of months is 12 of them — and none of it moves when the
     selection does, so it is held rather than redone per render. */
  const groups = useMemo(() => {
    if (!isActive) return [];
    const all = years.map(year => ({
      year,
      cells: cellsFor(viewScale, year).map(cell => ({
        ...cell,
        produced: anchorOf(periodOf(cell.date, viewScale), trailingValue),
        unavailable: !isPeriodAvailable(cell.date, viewScale)
      }))
    }));
    /* `yearRange` stretches to cover the bounds so no year is unreachable,
       which leaves the years outside them rendered as nothing but dead
       buttons — a tab stop each, half the list under a mid-range `minDate`.
       They go, unless that would empty the panel, which reads as broken
       rather than bounded. */
    const reachable = all.filter(group =>
      group.cells.some(cell => !cell.unavailable)
    );
    return reachable.length > 0 ? reachable : all;
  }, [isActive, years, viewScale, trailingValue, isPeriodAvailable]);

  /* Keyed on becoming active, not on mount: every view mounts at once, so a
     mount effect would fire with an empty ref. Scrolls the container, not
     `scrollIntoView`, which would move the popover with it. */
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isActive) return;
    const group = activeRef.current;
    const list = group?.parentElement;
    /* The ref lags a render behind `activeYear`. */
    if (!group || !list || group.dataset.year !== String(activeYear)) return;
    list.scrollTop +=
      group.getBoundingClientRect().top - list.getBoundingClientRect().top;
  }, [isActive, activeYear]);

  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.periods, className),
        'data-slot': slot,
        children: children ?? (
          <>
            {groups.map(({ year, cells }) => (
              <div
                key={year}
                ref={year === activeYear ? activeRef : undefined}
                className={styles['period-group']}
                data-slot='calendar-preview-period-group'
                data-year={year}
              >
                {viewScale !== 'year' && (
                  <div
                    className={styles['period-year']}
                    data-slot='calendar-preview-period-year'
                  >
                    {year}
                  </div>
                )}
                <div
                  className={styles['period-cells']}
                  style={
                    { '--rs-period-columns': columns } as React.CSSProperties
                  }
                >
                  {cells.map(({ produced, unavailable, ...cell }) => (
                    <button
                      key={cell.key}
                      type='button'
                      className={styles.period}
                      data-slot='calendar-preview-period'
                      data-scale={viewScale}
                      data-selected={produced === selectedKey || undefined}
                      data-unavailable={unavailable || undefined}
                      disabled={disabled || unavailable}
                      aria-label={
                        viewScale === 'year'
                          ? cell.label
                          : `${cell.label} ${year}`
                      }
                      aria-current={produced === selectedKey || undefined}
                      onClick={() => {
                        if (readOnly) return;
                        selectPeriod(cell.date, viewScale);
                      }}
                    >
                      {cell.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });

  return isActive ? element : null;
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
