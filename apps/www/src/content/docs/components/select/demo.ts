'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { autocomplete, multiple, ...rest } = props;
  return `
  <Select items={{ apple: "Apple", banana: "Banana", blueberry: "Blueberry", grapes: "Grapes", pineapple: "Pineapple" }}${getPropsString({ ...(autocomplete ? { autocomplete } : {}), ...(multiple ? { multiple } : {}) })}>
    <Select.Trigger width={200}${getPropsString(rest)}>
      <Select.Value placeholder="Select a fruit" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="blueberry">Blueberry</Select.Item>
        <Select.Item value="grapes">Grapes</Select.Item>
        <Select.Item value="pineapple">Pineapple</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['small', 'medium'],
      defaultValue: 'medium'
    },
    variant: {
      type: 'select',
      options: ['default', 'filter'],
      defaultValue: 'default'
    },
    autocomplete: {
      type: 'checkbox',
      defaultValue: false
    },
    multiple: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const iconDemo = {
  type: 'code',
  code: `
  <Select items={{ apple: "Apple", banana: "Banana", grape: "Grape", orange: "Orange" }}>
  <Select.Trigger aria-label="Fruit selection">
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple" leadingIcon={<Info size={16} />}>Apple</Select.Item>
    <Select.Item value="banana" leadingIcon={<X size={16} />}>Banana</Select.Item>
    <Select.Item value="grape" leadingIcon={<Home size={16} />}>Grape</Select.Item>
    <Select.Item value="orange" leadingIcon={<Laugh size={16} />}>Orange</Select.Item>
  </Select.Content>
</Select>`
};
export const basicDemo = {
  type: 'code',
  code: `
  <Select items={{ apple: "Apple", banana: "Banana" }}>
  <Select.Trigger aria-label="Fruit selection">
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
  </Select.Content>
</Select>`
};

export const sizeDemo = {
  type: 'code',
  code: `
  <Flex align="center" gap={9}>
  <Select items={{ "1": "Option 1", "2": "Option 2" }}>
  <Select.Trigger size="small">
    <Select.Value placeholder="Small select" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>
  <Select items={{ "1": "Option 1", "2": "Option 2" }}>
  <Select.Trigger>
    <Select.Value placeholder="Medium select" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>
</Flex>`
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `
  <Select items={{ all: "All", active: "Active", inactive: "Inactive" }}>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="all">All</Select.Item>
    <Select.Item value="active">Active</Select.Item>
    <Select.Item value="inactive">Inactive</Select.Item>
  </Select.Content>
</Select>`
    },
    {
      name: 'Filter',
      code: `
  <Select items={{ all: "All", active: "Active", inactive: "Inactive" }}>
  <Select.Trigger variant="filter">
    <Select.Value placeholder="Filter..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="all">All</Select.Item>
    <Select.Item value="active">Active</Select.Item>
    <Select.Item value="inactive">Inactive</Select.Item>
  </Select.Content>
</Select>`
    }
  ]
};
export const separatorDemo = {
  type: 'code',
  code: `
  <Select items={{ "1": "Option 1", "2": "Option 2", "3": "Option 3", "4": "Option 4" }}>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Item value="1">Option 1</Select.Item>
      <Select.Item value="2">Option 2</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Item value="3">Option 3</Select.Item>
      <Select.Item value="4">Option 4</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>`
};
export const multipleDemo = {
  type: 'code',
  code: `
  <Select
    multiple
    items={Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: "Option " + (i + 1) }))}
  >
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
      <Select.Item value="1">Option 1</Select.Item>
      <Select.Item value="2">Option 2</Select.Item>
      <Select.Item value="3">Option 3</Select.Item>
      <Select.Item value="4">Option 4</Select.Item>
      <Select.Item value="5">Option 5</Select.Item>
      <Select.Item value="6">Option 6</Select.Item>
      <Select.Item value="7">Option 7</Select.Item>
      <Select.Item value="8">Option 8</Select.Item>
      <Select.Item value="9">Option 9</Select.Item>
      <Select.Item value="10">Option 10</Select.Item>
  </Select.Content>
</Select>`
};

export const autocompleteDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default Autocomplete',
      code: `
      <Select autocomplete items={{ apple: "Apple", banana: "Banana", blueberry: "Blueberry", grapes: "Grapes", pineapple: "Pineapple" }}>
  <Select.Trigger>
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Empty>No fruit found</Select.Empty>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
    <Select.Item value="blueberry">Blueberry</Select.Item>
    <Select.Item value="grapes">Grapes</Select.Item>
    <Select.Item value="pineapple">Pineapple</Select.Item>
  </Select.Content>
</Select>`
    },
    {
      name: 'Manual Autocomplete',
      code: `
      function ManualDemo(){
        const items = [
          "Apple",
          "Banana",
          "Grape",
          "Orange",
          "Pineapple",
        ];

        const [simpleSearchQuery, setSimpleSearchQuery] = React.useState("");
        return <Select autocomplete autocompleteMode="manual" onSearch={value => setSimpleSearchQuery(value)}>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
      {items.filter(item => item.toLowerCase().startsWith(simpleSearchQuery.toLowerCase()))
      .map((item, index) => (
      <Select.Item key={index} value={item}>{item}</Select.Item>
      ))}
  </Select.Content>
</Select>
  }`
    }
  ]
};

export const controlledDemo = {
  type: 'code',
  code: `
function ControlledSelect() {
  const [fruit, setFruit] = React.useState('apple');

  return (
    <Flex direction="column" gap={5}>
      <Select
        value={fruit}
        onValueChange={setFruit}
        items={{ apple: "Apple", banana: "Banana", grapes: "Grapes" }}
      >
        <Select.Trigger width={200}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="grapes">Grapes</Select.Item>
        </Select.Content>
      </Select>
      <Button size="small" variant="outline" onClick={() => setFruit('grapes')}>
        Reset to Grapes
      </Button>
    </Flex>
  );
}`
};

export const labelDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={2}>
  <Select items={{ apple: "Apple", banana: "Banana" }}>
    <Select.Label>Fruit</Select.Label>
    <Select.Trigger>
      <Select.Value placeholder="Select a fruit" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Content>
  </Select>
</Flex>`
};

export const valueRenderDemo = {
  type: 'code',
  code: `
function IconValue() {
  const fruits = {
    apple: { label: "Apple", icon: <Info size={16} /> },
    banana: { label: "Banana", icon: <Home size={16} /> }
  };

  return (
    <Select defaultValue="apple">
      <Select.Trigger>
        <Select.Value placeholder="Select a fruit">
          {value => (
            <Flex align="center" gap={2}>
              {fruits[value].icon}
              {fruits[value].label}
            </Flex>
          )}
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        {Object.entries(fruits).map(([value, fruit]) => (
          <Select.Item key={value} value={value} leadingIcon={fruit.icon}>
            {fruit.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
}`
};
