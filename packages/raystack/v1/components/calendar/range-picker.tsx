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
  textFieldsProps?: { startDate?: TextfieldProps, endDate?: TextfieldProps };
  placeholders?: { startDate?: string; endDate?: string };
  calendarProps?: PropsRangeRequired & PropsBase;
  onSelect?: (date: DateRange) => void;
  pickerGroupClassName?: string;
  value?: DateRange;
  children?: React.ReactNode | ((props: { startDate: string; endDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  footer?: React.ReactNode;
}

type RangeFields = keyof DateRange;

export function RangePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldsProps = {},
  placeholders,
  calendarProps,
  onSelect = () => {},
  value = {
    to: new Date(),
    from: new Date(),
  },
  pickerGroupClassName,
  children,
  showCalendarIcon = true,
  footer,
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
    if (currentRangeField === "to") {
      if (dayjs(selectedDay).isSame(dayjs(from), 'day')) {
        // If same date is clicked twice, set end date to the same date for UI
        newRange = {
          from,
          to: selectedDay
        };
      } else if (dayjs(selectedDay).isAfter(dayjs(from))) {
        // If different date is selected and it's after start date
        newRange = { from, to: selectedDay };
      } else {
        // If selected date is before start date, reset and select start day
        newRange = { from: selectedDay };
      }
      setCurrentRangeField("from");
    } else {
      // Reset the range and select start day
      newRange = { from: selectedDay };
      setCurrentRangeField("to");
    }
    setSelectedRange(newRange);
    // Return the range with +1 day for the end date in the callback
    const callbackRange = {
      from: newRange.from,
      to: newRange.to ? dayjs(newRange.to).add(1, 'day').toDate() : undefined
    };
    onSelect(callbackRange);
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
        {...(textFieldsProps.startDate ?? {})}
        placeholder={placeholders?.startDate || "Select start date"}
      />
      <TextField
        value={endDate}
        trailing={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        readOnly
        {...(textFieldsProps.endDate ?? {})}
        placeholder={placeholders?.endDate || "Select end date"}
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
        {footer && (
          <Flex align="center" justify="center" className={styles.calendarFooter}>
            {footer}
          </Flex>
        )}
      </Popover.Content>
    </Popover>
  );
}
