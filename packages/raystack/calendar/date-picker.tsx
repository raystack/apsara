import { Popover } from "~/popover";
import { TextField } from "~/textfield";
import { Calendar, CalendarProps } from "./calendar";
import styles from "./calendar.module.css";
import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { TextfieldProps } from "~/textfield/textfield";
import { SelectSingleEventHandler } from "react-day-picker";

interface DatePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  calendarProps?: CalendarProps;
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
  const [showCalendar, setShowCalendar] = useState(false);
  const dateValue = dayjs(value).format(dateFormat);

  const handleSelect: SelectSingleEventHandler = (day, selectedDay) => {
    const selected = day || selectedDay;
    onSelect(selected);
    setShowCalendar(false);
  };

  function onOpenChange(open?: boolean) {
    setShowCalendar(Boolean(open));
  }

  return (
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <TextField
          value={dateValue}
          trailing={<CalendarIcon />}
          className={styles.datePickerInput}
          readOnly
          {...textFieldProps}
        />
      </Popover.Trigger>
      <Popover.Content side={side} className={styles.calendarPopover}>
        <Calendar
          {...calendarProps}
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover>
  );
}
