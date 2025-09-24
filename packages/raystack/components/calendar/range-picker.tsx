'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DateRange, PropsBase, PropsRangeRequired } from 'react-day-picker';
import { Flex } from '../flex';
import { InputField } from '../input-field';
import { InputFieldProps } from '../input-field/input-field';
import { Popover } from '../popover';
import { PopoverContentProps } from '../popover/popover';
import { Calendar } from './calendar';
import styles from './calendar.module.css';

interface RangePickerProps {
  dateFormat?: string;
  inputFieldsProps?: { startDate?: InputFieldProps; endDate?: InputFieldProps };
  calendarProps?: PropsRangeRequired & PropsBase;
  onSelect?: (date: DateRange) => void;
  pickerGroupClassName?: string;
  value?: DateRange;
  defaultValue?: DateRange;
  children?:
    | React.ReactNode
    | ((props: { startDate: string; endDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  footer?: React.ReactNode;
  timeZone?: string;
  popoverProps?: PopoverContentProps;
}

type RangeFields = keyof DateRange;

export function RangePicker({
  dateFormat = 'DD/MM/YYYY',
  inputFieldsProps = {},
  calendarProps,
  onSelect = () => {},
  value,
  defaultValue = {
    to: new Date(),
    from: new Date()
  },
  pickerGroupClassName,
  children,
  showCalendarIcon = true,
  footer,
  timeZone,
  popoverProps
}: RangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentRangeField, setCurrentRangeField] =
    useState<RangeFields>('from');
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [currentMonth, setCurrentMonth] = useState(internalValue?.from);

  const selectedRange = value ?? internalValue;

  const startDate = selectedRange.from
    ? dayjs(selectedRange.from).format(dateFormat)
    : '';
  const endDate = selectedRange.to
    ? dayjs(selectedRange.to).format(dateFormat)
    : '';

  // Ensures two months are visible even when
  // current month is the last allowed month (endMonth).
  const computedDefaultMonth = useMemo(() => {
    let month = currentMonth;
    if (calendarProps?.endMonth) {
      const endMonth = dayjs(calendarProps.endMonth);
      const fromMonth = dayjs(currentMonth);

      if (fromMonth.isSame(endMonth, 'month')) {
        month = endMonth.subtract(1, 'month').toDate();
      }
    }
    return month;
  }, [currentMonth, calendarProps?.endMonth]);

  const onTriggerClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const field = e.currentTarget.dataset.rangeField;
      if (field === 'start') {
        setCurrentRangeField('from');
      } else {
        setCurrentRangeField('to');
      }
      if (showCalendar) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [showCalendar]
  );

  // Handle date selection with custom logic
  const handleSelect = (_: DateRange, selectedDay: Date) => {
    let newRange = { ...selectedRange };
    let newCurrentRangeField = currentRangeField;

    if (currentRangeField === 'from') {
      // If selecting start date and it's after the current end date
      if (
        selectedRange?.to &&
        dayjs(selectedDay).isAfter(dayjs(selectedRange.to))
      ) {
        newRange = { from: selectedDay };
        newCurrentRangeField = 'to';
      } else {
        newRange.from = selectedDay;
        if (!selectedRange?.to) newCurrentRangeField = 'to';
      }
    } else {
      // If selecting end date and it's before the current start date
      if (
        selectedRange?.from &&
        dayjs(selectedDay).isBefore(dayjs(selectedRange.from))
      ) {
        newRange = { from: selectedDay };
        newCurrentRangeField = 'to';
      } else newRange.to = selectedDay;
    }

    if (newCurrentRangeField !== currentRangeField)
      setCurrentRangeField(newCurrentRangeField);

    setInternalValue(newRange);
    onSelect(newRange);
  };

  const defaultTrigger = (
    <Flex gap='medium' className={pickerGroupClassName}>
      <InputField
        size='small'
        placeholder='Select start date'
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        {...(inputFieldsProps.startDate ?? {})}
        value={startDate}
        readOnly
        data-range-field='start'
        data-active={showCalendar && currentRangeField === 'from'}
        onClick={onTriggerClick}
      />

      <InputField
        size='small'
        placeholder='Select end date'
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        {...(inputFieldsProps.endDate ?? {})}
        value={endDate}
        readOnly
        data-range-field='end'
        data-active={showCalendar && currentRangeField === 'to'}
        onClick={onTriggerClick}
      />
    </Flex>
  );

  const trigger =
    typeof children === 'function'
      ? children({ startDate, endDate })
      : children || defaultTrigger;

  return (
    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Content
        {...popoverProps}
        className={cx(styles.calendarPopover, popoverProps?.className)}
        side={popoverProps?.side ?? 'top'}
      >
        <Calendar
          showOutsideDays={false}
          numberOfMonths={2}
          defaultMonth={selectedRange.from}
          required={true}
          {...calendarProps}
          timeZone={timeZone}
          mode='range'
          month={computedDefaultMonth}
          selected={selectedRange}
          onSelect={handleSelect}
          onMonthChange={setCurrentMonth}
        />
        {footer && (
          <Flex
            align='center'
            justify='center'
            className={styles.calendarFooter}
          >
            {footer}
          </Flex>
        )}
      </Popover.Content>
    </Popover>
  );
}
