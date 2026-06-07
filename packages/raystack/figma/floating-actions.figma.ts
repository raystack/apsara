// url=<FIGMA_LINK>?node-id=9273-3281
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/floating-actions/floating-actions.tsx
// component=FloatingActions

import figma from 'figma';

// content SLOT → children of the FloatingActions root. Falls back to a
// placeholder action when the slot is empty.
const content = figma.selectedInstance.getSlot('content');

export default {
  id: 'FloatingActions',
  imports: ["import { FloatingActions } from '@raystack/apsara'"],
  example: figma.code`<FloatingActions>${
    content ??
    figma.code`<FloatingActions.Group>Actions</FloatingActions.Group>`
  }</FloatingActions>`,
  metadata: { nestable: false }
};
