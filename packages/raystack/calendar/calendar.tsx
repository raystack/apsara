import { DayPicker, DayPickerProps } from "react-day-picker";

export type CalendarProps = DayPickerProps & {};

export const Calendar = function ({ ...props }: CalendarProps) {
  return <DayPicker {...props} />;
};
