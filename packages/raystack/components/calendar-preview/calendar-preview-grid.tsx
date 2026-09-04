'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo
} from 'react';
import {
  type CustomComponents,
  type DayButtonProps,
  DayPicker,
  type DayPickerProps,
  type MonthCaptionProps,
  type MonthGridProps,
  type RootProps,
  type WeekdayProps
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
import { formatCaptionLabel, formatWeekdayLabel } from './date-adapter';

/* The only file that may import react-day-picker. It runs with
   `hideNavigation` and `captionLayout='label'` so it never mounts a `Select`,
   and the selection props come from root context rather than from
   `CalendarPreviewGridProps` — which is what lets `...props` stay last. */
interface GridContextValue {
  dateInfo?: (date: Date) => ReactNode;
  tooltipMessages?: (date: Date) => ReactNode;
  showTooltip: boolean;
  loading: boolean;
  rootRender: useRender.ComponentProps<'div'>['render'];
  rootRef: useRender.ComponentProps<'div'>['ref'];
  rootProps: useRender.ComponentProps<'div'>;
}

const GridContext = createContext<GridContextValue | null>(null);

function useGridContext(part: string): GridContextValue {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error(`${part} must be used within <CalendarPreview.Grid>`);
  }
  return context;
}

export interface CalendarPreviewGridProps
  extends useRender.ComponentProps<'div'> {
  /** Always render six week rows, so the grid height never jumps. */
  fixedWeeks?: boolean;
  /**
   * Render the days either side of the month.
   *
   * Off, unlike the current `DatePicker`: reference A ends every grid on the
   * last day of its month and leaves the leading cells blank. The cells are
   * still rendered, so the week rows keep their shape — they are just empty.
   *
   * @defaultValue false
   */
  showOutsideDays?: boolean;
  /** Render a week-number column. */
  showWeekNumber?: boolean;
  /** First day of the week, 0 (Sunday) to 6. */
  weekStartsOn?: DayPickerProps['weekStartsOn'];
  /** Extra day modifiers, passed through to react-day-picker. */
  modifiers?: DayPickerProps['modifiers'];
  /** Override react-day-picker's component slots. */
  components?: Partial<CustomComponents>;
  /**
   * Extra content for a day, rendered above the date number.
   *
   * A function, not a record: the record form keyed cells by a formatted
   * string and silently missed every day once a `timeZone` shifted the key.
   */
  dateInfo?: (date: Date) => ReactNode;
  /** Whether day tooltips are shown at all. @defaultValue false */
  showTooltip?: boolean;
  /** The tooltip for a day, or nothing. A function, for the same reason. */
  tooltipMessages?: (date: Date) => ReactNode;
  /** Cover the grid with a skeleton and stop navigation. */
  loading?: boolean;
}

export function CalendarPreviewGrid({
  fixedWeeks,
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
  ...props
}: CalendarPreviewGridProps) {
  const {
    value,
    setValue,
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

  /* The header is a sibling, so loading has to reach their common parent for
     navigation to go inert with it. */
  useEffect(() => {
    if (!setBusy) return;
    setBusy(loading);
    return () => setBusy(false);
  }, [loading, setBusy]);

  const gridContext: GridContextValue = {
    dateInfo,
    tooltipMessages,
    showTooltip,
    loading,
    rootRender: render,
    rootRef: ref,
    rootProps: props
  };

  const months = days?.numberOfMonths ?? 1;

  /* Several months have no single header to caption them, so each month
     captions itself and `.Days` renders no `.Header` above. */
  const slots = useMemo(
    () => ({
      Root: CalendarPreviewGridRoot,
      MonthGrid: CalendarPreviewWeeks,
      DayButton: CalendarPreviewDay,
      Weekday: CalendarPreviewWeekday,
      ...(months > 1 ? { MonthCaption: CalendarPreviewMonthCaption } : {}),
      ...components
    }),
    [components, months]
  );

  const handleSelect = (selected: Date | undefined, triggerDate: Date) => {
    if (readOnly || disabled) return;
    setValue(selected ?? null, selected ? 'select' : 'clear', triggerDate);
  };

  /* `mode`, `required`, `selected` and `onSelect` stay on the elements below:
     RDP discriminates its union on the literal `required`, which a `boolean`
     cannot narrow, so both arms are written out rather than cast away. */
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
    classNames: GRID_CLASS_NAMES
  } satisfies Omit<DayPickerProps, 'mode' | 'required' | 'selected'> & {
    'data-slot': string;
  };

  return (
    <GridContext value={gridContext}>
      {clearable ? (
        <DayPicker
          {...base}
          mode='single'
          required={false}
          selected={value ?? undefined}
          onSelect={handleSelect}
        />
      ) : (
        <DayPicker
          {...base}
          mode='single'
          required
          selected={value ?? undefined}
          onSelect={handleSelect}
        />
      )}
    </GridContext>
  );
}

