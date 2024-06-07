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
  value?: DateRange;
}

type RangeFields = keyof DateRange;

export function RangePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldProps,
  calendarProps,
  onSelect = () => {},
  value = {
    to: new Date(),
    from: new Date(),
  },
  pickerGroupClassName,
}: RangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentRangeField, setCurrentRangeField] =
    useState<RangeFields>("from");
  const startDate = dayjs(value.from).format(dateFormat);
  const endDate = dayjs(value.to).format(dateFormat);

  const handleSelect: SelectRangeEventHandler = (range, selectedDay) => {
    let from = value?.from || range?.from;
    from = dayjs(from).isAfter(dayjs(selectedDay)) ? undefined : from;
    if (currentRangeField === "to" && from) {
      onSelect({ from, to: selectedDay });
      setCurrentRangeField("from");
    } else {
      onSelect({ from: selectedDay });
      setCurrentRangeField("to");
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
            readOnly
            {...textFieldProps}
          />
          <TextField
            value={endDate}
            trailing={<CalendarIcon />}
            className={styles.datePickerInput}
            readOnly
            {...textFieldProps}
          />
        </Flex>
      </Popover.Trigger>
      <Popover.Content side={side} className={styles.calendarPopover}>
        <Calendar
          showOutsideDays={false}
          numberOfMonths={2}
          defaultMonth={value.from}
          {...calendarProps}
          mode="range"
          selected={value}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover>
  );
}
