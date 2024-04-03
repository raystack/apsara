import { DayPicker, DayPickerProps } from "react-day-picker";
import { cva } from "class-variance-authority";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

import styles from "./calendar.module.css";

export type CalendarProps = DayPickerProps & {};

const root = cva(styles.calendarRoot);

export const Calendar = function ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      components={{
        IconLeft: () => <ChevronLeftIcon />,
        IconRight: () => <ChevronRightIcon />,
      }}
      classNames={{
        caption: styles.caption,
        caption_label: styles.caption_label,
        nav_button: styles.nav_button,
        nav_button_previous: styles.nav_button_previous,
        nav_button_next: styles.nav_button_next,
        head: styles.head,
        head_cell: styles.head_cell,
        cell: styles.cell,
        head_row: styles.row,
        row: styles.row,
        day: styles.day,
        day_outside: styles.day_outside,
        day_today: styles.day_today,
        day_range_middle: styles.day_range_middle,
        day_range_end: styles.day_range_end,
        day_range_start: styles.day_range_start,
        ...classNames,
      }}
      className={root({ className })}
      {...props}
    />
  );
};
