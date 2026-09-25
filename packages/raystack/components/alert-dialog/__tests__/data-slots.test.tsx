import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { expectSlots } from '~/test-utils/data-slots';
import { AlertDialog } from '../alert-dialog';

const OpenAlertDialog = () => (
  <AlertDialog open>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Title</AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <AlertDialog.Description>Description</AlertDialog.Description>
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <AlertDialog.Close>Cancel</AlertDialog.Close>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>
);

describe('AlertDialog data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(<OpenAlertDialog />);
    // AlertDialog content portals to the body.
    expectSlots(document.body, [
      'alert-dialog-backdrop',
      'alert-dialog-viewport',
      'alert-dialog-content',
      'alert-dialog-header',
      'alert-dialog-title',
      'alert-dialog-body',
      'alert-dialog-description',
      'alert-dialog-footer'
    ]);
  });
});
