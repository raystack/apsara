'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: Record<string, unknown>) => {
  const { multiple, ...rest } = props;
  return `
  <Combobox${getPropsString({ ...(multiple ? { multiple } : {}) })}>
    <Combobox.Input placeholder="Enter a fruit"${getPropsString(rest)} />
    <Combobox.Content>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Blueberry</Combobox.Item>
      <Combobox.Item>Grapes</Combobox.Item>
      <Combobox.Item>Pineapple</Combobox.Item>
    </Combobox.Content>
  </Combobox>`;
};

export const playground = {
  type: 'playground',
  controls: {
    label: { type: 'text', initialValue: 'Fruits' },
    size: {
      type: 'select',
      options: ['small', 'large'],
      defaultValue: 'large'
    },
    multiple: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `
    <Combobox>
      <Combobox.Input placeholder="Enter a fruit" />
    <Combobox.Content>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Grape</Combobox.Item>
      <Combobox.Item>Orange</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const iconDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input placeholder="Enter a fruit" />
    <Combobox.Content>
      <Combobox.Item leadingIcon={<Info size={16} />}>Apple</Combobox.Item>
      <Combobox.Item leadingIcon={<X size={16} />}>Banana</Combobox.Item>
      <Combobox.Item leadingIcon={<Home size={16} />}>Grape</Combobox.Item>
      <Combobox.Item leadingIcon={<Laugh size={16} />}>Orange</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex align="center" gap="large">
    <Combobox>
      <Combobox.Input size="small" placeholder="Small combobox" />
      <Combobox.Content>
        <Combobox.Item>Option 1</Combobox.Item>
        <Combobox.Item>Option 2</Combobox.Item>
      </Combobox.Content>
    </Combobox>
    <Combobox>
      <Combobox.Input placeholder="Large combobox" />
      <Combobox.Content>
        <Combobox.Item>Option 1</Combobox.Item>
        <Combobox.Item>Option 2</Combobox.Item>
      </Combobox.Content>
    </Combobox>
  </Flex>`
};

export const multipleDemo = {
  type: 'code',
  code: `
  <Combobox multiple>
    <Combobox.Input placeholder="Select fruits..." />
    <Combobox.Content>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Grape</Combobox.Item>
      <Combobox.Item>Orange</Combobox.Item>
      <Combobox.Item>Pineapple</Combobox.Item>
      <Combobox.Item>Mango</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const groupDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input placeholder="Enter a fruit" />
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.Label>Fruits</Combobox.Label>
        <Combobox.Item>Apple</Combobox.Item>
        <Combobox.Item>Banana</Combobox.Item>
      </Combobox.Group>
      <Combobox.Separator />
      <Combobox.Group>
        <Combobox.Label>Vegetables</Combobox.Label>
        <Combobox.Item>Carrot</Combobox.Item>
        <Combobox.Item>Broccoli</Combobox.Item>
      </Combobox.Group>
    </Combobox.Content>
  </Combobox>`
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledDemo() {
    const [value, setValue] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");

    return (
      <Flex direction="column" gap="medium">
        <Text>Selected: {value || "None"}</Text>
        <Combobox
          value={value}
          onValueChange={setValue}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
        >
          <Combobox.Input placeholder="Enter a fruit" />
          <Combobox.Content>
            <Combobox.Item>Apple</Combobox.Item>
            <Combobox.Item>Banana</Combobox.Item>
            <Combobox.Item>Grape</Combobox.Item>
          </Combobox.Content>
        </Combobox>
      </Flex>
    );
  }`
};
