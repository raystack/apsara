'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<NumberField${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    defaultValue: { type: 'text', initialValue: '0' },
    min: { type: 'text', initialValue: '' },
    max: { type: 'text', initialValue: '' },
    step: { type: 'text', initialValue: '1' },
    disabled: { type: 'checkbox', initialValue: false, defaultValue: false }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `<NumberField defaultValue={0} />`
};

export const minMaxDemo = {
  type: 'code',
  code: `<NumberField defaultValue={5} min={0} max={10} />`
};

export const stepDemo = {
  type: 'code',
  code: `<NumberField defaultValue={0} step={5} />`
};

export const disabledDemo = {
  type: 'code',
  code: `<NumberField defaultValue={0} disabled />`
};

export const composedDemo = {
  type: 'code',
  code: `<NumberField defaultValue={0}>
  <NumberField.ScrubArea label="Amount" />
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField>`
};

export const formatDemo = {
  type: 'code',
  code: `<NumberField
  defaultValue={1000}
  format={{ style: 'currency', currency: 'USD' }}
/>`
};
