import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCallback, useEffect, useRef, useState } from "react";
import { PropsBase, PropsSingleRequired } from "react-day-picker";

import { Popover } from "../popover";
import { InputField } from "../input-field";
import { InputFieldProps } from "../input-field/input-field";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";

dayjs.extend(customParseFormat);

interface DatePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  inputFieldProps?: InputFieldProps;
  calendarProps?: PropsSingleRequired & PropsBase;
  onSelect?: (date: Date) => void;
  value?: Date;
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  timeZone?: string;
}

export function DatePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  inputFieldProps,
  calendarProps,
  value = new Date(),
  onSelect = () => {},
  children,
  showCalendarIcon = true,
  timeZone,
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [error, setError] = useState<string>();

  const formattedDate = dayjs(selectedDate).format(dateFormat);

  const isDropdownOpenRef = useRef(false);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isInputFieldFocused = useRef(false);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  function isElementOutside(el: HTMLElement) {
    return (
      !isDropdownOpenRef.current && // Month and Year dropdown from Date picker
      !inputFieldRef.current?.contains(el) && // InputField
      !contentRef.current?.contains(el)
    );
  }

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const el = event.target as HTMLElement | null;
    if (el && isElementOutside(el)) removeEventListeners();
  }, []);

  function registerEventListeners() {
    isInputFieldFocused.current = true;
    document.addEventListener("mouseup", handleMouseDown);
  }

  function removeEventListeners(skipUpdate = false) {
    isInputFieldFocused.current = false;
    setShowCalendar(false);

    const updatedVal = dayjs(selectedDateRef.current).format(dateFormat);

    if (inputFieldRef.current) inputFieldRef.current.value = updatedVal;
    if (!error && !skipUpdate) onSelect(dayjs(updatedVal).toDate());

    document.removeEventListener("mouseup", handleMouseDown);
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
      !(isInputFieldFocused.current && showCalendar)
    ) {
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
      setTimeout(() => inputFieldRef.current?.select());
    }
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === "Enter" && inputFieldRef.current) {
      inputFieldRef.current.blur();
      removeEventListeners();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    const format = value.includes("/")
      ? "DD/MM/YYYY"
      : value.includes("-")
      ? "DD-MM-YYYY"
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
      setError("Invalid date");
    }
  }

  const defaultTrigger = (
    <InputField
      size="small"
      placeholder="Select date"
      error={error}
      className={styles.datePickerInput}
      trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
      {...inputFieldProps}
      ref={inputFieldRef}
      defaultValue={formattedDate}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onKeyUp={handleKeyUp}
    />
  );

  const trigger =
    typeof children === "function"
      ? children({ selectedDate: formattedDate })
      : children ? <div>{children}</div> : defaultTrigger;

  return (
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Content
        side={side}
        className={styles.calendarPopover}
        ref={contentRef}
      >
        <Calendar
          required={true}
          {...calendarProps}
          timeZone={timeZone}
          onDropdownOpen={onDropdownOpen}
          mode="single"
          selected={selectedDate}
          month={selectedDate}
          onSelect={handleSelect}
          onMonthChange={setSelectedDate}
        />
      </Popover.Content>
    </Popover>
  );
}
