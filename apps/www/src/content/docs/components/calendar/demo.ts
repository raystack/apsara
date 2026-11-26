'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header>
                  <Calendar.Caption />
                  <Calendar.PrevMonth />
                  <Calendar.NextMonth />
                </Calendar.Header>
                <Calendar.Grid${getPropsString(props)} />
              </Calendar.Days>
            </Calendar>`;
};

export const playground = {
  type: 'playground',
  controls: {
    fixedWeeks: {
      type: 'checkbox',
      defaultValue: true
    },
    showOutsideDays: {
      type: 'checkbox',
      defaultValue: false
    },
    showWeekNumber: {
      type: 'checkbox',
      defaultValue: false
    },
    loading: {
      type: 'checkbox',
      defaultValue: false
    },
    weekStartsOn: {
      type: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
      defaultValue: 0
    }
  },
  getCode
};

export const calendarDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Two months',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days numberOfMonths={2} />
            </Calendar>`
    },
    {
      name: 'Monday first',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid weekStartsOn={1} />
              </Calendar.Days>
            </Calendar>`
    },
    {
      name: 'Week numbers',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid showWeekNumber fixedWeeks />
              </Calendar.Days>
            </Calendar>`
    },
    {
      name: 'Outside days',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid showOutsideDays />
              </Calendar.Days>
            </Calendar>`
    }
  ]
};

export const pickerDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Trigger>
                <Calendar.Input />
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'Custom trigger',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
            >
              <Calendar.Trigger nativeButton render={<Button variant="outline" />} />
              <Calendar.Content>
                <Calendar.Days />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'No icon',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Trigger>
                <Calendar.Input trailingIcon={null} />
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days />
              </Calendar.Content>
            </Calendar>`
    }
  ]
};

export const rangeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<Calendar selection="range" defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Trigger>
                <Flex align="center" gap={3}>
                  <Calendar.Input field="start" />
                  <Calendar.Input field="end" />
                </Flex>
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days numberOfMonths={2} />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'Read-only start',
      code: `<Calendar
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={{ from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }}
            >
              <Calendar.Trigger>
                <Flex align="center" gap={3}>
                  <Calendar.Input field="start" readOnly />
                  <Calendar.Input field="end" />
                </Flex>
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days numberOfMonths={2} />
              </Calendar.Content>
            </Calendar>`
    }
  ]
};

export const periodsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'All scales',
      code: `<Calendar
              scales={['day', 'month', 'quarter', 'half-year', 'year']}
              defaultMonth={new Date(2026, 7, 1)}
              defaultScale="quarter"
            >
              <Calendar.Body showCalendarIcon />
            </Calendar>`
    },
    {
      name: 'In a popover',
      code: `<Calendar
              scales={['day', 'month', 'quarter', 'half-year', 'year']}
              defaultMonth={new Date(2026, 7, 1)}
            >
              <Calendar.Trigger placeholder="Add start date" />
              <Calendar.Content>
                <Calendar.Body showCalendarIcon />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'Year range',
      code: `<Calendar
              scales={['month', 'quarter', 'year']}
              defaultScale="quarter"
              defaultMonth={new Date(2026, 7, 1)}
              yearRange={{ from: 2025, to: 2027 }}
            >
              <Calendar.Body showCalendarIcon />
            </Calendar>`
    },
    {
      name: 'Month',
      code: `<Calendar scales={['month', 'quarter', 'year']} defaultScale="month">
              <Calendar.Body showCalendarIcon />
            </Calendar>`
    },
    {
      name: 'Quarter',
      code: `<Calendar scales="quarter" defaultMonth={new Date(2026, 7, 1)}>
              <Calendar.Body showCalendarIcon />
            </Calendar>`
    },
    {
      name: 'Trailing value',
      code: `function CalendarTrailingExample() {
  const scales = ['day', 'month', 'quarter', 'half-year', 'year'];
  const [start, setStart] = React.useState({ date: '2026-07-01', scale: 'quarter' });
  const [end, setEnd] = React.useState({ date: '2026-09-30', scale: 'quarter' });

  return (
    <Flex direction="column" gap={5}>
      <Flex align="center" gap={3}>
        <Calendar scales={scales} value={start} onValueChange={setStart}>
          <Calendar.Trigger
            render={<Button variant="outline" size="small" />}
            nativeButton
            placeholder="Add start date"
          />
          <Calendar.Content>
            <Calendar.Body showCalendarIcon label="Start date" />
          </Calendar.Content>
        </Calendar>

        <Text size="small" color="secondary">→</Text>

        <Calendar scales={scales} trailingValue value={end} onValueChange={setEnd}>
          <Calendar.Trigger
            render={<Button variant="outline" size="small" />}
            nativeButton
            placeholder="Add end date"
          />
          <Calendar.Content>
            <Calendar.Body showCalendarIcon label="End date" />
          </Calendar.Content>
        </Calendar>
      </Flex>

      <Text size="micro" color="secondary">
        Emitted: {start.date} → {end.date}
      </Text>
    </Flex>
  );
}`
    }
  ]
};

export const limitsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Min date',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 17)}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Min/max',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 10)}
              maxDate={new Date(2024, 3, 20)}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Unavailable days',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              isDateUnavailable={date => date.getDay() === 0 || date.getDay() === 6}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Bounded periods',
      code: `<Calendar
              scales={['month', 'quarter', 'half-year']}
              defaultScale="quarter"
              trailingValue
              minDate={new Date(2026, 6, 15)}
            >
              <Calendar.Body showCalendarIcon />
            </Calendar>`
    }
  ]
};

export const statesDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Disabled',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)} disabled>
              <Calendar.Trigger>
                <Calendar.Input />
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'Read only',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
              readOnly
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Loading',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid loading />
              </Calendar.Days>
            </Calendar>`
    }
  ]
};

