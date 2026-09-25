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

export const spanDemo = {
  type: 'code',
  code: `
<Grid columns={3} gap={3}>
  <Grid.Item colSpan={3} style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>Header — colSpan 3</Grid.Item>
  <Grid.Item rowSpan={2} style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>Sidebar — rowSpan 2</Grid.Item>
  <Grid.Item colSpan={2} style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>Main</Grid.Item>
  <Grid.Item colSpan={2} style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>Below main</Grid.Item>
</Grid>`
};

export const areasDemo = {
  type: 'code',
  code: `
<Grid
  columns="140px 1fr"
  gap={3}
  templateAreas={["nav header", "nav main", "nav footer"]}>
  <Grid.Item area="nav" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>nav</Grid.Item>
  <Grid.Item area="header" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>header</Grid.Item>
  <Grid.Item area="main" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>main</Grid.Item>
  <Grid.Item area="footer" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>footer</Grid.Item>
</Grid>`
};

export const alignmentDemo = {
  type: 'code',
  code: `
<Grid columns={3} gap={3} rows="80px" alignItems="center" justifyItems="center">
  <Grid.Item style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>centered</Grid.Item>
  <Grid.Item alignSelf="start" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>alignSelf start</Grid.Item>
  <Grid.Item alignSelf="end" style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>alignSelf end</Grid.Item>
</Grid>`
};

export const autoFlowDemo = {
  type: 'code',
  code: `
<Grid autoFlow="column" autoColumns="minmax(90px, 1fr)" gap={3}>
  <Grid.Item style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>1</Grid.Item>
  <Grid.Item style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>2</Grid.Item>
  <Grid.Item style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>3</Grid.Item>
  <Grid.Item style={{ background: 'var(--rs-color-background-base-primary-hover)', border: '1px solid var(--rs-color-border-base-primary)', borderRadius: 4, padding: 12, fontSize: 13 }}>4</Grid.Item>
</Grid>`
};
