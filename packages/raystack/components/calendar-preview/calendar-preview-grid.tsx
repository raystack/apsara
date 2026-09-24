'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import {
  type CustomComponents,
  type DayButtonProps,
  DayPicker,
  type DayPickerProps,
  type MonthCaptionProps,
  type MonthGridProps,
  type RootProps,
  type WeekdayProps,
  type WeekNumberHeaderProps,
  type WeekNumberProps
} from 'react-day-picker';
import { Skeleton } from '../skeleton';
import { Tooltip } from '../tooltip';
import styles from './calendar-preview.module.css';
import {
  useCalendarPreviewContext,
  useCalendarPreviewDaysContext
} from './calendar-preview-context';
import {
  CalendarPreviewNextMonth,
  CalendarPreviewPrevMonth
} from './calendar-preview-header';
import { isScaleValue } from './calendar-preview-root';
import {
  formatCaptionLabel,
  formatWeekdayLabel,
  parseKey
} from './date-adapter';

/* The only file that may import react-day-picker, and it never mounts a `Select`. */
interface GridContextValue {
  dateInfo?: (date: Date) => ReactNode;
  tooltipMessages?: (date: Date) => ReactNode;
  showTooltip: boolean;
  loading: boolean;
  showOutsideDays: boolean;
}

interface GridRootContextValue {
  rootRender: useRender.ComponentProps<'div'>['render'];
  rootRef: useRender.ComponentProps<'div'>['ref'];
  rootProps: useRender.ComponentProps<'div'>;
}

const GridContext = createContext<GridContextValue | null>(null);
const GridRootContext = createContext<GridRootContextValue | null>(null);

function useGridContext(part: string): GridContextValue {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview.Grid>`);
  }
  return context;
}

function useGridRootContext(part: string): GridRootContextValue {
  const context = useContext(GridRootContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview.Grid>`);
  }
  return context;
}

export interface CalendarPreviewGridProps
  extends useRender.ComponentProps<'div'> {
  /** @defaultValue true */
  fixedWeeks?: boolean;
  /** @defaultValue false */
  showOutsideDays?: boolean;
  showWeekNumber?: boolean;
  weekStartsOn?: DayPickerProps['weekStartsOn'];
  modifiers?: DayPickerProps['modifiers'];
  components?: Partial<CustomComponents>;
  dateInfo?: (date: Date) => ReactNode;
  /** @defaultValue false */
  showTooltip?: boolean;
  tooltipMessages?: (date: Date) => ReactNode;
  loading?: boolean;
}