export const validationDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Invalid input',
      code: `function CalendarInvalidExample() {
  const [error, setError] = React.useState();

  return (
    <Flex justify="center">
      <Field label="Start date" error={error}>
        <Calendar
          defaultMonth={new Date(2024, 3, 1)}
          minDate={new Date(2024, 3, 1)}
          maxDate={new Date(2024, 3, 30)}
        >
          <Calendar.Trigger>
            <Calendar.Input
              errorMessages={{ unparseable: 'Use DD MMM YYYY' }}
              onValidityChange={({ message }) => setError(message)}
            />
          </Calendar.Trigger>
          <Calendar.Content>
            <Calendar.Days />
          </Calendar.Content>
        </Calendar>
      </Field>
    </Flex>
  );
}`
    },
    {
      name: 'Custom messages',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 1)}
              maxDate={new Date(2024, 3, 30)}
            >
              <Calendar.Trigger>
                <Calendar.Input
                  errorMessages={{
                    unparseable: 'Use DD/MM/YYYY, like 15/04/2024',
                    'out-of-bounds': 'Pick a date in April 2024'
                  }}
                />
              </Calendar.Trigger>
              <Calendar.Content>
                <Calendar.Days />
              </Calendar.Content>
            </Calendar>`
    },
    {
      name: 'With Field',
      code: `<Flex justify="center">
              <Field label="Start date" required>
                <Calendar defaultMonth={new Date(2024, 3, 1)}>
                  <Calendar.Trigger>
                    <Calendar.Input />
                  </Calendar.Trigger>
                  <Calendar.Content>
                    <Calendar.Days />
                  </Calendar.Content>
                </Calendar>
              </Field>
            </Flex>`
    }
  ]
};

export const resetDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Reset to date',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={new Date(2024, 3, 17)}
              defaultValue={new Date(2024, 3, 24)}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Reset range',
      code: `<Calendar
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={{ from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }}
              defaultValue={{ from: new Date(2024, 3, 3), to: new Date(2024, 3, 7) }}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Clear',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={null}
              defaultValue={new Date(2024, 3, 24)}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'Nothing to restore',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={new Date(2024, 3, 17)}
              defaultValue={new Date(2024, 3, 17)}
            >
              <Calendar.Days />
            </Calendar>`
    },
    {
      name: 'No defaultDate',
      code: `<Calendar
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 24)}
            >
              <Calendar.Days />
            </Calendar>`
    }
  ]
};

export const customisingDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Caption',
      code: `<Calendar defaultMonth={new Date(2024, 6, 1)}>
              <Calendar.Days>
                <Calendar.Header>
                  <Calendar.Caption>Delivery date</Calendar.Caption>
                  <Calendar.Caption />
                  <Calendar.PrevMonth />
                  <Calendar.NextMonth />
                </Calendar.Header>
                <Calendar.Grid />
              </Calendar.Days>
            </Calendar>`
    },
    {
      name: 'Month/year dropdown',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header>
                  <Calendar.Caption dropdown />
                  <Calendar.PrevMonth />
                  <Calendar.NextMonth />
                </Calendar.Header>
                <Calendar.Grid />
              </Calendar.Days>
            </Calendar>`
    },
    {
      name: 'Footer',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days />
              <Calendar.Footer>Dates are inclusive</Calendar.Footer>
            </Calendar>`
    },
    {
      name: 'Node footer',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days />
              <Calendar.Footer>
                <Flex align="center" gap={3}>
                  <Badge color="accent">Beta</Badge>
                  <Text size="small" color="secondary">Times are UTC</Text>
                </Flex>
              </Calendar.Footer>
            </Calendar>`
    },
    {
      name: 'Date info',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid
                  dateInfo={date =>
                    date.getDate() % 7 === 0 ? (
                      <Text size="micro" color="accent">$</Text>
                    ) : null
                  }
                />
              </Calendar.Days>
            </Calendar>`
    },
    {
      name: 'Tooltips',
      code: `<Calendar defaultMonth={new Date(2024, 3, 1)}>
              <Calendar.Days>
                <Calendar.Header />
                <Calendar.Grid
                  showTooltip
                  tooltipMessages={date =>
                    date.getDay() === 0 ? 'Weekend rate applies' : null
                  }
                />
              </Calendar.Days>
            </Calendar>`
    }
  ]
};
