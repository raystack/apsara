'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: Record<string, unknown>) => {
  const { multiple, ...rest } = props;
  return `
  <Combobox${getPropsString({ ...(multiple ? { multiple } : {}) })}>
    <Combobox.Input placeholder="Select a fruit"${getPropsString(rest)} width={240} />
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

export const multipleDemo = {
  type: 'code',
  code: `
  <Combobox multiple>
    <Combobox.Input placeholder="Select fruits" width={300} />
    <Combobox.Content>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Grape</Combobox.Item>
      <Combobox.Item>Orange</Combobox.Item>
      <Combobox.Item>Mango</Combobox.Item>
      <Combobox.Item>Pineapple</Combobox.Item>
      <Combobox.Item>Strawberry</Combobox.Item>
      <Combobox.Item>Watermelon</Combobox.Item>
      <Combobox.Item>Kiwi</Combobox.Item>
      <Combobox.Item>Lemon</Combobox.Item>
      <Combobox.Item>Lime</Combobox.Item>
      <Combobox.Item>Lemon</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const groupDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input placeholder="Search items" width={240} />
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.Label>Fruits</Combobox.Label>
        <Combobox.Item value="apple">Apple</Combobox.Item>
        <Combobox.Item value="banana">Banana</Combobox.Item>
      </Combobox.Group>
      <Combobox.Separator />
      <Combobox.Group>
        <Combobox.Label>Vegetables</Combobox.Label>
        <Combobox.Item value="carrot">Carrot</Combobox.Item>
        <Combobox.Item value="broccoli">Broccoli</Combobox.Item>
      </Combobox.Group>
    </Combobox.Content>
  </Combobox>`
};

export const iconDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input placeholder="Select a fruit" width={240} />
    <Combobox.Content>
      <Combobox.Item value="apple" leadingIcon={<Info size={16} />}>Apple</Combobox.Item>
      <Combobox.Item value="banana" leadingIcon={<X size={16} />}>Banana</Combobox.Item>
      <Combobox.Item value="grape" leadingIcon={<Home size={16} />}>Grape</Combobox.Item>
      <Combobox.Item value="orange" leadingIcon={<Laugh size={16} />}>Orange</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const withLabelDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input
      placeholder="Select a fruit"
      label="Favorite Fruit"
      helperText="Choose your favorite fruit"
      width={240}
    />
    <Combobox.Content>
      <Combobox.Item value="apple">Apple</Combobox.Item>
      <Combobox.Item value="banana">Banana</Combobox.Item>
      <Combobox.Item value="blueberry">Blueberry</Combobox.Item>
      <Combobox.Item value="grapes">Grapes</Combobox.Item>
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
