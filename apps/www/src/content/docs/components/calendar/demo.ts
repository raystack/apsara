"use client";

export const preview = {
  type: "code",
  tabs: [
    {
      name: "Calendar",
      code: `<Calendar numberOfMonths={2} />`,
    },
    {
      name: "Range Picker",
      code: `
        <RangePicker inputFieldsProps={{ startDate: { size: "large" } }} />`,
    },
    {
      name: "Date Picker",
      code: `
      <Flex style={{height:200}}>
        <DatePicker inputFieldsProps={{ startDate: { size: "large" } }}}} />
      </Flex>`,
    },
  ],
};

export const calendarDemo = {
  type: "code",
  tabs: [
    {
      name: "Basic",
      code: `<Calendar numberOfMonths={2} />`,
    },
    {
      name: "With Loading",
      code: `<Calendar loadingData={true} numberOfMonths={2} />`,
    },
  ],
};
export const rangePickerDemo = {
  type: "code",
  tabs: [
    {
      name: "Basic",
      code: `<RangePicker inputFieldsProps={{ startDate: { size: "large" } }} />`,
    },
    {
      name: "Without Calendar Icon",
      code: `<RangePicker showCalendarIcon={false} inputFieldsProps={{ startDate: { size: "large" } }} />`,
    },
    {
      name: "Custom Trigger",
      code: `
      <RangePicker
        dateFormat="DD/MM/YYYY"
        onSelect={(range) => console.log('Date range:', range)}
        value={{
          from: new Date(2024, 0, 1),
          to: new Date(2024, 0, 15)
        }}
        calendarProps={{
          mode: "range",
          required: true,
          selected: {
            from: new Date(2024, 0, 1),
            to: new Date(2024, 0, 15)
          },
          fromMonth: new Date(2024, 0, 1),
          toMonth: new Date(2024, 11, 31),
        }}
      >
        {({ startDate, endDate }) => (
          <button>
            {startDate} - {endDate}
          </button>
        )}
      </RangePicker>`,
    },
  ],
};
export const datePickerDemo = {
  type: "code",
  tabs: [
    {
      name: "Basic",
      code: `<DatePicker textFieldProps={{ size: "medium" }} />`,
    },
    {
      name: "Without Calendar Icon",
      code: `<DatePicker showCalendarIcon={false} textFieldProps={{ size: "medium" }} />`,
    },
    {
      name: "Custom Trigger",
      code: `
      <DatePicker>
        {({ selectedDate }) => (
          <button>
            Selected: {selectedDate}
          </button>
        )}
      </DatePicker>`,
    },
  ],
};
