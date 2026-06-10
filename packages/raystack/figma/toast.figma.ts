// url=<FIGMA_LINK>?node-id=3594-24627
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/toast/toast-manager.ts
// component=toastManager

import figma from 'figma';

// Toasts are created imperatively via toastManager.add(options) — there is no
// JSX toast element. We map the Figma properties onto the add() options shape.

// Leading icon BOOLEAN gates the Icon INSTANCE_SWAP → `leadingIcon` option.
const leadingIcon = figma.selectedInstance.getBoolean('Leading icon', {
  true: figma.selectedInstance.getInstanceSwap('Icon')?.executeTemplate()
    .example,
  false: undefined
});
// Button BOOLEAN → an action button via `actionProps`.
const action = figma.selectedInstance.getBoolean('Button', {
  true: true,
  false: undefined
});

// Unmapped (intentional):
// - Close / Options: built-in toast chrome, not options on add().
// - Variant (Small/Large): toast has no size option in code.

export default {
  id: 'toastManager',
  imports: ["import { toastManager } from '@raystack/apsara'"],
  example: figma.code`toastManager.add({
      title: 'Saved successfully',
      description: 'Your changes have been saved.',${
        leadingIcon
          ? figma.code`
      leadingIcon: ${leadingIcon},`
          : ''
      }${
        action
          ? figma.code`
      actionProps: { children: 'Undo', onClick: () => {} },`
          : ''
      }
    })`,
  metadata: { nestable: false }
};
