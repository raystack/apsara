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
}

export function DatePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldProps,
  calendarProps,
  onSelect = () => {},
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [value, setValue] = useState<Date>(new Date());
  const dateValue = dayjs(value).format(dateFormat);

  const handleSelect: SelectSingleEventHandler = (day, selectedDay) => {
    const selected = day || selectedDay;
    setValue(selected);
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
          {...textFieldProps}
        />
      </Popover.Trigger>
      <Popover.Content side={side} className={styles.calendarPopover}>
        <Calendar mode="single" selected={value} onSelect={handleSelect} />
      </Popover.Content>
    </Popover>
  );
}
