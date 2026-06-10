// url=<FIGMA_LINK>?node-id=9616-2356
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/command/command.tsx
// component=Command

import figma from 'figma';

// Plain COMPONENT with no Figma properties — emit a minimal realistic example
// composed from the public sub-component API.

export default {
  id: 'Command',
  imports: ["import { Command } from '@raystack/apsara'"],
  example: figma.code`<Command>
  <Command.Input placeholder="Search..." />
  <Command.Content>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group>
      <Command.Label>Suggestions</Command.Label>
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search</Command.Item>
    </Command.Group>
  </Command.Content>
</Command>`,
  metadata: { nestable: false }
};
