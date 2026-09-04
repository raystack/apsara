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

/*
 * The only file in `calendar-preview/` that imports react-day-picker.
 *
 * RDP earns its place for the day grid alone — roving tabindex, week
 * construction, outside days, locale weekday order. What changes is the
 * boundary: it runs with `hideNavigation` and `captionLayout='label'`, so it
 * never mounts a `Select`, and `mode`, `selected`, `onSelect`, `required`,
 * `month`, `onMonthChange` and `timeZone` come from root context rather than
 * from props. None of them is in `CalendarPreviewGridProps`, so nothing has to
 * be force-overridden after the consumer's spread — `...props` really is last.
 */

/** Props the grid shares with the cells it renders. */
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
   * @defaultValue true
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
   * string, which silently missed every day once a `timeZone` shifted the key.
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
  showOutsideDays = true,
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

  /* The header sits beside the grid, not inside it, so the loading state has
   * to travel up to their common parent for navigation to go inert with it. */
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

  const slots = useMemo(
    () => ({
      Root: CalendarPreviewGridRoot,
      MonthGrid: CalendarPreviewWeeks,
      DayButton: CalendarPreviewDay,
      Weekday: CalendarPreviewWeekday,
      ...components
    }),
    [components]
  );

  const handleSelect = (selected: Date | undefined, triggerDate: Date) => {
    if (readOnly || disabled) return;
    setValue(selected ?? null, selected ? 'select' : 'clear', triggerDate);
  };

  /*
   * Everything outside the selection arm. `mode`, `required`, `selected` and
   * `onSelect` stay on the elements below: react-day-picker discriminates its
   * props union on the literal `required`, which a `boolean` cannot narrow, so
   * the two arms are written out rather than cast away. The union is contained
   * here and reaches no consumer.
   */
  const base = {
    month,
    onMonthChange: setMonth,
    timeZone,
    today,
    hideNavigation: true,
    captionLayout: 'label',
    numberOfMonths: days?.numberOfMonths ?? 1,
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

/*
 * `render`, `ref` and the consumer's remaining props reach the root here
 * rather than on `<DayPicker>`, which forwards only `className`, `style` and
 * `data-*` to its root element.
 */
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

/** The weeks table, plus the skeleton that covers it while loading. */
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

export interface CalendarPreviewDayProps
  extends DayButtonProps,
    Pick<useRender.ComponentProps<'button'>, 'render' | 'ref'> {}

/**
 * One day cell, bound to react-day-picker's `DayButton` slot.
 *
 * Carries the cell state alongside its slot: `data-selected`, `data-draft`,
 * `data-unavailable`, `data-today`, `data-outside` and `data-scale`. At day
 * scale the draft is the roving-focus cell — arrowed to but not yet entered.
 */
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

/** One weekday heading, bound to react-day-picker's `Weekday` slot. */
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

/*
 * The caption is rendered but visually hidden: `.Header` owns the visible one,
 * while react-day-picker keeps labelling each month grid through `aria-label`
 * on the table, so nothing is lost to a screen reader.
 */
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