CalendarPreviewGrid.displayName = 'CalendarPreview.Grid';

/* `<DayPicker>` forwards only `className`, `style` and `data-*` to its root,
   so `render`, `ref` and the consumer's props have to land here instead. */
function CalendarPreviewGridRoot({ rootRef, ...rootProps }: RootProps) {
  const {
    rootRender,
    rootRef: ref,
    rootProps: extra
  } = useGridContext('CalendarPreview.Grid');
  return useRender({
    defaultTagName: 'div',
    ref,
    render: rootRender,
    props: mergeProps<'div'>(rootProps, extra)
  });
}

function CalendarPreviewWeeks(props: MonthGridProps) {
  const { loading } = useGridContext('CalendarPreview.Grid');
  return (
    <div className={styles.weeks} data-slot='calendar-preview-weeks'>
      <table
        data-slot='calendar-preview-table'
        aria-busy={loading || undefined}
        {...props}
      />
      <div
        className={styles.skeleton}
        data-slot='calendar-preview-skeleton'
        data-visible={loading || undefined}
        aria-hidden='true'
      >
        <Skeleton
          count={5}
          height='var(--rs-space-5)'
          width='100%'
          containerClassName={styles['skeleton-rows']}
        />
      </div>
    </div>
  );
}

/* Three fixed grid columns rather than spacer elements: the empty nav track is
   still reserved when a month carries no button, so every caption centres on
   its own grid instead of drifting toward the buttonless side. */
function CalendarPreviewMonthCaption({
  calendarMonth,
  displayIndex,
  /* The class react-day-picker passes here hides the caption, which is what
     the single-month layout wants and this header must not be. */
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
        data-slot='calendar-preview-caption'
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

/* At day scale the draft is the roving-focus cell — arrowed to, not entered.
   PR 5's scale-switch draft writes the same attribute. */
export function CalendarPreviewDay({
  day,
  modifiers,
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewDayProps) {
  const { scale } = useCalendarPreviewContext('CalendarPreview.Day');
  const { dateInfo, tooltipMessages, showTooltip } = useGridContext(
    'CalendarPreview.Day'
  );

  const info = dateInfo?.(day.date);
  const message = showTooltip ? tooltipMessages?.(day.date) : null;

  const button = useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: mergeProps<'button'>(
      {
        type: 'button',
        className: cx(
          styles['day-button'],
          info != null && styles['day-button-with-info'],
          className
        ),
        'data-slot': 'calendar-preview-day',
        'data-scale': scale,
        'data-selected': modifiers.selected || undefined,
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
      props
    )
  });

  if (message == null) return button;

  return (
    <Tooltip>
      <Tooltip.Trigger render={button} />
      <Tooltip.Content side='top' data-slot='calendar-preview-day-tooltip'>
        {message}
      </Tooltip.Content>
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

/* Locale-derived in the adapter, so a localized calendar gets its own
   abbreviation rather than a sliced English one. */
const GRID_FORMATTERS: DayPickerProps['formatters'] = {
  formatWeekdayName: date => formatWeekdayLabel(date)
};

/* month_caption is hidden, not removed: `.Header` owns the visible caption,
   and RDP still labels each table through it. */
const GRID_CLASS_NAMES: DayPickerProps['classNames'] = {
  months: styles.months,
  month: styles.month,
  month_caption: styles['month-caption'],
  caption_label: styles['caption-label'],
  weeks: styles.weeks,
  week: styles.week,
  weekdays: styles.weekdays,
  day: styles.day,
  today: styles.today,
  outside: styles.outside,
  disabled: styles.disabled,
  selected: styles.selected,
  hidden: styles.hidden,
  week_number: styles['week-number'],
  week_number_header: styles['week-number-header']
};
