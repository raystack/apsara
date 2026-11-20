'use client';

import { cva, cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import {
  DayPicker,
  DayPickerProps,
  DropdownProps,
  type Mode
} from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from '~/icons';

import { IconButton } from '../icon-button';
import { Select } from '../select';
import { Skeleton } from '../skeleton';
import { Tooltip } from '../tooltip';
import styles from './calendar.module.css';

// `timezone` plugin depends on `utc`.
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

interface OnDropdownOpen {
  /** Called when a month or year dropdown in the caption opens. */
  onDropdownOpen?: VoidFunction;
}

export interface CalendarPropsExtended {
  /**
   * Whether a day shows its message from `tooltipMessages` in a tooltip.
   * @default false
   */
  showTooltip?: boolean;
  /**
   * Tooltip text for each day, keyed by the date as `DD-MM-YYYY` in `timeZone`.
   */
  tooltipMessages?: Record<string, ReactNode>;
  /**
   * Content above the day number. A record is keyed by the date as `DD-MM-YYYY` in `timeZone`. A function gets the day's `Date` and must apply `timeZone` itself.
   */
  dateInfo?: Record<string, ReactNode> | ((date: Date) => ReactNode | null);
  /**
   * Whether to cover the days with a skeleton and disable navigation and selection.
   * @default false
   */
  loading?: boolean;
  timeZone?: string;
}

interface CalendarDayPickerDefaults {
  /**
   * Enable the selection of a single day, multiple days, or a range of days.
   * @default "single"
   */
  mode?: Mode | undefined;
  /**
   * Whether to show the days of the previous and next months.
   * @default true
   */
  showOutsideDays?: boolean;
}

export type CalendarProps = DayPickerProps &
  CalendarDayPickerDefaults &
  OnDropdownOpen &
  CalendarPropsExtended;

const root = cva(styles.calendarRoot);

interface DropDownComponentProps extends DropdownProps, OnDropdownOpen {
  disabled?: boolean;
}

function DropDown({
  options = [],
  value,
  onChange,
  onDropdownOpen,
  disabled
}: DropDownComponentProps) {
  const [open, setOpen] = useState(false);

  /*
   * Mirror the callback into a ref so the effect depends only on `open`,
   * parents that re-create `onDropdownOpen` per render would otherwise cause
   * a re-fire on every parent render where `open` is true.
   */
  const onDropdownOpenRef = useRef(onDropdownOpen);
  useEffect(() => {
    onDropdownOpenRef.current = onDropdownOpen;
  });

  useEffect(() => {
    if (open) onDropdownOpenRef.current?.();
  }, [open]);

  function handleChange(value: string) {
    if (onChange) {
      onChange({ target: { value } } as ChangeEvent<HTMLSelectElement>);
    }
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={handleChange}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        className={styles.dropdownTrigger}
        iconProps={{
          className: styles.dropdownIcon
        }}
        size='small'
        variant='text'
        disabled={disabled}
        data-slot='calendar-dropdown'
      >
        <Select.Value />
      </Select.Trigger>
      <Select.Content
        className={styles.dropdownContent}
        data-slot='calendar-dropdown-content'
      >
        {options.map(opt => (
          <Select.Item
            value={opt.value.toString()}
            key={opt.value}
            disabled={opt.disabled}
          >
            {opt.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
}

export const Calendar = function ({
  className,
  classNames,
  showOutsideDays = true,
  onDropdownOpen,
  showTooltip = false,
  tooltipMessages = {},
  dateInfo = {},
  loading = false,
  timeZone,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      timeZone={timeZone}
      components={{
        PreviousMonthButton: ({ children, ...props }) => (
          <IconButton
            {...props}
            disabled={loading || props.disabled}
            className={cx(props.className, loading && styles.disabled)}
            size={3}
            aria-label='Previous month'
            data-slot='calendar-nav-previous'
          >
            <ChevronLeftIcon />
          </IconButton>
        ),
        NextMonthButton: ({ children, ...props }) => (
          <IconButton
            {...props}
            disabled={loading || props.disabled}
            className={cx(props.className, loading && styles.disabled)}
            size={3}
            aria-label='Next month'
            data-slot='calendar-nav-next'
          >
            <ChevronRightIcon />
          </IconButton>
        ),
        Dropdown: (props: DropdownProps) => (
          <DropDown
            {...props}
            onDropdownOpen={onDropdownOpen}
            disabled={loading}
          />
        ),
        DayButton: props => {
          const { day, ...buttonProps } = props;
          /*
           * Format in the picker's zone so the key matches the rendered day
           * (otherwise UTC-day grids miss messages keyed at UTC midnight when
           * the browser is in a non-UTC zone).
           */
          const dateKey = timeZone
            ? dayjs(day.date).tz(timeZone).format('DD-MM-YYYY')
            : dayjs(day.date).format('DD-MM-YYYY');
          const message = tooltipMessages[dateKey];

          const dateComponent =
            typeof dateInfo === 'function'
              ? dateInfo(day.date)
              : dateInfo[dateKey];
          const hasDateInfo = Boolean(dateComponent);

          return (
            <Tooltip disabled={loading || !showTooltip || !message}>
              <Tooltip.Trigger
                render={
                  <button
                    {...buttonProps}
                    disabled={loading || buttonProps.disabled}
                    className={cx(
                      buttonProps.className,
                      hasDateInfo && styles.dayButtonWithInfo
                    )}
                    data-slot='calendar-day'
                  >
                    {hasDateInfo && (
                      <div
                        className={styles.dayInfo}
                        data-slot='calendar-day-info'
                      >
                        {dateComponent}
                      </div>
                    )}
                    <span
                      className={styles.dayNumber}
                      data-slot='calendar-day-number'
                    >
                      {buttonProps.children}
                    </span>
                  </button>
                }
              />
              <Tooltip.Content side='top' data-slot='calendar-day-tooltip'>
                {message}
              </Tooltip.Content>
            </Tooltip>
          );
        },
        MonthGrid: props => (
          <div className={styles.monthGridWrap} data-slot='calendar-month-grid'>
            <table
              {...props}
              aria-busy={loading || undefined}
              data-slot='calendar-grid-table'
            />
            <div
              className={styles.monthGridSkeleton}
              data-visible={loading || undefined}
              aria-hidden='true'
              data-slot='calendar-grid-skeleton'
            >
              <Skeleton
                count={5}
                height='18px'
                width='252px'
                style={{ marginBottom: 'var(--rs-space-6)' }}
              />
            </div>
          </div>
        )
      }}
      classNames={{
        caption_label: styles.captionLabel,
        button_previous: `${styles.navButton} ${styles.navButtonPrevious}`,
        button_next: `${styles.navButton} ${styles.navButtonNext}`,
        month_caption: styles.monthCaption,
        months: styles.months,
        nav: styles.nav,
        day: styles.day,
        today: styles.today,
        outside: styles.outside,
        week: styles.week,
        weekdays: styles.week,
        weekday: styles.weekday,
        disabled: styles.disabled,
        selected: styles.selected,
        day_button: styles.dayButton,
        range_middle: styles.rangeMiddle,
        range_end: styles.rangeEnd,
        range_start: styles.rangeStart,
        hidden: styles.hidden,
        dropdowns: styles.dropdowns,
        ...classNames
      }}
      className={root({ className })}
      data-slot='calendar'
      mode='single'
      {...props}
    />
  );
};

Calendar.displayName = 'Calendar';
