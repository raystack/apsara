import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Drawer } from '../drawer';

const OpenDrawer = ({ showCloseButton = true }) => (
  <Drawer open>
    <Drawer.Content showCloseButton={showCloseButton}>
      <Drawer.Header>
        <Drawer.Title>Title</Drawer.Title>
        <Drawer.Description>Description</Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>Body</Drawer.Body>
      <Drawer.Footer>Footer</Drawer.Footer>
    </Drawer.Content>
  </Drawer>
);

describe('Drawer data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(<OpenDrawer />);
    // Drawer content portals to the body.
    expectSlots(document.body, [
      'drawer-backdrop',
      'drawer-viewport',
      'drawer-content',
      'drawer-content-body',
      'drawer-close',
      'drawer-header',
      'drawer-title',
      'drawer-description',
      'drawer-body',
      'drawer-footer'
    ]);
  });

  it('omits the close slot when the close button is hidden', () => {
    render(<OpenDrawer showCloseButton={false} />);
    expect(getSlot(document.body, 'drawer-close')).toBeNull();
  });
});
