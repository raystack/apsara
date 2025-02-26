import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useState } from "react";
import { DateRange, PropsBase, PropsRangeRequired } from "react-day-picker";

import { Flex } from "../flex";
import { Popover } from "../popover";
import { TextField } from "../textfield";
import { TextfieldProps } from "../textfield/textfield";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";

interface RangePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  calendarProps?: PropsRangeRequired & PropsBase;
  onSelect?: (date: DateRange) => void;
  pickerGroupClassName?: string;
  value?: DateRange;
  children?: React.ReactNode | ((props: { startDate: string; endDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
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
  children,
  showCalendarIcon = true,
}: RangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentRangeField, setCurrentRangeField] = useState<RangeFields>("from");
  const [selectedRange, setSelectedRange] = useState(value);

  const startDate = selectedRange.from ? dayjs(selectedRange.from).format(dateFormat) : '';
  const endDate = selectedRange.to ? dayjs(selectedRange.to).format(dateFormat) : '';

  // 1st click will select the start date.
  // 2nd click will select the end date.
  // 3rd click will select the start date again.
  const handleSelect = (range: DateRange, selectedDay: Date) => {
    const from = selectedRange?.from || range?.from;
    let newRange: DateRange;
    
    if (currentRangeField === "to" && dayjs(selectedDay).isAfter(dayjs(from))) {
      // update the end date
      newRange = { from, to: selectedDay };
      setCurrentRangeField("from");
    } else {
      // reset the range and select start day
      newRange = { from: selectedDay };
      setCurrentRangeField("to");
    }
    
    setSelectedRange(newRange);
    onSelect(newRange);
  };

  function onOpenChange(open?: boolean) {
    setShowCalendar(Boolean(open));
  }

  const defaultTrigger = (
    <Flex gap={"medium"} className={pickerGroupClassName}>
      <TextField
        value={startDate}
        trailing={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        readOnly
        placeholder="Select start date"
        {...textFieldProps}
      />
      <TextField
        value={endDate}
        trailing={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        readOnly
        placeholder="Select end date"
        {...textFieldProps}
      />
    </Flex>
  );

  const trigger = typeof children === 'function' 
    ? children({ startDate, endDate }) 
    : children || defaultTrigger;

  return (
    <Popover open={showCalendar} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        {trigger}
      </Popover.Trigger>
      <Popover.Content side={side} className={styles.calendarPopover}>
        <Calendar
          showOutsideDays={false}
          numberOfMonths={2}
          defaultMonth={selectedRange.from}
          required={true}
          {...calendarProps}
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover>
  );
}
