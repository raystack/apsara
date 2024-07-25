import { Button, DayPicker, DayPickerProps } from "react-day-picker";
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
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeftIcon {...props} />;
          }
          return <ChevronRightIcon {...props} />;
        },
      }}
      classNames={{
        caption_label: styles.caption_label,
        button_previous: `${styles.nav_button} ${styles.nav_button_previous}`,
        button_next: `${styles.nav_button} ${styles.nav_button_next}`,
        month_caption: styles.month_caption,
        months: styles.months,
        nav: styles.nav,
        day: styles.day,
        today: styles.today,
        outside: styles.outside,
        week: styles.week,
        weekdays: styles.week,
        weekday: styles.weekday,
        day_button: styles.day_button,
        range_middle: styles.range_middle,
        range_end: styles.range_end,
        range_start: styles.range_start,
        ...classNames,
      }}
      className={root({ className })}
      mode="single"
      {...props}
    />
  );
};
