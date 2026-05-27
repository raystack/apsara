'use client';

export const preview = {
  type: 'code',
  tabs: [
    {
      name: 'Calendar',
      code: `<Calendar />`
    },
    {
      name: 'Range Picker',
      code: `
        <RangePicker slotProps={{ startInput: { size: "small" }, endInput: { size: "small" } }} />`
    },
    {
      name: 'Date Picker',
      code: `<DatePicker />`
    }
  ]
};

// Layout & appearance: how the calendar looks and what chrome it renders.
export const calendarDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<Calendar
              numberOfMonths={2}
              defaultMonth={new Date(2025, 5, 1)}
              showWeekNumber={false}
              weekStartsOn={1}
              showOutsideDays={false}
            />`
    },
    {
      name: 'With Loading',
      code: `<Calendar loadingData={true} numberOfMonths={2} />`
    },
    {
      name: 'With Dropdowns',
      code: `<Calendar
              captionLayout="dropdown"
              startMonth={new Date(2020, 0)}
              endMonth={new Date(2030, 11)}
            />`
    },
    {
      name: 'With Footer',
      code: `<Calendar
              footer="Select any date to view details"
            />`
    }
  ]
};

// Data & behavior: tooltips, disabled days, timezone, controlled navigation.
export const calendarBehaviorDemo = {
  type: 'code',
  tabs: [
    {
      name: 'With Tooltips',
      code: `<Calendar
              showTooltip
              tooltipMessages={{
                '15-06-2026': 'Holiday',
                '20-06-2026': 'Team off-site',
              }}
            />`
    },
    {
      name: 'With Disabled Dates',
      code: `<Calendar
              disabled={{
                before: new Date(),
                after: new Date(2026, 11, 31),
              }}
            />`
    },
    {
      name: 'With Timezone',
      code: `<Calendar timeZone="America/New_York" />`
    },
    {
      name: 'Controlled Month',
      code: `
/*
  In a real app, hold \`month\` in parent state and update it from
  \`onMonthChange\`:

    const [month, setMonth] = useState(new Date(2025, 5, 1));
    <Calendar month={month} onMonthChange={setMonth} />

  This demo uses a fixed date + logging callback, so the calendar stays
  pinned to June 2025 because no parent state advances on chevron clicks.
*/
              <Calendar
                month={new Date(2025, 5, 1)}
                onMonthChange={(month) => console.log('Visible month:', month)}
                numberOfMonths={2}
              />`
    }
  ]
};
export const rangePickerDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<RangePicker />`
    },
    {
      name: 'Disabled',
      code: `
      /* Disabling either input gates the whole picker — the shared popover would otherwise let users rewrite the "disabled" side through the calendar grid. To fix one side, constrain the calendar via \`calendarProps\` instead. */
      <RangePicker slotProps={{ startInput: { disabled: true }, endInput: { disabled: true } }} />
      `
    },
    {
      name: 'Disabled Dates',
      code: `
      /* Pass a matcher to \`slotProps.calendar.disabled\` to block specific dates in the grid (here: weekends). The inputs stay interactive; the calendar refuses the disabled dates. */
      <RangePicker
        slotProps={{
          calendar: { disabled: { dayOfWeek: [0, 6] } }
        }}
      />
      `
    },
    {
      name: 'Without Calendar Icon',
      code: `<RangePicker showCalendarIcon={false} />`
    },
    {
      name: 'Custom Trigger',
      code: `
      <RangePicker
        dateFormat="DD/MM/YYYY"
        onSelect={(range) => console.log('Date range:', range)}
        value={{
          from: new Date(2024, 0, 1),
          to: new Date(2024, 0, 15)
        }}
        slotProps={{
          calendar: {
            startMonth: new Date(2024, 0, 1),
            endMonth: new Date(2024, 11, 31),
          },
        }}
      >
        {({ startDate, endDate }) => (
          <button>
            {startDate} - {endDate}
          </button>
        )}
      </RangePicker>`
    }
  ]
};
export const datePickerDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<DatePicker slotProps={{ input: { size: "medium" } }} />`
    },
    {
      name: 'Disabled',
      code: `<DatePicker slotProps={{ input: { size: "medium", disabled: true } }} />`
    },
    {
      name: 'Disabled Dates',
      code: `
      /* Pass a matcher to \`slotProps.calendar.disabled\` to block specific dates in the grid (here: every date before today). The input stays interactive; the calendar refuses the disabled dates. */
      <DatePicker
        slotProps={{
          input: { size: "medium" },
          calendar: { disabled: { before: new Date() } }
        }}
      />
      `
    },
    {
      name: 'Without Calendar Icon',
      code: `<DatePicker showCalendarIcon={false} slotProps={{ input: { size: "medium" } }} />`
    },
    {
      name: 'Custom Trigger',
      code: `
      <DatePicker>
        {({ selectedDate }) => (
          <button>
            Selected: {selectedDate}
          </button>
        )}
      </DatePicker>`
    }
  ]
};

export const dateInfoDemo = {
  type: 'code',
  tabs: [
    {
      name: 'With Date Info',
      code: `<Calendar
              numberOfMonths={2}
              dateInfo={{
                [dayjs().format('DD-MM-YYYY')]: (
                  <Flex
                    align='center'
                    gap={2}
                    style={{ fontSize: '8px', color: 'var(--rs-color-foreground-base-secondary)' }}
                  >
                    <Info style={{ width: '8px', height: '8px' }} />
                    <Text style={{ fontSize: '8px' }} color='secondary'>25%</Text>
                  </Flex>
                )
              }}
            />`
    }
  ]
};
