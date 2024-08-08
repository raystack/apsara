import { DayPicker, DayPickerProps, DropdownProps } from "react-day-picker";
import { cva } from "class-variance-authority";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import styles from "./calendar.module.css";
import { Select } from "~/select";
import { ChangeEvent, useEffect, useState } from "react";
import { Flex } from "~/flex/flex";

interface OnDropdownOpen {
  onDropdownOpen?: VoidFunction;
}

export type CalendarProps = DayPickerProps & OnDropdownOpen;

const root = cva(styles.calendarRoot);

function DropDown({
  options = [],
  value,
  onChange,
  onDropdownOpen,
}: DropdownProps & OnDropdownOpen) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && onDropdownOpen) onDropdownOpen();
  }, [open]);

  function handleChange(value: string) {
    if (onChange) {
      onChange({ target: { value } } as ChangeEvent<HTMLSelectElement>);
    }
  }

  return (
    <Select
      value={value?.toString()}
      onValueChange={handleChange}
      open={open}
      onOpenChange={setOpen}
    >
      <Select.Trigger
        className={styles.dropdown_trigger}
        iconProps={{
          className: styles.dropdown_icon,
        }}
      >
        <Select.Value />
      </Select.Trigger>
      <Select.Content className={styles.dropdown_content}>
        <Select.ScrollUpButton asChild>
          <Flex justify={"center"}>
            <ChevronUpIcon />
          </Flex>
        </Select.ScrollUpButton>
        <Select.Viewport>
          {options.map((opt) => (
            <Select.Item
              value={opt.value.toString()}
              key={opt.value}
              disabled={opt.disabled}
              textProps={{
                className: styles.dropdown_item_text,
              }}
            >
              {opt.label}
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton asChild>
          <Flex justify={"center"}>
            <ChevronDownIcon />
          </Flex>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}

export const Calendar = function ({
  className,
  classNames,
  showOutsideDays = true,
  onDropdownOpen,
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
        Dropdown: (props: DropdownProps) => (
          <DropDown {...props} onDropdownOpen={onDropdownOpen} />
        ),
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
        disabled: styles.disabled,
        selected: styles.selected,
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
