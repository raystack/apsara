import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { DateRange, PropsBase, PropsRangeRequired } from "react-day-picker";

import { Flex } from "../flex";
import { Popover } from "../popover";
import { TextField } from "../textfield";
import { TextfieldProps } from "../textfield/textfield";
import { Calendar } from "./calendar";
import styles from "./calendar.module.css";
import { TimeZone } from "./date-picker";

dayjs.extend(utc);

interface RangePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: string;
  textFieldProps?: TextfieldProps;
  placeholders?: { startDate?: string; endDate?: string };
  calendarProps?: PropsRangeRequired & PropsBase;
  onSelect?: (date: { local: DateRange; utc: { from?: string; to?: string } }) => void;
  pickerGroupClassName?: string;
  value?: DateRange;
  children?: React.ReactNode | ((props: { startDate: string; endDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  footer?: React.ReactNode;
  timezone?: TimeZone;
}

type RangeFields = keyof DateRange;

export function RangePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  textFieldProps,
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
  timezone = "local",
}: RangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentRangeField, setCurrentRangeField] = useState<RangeFields>("from");
  const [selectedRange, setSelectedRange] = useState(value);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return timezone === "utc" 
      ? dayjs(date).utc().format(dateFormat)
      : dayjs(date).format(dateFormat);
  };

  const startDate = formatDate(selectedRange.from);
  const endDate = formatDate(selectedRange.to);

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
    const localRange = {
      from: newRange.from ? dayjs(newRange.from).startOf('day').toDate() : undefined,
      to: newRange.to ? dayjs(newRange.to).startOf('day').add(1, 'day').toDate() : undefined
    };

    const utcRange = {
      from: newRange.from ? dayjs(newRange.from).startOf('day').utc().toISOString() : undefined,
      to: newRange.to ? dayjs(newRange.to).startOf('day').add(1, 'day').utc().toISOString() : undefined
    };

    onSelect({ local: localRange, utc: utcRange });
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
        {...textFieldProps}
        placeholder={placeholders?.startDate || "Select start date"}
      />
      <TextField
        value={endDate}
        trailing={showCalendarIcon ? <CalendarIcon /> : undefined}
        className={styles.datePickerInput}
        readOnly
        {...textFieldProps}
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
