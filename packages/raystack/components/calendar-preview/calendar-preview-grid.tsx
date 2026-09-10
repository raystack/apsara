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
import {
  type CalendarPreviewValue,
  isScaleValue
} from './calendar-preview-root';
import {
  formatCaptionLabel,
  formatWeekdayLabel,
  parseKey
} from './date-adapter';

/* The only file that may import react-day-picker. It runs with
   `hideNavigation` and `captionLayout='label'` so it never mounts a `Select`,
   and the selection props come from root context rather than from
   `CalendarPreviewGridProps` — which is what lets `...props` stay last. */
/* Split in two on purpose. Every day button and its tooltip wrapper consume
   the day-facing half, so it is memoized — an unstable value there re-renders
   all 42 cells per month on any grid render. The root half carries
   `rootProps`, a fresh rest-spread every render that cannot be memoized
   without going stale; it has exactly one consumer, so its instability costs
   one element instead of 42. */
interface GridContextValue {
  dateInfo?: (date: Date) => ReactNode;
  tooltipMessages?: (date: Date) => ReactNode;
  showTooltip: boolean;
  loading: boolean;
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
  /**
   * Always render six week rows, so the grid height never jumps between a
   * 4-, 5- and 6-row month.
   *
   * On by default. Phases 3-4 put this calendar in a popover, where a grid
   * that changes height on navigation resizes the surface under the user's
   * cursor. Opt out with `fixedWeeks={false}` where the calendar is inline
   * and the trailing blank row is not wanted.
   *
   * @defaultValue true
   */
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
  /* Swallowed, not forwarded: `.Grid` renders the day cells from context, and
     `props` is spread last into the day-picker root, so a stray child would
     win over them and blank the calendar. `.Day` / `.Weekday` are `components`
     overrides, not children. */
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
  } = useCalendarPreviewContext<CalendarPreviewValue>('CalendarPreview.Grid');
  const days = useCalendarPreviewDaysContext();
  const setBusy = days?.setBusy;

  /* The header is a sibling, so loading has to reach their common parent for
     navigation to go inert with it. */
  useEffect(() => {
    if (!setBusy) return;
    setBusy(loading);
    return () => setBusy(false);
  }, [loading, setBusy]);

  /* `dateInfo` and `tooltipMessages` are functions, so a consumer passing
     inline arrows still invalidates this every render — which is why the docs
     ask for them to be memoized at the call site. */
  const gridContext = useMemo<GridContextValue>(
    () => ({ dateInfo, tooltipMessages, showTooltip, loading }),
    [dateInfo, tooltipMessages, showTooltip, loading]
  );

  const gridRootContext: GridRootContextValue = {
    rootRender: render,
    rootRef: ref,
    rootProps: props
  };

  const months = days?.numberOfMonths ?? 1;

  /* A scale-aware root carries `{ date, scale }` at day scale too, so the day
     to mark is inside the value rather than being it. */
  const selected = isScaleValue(value)
    ? parseKey(value.date)
    : value instanceof Date
      ? value
      : undefined;

  /* Several months have no single header to caption them, so each month
     captions itself and `.Days` renders no `.Header` above. */
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

  /* Every click goes to the root, which owns both the single commit and the
     from/to machine — completing a range has to close the popover, and that
     must travel through the root's open state rather than from in here. It
     also keeps the `readOnly` / `disabled` guard in one place, so every path
     in and out of the calendar inherits the same one. */
  const handleSelect = useCallback(
    (_selected: unknown, triggerDate: Date) => {
      selectDay(triggerDate);
    },
    [selectDay]
  );

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
            selected={draft ?? undefined}
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

/* `<DayPicker>` forwards only `className`, `style` and `data-*` to its root,
   so `render`, `ref` and the consumer's props have to land here instead. */
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
  const { scale, readOnly } = useCalendarPreviewContext('CalendarPreview.Day');
  const { dateInfo, tooltipMessages, showTooltip } = useGridContext(
    'CalendarPreview.Day'
  );

  /* Replacing react-day-picker's `DayButton` also replaces the effect it uses
     to move DOM focus, which lives on that component rather than in the
     library's keyboard handler. Without this, an arrow key moves RDP's focus
     target and the `data-draft` marker while focus stays put — so the next
     Enter commits the day the user navigated away from. */
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
          styles['day-button'],
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
      /* After the spread, unlike everything else here. RDP sets
         `aria-disabled` per day and passes `undefined` for an available one,
         which would erase this — and `readOnly` is root state that has to win
         over a per-day value. It is not `disabled`: a read-only grid stays
         focusable and arrow-navigable, which is the whole difference. */
      readOnly
        ? ({ 'aria-disabled': true } as useRender.ComponentProps<'button'>)
        : {}
    )
  });

  /* The wrapper is unconditional. Two reasons, both measured: a disabled
     button fires no pointer events, so hanging the trigger on the day itself
     hid exactly the tooltip a blocked day needs; and returning `button` bare
     when there is no message changes the element type at that position, which
     tears down the DOM node and drops focus the moment `showTooltip` or a
     per-day message flips. */
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

/* `showWeekNumber` renders these two, and RFC 005 asks for a `data-slot` on
   every rendered element. Overridden only to carry the slot — the classes
   already arrive through `GRID_CLASS_NAMES`. */
function CalendarPreviewWeekNumber({ week: _week, ...props }: WeekNumberProps) {
  return <th data-slot='calendar-preview-week-number' {...props} />;
}

function CalendarPreviewWeekNumberHeader(props: WeekNumberHeaderProps) {
  return <th data-slot='calendar-preview-week-number-header' {...props} />;
}

/* Three-letter names from the adapter rather than react-day-picker's
   two-letter default, because the frames spell them `Sun Mon Tue`.

   English only, and deliberately so for now: there is no `locale` prop on this
   family yet, so every `format()` call falls back to date-fns' `en-US`, and
   the nav, reset and caption labels are hardcoded literals besides. Adding
   `locale` means threading it through `date-adapter` and adding a label bag
   for the literals — a change to make once, not one to half-make here. */
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
