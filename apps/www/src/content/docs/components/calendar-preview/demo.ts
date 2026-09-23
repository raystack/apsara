'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

/* The grid props drive the playground rather than the root's, because they
   are what visibly changes: the root's state props need a value to show. */
export const getCode = (props: ComponentPropsType) => {
  return `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header>
                  <CalendarPreview.Caption />
                  <CalendarPreview.PrevMonth />
                  <CalendarPreview.NextMonth />
                </CalendarPreview.Header>
                <CalendarPreview.Grid${getPropsString(props)} />
              </CalendarPreview.Days>
            </CalendarPreview>`;
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
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Two months',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days numberOfMonths={2} />
            </CalendarPreview>`
    },
    {
      name: 'Monday first',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid weekStartsOn={1} />
              </CalendarPreview.Days>
            </CalendarPreview>`
    },
    {
      name: 'Week numbers',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid showWeekNumber fixedWeeks />
              </CalendarPreview.Days>
            </CalendarPreview>`
    },
    {
      name: 'Outside days',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid showOutsideDays />
              </CalendarPreview.Days>
            </CalendarPreview>`
    }
  ]
};

export const pickerDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Trigger>
                <CalendarPreview.Input />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'Custom trigger',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
            >
              <CalendarPreview.Trigger nativeButton render={<Button variant="outline" />} />
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'No icon',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Trigger>
                <CalendarPreview.Input trailingIcon={null} />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    }
  ]
};

export const rangeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<CalendarPreview selection="range" defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Trigger>
                <Flex align="center" gap={3}>
                  <CalendarPreview.Input field="start" />
                  <CalendarPreview.Input field="end" />
                </Flex>
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days numberOfMonths={2} />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'Read-only start',
      code: `<CalendarPreview
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={{ from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }}
            >
              <CalendarPreview.Trigger>
                <Flex align="center" gap={3}>
                  <CalendarPreview.Input field="start" readOnly />
                  <CalendarPreview.Input field="end" />
                </Flex>
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days numberOfMonths={2} />
              </CalendarPreview.Content>
            </CalendarPreview>`
    }
  ]
};

export const periodsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'All scales',
      code: `<CalendarPreview
              scales={['day', 'month', 'quarter', 'halfYear', 'year']}
              defaultMonth={new Date(2026, 7, 1)}
              defaultScale="quarter"
            >
              <CalendarPreview.Body showIcon />
            </CalendarPreview>`
    },
    {
      name: 'In a popover',
      code: `<CalendarPreview
              scales={['day', 'month', 'quarter', 'halfYear', 'year']}
              defaultMonth={new Date(2026, 7, 1)}
            >
              <CalendarPreview.Trigger placeholder="Add start date" />
              <CalendarPreview.Content>
                <CalendarPreview.Body showIcon />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'Year range',
      code: `<CalendarPreview
              scales={['month', 'quarter', 'year']}
              defaultScale="quarter"
              defaultMonth={new Date(2026, 7, 1)}
              yearRange={{ from: 2025, to: 2027 }}
            >
              <CalendarPreview.Body showIcon />
            </CalendarPreview>`
    },
    {
      name: 'Month',
      code: `<CalendarPreview scales={['month', 'quarter', 'year']} defaultScale="month">
              <CalendarPreview.Body showIcon />
            </CalendarPreview>`
    },
    {
      name: 'Quarter',
      code: `<CalendarPreview scales="quarter" defaultMonth={new Date(2026, 7, 1)}>
              <CalendarPreview.Body showIcon />
            </CalendarPreview>`
    },
    {
      name: 'Trailing value',
      code: `function CalendarPreviewTrailingExample() {
  const scales = ['day', 'month', 'quarter', 'halfYear', 'year'];
  const [start, setStart] = React.useState({ date: '2026-07-01', scale: 'quarter' });
  const [end, setEnd] = React.useState({ date: '2026-09-30', scale: 'quarter' });

  return (
    <Flex direction="column" gap={5}>
      <Flex align="center" gap={3}>
        <CalendarPreview scales={scales} value={start} onValueChange={setStart}>
          <CalendarPreview.Trigger
            render={<Button variant="outline" size="small" />}
            nativeButton
            placeholder="Add start date"
          />
          <CalendarPreview.Content>
            <CalendarPreview.Body showIcon label="Start date" />
          </CalendarPreview.Content>
        </CalendarPreview>

        <Text size="small" variant="secondary">→</Text>

        <CalendarPreview scales={scales} trailingValue value={end} onValueChange={setEnd}>
          <CalendarPreview.Trigger
            render={<Button variant="outline" size="small" />}
            nativeButton
            placeholder="Add end date"
          />
          <CalendarPreview.Content>
            <CalendarPreview.Body showIcon label="End date" />
          </CalendarPreview.Content>
        </CalendarPreview>
      </Flex>

      <Text size="micro" variant="secondary">
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
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 17)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Min/max',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 10)}
              maxDate={new Date(2024, 3, 20)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Unavailable days',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              isDateUnavailable={date => date.getDay() === 0 || date.getDay() === 6}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Bounded periods',
      code: `<CalendarPreview
              scales={['month', 'quarter', 'halfYear']}
              defaultScale="quarter"
              trailingValue
              minDate={new Date(2026, 6, 15)}
            >
              <CalendarPreview.Body showIcon />
            </CalendarPreview>`
    }
  ]
};

