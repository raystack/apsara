import { Popover } from "~/popover";
import { TextField } from "~/textfield";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";
import { useRef, useState } from "react";
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
  const [showCalendar, setShowCalendar] = useState(false);
  const dateValue = dayjs(value).format(dateFormat);

  const isDropdownOpenedRef = useRef(false);

  const handleSelect = (day: Date) => {
    onSelect(day);
    setShowCalendar(false);
  };

  function onDropdownOpen() {
    isDropdownOpenedRef.current = true;
  }

  function onOpenChange(open?: boolean) {
    if (!isDropdownOpenedRef.current) {
      setShowCalendar(Boolean(open));
    }

    isDropdownOpenedRef.current = false;
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
          required={true}
          {...calendarProps}
          onDropdownOpen={onDropdownOpen}
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover>
  );
}
