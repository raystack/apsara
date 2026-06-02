'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange, PropsBase } from 'react-day-picker';
import { Flex } from '../flex';
import { Input } from '../input';
import { InputProps } from '../input/input';
import { Popover } from '../popover';
import { PopoverContentProps } from '../popover/popover';
import { Calendar, type CalendarPropsExtended } from './calendar';
import styles from './calendar.module.css';
import { usePickerPopover } from './use-picker-popover';

/*
 * Picker-specific calendar surface. `mode` is owned by the picker; the other
 * forced keys (`selected`/`onSelect`/`required`) aren't in `PropsBase` so
 * they're already unreachable.
 */
type RangePickerCalendarSlot = Omit<PropsBase, 'mode'> & CalendarPropsExtended;

interface RangePickerSlotProps {
  startInput?: InputProps;
  endInput?: InputProps;
  calendar?: RangePickerCalendarSlot;
  popover?: PopoverContentProps;
}

interface RangePickerProps {
  dateFormat?: string;
  /**
   * Props for each picker slot. When both this and the legacy
   * `inputsProps`/`calendarProps`/`popoverProps` are set, `slotProps` wins.
   */
  slotProps?: RangePickerSlotProps;
  /** @deprecated Use `slotProps.startInput` / `slotProps.endInput` instead. */
  inputsProps?: { startDate?: InputProps; endDate?: InputProps };
  /** @deprecated Use `slotProps.calendar` instead. */
  calendarProps?: RangePickerCalendarSlot;
  /** @deprecated Use `slotProps.popover` instead. */
  popoverProps?: PopoverContentProps;
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
}

type RangeFields = keyof DateRange;

