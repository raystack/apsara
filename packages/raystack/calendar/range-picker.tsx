import { Popover } from "~/popover";
import { TextField } from "~/textfield";
import { Calendar, CalendarProps } from "./calendar";
import styles from "./calendar.module.css";
import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { TextfieldProps } from "~/textfield/textfield";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Flex } from "~/flex";

interface RangePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  calendarProps?: CalendarProps;
  onSelect?: (date: DateRange) => void;
  pickerGroupClassName?: string;
}

export function RangePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldProps,
  calendarProps,
  onSelect = () => {},
  pickerGroupClassName,
}: RangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [value, setValue] = useState<DateRange>({
    to: new Date(),
    from: new Date(),
  });
  const startDate = dayjs(value.from).format(dateFormat);
  const endDate = dayjs(value.to).format(dateFormat);

  const handleSelect: SelectRangeEventHandler = (range, selectedDay) => {
    if (range) {
      setValue(range);
    }
    if (range?.to === selectedDay) {
      onOpenChange(false);
      onSelect(range);
    }
  };

  function onOpenChange(open?: boolean) {
    setShowCalendar(Boolean(open));
  }

  return (
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Flex gap={"medium"} className={pickerGroupClassName}>
          <TextField
            value={startDate}
            trailing={<CalendarIcon />}
            className={styles.datePickerInput}
            {...textFieldProps}
          />
          <TextField
            value={endDate}
            trailing={<CalendarIcon />}
            className={styles.datePickerInput}
            {...textFieldProps}
          />
        </Flex>
      </Popover.Trigger>
      <Popover.Content side={side} className={styles.calendarPopover}>
        <Calendar
          numberOfMonths={2}
          {...calendarProps}
          mode="range"
          selected={value}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover>
  );
}
