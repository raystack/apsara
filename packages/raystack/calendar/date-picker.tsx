import { Popover } from "~/popover";
import { TextField } from "~/textfield";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { TextfieldProps } from "~/textfield/textfield";
import { PropsBase, PropsSingleRequired } from "react-day-picker";

interface DatePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  calendarProps?: PropsSingleRequired & PropsBase;
  onSelect?: (date: Date) => void;
  value?: Date;
}

export function DatePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldProps,
  calendarProps,
  value = new Date(),
  onSelect = () => {},
}: DatePickerProps) {
  const defaultDate = dayjs(value).format(dateFormat);

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarVal, setCalendarVal] = useState(value);
  const [inputState, setInputState] = useState<Partial<React.ComponentProps<typeof TextField>['state']>>();

  const dropdownRef = useRef(null);
  const isDropdownOpenRef = useRef(false);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isInputFieldFocused = useRef(false);

  function isElementOutside(el: HTMLElement) {
    return !isDropdownOpenRef.current && // Month and Year dropdown from Date picker
           !textFieldRef.current?.contains(el) && // TextField
           !contentRef.current?.contains(el);
  }

  const handleMouseDown = useCallback((event: MouseEvent) => {
      const el = (event.target) as HTMLElement | null;
      if (el && isElementOutside(el)) removeEventListeners();
  }, [])

  function registerEventListeners() {
    isInputFieldFocused.current = true;
    document.addEventListener('mouseup', handleMouseDown, true);
  }

  function removeEventListeners() {
    isInputFieldFocused.current = false;
    setShowCalendar(false);
    if (inputState === undefined) onSelect(calendarVal);
    document.removeEventListener('mouseup', handleMouseDown);
  }

  const handleSelect = (day: Date) => {
    onSelect(day);
    setCalendarVal(day);

    setInputState(undefined);

    if  (textFieldRef.current) {
        textFieldRef.current.value = dayjs(day).format(dateFormat);
    }

    removeEventListeners();
  };

  function onDropdownOpen() {
    isDropdownOpenRef.current = true;
  }

  function onOpenChange(open?: boolean) {
    if (!isDropdownOpenRef.current && !(isInputFieldFocused.current && showCalendar)) {
      setShowCalendar(Boolean(open));
    }

    isDropdownOpenRef.current = false;
  }

  function handleInputFocus() {
    if (isInputFieldFocused.current) return;
    if (!showCalendar) setShowCalendar(true);
  }

  function handleInputBlur(event: React.FocusEvent) {
    if (isInputFieldFocused.current) {
        const el = event.relatedTarget as HTMLElement | null;
        if (el && isElementOutside(el)) removeEventListeners();
    } else {
        registerEventListeners();
        setTimeout(() => textFieldRef.current?.focus());
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = (event.target);
    const date = dayjs(value);

    const isValidDate = date.isValid();

    const isAfter = calendarProps?.startMonth !== undefined ? dayjs(date).isSameOrAfter(calendarProps.startMonth) : true;
    const isBefore = calendarProps?.endMonth !== undefined ? dayjs(date).isSameOrBefore(calendarProps.endMonth) : true;

    const isValid = isValidDate && isAfter && isBefore && dayjs(date).isSameOrBefore(dayjs());

    if (isValid) {
        setCalendarVal(date.toDate());
        if (inputState === 'invalid') setInputState(undefined);
    } else {
        setInputState('invalid');
    }
  }

  return (
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <TextField
          ref={textFieldRef}
          defaultValue={defaultDate}
          trailing={<Popover.Trigger asChild><CalendarIcon /></Popover.Trigger>}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          state={inputState}
          {...textFieldProps}
      />

      <Popover.Content side={side} className={styles.calendarPopover} ref={contentRef}>
        <Calendar
          required={true}
          {...calendarProps}
          onDropdownOpen={onDropdownOpen}
          mode="single"
          selected={calendarVal}
          month={calendarVal}
          onSelect={handleSelect}
          onMonthChange={setCalendarVal}
        />
      </Popover.Content>
    </Popover>
  );
}