export function CalendarPreviewGrid({
  fixedWeeks = true,
  showOutsideDays = false,
  showWeekNumber,
  weekStartsOn,
  modifiers,
  components,
  dateInfo,
  showTooltip = false,
  tooltipMessages,
  loading = false,
  className,
  render,
  ref,
  children: _children,
  ...props
}: CalendarPreviewGridProps) {
  const {
    value,
    selection,
    selectDay,
    draft,
    month,
    setMonth,
    isDateUnavailable,
    today,
    timeZone,
    clearable,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Grid');
  const days = useCalendarPreviewDaysContext();
  const setBusy = days?.setBusy;

  useEffect(() => {
    if (!setBusy) return;
    setBusy(loading);
    return () => setBusy(false);
  }, [loading, setBusy]);

  /* Inline arrows invalidate this every render, which is why the docs ask for memoized ones. */
  const gridContext = useMemo<GridContextValue>(
    () => ({
      dateInfo,
      tooltipMessages,
      showTooltip,
      loading,
      showOutsideDays
    }),
    [dateInfo, tooltipMessages, showTooltip, loading, showOutsideDays]
  );

  const gridRootContext: GridRootContextValue = {
    rootRender: render,
    rootRef: ref,
    rootProps: props
  };

  const months = days?.numberOfMonths ?? 1;

  const selected = isScaleValue(value)
    ? parseKey(value.date)
    : value instanceof Date
      ? value
      : undefined;

  const slots = useMemo(
    () => ({
      Root: CalendarPreviewGridRoot,
      MonthGrid: CalendarPreviewWeeks,
      DayButton: CalendarPreviewDay,
      Weekday: CalendarPreviewWeekday,
      WeekNumber: CalendarPreviewWeekNumber,
      WeekNumberHeader: CalendarPreviewWeekNumberHeader,
      ...(months > 1 ? { MonthCaption: CalendarPreviewMonthCaption } : {}),
      ...components
    }),
    [components, months]
  );

  const handleSelect = useCallback(
    (_selected: unknown, triggerDate: Date) => {
      selectDay(triggerDate);
    },
    [selectDay]
  );

  const base = {
    month,
    onMonthChange: setMonth,
    timeZone,
    today,
    hideNavigation: true,
    captionLayout: 'label',
    numberOfMonths: months,
    formatters: GRID_FORMATTERS,
    disabled: disabled ? true : isDateUnavailable,
    fixedWeeks,
    showOutsideDays,
    showWeekNumber,
    weekStartsOn,
    modifiers,
    components: slots,
    className: cx(styles.grid, className),
    'data-slot': 'calendar-preview-grid',
    'data-readonly': readOnly || undefined,
    classNames: GRID_CLASS_NAMES
  } satisfies Omit<DayPickerProps, 'mode' | 'required' | 'selected'> & {
    'data-slot': string;
    'data-readonly'?: true;
  };

  return (
    <GridRootContext value={gridRootContext}>
      <GridContext value={gridContext}>
        {selection === 'range' ? (
          <DayPicker
            {...base}
            mode='range'
            required={false}
            selected={draft ? { from: draft.from, to: draft.to } : undefined}
            onSelect={handleSelect}
          />
        ) : clearable ? (
          <DayPicker
            {...base}
            mode='single'
            required={false}
            selected={selected}
            onSelect={handleSelect}
          />
        ) : (
          <DayPicker
            {...base}
            mode='single'
            required
            selected={selected}
            onSelect={handleSelect}
          />
        )}
      </GridContext>
    </GridRootContext>
  );
}

CalendarPreviewGrid.displayName = 'CalendarPreview.Grid';

/* `<DayPicker>` forwards only `className`, `style` and `data-*` to its root. */
function CalendarPreviewGridRoot({ rootRef, ...rootProps }: RootProps) {
  const {
    rootRender,
    rootRef: ref,
    rootProps: extra
  } = useGridRootContext('CalendarPreview.Grid');
  return useRender({
    defaultTagName: 'div',
    ref,
    render: rootRender,
    props: mergeProps<'div'>(rootProps, extra)
  });
}

function CalendarPreviewWeeks(props: MonthGridProps) {
  const { loading } = useGridContext('CalendarPreview.Grid');
  const { readOnly } = useCalendarPreviewContext('CalendarPreview.Grid');
  return (
    <div className={styles.weeks} data-slot='calendar-preview-weeks'>
      <table
        data-slot='calendar-preview-table'
        aria-busy={loading || undefined}
        aria-readonly={readOnly || undefined}
        {...props}
      />
      <div
        className={styles.skeleton}
        data-slot='calendar-preview-skeleton'
        data-visible={loading || undefined}
        aria-hidden='true'
      >
        <Skeleton
          count={6}
          height='var(--rs-space-5)'
          width='100%'
          containerClassName={styles['skeleton-rows']}
          containerStyle={{ gap: undefined }}
        />
      </div>
    </div>
  );
}

function CalendarPreviewMonthCaption({
  calendarMonth,
  displayIndex,
  /* The class RDP passes here hides the caption, which this header must not be. */
  className: _className,
  ...props
}: MonthCaptionProps) {
  const { timeZone } = useCalendarPreviewContext('CalendarPreview.Grid');
  const days = useCalendarPreviewDaysContext();

  return (
    <div
      className={styles['month-header']}
      data-slot='calendar-preview-month-header'
      {...props}
    >
      {displayIndex === 0 && (
        <CalendarPreviewPrevMonth className={styles['month-header-prev']} />
      )}
      <span
        className={cx(styles.caption, styles['month-header-caption'])}
        data-slot='calendar-preview-month-header-caption'
      >
        {formatCaptionLabel(calendarMonth.date, timeZone)}
      </span>
      {displayIndex === (days?.numberOfMonths ?? 1) - 1 && (
        <CalendarPreviewNextMonth className={styles['month-header-next']} />
      )}
    </div>
  );
}

export interface CalendarPreviewDayProps
  extends DayButtonProps,
    Pick<useRender.ComponentProps<'button'>, 'render' | 'ref'> {}

export function CalendarPreviewDay({
  day,
  modifiers,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewDayProps) {
  const { scale, readOnly } = useCalendarPreviewContext('CalendarPreview.Day');
  const { dateInfo, tooltipMessages, showTooltip } = useGridContext(
    'CalendarPreview.Day'
  );

  /* Replacing RDP's `DayButton` also replaces the effect that moves DOM focus. */
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mergedRef = useMergedRefs(buttonRef, ref);

  useEffect(() => {
    if (modifiers.focused) buttonRef.current?.focus();
  }, [modifiers.focused]);

  const info = dateInfo?.(day.date);
  const message = showTooltip ? tooltipMessages?.(day.date) : null;

  const button = useRender({
    defaultTagName: 'button',
    ref: mergedRef,
    render,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: cx(
          info != null && styles['day-button-with-info'],
          className
        ),
        'data-slot': 'calendar-preview-day',
        'data-scale': scale,
        'data-selected': modifiers.selected || undefined,
        'data-range-start': modifiers.range_start || undefined,
        'data-range-middle': modifiers.range_middle || undefined,
        'data-range-end': modifiers.range_end || undefined,
        'data-draft': (modifiers.focused && !modifiers.selected) || undefined,
        'data-unavailable': modifiers.disabled || undefined,
        'data-today': modifiers.today || undefined,
        'data-outside': day.outside || undefined,
        children: (
          <>
            {info != null && (
              <span
                className={styles['day-info']}
                data-slot='calendar-preview-day-info'
              >
                {info}
              </span>
            )}
            <span
              className={styles['day-number']}
              data-slot='calendar-preview-day-number'
            >
              {children}
            </span>
          </>
        )
      } as useRender.ComponentProps<'button'>,
      props,
      /* After the spread: RDP passes `undefined` per available day, which would erase this. */
      readOnly
        ? ({ 'aria-disabled': true } as useRender.ComponentProps<'button'>)
        : {}
    )
  });

  /* The span, not the day: a disabled button fires no pointer events. */
  if (!showTooltip) {
    return (
      <span
        className={styles['day-trigger']}
        data-slot='calendar-preview-day-trigger'
      >
        {button}
      </span>
    );
  }

  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <span
            className={styles['day-trigger']}
            data-slot='calendar-preview-day-trigger'
          />
        }
      >
        {button}
      </Tooltip.Trigger>
      {message != null && (
        <Tooltip.Content side='top' data-slot='calendar-preview-day-tooltip'>
          {message}
        </Tooltip.Content>
      )}
    </Tooltip>
  );
}

