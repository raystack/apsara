"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { autocomplete, ...rest } = props;
  return `
  <Select${getPropsString(autocomplete ? { autocomplete } : {})}>
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
  type: "playground",
  controls: {
    size: {
      type: "select",
      options: ["small", "medium"],
      defaultValue: "medium",
    },
    variant: {
      type: "select",
      options: ["default", "filter"],
      defaultValue: "default",
    },
    autocomplete: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
};

export const iconDemo = {
  type: "code",
  code: `
  <Select>
  <Select.Trigger aria-label="Fruit selection">
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple" leadingIcon={<Info size={16} />}>Apple</Select.Item>
    <Select.Item value="banana" leadingIcon={<X size={16} />}>Banana</Select.Item>
    <Select.Item value="grape" leadingIcon={<Home size={16} />}>Grape</Select.Item>
    <Select.Item value="Orange" leadingIcon={<Laugh size={16} />}>Orange</Select.Item>
  </Select.Content>
</Select>`,
};
export const basicDemo = {
  type: "code",
  code: `
  <Select>
  <Select.Trigger aria-label="Fruit selection">
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
  </Select.Content>
</Select>`,
};

export const sizeDemo = {
  type: "code",
  code: `
  <Flex align="center" gap="large">
  <Select>
  <Select.Trigger size="small">
    <Select.Value placeholder="Small select" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>
  <Select>
  <Select.Trigger>
    <Select.Value placeholder="Small select" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>
</Flex>`,
};

export const variantDemo = {
  type: "code",
  tabs: [
    {
      name: "Default",
      code: `
  <Select>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="all">All</Select.Item>
    <Select.Item value="active">Active</Select.Item>
    <Select.Item value="inactive">Inactive</Select.Item>
  </Select.Content>
</Select>`,
    },
    {
      name: "Filter",
      code: `
  <Select>
  <Select.Trigger variant="filter">
    <Select.Value placeholder="Filter..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="all">All</Select.Item>
    <Select.Item value="active">Active</Select.Item>
    <Select.Item value="inactive">Inactive</Select.Item>
  </Select.Content>
</Select>`,
    },
  ],
};
export const separatorDemo = {
  type: "code",
  code: `
  <Select>
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
</Select>`,
};

export const autocompleteDemo = {
  type: "code",
  tabs: [
    {
      name: "Default Autocomplete",
      code: `
      <Select autocomplete>
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
</Select>`,
    },
    {
      name: "Manual Autocomplete",
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
  }`,
    },
  ],
};
