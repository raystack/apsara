'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Switch${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    defaultChecked: {
      type: 'checkbox',
      defaultValue: false
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    },
    size: {
      type: 'select',
      options: ['large', 'small'],
      defaultValue: 'large'
    }
  },
  getCode
};

export const stateDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Switch />
    <Switch defaultChecked />
    <Switch disabled />
    <Switch disabled defaultChecked />
    <Switch required />
  </Flex>`
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Switch size="large" />
    <Switch size="large" defaultChecked />
    <Switch size="small" />
    <Switch size="small" defaultChecked />
  </Flex>`
};

export const controlDemo = {
  type: 'code',
  code: `
  function ControlledSwitch() {
  const [checked, setChecked] = React.useState(false);
  return (
    <Switch
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}`
};
