'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `<Slider${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    defaultValue: { type: 'number', initialValue: 50 },
    thumbSize: {
      type: 'select',
      initialValue: 'large',
      options: ['small', 'large']
    },
    min: { type: 'number', defaultValue: 0, min: 0, max: 99 },
    max: { type: 'number', defaultValue: 100, min: 1, max: 100 },
    step: { type: 'number', defaultValue: 1, min: 0, max: 100 },
    thumbLabel: { type: 'text', initialValue: 'Slider Label' }
  },
  getCode
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `<Slider variant="single" thumbLabel="Value" defaultValue={50} />`
    },
    {
      name: 'Range',
      code: `<Slider variant="range" thumbLabel={["Min", "Max"]} defaultValue={[20, 80]} />`
    }
  ]
};

export const controlDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `function ControlledSlider() {
  const [value, setValue] = React.useState(50);

  return (
    <Flex direction="column" gap={5} align="center" style={{ width: "400px" }}>
      <Slider
        variant="single"
        value={value}
        thumbLabel="Value"
        onValueChange={(newValue) => setValue(newValue as number)}
      />
      <Text>Value {value}</Text>
    </Flex>
  );
}`
    },
    {
      name: 'Range',
      code: `function ControlledRangeSlider() {
  const [value, setValue] = React.useState([25, 75]);

  return (
    <Flex direction="column" gap={5} align="center" style={{ width: "400px" }}>
      <Slider
        variant="range"
        value={value}
        thumbLabel={["Lower", "Upper"]}
        onValueChange={(newValue) => setValue(newValue as [number, number])}
      />
      <Text>Lower {value[0]}</Text>
      <Text>Upper {value[1]}</Text>
    </Flex>
  );
}`
    }
  ]
};

export const thumbSizeDemo = {
  type: 'code',
  code: `<Flex direction="column" gap={11} align="center" style={{ width: "400px" }}>
  <Slider
    variant="single"
    thumbLabel="Large Thumb"
    defaultValue={50}
    thumbSize="large"
  />
  <Slider
    variant="single"
    thumbLabel="Small Thumb"
    defaultValue={50}
    thumbSize="small"
  />
</Flex>`
};

export const labelDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `<Slider defaultValue={40} style={{ width: "400px" }}>
  <Slider.Label>Volume</Slider.Label>
  <Slider.Value />
</Slider>`
    },
    {
      name: 'Range',
      code: `<Slider
  variant="range"
  defaultValue={[20, 80]}
  thumbLabel={["Minimum price", "Maximum price"]}
  style={{ width: "400px" }}
>
  <Slider.Label>Price</Slider.Label>
  <Slider.Value />
</Slider>`
    }
  ]
};
