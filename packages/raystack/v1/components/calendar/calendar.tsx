import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import { cva } from 'class-variance-authority';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  dateLib,
  DayPicker,
  DayPickerProps,
  DropdownProps,
} from 'react-day-picker';
import Skeleton from 'react-loading-skeleton';

import { Flex } from '../flex/flex';
import { Select } from '../select';
import { Tooltip } from '../tooltip';
import styles from './calendar.module.css';

interface OnDropdownOpen {
  onDropdownOpen?: VoidFunction;
}

interface CalendarPropsExtended {
  showTooltip?: boolean;
  tooltipMessages?: { [key: string]: any };
  loadingData?: boolean;
}

export type CalendarProps = DayPickerProps &
  OnDropdownOpen &
  CalendarPropsExtended;

const root = cva(styles.calendarRoot);

function DropDown({
  options = [],
  value,
  onChange,
  onDropdownOpen,
}: DropdownProps & OnDropdownOpen) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && onDropdownOpen) onDropdownOpen();
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
        className={styles.dropdown_trigger}
        iconProps={{
          className: styles.dropdown_icon,
        }}
        stopPropagation={true}
      >
        <Select.Value />
      </Select.Trigger>
      <Select.Content className={styles.dropdown_content}>
        <Select.ScrollUpButton asChild>
          <Flex justify={'center'}>
            <ChevronUpIcon />
          </Flex>
        </Select.ScrollUpButton>
        <Select.Viewport>
          {options.map((opt) => (
            <Select.Item
              value={opt.value.toString()}
              key={opt.value}
              disabled={opt.disabled}
              textProps={{
                className: styles.dropdown_item_text,
              }}
            >
              {opt.label}
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton asChild>
          <Flex justify={'center'}>
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
  loadingData = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      components={{
        Chevron: (props) => {
          if (props.orientation === 'left') {
            return <ChevronLeftIcon {...props} />;
          }
          return <ChevronRightIcon {...props} />;
        },
        Dropdown: (props: DropdownProps) => (
          <DropDown {...props} onDropdownOpen={onDropdownOpen} />
        ),
        DayButton: (props) => {
          const { day, ...buttonProps } = props;
          const message =
            tooltipMessages[dateLib.format(day.date, 'dd-MM-yyyy')];
          return (
            <Tooltip
              side="top"
              disabled={loadingData || !showTooltip || !message}
              message={message}
            >
              <button {...buttonProps} />
            </Tooltip>
          );
        },
        MonthGrid: (props) =>
          loadingData ? (
            <Skeleton
              count={6}
              height="12px"
              width="252px"
              style={{ marginBottom: "var(--rs-space-5)" }}
              highlightColor="var(--rs-color-background-base-primary)"
              baseColor="var(--rs-color-background-base-primary-hover)"
            />
          ) : (
            <table {...props} />
          ),
      }}
      classNames={{
        caption_label: styles.caption_label,
        button_previous: `${styles.nav_button} ${styles.nav_button_previous}`,
        button_next: `${styles.nav_button} ${styles.nav_button_next}`,
        month_caption: styles.month_caption,
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
        day_button: styles.day_button,
        range_middle: styles.range_middle,
        range_end: styles.range_end,
        range_start: styles.range_start,
        hidden: styles.hidden,
        dropdowns: styles.dropdowns,
        ...classNames,
      }}
      className={root({ className })}
      mode="single"
      {...props}
    />
  );
};
