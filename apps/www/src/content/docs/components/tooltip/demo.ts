'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { children = 'Tooltip message', trackCursorAxis, ...rest } = props;
  return `
    <Tooltip ${trackCursorAxis ? `trackCursorAxis="${trackCursorAxis}"` : ''}>
      <Tooltip.Trigger render={<Button />}>
        Hover me
      </Tooltip.Trigger>
      <Tooltip.Content ${getPropsString(rest)}>
        ${children}
      </Tooltip.Content>
    </Tooltip>`;
};

export const playground = {
  type: 'playground',
  controls: {
    children: {
      type: 'text',
      initialValue: 'Tooltip message'
    },
    side: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'top'
    },
    align: {
      type: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'center'
    },
    sideOffset: {
      type: 'number',
      defaultValue: 4
    },
    alignOffset: {
      type: 'number',
      defaultValue: 0
    },
    showArrow: {
      type: 'checkbox',
      initialValue: false,
      defaultValue: false
    },
    trackCursorAxis: {
      type: 'select',
      options: ['none', 'x', 'y', 'both'],
      defaultValue: 'none'
    }
  },
  getCode
};

export const sideDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="center">
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Top</Tooltip.Trigger>
      <Tooltip.Content side="top">Top tooltip</Tooltip.Content>
    </Tooltip>
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Right</Tooltip.Trigger>
      <Tooltip.Content side="right">Right tooltip</Tooltip.Content>
    </Tooltip>
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Bottom</Tooltip.Trigger>
      <Tooltip.Content side="bottom">Bottom tooltip</Tooltip.Content>
    </Tooltip>
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Left</Tooltip.Trigger>
      <Tooltip.Content side="left">Left tooltip</Tooltip.Content>
    </Tooltip>
  </Flex>`
};
export const alignDemo = {
  type: 'code',
  code: `
  <Flex gap="large" align="center">
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Start</Tooltip.Trigger>
      <Tooltip.Content align="start">Start tooltip</Tooltip.Content>
    </Tooltip>
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>Center</Tooltip.Trigger>
      <Tooltip.Content align="center">Center tooltip</Tooltip.Content>
    </Tooltip>
    <Tooltip>
      <Tooltip.Trigger render={<Button />}>End</Tooltip.Trigger>
      <Tooltip.Content align="end">End tooltip</Tooltip.Content>
    </Tooltip>
  </Flex>`
};

export const customDemo = {
  type: 'code',
  code: `
  <Tooltip>
    <Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
    <Tooltip.Content>
      <div>
        <span style={{ fontWeight: "medium" }}>Custom Tooltip</span>
      </div>
    </Tooltip.Content>
  </Tooltip>`
};

export const providerDemo = {
  type: 'code',
  code: `
  <Tooltip.Provider>
    <Flex gap="medium" align="center">
      <Tooltip>
        <Tooltip.Trigger render={<Button />}>Tooltip 1</Tooltip.Trigger>
        <Tooltip.Content>Top Left tooltip</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger render={<Button />}>Tooltip 2</Tooltip.Trigger>
        <Tooltip.Content>Top Right tooltip</Tooltip.Content>
      </Tooltip>
    </Flex>
  </Tooltip.Provider>`
};

export const trackCursorDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Both',
      code: `
      <Tooltip trackCursorAxis="both">
        <Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip follows cursor</Tooltip.Content>
      </Tooltip>`
    },
    {
      name: 'X',
      code: `
      <Tooltip trackCursorAxis="x">
        <Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip follows cursor</Tooltip.Content>
      </Tooltip>`
    },
    {
      name: 'Y',
      code: `
      <Tooltip trackCursorAxis="y">
        <Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip follows cursor</Tooltip.Content>
      </Tooltip>`
    }
  ]
};

export const arrowDemo = {
  type: 'code',
  code: `
  <Tooltip>
    <Tooltip.Trigger render={<Button />}>Hover me</Tooltip.Trigger>
    <Tooltip.Content showArrow>Tooltip with arrow</Tooltip.Content>
  </Tooltip>`
};