CalendarPreviewDay.displayName = 'CalendarPreview.Day';

export interface CalendarPreviewWeekdayProps
  extends WeekdayProps,
    Pick<useRender.ComponentProps<'th'>, 'render' | 'ref'> {}

export function CalendarPreviewWeekday({
  className,
  render,
  ref,
  ...props
}: CalendarPreviewWeekdayProps) {
  return useRender({
    defaultTagName: 'th',
    ref,
    render,
    props: mergeProps<'th'>(
      {
        className: cx(styles.weekday, className),
        'data-slot': 'calendar-preview-weekday'
      } as useRender.ComponentProps<'th'>,
      props
    )
  });
}

CalendarPreviewWeekday.displayName = 'CalendarPreview.Weekday';

function CalendarPreviewWeekNumber({
  week,
  children,
  ...props
}: WeekNumberProps) {
  const { showOutsideDays } = useGridContext('CalendarPreview.Grid');
  /* A padding row's number counts a week the grid never showed. */
  const counts = showOutsideDays || week.days.some(day => !day.outside);
  return (
    <th data-slot='calendar-preview-week-number' {...props}>
      {counts ? children : null}
    </th>
  );
}

function CalendarPreviewWeekNumberHeader(props: WeekNumberHeaderProps) {
  return <th data-slot='calendar-preview-week-number-header' {...props} />;
}

const GRID_FORMATTERS: DayPickerProps['formatters'] = {
  formatWeekdayName: date => formatWeekdayLabel(date)
};

/* Hidden, not removed: RDP still labels each table through it. */
const GRID_CLASS_NAMES: DayPickerProps['classNames'] = {
  months: styles.months,
  month: styles.month,
  month_caption: styles['month-caption'],
  caption_label: styles['caption-label'],
  weeks: styles.weeks,
  week: styles.week,
  weekdays: styles.weekdays,
  day: styles.day,
  day_button: styles['day-button'],
  weekday: styles.weekday,
  today: styles.today,
  outside: styles.outside,
  disabled: styles.disabled,
  selected: styles.selected,
  hidden: styles.hidden,
  range_start: styles['range-start'],
  range_middle: styles['range-middle'],
  range_end: styles['range-end'],
  week_number: styles['week-number'],
  week_number_header: styles['week-number-header']
};
