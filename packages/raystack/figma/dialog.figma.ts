// url=<FIGMA_LINK>?node-id=6618-7014
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/dialog/dialog.tsx
// component=Dialog

import figma from 'figma';

const instance = figma.selectedInstance;

// Header/Footer booleans toggle whether those sub-components are rendered.
const header = instance.getBoolean('Header', {
  true: `
    <Dialog.Header>
      <Dialog.Title>Dialog title</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>`,
  false: ''
});
const footer = instance.getBoolean('Footer', {
  true: `
    <Dialog.Footer>
      <Dialog.Close>Cancel</Dialog.Close>
      <Dialog.Close>Confirm</Dialog.Close>
    </Dialog.Footer>`,
  false: ''
});

// `content` is a SLOT — interpolate the nested sections, with a placeholder fallback.
const content = instance.getSlot('content') ?? 'Dialog content';

export default {
  id: 'Dialog',
  imports: ["import { Dialog } from '@raystack/apsara'"],
  example: figma.code`<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>${header}
    <Dialog.Body>${content}</Dialog.Body>${footer}
  </Dialog.Content>
</Dialog>`,
  metadata: { nestable: false }
};
