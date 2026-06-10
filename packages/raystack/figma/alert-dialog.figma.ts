// url=<FIGMA_LINK>?node-id=6633-2337
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/alert-dialog/alert-dialog.tsx
// component=AlertDialog

import figma from 'figma';

const instance = figma.selectedInstance;

// Title/Description booleans toggle whether those sub-components are rendered.
const title = instance.getBoolean('Title', {
  true: `
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>`,
  false: ''
});
const description = instance.getBoolean('Description', {
  true: `
      <AlertDialog.Description>
        This action cannot be undone.
      </AlertDialog.Description>`,
  false: ''
});

export default {
  id: 'AlertDialog',
  imports: ["import { AlertDialog } from '@raystack/apsara'"],
  example: figma.code`<AlertDialog>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>${title}${description}
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Close>Cancel</AlertDialog.Close>
      <AlertDialog.Close>Continue</AlertDialog.Close>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog>`,
  metadata: { nestable: false }
};
