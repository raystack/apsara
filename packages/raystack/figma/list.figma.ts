// url=<FIGMA_LINK>?node-id=8942-830
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/list/list.tsx
// component=List

import figma from 'figma';

// The List Figma component's only property is a purely-visual `State`
// (Default/Hover) with no code counterpart, so it is intentionally not mapped.
// Compose a realistic List from the public sub-component API.

export default {
  id: 'List',
  imports: ["import { List } from '@raystack/apsara'"],
  example: figma.code`<List>
      <List.Header>Details</List.Header>
      <List.Item>
        <List.Label>Name</List.Label>
        <List.Value>Aurora</List.Value>
      </List.Item>
      <List.Item>
        <List.Label>Status</List.Label>
        <List.Value>Active</List.Value>
      </List.Item>
    </List>`,
  metadata: { nestable: false }
};