export const statesDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Disabled',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)} disabled>
              <CalendarPreview.Trigger>
                <CalendarPreview.Input />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'Read only',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
              readOnly
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Loading',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid loading />
              </CalendarPreview.Days>
            </CalendarPreview>`
    }
  ]
};

export const validationDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Invalid input',
      code: `function CalendarPreviewInvalidExample() {
  const [error, setError] = React.useState();

  return (
    <Flex justify="center">
      <Field label="Start date" error={error}>
        <CalendarPreview
          defaultMonth={new Date(2024, 3, 1)}
          minDate={new Date(2024, 3, 1)}
          maxDate={new Date(2024, 3, 30)}
        >
          <CalendarPreview.Trigger>
            <CalendarPreview.Input
              errorMessages={{ unparseable: 'Use DD MMM YYYY' }}
              onValidityChange={({ message }) => setError(message)}
            />
          </CalendarPreview.Trigger>
          <CalendarPreview.Content>
            <CalendarPreview.Days />
          </CalendarPreview.Content>
        </CalendarPreview>
      </Field>
    </Flex>
  );
}`
    },
    {
      name: 'Custom messages',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 1)}
              maxDate={new Date(2024, 3, 30)}
            >
              <CalendarPreview.Trigger>
                <CalendarPreview.Input
                  errorMessages={{
                    unparseable: 'Use DD/MM/YYYY, like 15/04/2024',
                    'out-of-bounds': 'Pick a date in April 2024'
                  }}
                />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'With Field',
      code: `<Flex justify="center">
              <Field label="Start date" required>
                <CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
                  <CalendarPreview.Trigger>
                    <CalendarPreview.Input />
                  </CalendarPreview.Trigger>
                  <CalendarPreview.Content>
                    <CalendarPreview.Days />
                  </CalendarPreview.Content>
                </CalendarPreview>
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
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={new Date(2024, 3, 17)}
              defaultValue={new Date(2024, 3, 24)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Reset range',
      code: `<CalendarPreview
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={{ from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }}
              defaultValue={{ from: new Date(2024, 3, 3), to: new Date(2024, 3, 7) }}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Clear',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={null}
              defaultValue={new Date(2024, 3, 24)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Nothing to restore',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={new Date(2024, 3, 17)}
              defaultValue={new Date(2024, 3, 17)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'No defaultDate',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 24)}
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    }
  ]
};

export const customisingDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Caption',
      code: `<CalendarPreview defaultMonth={new Date(2024, 6, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header>
                  <CalendarPreview.Caption>Delivery date</CalendarPreview.Caption>
                  <CalendarPreview.Caption />
                  <CalendarPreview.PrevMonth />
                  <CalendarPreview.NextMonth />
                </CalendarPreview.Header>
                <CalendarPreview.Grid />
              </CalendarPreview.Days>
            </CalendarPreview>`
    },
    {
      name: 'Month/year dropdown',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header>
                  <CalendarPreview.Caption dropdown />
                  <CalendarPreview.PrevMonth />
                  <CalendarPreview.NextMonth />
                </CalendarPreview.Header>
                <CalendarPreview.Grid />
              </CalendarPreview.Days>
            </CalendarPreview>`
    },
    {
      name: 'Footer',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days />
              <CalendarPreview.Footer>Dates are inclusive</CalendarPreview.Footer>
            </CalendarPreview>`
    },
    {
      name: 'Node footer',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days />
              <CalendarPreview.Footer>
                <Flex align="center" gap={3}>
                  <Badge variant="accent">Beta</Badge>
                  <Text size="small" variant="secondary">Times are UTC</Text>
                </Flex>
              </CalendarPreview.Footer>
            </CalendarPreview>`
    },
    {
      name: 'Date info',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid
                  dateInfo={date =>
                    date.getDate() % 7 === 0 ? (
                      <Text size="micro" variant="accent">$</Text>
                    ) : null
                  }
                />
              </CalendarPreview.Days>
            </CalendarPreview>`
    },
    {
      name: 'Tooltips',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid
                  showTooltip
                  tooltipMessages={date =>
                    date.getDay() === 0 ? 'Weekend rate applies' : null
                  }
                />
              </CalendarPreview.Days>
            </CalendarPreview>`
    }
  ]
};
