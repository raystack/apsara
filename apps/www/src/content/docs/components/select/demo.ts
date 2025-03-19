"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `
  <Select>
    <Select.Trigger width={200}${getPropsString(props)}>
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
  },
  getCode,
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
