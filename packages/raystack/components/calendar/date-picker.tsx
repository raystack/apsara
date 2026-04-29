'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { PropsBase, PropsSingleRequired } from 'react-day-picker';
import { Input } from '../input';
import { InputProps } from '../input/input';
import { Popover } from '../popover';
import { PopoverContentProps } from '../popover/popover';
import { Calendar } from './calendar';
import styles from './calendar.module.css';

dayjs.extend(customParseFormat);

interface DatePickerProps {
  dateFormat?: string;
  inputProps?: InputProps;
  calendarProps?: PropsSingleRequired & PropsBase;
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
  value = new Date(),
  onSelect = () => {},
  children,
  showCalendarIcon = true,
  timeZone,
  popoverProps
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [error, setError] = useState<string>();

  const formattedDate = dayjs(selectedDate).format(dateFormat);

  const isDropdownOpenRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isInputFocused = useRef(false);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const isElementOutside = useCallback((el: HTMLElement) => {
    return (
      !isDropdownOpenRef.current && // Month and Year dropdown from Date picker
      !inputRef.current?.contains(el) && // Input
      !contentRef.current?.contains(el)
    );
  }, []);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      if (el && isElementOutside(el)) removeEventListeners();
    },
    [isElementOutside]
  );

  function registerEventListeners() {
    isInputFocused.current = true;
    document.addEventListener('mouseup', handleMouseDown);
  }

  function removeEventListeners(skipUpdate = false) {
    isInputFocused.current = false;
    setShowCalendar(false);

    const updatedVal = dayjs(selectedDateRef.current).format(dateFormat);

    if (inputRef.current) inputRef.current.value = updatedVal;
    if (!error && !skipUpdate) onSelect(dayjs(updatedVal).toDate());

    document.removeEventListener('mouseup', handleMouseDown);
  }

  const handleSelect = (day: Date) => {
    setSelectedDate(day);
    onSelect(day);
    setError(undefined);
    removeEventListeners(true);
  };

  function onDropdownOpen() {
    isDropdownOpenRef.current = true;
  }

  function onOpenChange(open?: boolean) {
    if (
      !isDropdownOpenRef.current &&
      !(isInputFocused.current && showCalendar)
    ) {
      setShowCalendar(Boolean(open));
    }

    isDropdownOpenRef.current = false;
  }

  function handleInputFocus() {
    if (isInputFocused.current) return;
    if (!showCalendar) setShowCalendar(true);
  }

  function handleInputBlur(event: React.FocusEvent) {
    if (isInputFocused.current) {
      const el = event.relatedTarget as HTMLElement | null;
      if (el && isElementOutside(el)) removeEventListeners();
    } else {
      registerEventListeners();
      setTimeout(() => inputRef.current?.select());
    }
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Enter' && inputRef.current) {
      inputRef.current.blur();
      removeEventListeners();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    const format = value.includes('/')
      ? 'DD/MM/YYYY'
      : value.includes('-')
        ? 'DD-MM-YYYY'
        : undefined;
    const date = dayjs(value, format);

    const isValidDate = date.isValid();

    const isAfter =
      calendarProps?.startMonth !== undefined
        ? dayjs(date).isSameOrAfter(calendarProps.startMonth)
        : true;
    const isBefore =
      calendarProps?.endMonth !== undefined
        ? dayjs(date).isSameOrBefore(calendarProps.endMonth)
        : true;

    const isValid =
      isValidDate && isAfter && isBefore && dayjs(date).isSameOrBefore(dayjs());

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
      ref={inputRef}
      value={formattedDate}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
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
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <Popover.Trigger
        nativeButton={isValidElement(trigger) ? false : true}
        render={isValidElement(trigger) ? trigger : <button>{trigger}</button>}
      />
      <Popover.Content
        ref={contentRef}
        {...popoverProps}
        className={cx(styles.calendarPopover, popoverProps?.className)}
        side={popoverProps?.side ?? 'top'}
      >
        <Calendar
          required={true}
          {...calendarProps}
          timeZone={timeZone}
          onDropdownOpen={onDropdownOpen}
          mode='single'
          selected={selectedDate}
          month={selectedDate}
          onSelect={handleSelect}
          onMonthChange={setSelectedDate}
        />
      </Popover.Content>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';
