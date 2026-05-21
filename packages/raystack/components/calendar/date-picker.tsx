'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { PropsBase } from 'react-day-picker';
import { Input } from '../input';
import { InputProps } from '../input/input';
import { Popover } from '../popover';
import { PopoverContentProps } from '../popover/popover';
import { Calendar, type CalendarPropsExtended } from './calendar';
import styles from './calendar.module.css';
import { usePickerPopover } from './use-picker-popover';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface DatePickerProps {
  dateFormat?: string;
  inputProps?: InputProps;
  /*
   * `mode` is owned by the picker; `selected`/`onSelect`/`required` aren't in
   * PropsBase so they're already unreachable.
   */
  calendarProps?: Omit<PropsBase, 'mode'> & CalendarPropsExtended;
  onSelect?: (date: Date) => void;
  value?: Date;
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  timeZone?: string;
  popoverProps?: PopoverContentProps;
}

export function DatePicker({
  dateFormat = 'DD/MM/YYYY',
  inputProps,
  calendarProps,
  value: valueProp,
  onSelect = () => {},
  children,
  showCalendarIcon = true,
  timeZone,
  popoverProps
}: DatePickerProps) {
  /*
   * Stabilise the "no value" default — a fresh `new Date()` per render would
   * flip the sync effect's timestamp dep across 1ms boundaries and loop.
   */
  const value = useMemo(() => valueProp ?? new Date(), [valueProp]);

  const [selectedDate, setSelectedDate] = useState(value);
  const [error, setError] = useState<string>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: compare on timestamp, not Date identity
  useEffect(() => {
    setSelectedDate(value);
  }, [value?.getTime()]);

  const formattedDate = dayjs(selectedDate).format(dateFormat);

  const [inputValue, setInputValue] = useState(formattedDate);

  /*
   * Separate from `selectedDate` so chevron/dropdown nav doesn't rewrite the
   * committed date — only day-clicks (`onSelect`) do.
   */
  const [viewMonth, setViewMonth] = useState<Date>(selectedDate);

  // Mirror for reading inside the outside-click callback closure.
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  // Sync the input when the committed date changes from a non-typing source.
  useEffect(() => {
    setInputValue(formattedDate);
  }, [formattedDate]);

  // Hook owns open/close, outside-click, and the year/month dropdown carve-out.
  const popover = usePickerPopover({
    onOutsideClick: () => closePicker()
  });

  // Reset the visible month on open or external selection change.
  useEffect(() => {
    if (popover.isOpen) setViewMonth(selectedDate);
  }, [popover.isOpen, selectedDate]);

  function closePicker() {
    popover.disengage();
    const committed = dayjs(selectedDateRef.current).format(dateFormat);
    setInputValue(committed);
    setError(undefined);
    if (!error) onSelect(dayjs(committed).toDate());
  }

  function handleSelect(day: Date) {
    setSelectedDate(day);
    onSelect(day);
    setError(undefined);
    popover.disengage();
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Enter' && popover.inputRef.current) {
      popover.inputRef.current.blur();
      closePicker();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInputValue(value);

    const date = dayjs(value, dateFormat, true);

    const isValidDate = date.isValid();

    /*
     * RDP treats `startMonth`/`endMonth` as months — compare against month
     * bounds so any day inside the boundary month is accepted.
     */
    const isAfter =
      calendarProps?.startMonth !== undefined
        ? date.isSameOrAfter(dayjs(calendarProps.startMonth).startOf('month'))
        : true;
    const isBefore =
      calendarProps?.endMonth !== undefined
        ? date.isSameOrBefore(dayjs(calendarProps.endMonth).endOf('month'))
        : true;

    /*
     * No upper-bound on "future": the grid lets users click future days, so
     * typing and clicking should agree.
     */
    const isValid = isValidDate && isAfter && isBefore;

    if (isValid) {
      setSelectedDate(date.toDate());
      setError(undefined);
    } else {
      setError('Invalid date');
    }
  }

  const defaultTrigger = (
    <Input
      size='small'
      placeholder='Select date'
      aria-invalid={!!error}
      className={styles.datePickerInput}
      trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
      {...inputProps}
      ref={popover.inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onFocus={popover.handleInputFocus}
      onBlur={popover.handleInputBlur}
      onKeyUp={handleKeyUp}
    />
  );

  const trigger =
    typeof children === 'function' ? (
      children({ selectedDate: formattedDate })
    ) : children ? (
      <div>{children}</div>
    ) : (
      <div>{defaultTrigger}</div>
    );

  return (
    <Popover open={popover.isOpen} onOpenChange={popover.onOpenChange}>
      <Popover.Trigger
        nativeButton={isValidElement(trigger) ? false : true}
        render={isValidElement(trigger) ? trigger : <button>{trigger}</button>}
      />
      <Popover.Content
        ref={popover.contentRef}
        {...popoverProps}
        className={cx(styles.calendarPopover, popoverProps?.className)}
        side={popoverProps?.side ?? 'top'}
      >
        <Calendar
          /*
           * No `captionLayout` default — 'dropdown' renders Apsara Selects
           * inside the popover whose unmount loops ("Maximum update depth").
           * Consumers can opt in via `calendarProps.captionLayout`.
           */
          {...calendarProps}
          /*
           * Must stay after spread: `required` is the discriminator for
           * RDP's prop union, and a widened value would break the narrowing.
           */
          required={true}
          timeZone={timeZone}
          onDropdownOpen={popover.markDropdownOpen}
          mode='single'
          selected={selectedDate}
          month={viewMonth}
          onSelect={handleSelect}
          onMonthChange={setViewMonth}
        />
      </Popover.Content>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';
