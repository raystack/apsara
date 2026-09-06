'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `
    <Flex${getPropsString(props)} style={{width:"100%",height:"100%"}}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Flex>`;
};
export const playground = {
  type: 'playground',
  controls: {
    gap: {
      type: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      initialValue: 3
    },
    wrap: {
      type: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      initialValue: 'wrap'
    },
    justify: {
      type: 'select',
      options: ['start', 'end', 'center', 'between'],
      initialValue: 'center'
    },
    align: {
      type: 'select',
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
      initialValue: 'center'
    },
    direction: {
      type: 'select',
      options: ['row', 'rowReverse', 'column', 'columnReverse'],
      initialValue: 'row'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Flex gap={9}>
    <Flex gap={5} direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
    <Flex gap={5} direction="column">
      <Button>Primary button</Button>
      <Button>Primary button</Button>
      <Button>Primary button</Button>
    </Flex>
  </Flex>`
};

export const directionDemo = {
  type: 'code',
  code: `
<Flex direction="column" gap={5}>
  <Flex direction="row" gap={3}>
    <Button size="small" variant="outline">row</Button>
    <Button size="small" variant="outline">is the</Button>
    <Button size="small" variant="outline">default</Button>
  </Flex>
  <Flex direction="column" gap={3} style={{ width: 'fit-content' }}>
    <Button size="small" variant="outline">column</Button>
    <Button size="small" variant="outline">stacks</Button>
  </Flex>
</Flex>`
};

export const justifyDemo = {
  type: 'code',
  code: `
<Flex direction="column" gap={4} style={{ width: '100%' }}>
  {["start", "center", "end", "between"].map((j) => (
    <Flex key={j} justify={j} gap={3}
      style={{ width: '100%', padding: 8, border: '1px dashed var(--rs-color-border-base-primary)', borderRadius: 4 }}>
      <Badge>{j}</Badge>
      <Badge>b</Badge>
    </Flex>
  ))}
</Flex>`
};

export const alignDemo = {
  type: 'code',
  code: `
<Flex gap={4} align="center" style={{ height: 90, padding: 8, border: '1px dashed var(--rs-color-border-base-primary)', borderRadius: 4 }}>
  <Badge>align</Badge>
  <Text size="large">center</Text>
  <Button size="small">pulls a mixed-height row onto one line</Button>
</Flex>`
};

export const wrapDemo = {
  type: 'code',
  code: `
<Flex wrap="wrap" gap={3} style={{ maxWidth: 300 }}>
  {["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"].map((t) => (
    <Badge key={t}>{t}</Badge>
  ))}
</Flex>`
};
