'use client';

import { getPropsString } from '@/lib/utils';

const getCode = (props: any) => {
  return `<Toggle aria-label="Bold"${getPropsString(props)}>
  <FontBoldIcon />
</Toggle>`;
};

export const playground = {
  type: 'playground',
  controls: {
    defaultPressed: {
      type: 'checkbox',
      defaultValue: false
    },
    disabled: {
      type: 'checkbox',
      defaultValue: false
    },
    size: {
      type: 'select',
      options: ['1', '2', '3', '4'],
      defaultValue: '3'
    }
  },
  getCode
};

export const preview = {
  type: 'code',
  code: `<Toggle aria-label="Bold" defaultPressed>
  <b>B</b>
</Toggle>`
};

export const groupDemo = {
  type: 'code',
  code: `<Toggle.Group defaultValue={["center"]} aria-label="Text alignment">
  <Toggle value="left" aria-label="Align left">
    <TextAlignLeftIcon />
  </Toggle>
  <Toggle value="center" aria-label="Align center">
    <TextAlignCenterIcon />
  </Toggle>
  <Toggle value="right" aria-label="Align right">
    <TextAlignRightIcon />
  </Toggle>
</Toggle.Group>`
};

export const multipleDemo = {
  type: 'code',
  code: `<Toggle.Group multiple aria-label="Text formatting">
  <Toggle value="bold" aria-label="Bold">
    <FontBoldIcon />
  </Toggle>
  <Toggle value="italic" aria-label="Italic">
    <FontItalicIcon />
  </Toggle>
  <Toggle value="underline" aria-label="Underline">
    <UnderlineIcon />
  </Toggle>
</Toggle.Group>`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledToggle() {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Toggle
      aria-label="Star"
      pressed={pressed}
      onPressedChange={setPressed}
    >
      {pressed ? "★" : "☆"}
    </Toggle>
  );
}`
};

export const sizeDemo = {
  type: 'code',
  code: `<Flex gap="large" align="center">
  <Toggle size={1} aria-label="Bold">
    <FontBoldIcon />
  </Toggle>
  <Toggle size={2} aria-label="Bold">
    <FontBoldIcon />
  </Toggle>
  <Toggle size={3} aria-label="Bold">
    <FontBoldIcon />
  </Toggle>
  <Toggle size={4} aria-label="Bold">
    <FontBoldIcon />
  </Toggle>
</Flex>`
};

export const disabledDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `<Toggle aria-label="Bold" disabled>
  <b>B</b>
</Toggle>`
    },
    {
      name: 'Group',
      code: `<Toggle.Group disabled aria-label="Text alignment">
  <Toggle value="left" aria-label="Align left">
    <TextAlignLeftIcon />
  </Toggle>
  <Toggle value="center" aria-label="Align center">
    <TextAlignCenterIcon />
  </Toggle>
</Toggle.Group>`
    }
  ]
};
