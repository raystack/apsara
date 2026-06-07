// url=<FIGMA_LINK>?node-id=8933-124
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/list/list.tsx
// component=List.Item

import figma from 'figma';

// List.Item is a plain layout wrapper (extends ComponentProps<'li'>) with no
// `variant` or `size` props in code. The Figma `Variant`
// (Identity/Status/Avatar Stack/Chip) and `Size` (Medium/Large) describe the
// shape of the value content, which is expressed through composition of
// List.Label / List.Value rather than props — so neither variant is mapped to
// a prop. A representative Identity-style row is emitted.

export default {
  id: 'List.Item',
  imports: ["import { List } from '@raystack/apsara'"],
  example: figma.code`<List.Item>
      <List.Label>Owner</List.Label>
      <List.Value>Jane Doe</List.Value>
    </List.Item>`,
  metadata: { nestable: true }
};
