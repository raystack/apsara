// url=<FIGMA_LINK>?node-id=9053-3557
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/menubar/menubar.tsx
// component=Menubar

import figma from 'figma';

// Menubar exposes no Figma properties; it is a container that hosts Menu
// instances. Compose a minimal realistic example from the public API.

export default {
  id: 'Menubar',
  imports: ["import { Menubar, Menu } from '@raystack/apsara'"],
  example: figma.code`<Menubar>
      <Menu>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <Menu.Item value='new'>New</Menu.Item>
          <Menu.Item value='open'>Open</Menu.Item>
        </Menu.Content>
      </Menu>
    </Menubar>`,
  metadata: { nestable: false }
};
