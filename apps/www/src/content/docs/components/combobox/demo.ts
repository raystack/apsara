'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
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
        <Combobox.GroupLabel>Fruits</Combobox.GroupLabel>
        <Combobox.Item value="apple">Apple</Combobox.Item>
        <Combobox.Item value="banana">Banana</Combobox.Item>
      </Combobox.Group>
      <Combobox.Separator />
      <Combobox.Group>
        <Combobox.GroupLabel>Vegetables</Combobox.GroupLabel>
        <Combobox.Item value="carrot">Carrot</Combobox.Item>
        <Combobox.Item value="broccoli">Broccoli</Combobox.Item>
      </Combobox.Group>
    </Combobox.Content>
  </Combobox>`
};

export const labelDemo = {
  type: 'code',
  code: `
  <Combobox multiple>
    <Flex direction="column" gap={2}>
      <Combobox.Label>Fruits</Combobox.Label>
      <Flex align="center" gap={2}>
        <Combobox.Input placeholder="Select fruits" width={300} />
        <Combobox.Clear />
      </Flex>
    </Flex>
    <Combobox.Content>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Grape</Combobox.Item>
      <Combobox.Item>Orange</Combobox.Item>
    </Combobox.Content>
  </Combobox>`
};

export const emptyDemo = {
  type: 'code',
  code: `
  <Combobox>
    <Combobox.Input placeholder="Type 'xyz'" width={240} />
    <Combobox.Content>
      <Combobox.Empty>No fruit matches your search</Combobox.Empty>
      <Combobox.Item>Apple</Combobox.Item>
      <Combobox.Item>Banana</Combobox.Item>
      <Combobox.Item>Grape</Combobox.Item>
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

export const withFieldDemo = {
  type: 'code',
  code: `
  <Field label="Favorite Fruit" description="Choose your favorite fruit">
    <Combobox>
      <Combobox.Input placeholder="Select a fruit" width={240} />
      <Combobox.Content>
        <Combobox.Item value="apple">Apple</Combobox.Item>
        <Combobox.Item value="banana">Banana</Combobox.Item>
        <Combobox.Item value="blueberry">Blueberry</Combobox.Item>
        <Combobox.Item value="grapes">Grapes</Combobox.Item>
      </Combobox.Content>
    </Combobox>
  </Field>`
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledDemo() {
    const [value, setValue] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");

    return (
      <Flex direction="column" gap={5}>
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

export const createItemsDemo = {
  type: 'code',
  code: `
  function CreateItemsDemo() {
    const users = [
      { id: "u1", name: "Jane Doe" },
      { id: "u2", name: "John Smith" },
      { id: "u3", name: "Ada Lovelace" }
    ];
    const items = React.useMemo(
      () =>
        Combobox.createItems(users, {
          getValue: user => user.id,
          getLabel: user => user.name
        }),
      []
    );
    const [value, setValue] = React.useState(null);

    return (
      <Flex direction="column" gap={5}>
        <Text>Selected ID: {value || "None"}</Text>
        <Combobox items={items} value={value} onValueChange={setValue}>
          <Combobox.Input placeholder="Pick a user" />
          <Combobox.Content>
            {user => (
              <Combobox.Item key={user.id} value={user.id}>
                {user.name}
              </Combobox.Item>
            )}
          </Combobox.Content>
        </Combobox>
      </Flex>
    );
  }`
};
