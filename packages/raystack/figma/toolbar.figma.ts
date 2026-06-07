// url=<FIGMA_LINK>?node-id=9053-3916
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/toolbar/toolbar.tsx
// component=Toolbar

import figma from 'figma';

// Toolbar has no Figma component properties. Compose a minimal realistic
// example using the public Toolbar API (Button/Group/Separator).

export default {
  id: 'Toolbar',
  imports: ["import { Toolbar } from '@raystack/apsara'"],
  example: figma.code`<Toolbar>
      <Toolbar.Group>
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Button>Link</Toolbar.Button>
    </Toolbar>`,
  metadata: { nestable: false }
};
