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
import styles from './calendar.module.css';
import { useCalendarContext, useCalendarDaysContext } from './calendar-context';
import { CalendarNextMonth, CalendarPrevMonth } from './calendar-header';
import { isScaleValue } from './calendar-root';
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
    throw new Error(`${part} must be used within <Calendar.Grid>`);
  }
  return context;
}

function useGridRootContext(part: string): GridRootContextValue {
  const context = useContext(GridRootContext);
  if (!context) {
    throw new Error(`${part} must be used within <Calendar.Grid>`);
  }
  return context;
}

export interface CalendarGridProps extends useRender.ComponentProps<'div'> {
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

export function CalendarGrid({
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
}: CalendarGridProps) {
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
  } = useCalendarContext('Calendar.Grid');
  const days = useCalendarDaysContext();
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
      Root: CalendarGridRoot,
      MonthGrid: CalendarWeeks,
      DayButton: CalendarDay,
      Weekday: CalendarWeekday,
      WeekNumber: CalendarWeekNumber,
      WeekNumberHeader: CalendarWeekNumberHeader,
      ...(months > 1 ? { MonthCaption: CalendarMonthCaption } : {}),
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
    'data-slot': 'calendar-grid',
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

CalendarGrid.displayName = 'Calendar.Grid';

/* `<DayPicker>` forwards only `className`, `style` and `data-*` to its root. */
function CalendarGridRoot({ rootRef, ...rootProps }: RootProps) {
  const {
    rootRender,
    rootRef: ref,
    rootProps: extra
  } = useGridRootContext('Calendar.Grid');
  return useRender({
    defaultTagName: 'div',
    ref,
    render: rootRender,
    props: mergeProps<'div'>(rootProps, extra)
  });
}

function CalendarWeeks(props: MonthGridProps) {
  const { loading } = useGridContext('Calendar.Grid');
  const { readOnly } = useCalendarContext('Calendar.Grid');
  return (
    <div className={styles.weeks} data-slot='calendar-weeks'>
      <table
        data-slot='calendar-table'
        aria-busy={loading || undefined}
        aria-readonly={readOnly || undefined}
        {...props}
      />
      <div
        className={styles.skeleton}
        data-slot='calendar-skeleton'
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

function CalendarMonthCaption({
  calendarMonth,
  displayIndex,
  /* The class RDP passes here hides the caption, which this header must not be. */
  className: _className,
  ...props
}: MonthCaptionProps) {
  const { timeZone } = useCalendarContext('Calendar.Grid');
  const days = useCalendarDaysContext();

  return (
    <div
      className={styles['month-header']}
      data-slot='calendar-month-header'
      {...props}
    >
      {displayIndex === 0 && (
        <CalendarPrevMonth className={styles['month-header-prev']} />
      )}
      <span
        className={cx(styles.caption, styles['month-header-caption'])}
        data-slot='calendar-month-header-caption'
      >
        {formatCaptionLabel(calendarMonth.date, timeZone)}
      </span>
      {displayIndex === (days?.numberOfMonths ?? 1) - 1 && (
        <CalendarNextMonth className={styles['month-header-next']} />
      )}
    </div>
  );
}

export interface CalendarDayProps
  extends DayButtonProps,
    Pick<useRender.ComponentProps<'button'>, 'render' | 'ref'> {}

export function CalendarDay({
  day,
  modifiers,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarDayProps) {
  const { scale, readOnly } = useCalendarContext('Calendar.Day');
  const { dateInfo, tooltipMessages, showTooltip } =
    useGridContext('Calendar.Day');

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
        'data-slot': 'calendar-day',
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
                data-slot='calendar-day-info'
              >
                {info}
              </span>
            )}
            <span
              className={styles['day-number']}
              data-slot='calendar-day-number'
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
      <span className={styles['day-trigger']} data-slot='calendar-day-trigger'>
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
            data-slot='calendar-day-trigger'
          />
        }
      >
        {button}
      </Tooltip.Trigger>
      {message != null && (
        <Tooltip.Content side='top' data-slot='calendar-day-tooltip'>
          {message}
        </Tooltip.Content>
      )}
    </Tooltip>
  );
}

CalendarDay.displayName = 'Calendar.Day';

export interface CalendarWeekdayProps
  extends WeekdayProps,
    Pick<useRender.ComponentProps<'th'>, 'render' | 'ref'> {}

export function CalendarWeekday({
  className,
  render,
  ref,
  ...props
}: CalendarWeekdayProps) {
  return useRender({
    defaultTagName: 'th',
    ref,
    render,
    props: mergeProps<'th'>(
      {
        className: cx(styles.weekday, className),
        'data-slot': 'calendar-weekday'
      } as useRender.ComponentProps<'th'>,
      props
    )
  });
}

CalendarWeekday.displayName = 'Calendar.Weekday';

function CalendarWeekNumber({ week, children, ...props }: WeekNumberProps) {
  const { showOutsideDays } = useGridContext('Calendar.Grid');
  /* A padding row's number counts a week the grid never showed. */
  const counts = showOutsideDays || week.days.some(day => !day.outside);
  return (
    <th data-slot='calendar-week-number' {...props}>
      {counts ? children : null}
    </th>
  );
}

function CalendarWeekNumberHeader(props: WeekNumberHeaderProps) {
  return <th data-slot='calendar-week-number-header' {...props} />;
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
