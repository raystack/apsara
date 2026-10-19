'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useRef, useState } from 'react';
import { type Modifiers, PropsBase } from 'react-day-picker';
import { CalendarIcon } from '~/icons';
import {
  type ChangeDetails,
  createChangeDetails
} from '~/shared/change-details';
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

/*
 * Picker-specific calendar surface. `mode` is owned by the picker; the other
 * forced keys (`selected`/`onSelect`/`required`) aren't in `PropsBase` so
 * they're already unreachable.
 */
type DatePickerCalendarSlot = Omit<PropsBase, 'mode'> & CalendarPropsExtended;

export type DatePickerChangeDetails = ChangeDetails<
  'item-press' | 'input-change'
>;

export interface DatePickerSlotProps {
  input?: InputProps;
  calendar?: DatePickerCalendarSlot;
  popover?: PopoverContentProps;
}

export interface DatePickerProps {
  dateFormat?: string;
  /**
   * Props for each picker slot. When both this and the legacy
   * `inputProps`/`calendarProps`/`popoverProps` are set, `slotProps` wins.
   */
  slotProps?: DatePickerSlotProps;
  /** @deprecated Use `slotProps.input` instead. */
  inputProps?: InputProps;
  /** @deprecated Use `slotProps.calendar` instead. */
  calendarProps?: DatePickerCalendarSlot;
  /** @deprecated Use `slotProps.popover` instead. */
  popoverProps?: PopoverContentProps;
  onValueChange?: (date: Date, details: DatePickerChangeDetails) => void;
  /**
   * Fires when the typed-input validation state changes: with a message when
   * the typed text stops parsing as a valid in-bounds date, and with
   * `undefined` when it becomes valid again (or the picker commits/closes).
   * DatePicker renders no error UI of its own, not even `aria-invalid`.
   * Lift this into `Field`'s `error` prop (or your form library) to display
   * it; `Field` also wires `aria-invalid` onto the input.
   */
  onErrorChange?: (error: string | undefined) => void;
  value?: Date;
  defaultValue?: Date;
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  timeZone?: string;
}

