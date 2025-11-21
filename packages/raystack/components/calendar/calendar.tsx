'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from '@radix-ui/react-icons';
import { cva, cx } from 'class-variance-authority';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import {
  DayPicker,
  DayPickerProps,
  DropdownProps,
  dateLib
} from 'react-day-picker';

import { Flex } from '../flex/flex';
import { IconButton } from '../icon-button';
import { Select } from '../select';
import { Skeleton } from '../skeleton';
import { Tooltip } from '../tooltip';
import styles from './calendar.module.css';

interface OnDropdownOpen {
  onDropdownOpen?: VoidFunction;
}

interface CalendarPropsExtended {
  showTooltip?: boolean;
  tooltipMessages?: Record<string, ReactNode>;
  dateInfo?: Record<string, ReactNode>;
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

  useEffect(() => {
    if (open && onDropdownOpen) onDropdownOpen();
  }, [open, onDropdownOpen]);

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
        <Select.ScrollUpButton asChild>
          <Flex justify='center'>
            <ChevronUpIcon />
          </Flex>
        </Select.ScrollUpButton>
        <Select.Viewport>
          {options.map(opt => (
            <Select.Item
              value={opt.value.toString()}
              key={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton asChild>
          <Flex justify='center'>
            <ChevronDownIcon />
          </Flex>
        </Select.ScrollDownButton>
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
        Chevron: props => {
          const icon =
            props.orientation === 'left' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            );

          return (
            <IconButton
              {...props}
              disabled={loadingData}
              className={cx(props.className, loadingData && styles.disabled)}
              size={3}
              aria-label={
                props.orientation === 'left' ? 'Previous month' : 'Next month'
              }
            >
              {icon}
            </IconButton>
          );
        },
        Dropdown: (props: DropdownProps) => (
          <DropDown
            {...props}
            onDropdownOpen={onDropdownOpen}
            disabled={loadingData}
          />
        ),
        DayButton: props => {
          const { day, ...buttonProps } = props;
          const dateKey = dateLib.format(day.date, 'dd-MM-yyyy');
          const message = tooltipMessages[dateKey];
          const dateComponent = dateInfo[dateKey];
          const hasDateInfo = Boolean(dateComponent);

          return (
            <Tooltip
              side='top'
              disabled={loadingData || !showTooltip || !message}
              message={message}
            >
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
                <span className={styles.dayNumber}>{buttonProps.children}</span>
              </button>
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
