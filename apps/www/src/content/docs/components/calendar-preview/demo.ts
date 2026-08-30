'use client';

import { getPropsString } from '@/lib/utils';

export const preview = {
  type: 'code',
  tabs: [
    {
      name: 'Inline',
      code: `<CalendarPreview defaultMonth={new Date(2024, 3, 1)}>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
    },
    {
      name: 'Date picker',
      code: `<CalendarPreview>
  <CalendarPreview.Trigger>
    <CalendarPreview.Input />
  </CalendarPreview.Trigger>
  <CalendarPreview.Content initialFocus={false}>
    <CalendarPreview.Nav />
    <CalendarPreview.Grid />
  </CalendarPreview.Content>
</CalendarPreview>`
    },
    {
      name: 'Range picker',
      code: `<CalendarPreview selection="range">
  <CalendarPreview.Trigger>
    <CalendarPreview.RangeInput />
  </CalendarPreview.Trigger>
  <CalendarPreview.Content initialFocus={false}>
    <CalendarPreview.Nav months={2} />
    <CalendarPreview.Grid months={2} />
  </CalendarPreview.Content>
</CalendarPreview>`
    }
  ]
};

export const stateDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Open state',
      code: `<CalendarPreview defaultOpen onOpenChange={(open) => console.log(open)}>
  <CalendarPreview.Trigger>
    <CalendarPreview.Input />
  </CalendarPreview.Trigger>
  <CalendarPreview.Content initialFocus={false}>
    <CalendarPreview.Nav />
    <CalendarPreview.Grid />
  </CalendarPreview.Content>
</CalendarPreview>`
    },
    {
      name: 'Visible month',
      code: `<CalendarPreview defaultMonth={new Date(2020, 0, 1)}>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
    },
    {
      name: 'Bounds',
      code: `<CalendarPreview
  defaultMonth={new Date(2024, 3, 1)}
  minDate={new Date(2024, 3, 10)}
  maxDate={new Date(2024, 3, 20)}
>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
    },
    {
      name: 'Unavailable days',
      code: `<CalendarPreview
  defaultMonth={new Date(2024, 3, 1)}
  isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
    }
  ]
};

export const granularityDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Switchable',
      code: `<CalendarPreview
  defaultMonth={new Date(2024, 3, 1)}
  granularities={['day', 'month', 'quarter', 'half-year', 'year']}
>
  <CalendarPreview.GranularityTabs />
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
  <CalendarPreview.MonthGrid />
</CalendarPreview>`
    },
    {
      name: 'Month only',
      code: `<CalendarPreview defaultGranularity="month">
  <CalendarPreview.MonthGrid />
</CalendarPreview>`
    },
    {
      name: 'Quarter',
      code: `<CalendarPreview defaultGranularity="quarter">
  <CalendarPreview.MonthGrid />
</CalendarPreview>`
    }
  ]
};

export const commitDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Explicit commit',
      code: `<CalendarPreview commit="explicit" defaultMonth={new Date(2024, 3, 1)} defaultOpen>
  <CalendarPreview.Trigger>
    <CalendarPreview.Input />
  </CalendarPreview.Trigger>
  <CalendarPreview.Content initialFocus={false}>
    <CalendarPreview.Nav />
    <CalendarPreview.Grid />
    <CalendarPreview.Footer>
      <CalendarPreview.Cancel />
      <CalendarPreview.Apply />
    </CalendarPreview.Footer>
  </CalendarPreview.Content>
</CalendarPreview>`
    },
    {
      name: 'Locked endpoint',
      code: `<CalendarPreview
  selection="range"
  lock="from"
  defaultMonth={new Date(2024, 3, 1)}
  defaultValue={{ from: new Date(2024, 3, 10), to: null }}
>
  <CalendarPreview.RangeInput />
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
    }
  ]
};

export const presetDemo = {
  type: 'code',
  code: `<CalendarPreview selection="range" defaultMonth={new Date(2024, 3, 1)}>
  <CalendarPreview.Presets>
    <CalendarPreview.Preset range={{ from: new Date(2024, 3, 11), to: new Date(2024, 3, 17) }}>
      Last 7 days
    </CalendarPreview.Preset>
    <CalendarPreview.Preset range={{ from: new Date(2024, 2, 19), to: new Date(2024, 3, 17) }}>
      Last 30 days
    </CalendarPreview.Preset>
    <CalendarPreview.Preset range={{ from: new Date(2024, 3, 1), to: new Date(2024, 3, 30) }}>
      This month
    </CalendarPreview.Preset>
  </CalendarPreview.Presets>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
};

export const loadingDemo = {
  type: 'code',
  code: `<CalendarPreview loading defaultMonth={new Date(2024, 3, 1)}>
  <CalendarPreview.Nav />
  <CalendarPreview.Grid />
</CalendarPreview>`
};

export const fieldDemo = {
  type: 'code',
  code: `<Field>
  <Field.Label>Starts</Field.Label>
  <CalendarPreview>
    <CalendarPreview.Trigger>
      <CalendarPreview.Input />
    </CalendarPreview.Trigger>
    <CalendarPreview.Content initialFocus={false}>
      <CalendarPreview.Nav />
      <CalendarPreview.Grid />
    </CalendarPreview.Content>
  </CalendarPreview>
  <Field.Error />
</Field>`
};

export const getCode = (props: Record<string, unknown>) => {
  const {
    selection = 'single',
    months = '1',
    switchable = false,
    withFooter = false,
    ...rest
  } = props;

  const monthCount = Number(months);
  const rootProps = getPropsString({
    ...(selection !== 'single' ? { selection } : {}),
    ...(switchable
      ? { granularities: ['day', 'month', 'quarter', 'half-year', 'year'] }
      : {}),
    ...(withFooter ? { commit: 'explicit' } : {}),
    ...rest
  });

  const input =
    selection === 'range'
      ? '<CalendarPreview.RangeInput />'
      : '<CalendarPreview.Input />';

  const monthsProp = monthCount > 1 ? ` months={${monthCount}}` : '';

  return `<CalendarPreview${rootProps} defaultMonth={new Date(2024, 3, 1)}>
  <CalendarPreview.Trigger>
    ${input}
  </CalendarPreview.Trigger>
  <CalendarPreview.Content initialFocus={false}>
${switchable ? '    <CalendarPreview.GranularityTabs />\n' : ''}    <CalendarPreview.Nav${monthsProp} />
    <CalendarPreview.Grid${monthsProp} />
${switchable ? '    <CalendarPreview.MonthGrid />\n' : ''}${
  withFooter
    ? `    <CalendarPreview.Footer>
      <CalendarPreview.Cancel />
      <CalendarPreview.Apply />
    </CalendarPreview.Footer>\n`
    : ''
}  </CalendarPreview.Content>
</CalendarPreview>`;
};

export const playground = {
  type: 'playground',
  controls: {
    selection: {
      type: 'select',
      options: ['single', 'range', 'multiple'],
      defaultValue: 'single'
    },
    months: { type: 'select', options: ['1', '2'], defaultValue: '1' },
    switchable: { type: 'checkbox', defaultValue: false },
    withFooter: { type: 'checkbox', defaultValue: false },
    disabled: { type: 'checkbox', defaultValue: false },
    readOnly: { type: 'checkbox', defaultValue: false },
    format: { type: 'text', initialValue: 'DD MMM YYYY' }
  },
  getCode
};