export function DatePicker({
  dateFormat = 'DD MMM YYYY',
  slotProps,
  inputProps: legacyInputProps,
  calendarProps: legacyCalendarProps,
  popoverProps: legacyPopoverProps,
  value: valueProp,
  defaultValue,
  onValueChange,
  onErrorChange,
  children,
  showCalendarIcon = true,
  timeZone
}: DatePickerProps) {
  // Merge legacy props with slotProps; slotProps wins when both are set.
  const inputProps = { ...legacyInputProps, ...slotProps?.input };
  const calendarProps = { ...legacyCalendarProps, ...slotProps?.calendar };
  const popoverProps = { ...legacyPopoverProps, ...slotProps?.popover };
  /*
   * Gate the popover when the input is disabled, since the trailing icon
   * renders as a sibling `<div>` to the `<input>`, so its clicks bubble
   * to `Popover.Trigger` even when the input itself is `disabled`.
   */
  const isDisabled = !!inputProps.disabled;
  const [value, setValueUnwrapped] = useControlled<Date | undefined>({
    controlled: valueProp,
    default: defaultValue,
    name: 'DatePicker',
    state: 'value'
  });
  // A valid typed date. Enter, blur or an outside click commits it.
  const [typedDate, setTypedDate] = useState<Date | undefined>();
  const selectedDate = typedDate ?? value;

  const errorRef = useRef<string | undefined>(undefined);

  function updateError(next: string | undefined) {
    if (next !== errorRef.current) onErrorChange?.(next);
    errorRef.current = next;
  }

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format(dateFormat)
    : '';

  const [inputValue, setInputValue] = useState(formattedDate);

  /*
   * Separate from `selectedDate` so chevron/dropdown nav doesn't rewrite the
   * committed date. Only day-clicks (`onSelect`) do. Initial month honors
   * `calendarProps.defaultMonth`, then the selected date, then today.
   */
  const [viewMonth, setViewMonth] = useState<Date>(
    calendarProps?.defaultMonth ?? selectedDate ?? new Date()
  );

  // Sync the input when the committed date changes from a non-typing source.
  useEffect(() => {
    setInputValue(formattedDate);
  }, [formattedDate]);

  // Hook owns open/close, outside-click, and the year/month dropdown carve-out.
  const popover = usePickerPopover({
    onOutsideClick: () => closePicker()
  });

  /*
   * Reset the visible month on open or external selection change. Honor
   * `calendarProps.defaultMonth` so consumers controlling the initial view
   * see it every time the picker opens, not only on first mount.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: compare on timestamp, not Date identity
  useEffect(() => {
    if (popover.isOpen) {
      setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
    }
  }, [popover.isOpen, selectedDate?.getTime(), calendarProps?.defaultMonth]);

  function setValue(date: Date, details: DatePickerChangeDetails) {
    setValueUnwrapped(date);
    onValueChange?.(date, details);
  }

  function closePicker(event?: Event) {
    popover.disengage();
    const hadError = errorRef.current !== undefined;
    const nextDate = hadError ? value : selectedDate;
    setTypedDate(undefined);
    setInputValue(nextDate ? dayjs(nextDate).format(dateFormat) : '');
    updateError(undefined);
    if (!hadError && typedDate && typedDate.getTime() !== value?.getTime()) {
      setValue(typedDate, createChangeDetails('input-change', event));
    }
  }

  function handleSelect(
    day: Date | undefined,
    _triggerDate?: Date,
    _modifiers?: Modifiers,
    event?: React.MouseEvent | React.KeyboardEvent
  ) {
    setTypedDate(undefined);
    // RDP passes `undefined` when the user clicks the selected day, because
    // `required` is false. `onValueChange` reports only a defined date.
    if (day) {
      setValue(day, createChangeDetails('item-press', event?.nativeEvent));
    } else {
      setValueUnwrapped(undefined);
    }
    updateError(undefined);
    popover.disengage();
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Enter' && popover.inputRef.current) {
      popover.inputRef.current.blur();
      closePicker(event.nativeEvent);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInputValue(value);

    const date = dayjs(value, dateFormat, true);

    const isValidDate = date.isValid();

    /*
     * RDP treats `startMonth`/`endMonth` as months, so compare against month
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
      setTypedDate(date.toDate());
      updateError(undefined);
    } else {
      updateError('Invalid date');
    }
  }

  const defaultTrigger = (
    <Input
      size='small'
      placeholder='Select date'
      className={styles.datePickerInput}
      trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
      data-slot='date-picker-input'
      {...inputProps}
      ref={popover.inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onFocus={popover.handleInputFocus}
      onBlur={popover.handleInputBlur}
      onKeyUp={handleKeyUp}
    />
  );

  /*
   * Always wrap the trigger in a `<div>` so the rendered outer element is
   * never a `<button>`. This keeps `nativeButton={false}` correct regardless
   * of what the consumer passes (string, host element, React component that
   * happens to render a button, etc.), avoiding Base UI's button-nesting
   * warning.
   */
  const triggerContent =
    typeof children === 'function'
      ? children({ selectedDate: formattedDate })
      : children || defaultTrigger;

  return (
    <Popover
      open={isDisabled ? false : popover.isOpen}
      onOpenChange={(open, eventDetails) => {
        if (isDisabled) return;
        popover.onOpenChange(open, eventDetails?.reason);
      }}
    >
      <Popover.Trigger
        nativeButton={false}
        render={<div data-slot='date-picker-trigger'>{triggerContent}</div>}
      />
      <Popover.Content
        ref={popover.contentRef}
        data-slot='date-picker-positioner'
        {...popoverProps}
        className={cx(styles.calendarPopover, popoverProps?.className)}
        side={popoverProps?.side ?? 'top'}
      >
        <div data-slot='date-picker-content'>
          <Calendar
            {...calendarProps}
            required={false}
            timeZone={timeZone}
            onDropdownOpen={popover.markDropdownOpen}
            mode='single'
            selected={selectedDate}
            month={viewMonth}
            onSelect={handleSelect}
            onMonthChange={setViewMonth}
          />
        </div>
      </Popover.Content>
    </Popover>
  );
}

DatePicker.displayName = 'DatePicker';
