'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  if (props.checked === 'false') props.checked = false;
  else if (props.checked === 'true') props.checked = true;

  return `<Checkbox${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    checked: {
      type: 'checkbox',
      initialValue: false,
      defaultValue: false
    },
    indeterminate: {
      type: 'checkbox',
      initialValue: false,
      defaultValue: false
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const statesExamples = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `<Checkbox />`
    },
    {
      name: 'Checked',
      code: `<Checkbox checked/>`
    },
    {
      name: 'Indeterminate',
      code: `<Checkbox indeterminate />`
    },
    {
      name: 'Disabled',
      code: `<Checkbox disabled />`
    }
  ]
};
