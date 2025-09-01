'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
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
      options: ['extra-small', 'small', 'medium', 'large', 'extra-large'],
      initialValue: 'small'
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
  gap="small"
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
