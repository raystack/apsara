import CalendarLocale from "rc-picker/lib/locale/en_US";
import { PickerLocale } from "./";
import { TimePickerLocale } from "./";

const timePickerLocale: TimePickerLocale = {
    placeholder: "Select time",
    rangePlaceholder: ["Start time", "End time"],
};

const locale: PickerLocale = {
    lang: {
        placeholder: "Select date",
        yearPlaceholder: "Select year",
        quarterPlaceholder: "Select quarter",
        monthPlaceholder: "Select month",
        weekPlaceholder: "Select week",
        rangePlaceholder: ["Start date", "End date"],
        rangeYearPlaceholder: ["Start year", "End year"],
        rangeMonthPlaceholder: ["Start month", "End month"],
        rangeWeekPlaceholder: ["Start week", "End week"],
        ...CalendarLocale,
    },
    timePickerLocale: {
        ...timePickerLocale,
    },
};
export default locale;
