'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
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
    label: { type: 'text', initialValue: 'Slider Label' }
  },
  getCode
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `<Slider variant="single" label="Value" defaultValue={50} />`
    },
    {
      name: 'Range',
      code: `<Slider variant="range" label={["Min", "Max"]} defaultValue={[20, 80]} />`
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
    <Flex direction="column" gap="medium" align="center" style={{ width: "400px" }}>
      <Slider
        variant="single"
        value={value}
        label="Value"
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
    <Flex direction="column" gap="medium" align="center" style={{ width: "400px" }}>
      <Slider
        variant="range"
        value={value}
        label={["Lower", "Upper"]}
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
  code: `<Flex direction="column" gap="extra-large" align="center" style={{ width: "400px" }}>
  <Slider
    variant="single"
    label="Large Thumb"
    defaultValue={50}
    thumbSize="large"
  />
  <Slider
    variant="single"
    label="Small Thumb"
    defaultValue={50}
    thumbSize="small"
  />
</Flex>`
};
