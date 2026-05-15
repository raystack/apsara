'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
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
    },
    size: {
      type: 'select',
      options: ['large', 'small'],
      defaultValue: 'large'
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

export const sizeExamples = {
  type: 'code',
  tabs: [
    {
      name: 'Large (default)',
      code: `<Checkbox size="large" />`
    },
    {
      name: 'Small',
      code: `<Checkbox size="small" />`
    }
  ]
};

export const groupDemo = {
  type: 'code',
  code: `
<Checkbox.Group defaultValue={["banana"]}>
  <Flex direction="column" gap={3}>
    <Flex gap={3} align="center">
      <Checkbox name="apple" id="cg-apple" />
      <label htmlFor="cg-apple">Apple</label>
    </Flex>
    <Flex gap={3} align="center">
      <Checkbox name="banana" id="cg-banana" />
      <label htmlFor="cg-banana">Banana</label>
    </Flex>
    <Flex gap={3} align="center">
      <Checkbox name="cherry" id="cg-cherry" />
      <label htmlFor="cg-cherry">Cherry</label>
    </Flex>
  </Flex>
</Checkbox.Group>`
};

export const groupHorizontalDemo = {
  type: 'code',
  code: `
<Checkbox.Group defaultValue={["banana"]} orientation="horizontal">
  <Flex gap={3} align="center">
    <Checkbox name="apple" id="ch-apple" />
    <label htmlFor="ch-apple">Apple</label>
  </Flex>
  <Flex gap={3} align="center">
    <Checkbox name="banana" id="ch-banana" />
    <label htmlFor="ch-banana">Banana</label>
  </Flex>
  <Flex gap={3} align="center">
    <Checkbox name="cherry" id="ch-cherry" />
    <label htmlFor="ch-cherry">Cherry</label>
  </Flex>
</Checkbox.Group>`
};

export const groupDisabledDemo = {
  type: 'code',
  code: `
<Checkbox.Group defaultValue={["apple"]} disabled>
  <Flex direction="column" gap={3}>
    <Flex gap={3} align="center">
      <Checkbox name="apple" id="cd-apple" />
      <label htmlFor="cd-apple">Apple</label>
    </Flex>
    <Flex gap={3} align="center">
      <Checkbox name="banana" id="cd-banana" />
      <label htmlFor="cd-banana">Banana</label>
    </Flex>
  </Flex>
</Checkbox.Group>`
};

export const parentDemo = {
  type: 'code',
  code: `
function ParentExample() {
  const [value, setValue] = React.useState([]);
  const allValues = ["apple", "banana", "cherry"];
  return (
    <Checkbox.Group value={value} onValueChange={setValue} allValues={allValues}>
      <Flex direction="column" gap={3}>
        <Flex gap={3} align="center">
          <Checkbox parent id="cp-all" />
          <label htmlFor="cp-all"><strong>Select All</strong></label>
        </Flex>
        <Flex direction="column" gap={3} style={{ paddingLeft: 24 }}>
          <Flex gap={3} align="center">
            <Checkbox name="apple" id="cp-apple" />
            <label htmlFor="cp-apple">Apple</label>
          </Flex>
          <Flex gap={3} align="center">
            <Checkbox name="banana" id="cp-banana" />
            <label htmlFor="cp-banana">Banana</label>
          </Flex>
          <Flex gap={3} align="center">
            <Checkbox name="cherry" id="cp-cherry" />
            <label htmlFor="cp-cherry">Cherry</label>
          </Flex>
        </Flex>
      </Flex>
    </Checkbox.Group>
  );
}`
};
