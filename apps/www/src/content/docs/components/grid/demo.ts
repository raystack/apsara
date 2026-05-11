'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  return `
    <Grid${getPropsString(props)} style={{width:"100%",height:"100%"}}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Button>Button 4</Button>
      <Button>Button 5</Button>
      <Button>Button 6</Button>
      <Button>Button 7</Button>
      <Button>Button 8</Button>
    </Grid>`;
};
export const playground = {
  type: 'playground',
  controls: {
    gap: {
      type: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      initialValue: 3
    },
    rows: {
      type: 'number',
      min: 1,
      max: 10,
      initialValue: 4
    },
    columns: {
      type: 'number',
      min: 1,
      max: 10,
      initialValue: 2
    },
    justifyItems: {
      type: 'select',
      options: ['start', 'end', 'center', 'stretch'],
      initialValue: 'center'
    },
    alignItems: {
      type: 'select',
      options: ['start', 'end', 'center', 'stretch'],
      initialValue: 'center'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
  <Grid
  gap={3}
  rows={2}
  columns={2}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
  <Grid.Item>4</Grid.Item>
  <Grid.Item>5</Grid.Item>
  <Grid.Item>6</Grid.Item>
</Grid>`
};
