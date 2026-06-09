'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `
<Radio.Group defaultValue="2"${getPropsString(props)}>
  <Flex gap={3} align="center">
    <Radio value="1" id="pg-r1" />
    <label htmlFor="pg-r1">Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="pg-r2" />
    <label htmlFor="pg-r2">Option Two</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="3" id="pg-r3" />
    <label htmlFor="pg-r3">Option Three</label>
  </Flex>
</Radio.Group>`;
};

export const playground = {
  type: 'playground',
  controls: {
    orientation: {
      type: 'select',
      options: ['vertical', 'horizontal'],
      defaultValue: 'vertical'
    },
    size: {
      type: 'select',
      options: ['large', 'small'],
      defaultValue: 'large'
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const stateDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `
<Radio.Group defaultValue="1">
  <Flex gap={3} align="center">
    <Radio value="1" id="d1" />
    <label htmlFor="d1">Default Option</label>
  </Flex>
</Radio.Group>`
    },
    {
      name: 'Disabled',
      code: `
<Radio.Group defaultValue="1">
  <Flex gap={3} align="center">
    <Radio value="1" disabled id="dis1" />
    <label htmlFor="dis1">Disabled Option</label>
  </Flex>
</Radio.Group>`
    }
  ]
};

export const sizeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Large (default)',
      code: `
<Radio.Group defaultValue="1" size="large">
  <Flex gap={3} align="center">
    <Radio value="1" id="sl1" />
    <label htmlFor="sl1">Large Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="sl2" />
    <label htmlFor="sl2">Large Option Two</label>
  </Flex>
</Radio.Group>`
    },
    {
      name: 'Small',
      code: `
<Radio.Group defaultValue="1" size="small">
  <Flex gap={3} align="center">
    <Radio value="1" id="ss1" />
    <label htmlFor="ss1">Small Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="ss2" />
    <label htmlFor="ss2">Small Option Two</label>
  </Flex>
</Radio.Group>`
    },
    {
      name: 'Per-item override',
      code: `
<Radio.Group defaultValue="1" size="small">
  <Flex gap={3} align="center">
    <Radio value="1" id="so1" />
    <label htmlFor="so1">Small (from group)</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" size="large" id="so2" />
    <label htmlFor="so2">Large (overrides group)</label>
  </Flex>
</Radio.Group>`
    }
  ]
};

export const orientationDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Vertical (default)',
      code: `
<Radio.Group defaultValue="1" orientation="vertical">
  <Flex gap={3} align="center">
    <Radio value="1" id="ov1" />
    <label htmlFor="ov1">Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="ov2" />
    <label htmlFor="ov2">Option Two</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="3" id="ov3" />
    <label htmlFor="ov3">Option Three</label>
  </Flex>
</Radio.Group>`
    },
    {
      name: 'Horizontal',
      code: `
<Radio.Group defaultValue="1" orientation="horizontal">
  <Flex gap={3} align="center">
    <Radio value="1" id="oh1" />
    <label htmlFor="oh1">Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="oh2" />
    <label htmlFor="oh2">Option Two</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="3" id="oh3" />
    <label htmlFor="oh3">Option Three</label>
  </Flex>
</Radio.Group>`
    }
  ]
};

export const labelDemo = {
  type: 'code',
  code: `
<Radio.Group defaultValue="1">
  <Flex gap={3} align="center">
    <Radio value="1" id="L1" />
    <label htmlFor="L1">Option One</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="2" id="L2" />
    <label htmlFor="L2">Option Two</label>
  </Flex>
  <Flex gap={3} align="center">
    <Radio value="3" id="L3" />
    <label htmlFor="L3">Option Three</label>
  </Flex>
</Radio.Group>`
};

export const formDemo = {
  type: 'code',
  code: `
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  alert(JSON.stringify(Object.fromEntries(formData)));
}}>
  <Flex direction="column" gap={5}>
    <Radio.Group name="plan" defaultValue="monthly">
      <Flex gap={3} align="center">
        <Radio value="monthly" id="mp" />
        <label htmlFor="mp">Monthly Plan</label>
      </Flex>
      <Flex gap={3} align="center">
        <Radio value="yearly" id="yp" />
        <label htmlFor="yp">Yearly Plan</label>
      </Flex>
    </Radio.Group>
    <Button type="submit" style={{ width: "100%" }}>Submit</Button>
  </Flex>
</form>`
};
