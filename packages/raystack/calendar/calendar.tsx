import { DayPicker, DayPickerProps } from "react-day-picker";
import { cva } from "class-variance-authority";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

import styles from "./calendar.module.css";
import { Select } from "~/select";
import { ChangeEvent } from "react";

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
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeftIcon {...props} />;
          }
          return <ChevronRightIcon {...props} />;
        },
        Dropdown: ({ options = [], value, onChange }) => {
          function handleChange(value: string) {
            if (onChange) {
              onChange({ target: { value } } as ChangeEvent<HTMLSelectElement>);
            }
          }
          return (
            <Select value={value?.toString()} onValueChange={handleChange}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {options.map((opt) => (
                  <Select.Item
                    value={opt.value.toString()}
                    key={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          );
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
        hidden: styles.hidden,
        dropdowns: styles.dropdowns,
        ...classNames,
      }}
      className={root({ className })}
      mode="single"
      {...props}
    />
  );
};
