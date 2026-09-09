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

export const preview = {
  type: 'code',
  tabs: [
    {
      name: 'Inline',
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
      name: 'Month + year',
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
    }
  ]
};

export const compositionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default header',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days />
            </CalendarPreview>`
    },
    {
      name: 'Custom caption',
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
      name: 'With footer',
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
    }
  ]
};

export const resetDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Reset',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={new Date(2024, 3, 17)}
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
      name: 'Clear the selection',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultDate={null}
              defaultValue={new Date(2024, 3, 24)}
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

export const boundsDemo = {
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
      name: 'Min and max',
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
      name: 'Read only',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
              readOnly
            >
              <CalendarPreview.Days />
            </CalendarPreview>`
    }
  ]
};

export const gridDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Outside days',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid showOutsideDays />
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
      name: 'Monday first',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Days>
                <CalendarPreview.Header />
                <CalendarPreview.Grid weekStartsOn={1} />
              </CalendarPreview.Days>
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

export const dateInfoDemo = {
  type: 'code',
  tabs: [
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
      name: 'Disabled dates',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 10)}
              isDateUnavailable={date => date.getDay() === 0 || date.getDay() === 6}
            >
              <CalendarPreview.Trigger>
                <CalendarPreview.Input />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'Without calendar icon',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Trigger>
                <CalendarPreview.Input trailingIcon={null} />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>`
    },
    {
      name: 'With Field',
      code: `<Field label="Start date" required>
              <CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
                <CalendarPreview.Trigger>
                  <CalendarPreview.Input />
                </CalendarPreview.Trigger>
                <CalendarPreview.Content>
                  <CalendarPreview.Days />
                </CalendarPreview.Content>
              </CalendarPreview>
            </Field>`
    },
    {
      name: 'Invalid input',
      code: `
function CalendarPreviewInvalidExample() {
  const [defaultError, setDefaultError] = React.useState();
  const [customError, setCustomError] = React.useState();

  const bounds = {
    defaultMonth: new Date(2024, 3, 1),
    minDate: new Date(2024, 3, 1),
    maxDate: new Date(2024, 3, 30)
  };

  return (
    <Flex direction="column" gap={7} style={{ maxWidth: 260 }}>
      <Field
        label="Start date"
        description="Type something that is not a date in April 2024"
        error={defaultError}
      >
        <CalendarPreview {...bounds}>
          <CalendarPreview.Trigger>
            <CalendarPreview.Input
              onValidityChange={({ message }) => setDefaultError(message)}
            />
          </CalendarPreview.Trigger>
          <CalendarPreview.Content>
            <CalendarPreview.Days />
          </CalendarPreview.Content>
        </CalendarPreview>
      </Field>

      <Field
        label="End date"
        description="The same failures, worded with errorMessages"
        error={customError}
      >
        <CalendarPreview {...bounds}>
          <CalendarPreview.Trigger>
            <CalendarPreview.Input
              errorMessages={{
                unparseable: 'Use DD/MM/YYYY, like 15/04/2024',
                'out-of-bounds': 'Pick a date in April 2024'
              }}
              onValidityChange={({ message }) => setCustomError(message)}
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
      name: 'Custom trigger',
      code: `<CalendarPreview
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={new Date(2024, 3, 17)}
            >
              <CalendarPreview.Trigger render={<Button variant="outline" />} />
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
      name: 'Disabled',
      code: `<CalendarPreview selection="range" defaultMonth={new Date(2024, 3, 1)} disabled>
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
      name: 'Disabled dates',
      code: `<CalendarPreview
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              minDate={new Date(2024, 3, 10)}
              isDateUnavailable={date => date.getDay() === 0 || date.getDay() === 6}
            >
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
      name: 'Without calendar icon',
      code: `<CalendarPreview selection="range" defaultMonth={new Date(2024, 3, 1)}>
              <CalendarPreview.Trigger>
                <Flex align="center" gap={3}>
                  <CalendarPreview.Input field="start" trailingIcon={null} />
                  <CalendarPreview.Input field="end" trailingIcon={null} />
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
    },
    {
      name: 'Invalid input',
      code: `
function CalendarPreviewRangeInvalidExample() {
  const [defaultError, setDefaultError] = React.useState();
  const [customError, setCustomError] = React.useState();

  const range = {
    selection: 'range',
    defaultMonth: new Date(2024, 3, 1),
    defaultValue: { from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }
  };

  return (
    <Flex direction="column" gap={7} style={{ maxWidth: 320 }}>
      <Field
        label="Trip dates"
        description="Type an end before 10/04/2024 — typing rejects, clicking restarts"
        error={defaultError}
      >
        <CalendarPreview {...range}>
          <CalendarPreview.Trigger>
            <Flex align="center" gap={3}>
              <CalendarPreview.Input
                field="start"
                onValidityChange={({ message }) => setDefaultError(message)}
              />
              <CalendarPreview.Input
                field="end"
                onValidityChange={({ message }) => setDefaultError(message)}
              />
            </Flex>
          </CalendarPreview.Trigger>
          <CalendarPreview.Content>
            <CalendarPreview.Days numberOfMonths={2} />
          </CalendarPreview.Content>
        </CalendarPreview>
      </Field>

      <Field
        label="Trip dates"
        description="The same crossing, worded with errorMessages"
        error={customError}
      >
        <CalendarPreview {...range}>
          <CalendarPreview.Trigger>
            <Flex align="center" gap={3}>
              <CalendarPreview.Input
                field="start"
                errorMessages={{ 'out-of-order': 'Start must not pass the end' }}
                onValidityChange={({ message }) => setCustomError(message)}
              />
              <CalendarPreview.Input
                field="end"
                errorMessages={{ 'out-of-order': 'Pick a day on or after the start' }}
                onValidityChange={({ message }) => setCustomError(message)}
              />
            </Flex>
          </CalendarPreview.Trigger>
          <CalendarPreview.Content>
            <CalendarPreview.Days numberOfMonths={2} />
          </CalendarPreview.Content>
        </CalendarPreview>
      </Field>
    </Flex>
  );
}`
    },
    {
      name: 'Custom trigger',
      code: `<CalendarPreview
              selection="range"
              defaultMonth={new Date(2024, 3, 1)}
              defaultValue={{ from: new Date(2024, 3, 10), to: new Date(2024, 3, 20) }}
            >
              <CalendarPreview.Trigger render={<Button variant="outline" />}>
                10 Apr – 20 Apr
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days numberOfMonths={2} />
              </CalendarPreview.Content>
            </CalendarPreview>`
    }
  ]
};
