// url=<FIGMA_LINK>?node-id=8421-1371
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/scroll-area/scroll-area.tsx
// component=ScrollArea

import figma from 'figma';

// State (Default / Hover) is purely visual (scrollbar visibility) — no matching
// code prop, intentionally not mapped. Compose a minimal example.

export default {
  id: 'ScrollArea',
  imports: ["import { ScrollArea } from '@raystack/apsara'"],
  example: figma.code`<ScrollArea style={{ height: 200 }}>
  Scrollable content
</ScrollArea>`,
  metadata: { nestable: false }
};
