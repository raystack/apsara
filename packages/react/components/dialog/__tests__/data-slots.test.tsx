import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Dialog } from '../dialog';

const OpenDialog = ({ showCloseButton = true }) => (
  <Dialog open>
    <Dialog.Content showCloseButton={showCloseButton}>
      <Dialog.Header>
        <Dialog.Title>Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>Description</Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
);

describe('Dialog data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(<OpenDialog />);
    // Dialog content portals to the body.
    expectSlots(document.body, [
      'dialog-backdrop',
      'dialog-viewport',
      'dialog-content',
      'dialog-header',
      'dialog-title',
      'dialog-body',
      'dialog-description',
      'dialog-footer',
      'dialog-close'
    ]);
  });

  it('omits the close slot when the close button is hidden', () => {
    render(<OpenDialog showCloseButton={false} />);
    expect(getSlot(document.body, 'dialog-close')).toBeNull();
  });
});
