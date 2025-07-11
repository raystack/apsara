'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `
    <Tooltip${getPropsString(props)}>
      <Button>Hover me</Button>
    </Tooltip>`;
};

export const playground = {
  type: 'playground',
  controls: {
    message: {
      type: 'text',
      initialValue: 'Tooltip message'
    },
    side: {
      type: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ],
      defaultValue: 'top'
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    },
    delayDuration: {
      type: 'number',
      defaultValue: 200,
      min: 0
    },
    skipDelayDuration: {
      type: 'number',
      defaultValue: 200,
      min: 0
    },
    followCursor: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const sideDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" align="center">
    <Tooltip message="Top tooltip" side="top">
      <Button>Top</Button>
    </Tooltip>
    <Tooltip message="Right tooltip" side="right">
      <Button>Right</Button>
    </Tooltip>
    <Tooltip message="Bottom tooltip" side="bottom">
      <Button>Bottom</Button>
    </Tooltip>
    <Tooltip message="Left tooltip" side="left">
      <Button>Left</Button>
    </Tooltip>
    <Tooltip message="Top Left tooltip" side="top-left">
      <Button>Top Left</Button>
    </Tooltip>
    <Tooltip message="Top Right tooltip" side="top-right">
      <Button>Top Right</Button>
    </Tooltip>
    <Tooltip message="Bottom Left tooltip" side="bottom-left">
      <Button>Bottom Left</Button>
    </Tooltip>
    <Tooltip message="Bottom Right tooltip" side="bottom-right">
      <Button>Bottom Right</Button>
    </Tooltip>
  </Flex>`
};
export const followCursorDemo = {
  type: 'code',
  code: `
  <Tooltip message="Tooltip message" followCursor>
    <Button>Hover me</Button>
  </Tooltip>
  `
};
export const customDemo = {
  type: 'code',
  code: `
 <Tooltip message={
  <div>
    <span style={{ fontWeight: "medium" }}>Custom Tooltip</span>
  </div>
}>
  <Button>Hover me</Button>
</Tooltip>`
};

export const providerDemo = {
  type: 'code',
  tabs: [
    {
      name: 'With Provider',
      code: `
      <Flex gap="medium" align="center">
        <Tooltip.Provider>
          <Tooltip message='Top Left tooltip' side='top-left'>
            <Button>Top Left</Button>
          </Tooltip>
          <Tooltip message='Top Right tooltip' side='top-right'>
            <Button>Top Right</Button>
          </Tooltip>
          <Tooltip message='Bottom Left tooltip' side='bottom-left'>
            <Button>Bottom Left</Button>
          </Tooltip>
          <Tooltip message='Bottom Right tooltip' side='bottom-left'>
            <Button>Bottom Right</Button>
          </Tooltip>
        </Tooltip.Provider>
      </Flex>`
    },
    {
      name: 'Without Provider',
      code: `
      <Flex gap="medium" align="center">
        <Tooltip message='Top Left tooltip' side='top-left'>
          <Button>Top Left</Button>
        </Tooltip>
        <Tooltip message='Top Right tooltip' side='top-right'>
          <Button>Top Right</Button>
        </Tooltip>
        <Tooltip message='Bottom Left tooltip' side='bottom-left'>
          <Button>Bottom Left</Button>
        </Tooltip>
        <Tooltip message='Bottom Right tooltip' side='bottom-left'>
          <Button>Bottom Right</Button>
        </Tooltip>
      </Flex>`
    }
  ]
};
