import { CalendarIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useState } from "react";
import { DateRange, PropsBase, PropsRangeRequired } from "react-day-picker";

import { Flex } from "../flex";
import { Popover } from "../popover";
import { Calendar } from "./calendar";
import { DayjsDateFormat } from "./utils";
import styles from "./calendar.module.css";
import { InputField } from "../input-field";
import { InputFieldProps } from "../input-field/input-field";

interface RangePickerProps {
  side?: "top" | "right" | "bottom" | "left";
  dateFormat?: DayjsDateFormat;
  inputFieldsProps?: { startDate?: InputFieldProps, endDate?: InputFieldProps };
  calendarProps?: PropsRangeRequired & PropsBase;
  onSelect?: (date: DateRange) => void;
  pickerGroupClassName?: string;
  value?: DateRange;
  children?: React.ReactNode | ((props: { startDate: string; endDate: string }) => React.ReactNode);
  showCalendarIcon?: boolean;
  footer?: React.ReactNode;
  timeZone?: string;
}

type RangeFields = keyof DateRange;

export function RangePicker({
  side = "top",
  dateFormat = "DD/MM/YYYY",
  inputFieldsProps = {},
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
  timeZone,
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
    // TODO: Remove custom logic and reuse the default logic from react-day-picker
    let newRange: DateRange;

    if (currentRangeField === "from") {
      // First click - set from date and prepare for to date selection
      newRange = { from: selectedDay };
      setCurrentRangeField("to");
    } else {
      // Second click - setting to date
      const from = selectedRange.from;
      
      if (dayjs(selectedDay).isBefore(dayjs(from))) {
        // If selected date is before current from date, start new range
        newRange = { from: selectedDay };
        setCurrentRangeField("to");
      } else {
        // Set the to date
        newRange = { from, to: selectedDay };
        setCurrentRangeField("from");
      }
    }

    setSelectedRange(newRange);
    onSelect(newRange);
  };

  function onOpenChange(open?: boolean) {
    setShowCalendar(Boolean(open));
  }

  const defaultTrigger = (
    <Flex gap="medium" className={pickerGroupClassName}>
      <InputField
        size='small'
        placeholder="Select start date"
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        {...(inputFieldsProps.startDate ?? {})}
        value={startDate}
        className={styles.datePickerInput}
        readOnly
      />

      <InputField
        size='small'
        placeholder="Select end date"
        trailingIcon={showCalendarIcon ? <CalendarIcon /> : undefined}
        {...(inputFieldsProps.endDate ?? {})}
        value={endDate}
        className={styles.datePickerInput}
        readOnly
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
          timeZone={timeZone}
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
