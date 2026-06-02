'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { cva, cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { DayPicker, DayPickerProps, DropdownProps } from 'react-day-picker';

import { IconButton } from '../icon-button';
import { Select } from '../select';
import { Skeleton } from '../skeleton';
import { Tooltip } from '../tooltip';
import styles from './calendar.module.css';

// `timezone` plugin depends on `utc`.
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

interface OnDropdownOpen {
  onDropdownOpen?: VoidFunction;
}

export interface CalendarPropsExtended {
  showTooltip?: boolean;
  tooltipMessages?: Record<string, ReactNode>;
  /*
   * Record keys are tz-aware `DD-MM-YYYY`; function form gets raw `day.date`
   * (consumer must apply `timeZone` themselves to stay consistent).
   */
  dateInfo?: Record<string, ReactNode> | ((date: Date) => ReactNode | null);
  loadingData?: boolean;
  timeZone?: string;
}

export type CalendarProps = DayPickerProps &
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
   * Mirror the callback into a ref so the effect depends only on `open` —
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
      >
        <Select.Value />
      </Select.Trigger>
      <Select.Content className={styles.dropdownContent}>
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
  loadingData = false,
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
            disabled={loadingData ?? props.disabled}
            className={cx(props.className, loadingData && styles.disabled)}
            size={3}
            aria-label='Previous month'
          >
            <ChevronLeftIcon />
          </IconButton>
        ),
        NextMonthButton: ({ children, ...props }) => (
          <IconButton
            {...props}
            disabled={loadingData ?? props.disabled}
            className={cx(props.className, loadingData && styles.disabled)}
            size={3}
            aria-label='Next month'
          >
            <ChevronRightIcon />
          </IconButton>
        ),
        Dropdown: (props: DropdownProps) => (
          <DropDown
            {...props}
            onDropdownOpen={onDropdownOpen}
            disabled={loadingData}
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
            <Tooltip disabled={loadingData || !showTooltip || !message}>
              <Tooltip.Trigger
                render={
                  <button
                    {...buttonProps}
                    className={cx(
                      buttonProps.className,
                      hasDateInfo && styles.dayButtonWithInfo
                    )}
                  >
                    {hasDateInfo && (
                      <div className={styles.dayInfo}>{dateComponent}</div>
                    )}
                    <span className={styles.dayNumber}>
                      {buttonProps.children}
                    </span>
                  </button>
                }
              />
              <Tooltip.Content side='top'>{message}</Tooltip.Content>
            </Tooltip>
          );
        },
        MonthGrid: props =>
          loadingData ? (
            <Skeleton
              count={5}
              height='18px'
              width='252px'
              style={{ marginBottom: 'var(--rs-space-6)' }}
            />
          ) : (
            <table {...props} />
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
      mode='single'
      {...props}
    />
  );
};

Calendar.displayName = 'Calendar';
