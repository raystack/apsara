// url=<FIGMA_LINK>?node-id=5814-33367
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/separator/separator.tsx
// component=Separator

import figma from 'figma';

// Figma "Divider" exposes only the `Outerspace` VARIANT (Small/None), which
// controls the surrounding margin/spacing — there is no corresponding public
// prop on the code Separator (its `size` controls line length, not spacing),
// so no prop is emitted.

export default {
  id: 'Separator',
  imports: ["import { Separator } from '@raystack/apsara'"],
  example: figma.code`<Separator />`,
  metadata: { nestable: true }
};
