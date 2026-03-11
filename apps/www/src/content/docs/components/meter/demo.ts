'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Meter${getPropsString(props)} />`;
};

export const playground = {
  type: 'playground',
  controls: {
    value: { type: 'number', initialValue: 40, min: 0, max: 100 },
    variant: {
      type: 'select',
      initialValue: 'linear',
      options: ['linear', 'circular']
    },
    min: { type: 'number', defaultValue: 0, min: 0, max: 99 },
    max: { type: 'number', defaultValue: 100, min: 1, max: 100 }
  },
  getCode
};

export const directUsageDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Meter value={40} />
  <Meter value={70} />
  <Meter value={100} />
</Flex>`
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Linear',
      code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Meter value={15}>
    <Flex justify="between">
      <Meter.Label>Storage used</Meter.Label>
      <Meter.Value />
    </Flex>
    <Meter.Track />
  </Meter>
</Flex>`
    },
    {
      name: 'Circular',
      code: `<Flex gap="large" align="center">
  <Meter variant="circular" value={70}>
    <Meter.Track />
    <Meter.Value />
  </Meter>
  <Meter variant="circular" value={30}>
    <Meter.Track />
    <Meter.Value />
  </Meter>
  <Meter variant="circular" value={90}>
    <Meter.Track />
    <Meter.Value />
  </Meter>
</Flex>`
    }
  ]
};

export const customizationDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Linear',
      code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Meter value={60}>
    <Meter.Track style={{ height: 2 }} />
  </Meter>
  <Meter value={60}>
    <Meter.Track />
  </Meter>
  <Meter value={60}>
    <Meter.Track style={{ height: 8 }} />
  </Meter>
</Flex>`
    },
    {
      name: 'Circular',
      code: `<Flex gap="large" align="center">
  <Meter variant="circular" value={60}>
    <Meter.Track style={{ width: 48, height: 48 }} />
    <Meter.Value />
  </Meter>
  <Meter variant="circular" value={60}>
    <Meter.Track />
    <Meter.Value />
  </Meter>
  <Meter variant="circular" value={60}>
    <Meter.Track style={{ width: 96, height: 96, "--rs-meter-track-size": "2px" }} />
    <Meter.Value />
  </Meter>
  <Meter variant="circular" value={60}>
    <Meter.Track style={{ "--rs-meter-track-size": "8px" }} />
    <Meter.Value />
  </Meter>
</Flex>`
    }
  ]
};

export const withLabelsDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Meter value={60}>
    <Flex justify="between">
      <Meter.Label>CPU Usage</Meter.Label>
      <Meter.Value />
    </Flex>
    <Meter.Track />
  </Meter>
  <Meter value={85}>
    <Flex justify="between">
      <Meter.Label>Memory</Meter.Label>
      <Meter.Value />
    </Flex>
    <Meter.Track />
  </Meter>
</Flex>`
};

export const customRangeDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Meter value={750} min={0} max={1000}>
    <Flex justify="between">
      <Meter.Label>API Calls</Meter.Label>
      <Meter.Value />
    </Flex>
    <Meter.Track />
  </Meter>
</Flex>`
};