export function RangePicker({
  dateFormat = 'DD MMM YYYY',
  slotProps,
  inputsProps: legacyInputsProps = {},
  calendarProps: legacyCalendarProps,
  popoverProps: legacyPopoverProps,
  onSelect = () => undefined,
  value,
  /*
   * No inline default — the state machine's "first click sets `from`" branch
   * needs an empty range to fire.
   */
  defaultValue,
  pickerGroupClassName,
  children,
  showCalendarIcon = true,
  footer,
  timeZone
}: RangePickerProps) {
  // Merge legacy props with slotProps; slotProps wins when both are set.
  const startInputProps = {
    ...legacyInputsProps.startDate,
    ...slotProps?.startInput
  };
  const endInputProps = {
    ...legacyInputsProps.endDate,
    ...slotProps?.endInput
  };
  const calendarProps = { ...legacyCalendarProps, ...slotProps?.calendar };
  const popoverProps = { ...legacyPopoverProps, ...slotProps?.popover };
  /*
   * Gate the popover whenever either input is disabled. Partial-disable
   * leaks: the range state machine rewrites both `from` and `to` regardless
   * of which input was clicked, and the trailing icon's click bubbles to
   * `Popover.Trigger` even when the input is disabled. For "fix one side,
   * pick the other", constrain the calendar via `calendarProps` instead.
   */
  const isDisabled = !!startInputProps.disabled || !!endInputProps.disabled;
  /*
   * Hook owns open/close, outside-click dismissal, and the year/month
   * dropdown carve-out. Inputs stay `readOnly`, so we arm the listener on
   * open (click-to-open path) instead of on input blur (typed-input path).
   */
  const popover = usePickerPopover({
    onOutsideClick: () => popover.disengage()
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: engage/disengage are stable
  useEffect(() => {
    if (popover.isOpen) popover.engage();
    else popover.disengage();
  }, [popover.isOpen]);

  const [currentRangeField, setCurrentRangeField] =
    useState<RangeFields>('from');
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(
    value ?? defaultValue
  );
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
    internalValue?.from
  );

  /*
   * Sync visible month when controlled `value.from` changes externally
   * (form reset, preset buttons, sync-from-URL). Sync runs whenever
   * `value` is defined — including when `value.from` is cleared — so a
   * parent reset (`setValue({ from: undefined })`) actually unpins the
   * calendar. Uncontrolled mode (value === undefined) skips entirely.
   */
  const valueFromTime = value?.from?.getTime();
  const isControlled = value !== undefined;
  // biome-ignore lint/correctness/useExhaustiveDependencies: compare on timestamp, not Date identity
  useEffect(() => {
    if (isControlled) setCurrentMonth(value.from);
  }, [valueFromTime, isControlled]);

  // Empty-range fallback so downstream `.from`/`.to` reads don't need guards.
  const selectedRange: DateRange = value ??
    internalValue ?? { from: undefined };

  const startDate = selectedRange.from
    ? dayjs(selectedRange.from).format(dateFormat)
    : '';
  const endDate = selectedRange.to
    ? dayjs(selectedRange.to).format(dateFormat)
    : '';

  /*
   * Ensures two months are visible even when the current month is the last
   * allowed month (endMonth). Skips when `currentMonth` is undefined —
   * `dayjs(undefined)` returns "now" and would falsely match `endMonth` if
   * endMonth happens to be the current month, forcing the calendar away
   * from its own default.
   */
  const computedDefaultMonth = useMemo(() => {
    if (!currentMonth || !calendarProps?.endMonth) return currentMonth;
    const endMonth = dayjs(calendarProps.endMonth);
    if (dayjs(currentMonth).isSame(endMonth, 'month')) {
      return endMonth.subtract(1, 'month').toDate();
    }
    return currentMonth;
  }, [currentMonth, calendarProps?.endMonth]);

  const onTriggerClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const field = e.currentTarget.dataset.rangeField;
      if (field === 'start') {
        setCurrentRangeField('from');
      } else {
        setCurrentRangeField('to');
      }
      if (popover.isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [popover.isOpen]
  );

  /*
   * State machine branches on `from`/`to`, not the focused input:
   *   A.  !from           -> set `from`, advance to 'to'
   *   B1. from, before    -> reset
   *   B2. from, after     -> commit `to`, close
   *   C.  from && to      -> restart
   * `onSelect` fires on every step; consumers gate on `range.to` for completed
   * ranges.
   */
  const handleSelect = (_: DateRange, selectedDay: Date) => {
    const { from, to } = selectedRange;
    let newRange: DateRange;
    let newField: RangeFields = 'to';
    let shouldClose = false;

    if (!from) {
      // A: empty -> set from, advance
      newRange = { from: selectedDay };
    } else if (!to) {
      if (dayjs(selectedDay).isBefore(dayjs(from))) {
        // B1: click before from -> reset
        newRange = { from: selectedDay };
      } else {
        // B2: complete range -> close
        newRange = { from, to: selectedDay };
        newField = 'from';
        shouldClose = true;
      }
    } else {
      // C: both set -> restart
      newRange = { from: selectedDay };
    }

    if (newField !== currentRangeField) setCurrentRangeField(newField);
    // Only update internal state when uncontrolled — controlled consumers own `value`.
    if (!isControlled) setInternalValue(newRange);
    onSelect(newRange);
    if (shouldClose) popover.disengage();
  };

  const defaultTrigger = (
    <Flex gap={5} className={pickerGroupClassName}>
      <Input
        size='small'
        placeholder='Select start date'
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        {...startInputProps}
        value={startDate}
        readOnly
        data-range-field='start'
        data-active={popover.isOpen && currentRangeField === 'from'}
        onClick={onTriggerClick}
      />

      <Input
        size='small'
        placeholder='Select end date'
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        {...endInputProps}
        value={endDate}
        readOnly
        data-range-field='end'
        data-active={popover.isOpen && currentRangeField === 'to'}
        onClick={onTriggerClick}
      />
    </Flex>
  );

  /*
   * Always wrap the trigger in a `<div>` so the rendered outer element is
   * never a `<button>`. This keeps `nativeButton={false}` correct regardless
   * of what the consumer passes (string, host element, React component that
   * happens to render a button, etc.) — avoiding Base UI's button-nesting
   * warning.
   */
  const triggerContent =
    typeof children === 'function'
      ? children({ startDate, endDate })
      : children || defaultTrigger;

  return (
    <Popover
      open={isDisabled ? false : popover.isOpen}
      onOpenChange={open => {
        if (isDisabled) return;
        popover.onOpenChange(open);
      }}
    >
      <Popover.Trigger
        nativeButton={false}
        render={<div>{triggerContent}</div>}
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
          showOutsideDays={false}
          numberOfMonths={2}
          defaultMonth={selectedRange.from}
          {...calendarProps}
          /*
           * Must stay after spread: `required` is the discriminator for
           * RDP's prop union, and a widened value would break the narrowing.
           */
          required={true}
          timeZone={timeZone}
          onDropdownOpen={popover.markDropdownOpen}
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

RangePicker.displayName = 'RangePicker';
