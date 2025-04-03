import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCallback, useEffect, useRef, useState } from "react";
import { PropsBase, PropsSingleRequired } from "react-day-picker";

import { Popover } from "../popover";
import { TextField } from "../textfield";
import { TextfieldProps } from "../textfield/textfield";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface DatePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  calendarProps?: PropsSingleRequired & PropsBase;
  onSelect?: (date: Date) => void;
  placeholder?: string;
  value?: Date;
  children?:
    | React.ReactNode
    | ((props: { selectedDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  timezone?: string;
}

export function DatePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  placeholder = "DD/MM/YYYY",
  textFieldProps,
  calendarProps,
  value = new Date(),
  onSelect = () => {},
  children,
  showCalendarIcon = true,
  timezone = dayjs.tz.guess(),
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const [inputState, setInputState] =
    useState<Partial<React.ComponentProps<typeof TextField>["state"]>>();

  const formattedDate = dayjs(selectedDate).tz(timezone).format(dateFormat);

  const isDropdownOpenRef = useRef(false);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isInputFieldFocused = useRef(false);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  function isElementOutside(el: HTMLElement) {
    return (
      !isDropdownOpenRef.current && // Month and Year dropdown from Date picker
      !textFieldRef.current?.contains(el) && // TextField
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

    const updatedVal = dayjs(selectedDateRef.current).tz(timezone).format(dateFormat);

    if (textFieldRef.current) textFieldRef.current.value = updatedVal;
    if (inputState === undefined && !skipUpdate)
      onSelect(dayjs(updatedVal).toDate());

    document.removeEventListener("mouseup", handleMouseDown);
  }

  const handleSelect = (day: Date) => {
    setSelectedDate(day);
    onSelect(day);
    setInputState(undefined);
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
      setTimeout(() => textFieldRef.current?.select());
    }
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === "Enter" && textFieldRef.current) {
      textFieldRef.current.blur();
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
    const date = dayjs(
      value.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, (_, day, month, year) => {
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`; // Replaces [8/8/2024] to [08/08/2024]
      }),
      format
    ).tz(timezone);

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
      if (inputState === "invalid") setInputState(undefined);
    } else {
      setInputState("invalid");
    }
  }

  const defaultTrigger = (
    <TextField
      ref={textFieldRef}
      defaultValue={formattedDate}
      trailing={showCalendarIcon ? <CalendarIcon /> : undefined}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      state={inputState}
      placeholder={placeholder}
      onKeyUp={handleKeyUp}
      className={styles.datePickerInput}
      {...textFieldProps}
    />
  );

  const trigger =
    typeof children === "function"
      ? children({ selectedDate: formattedDate })
      : children || defaultTrigger;

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
