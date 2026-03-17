'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Progress${getPropsString(props)} />`;
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
  <Progress value={40} />
  <Progress value={70} />
  <Progress value={100} />
</Flex>`
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Linear',
      code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Progress value={15}>
    <Flex justify="between">
      <Progress.Label>Uploading...</Progress.Label>
      <Progress.Value />
    </Flex>
    <Progress.Track />
  </Progress>
</Flex>`
    },
    {
      name: 'Circular',
      code: `<Flex gap="large" align="center">
  <Progress variant="circular" value={70}>
    <Progress.Track />
    <Progress.Value />
  </Progress>
  <Progress variant="circular" value={30}>
    <Progress.Track />
    <Progress.Value />
  </Progress>
  <Progress variant="circular" value={90}>
    <Progress.Track />
    <Progress.Value />
  </Progress>
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
  <Progress value={60}>
    <Progress.Track style={{ height: 2 }} />
  </Progress>
  <Progress value={60}>
    <Progress.Track />
  </Progress>
  <Progress value={60}>
    <Progress.Track style={{ height: 8 }} />
  </Progress>
</Flex>`
    },
    {
      name: 'Circular',
      code: `<Flex gap="large" align="center">
  <Progress variant="circular" value={60}>
    <Progress.Track style={{ width: 48, height: 48 }} />
    <Progress.Value />
  </Progress>
  <Progress variant="circular" value={60}>
    <Progress.Track />
    <Progress.Value />
  </Progress>
  <Progress variant="circular" value={60}>
    <Progress.Track style={{ width: 96, height: 96, "--rs-progress-track-size": "2px" }} />
    <Progress.Value />
  </Progress>
  <Progress variant="circular" value={60}>
    <Progress.Track style={{ "--rs-progress-track-size": "8px" }} />
    <Progress.Value />
  </Progress>
</Flex>`
    }
  ]
};

export const animatedDemo = {
  type: 'code',
  code: `function AnimatedProgress() {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((current) => {
        if (current >= 100) return 0;
        return Math.min(100, Math.round(current + Math.random() * 25));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex gap="large" align="center">
      <Progress value={value} style={{ width: 300 }}>
        <Flex justify="between">
          <Progress.Label>Uploading...</Progress.Label>
          <Progress.Value />
        </Flex>
        <Progress.Track />
      </Progress>
      <Progress variant="circular" value={value}>
        <Progress.Track />
        <Progress.Value />
      </Progress>
    </Flex>
  );
}`
};

export const withLabelsDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="large" style={{ width: "300px" }}>
  <Progress value={60}>
    <Flex justify="between">
      <Progress.Label>Uploading files...</Progress.Label>
      <Progress.Value />
    </Flex>
    <Progress.Track />
  </Progress>
  <Progress value={85}>
    <Flex justify="between">
      <Progress.Label>Processing...</Progress.Label>
      <Progress.Value />
    </Flex>
    <Progress.Track />
  </Progress>
</Flex>`
};
