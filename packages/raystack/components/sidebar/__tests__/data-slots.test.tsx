import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Sidebar } from '../sidebar';

describe('Sidebar data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Header>Header</Sidebar.Header>
        <Sidebar.Main>
          <Sidebar.Group label='Main' leadingIcon={<span>icon</span>}>
            <Sidebar.Item href='#' leadingIcon={<span>icon</span>}>
              Dashboard
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Main>
        <Sidebar.Footer>Footer</Sidebar.Footer>
      </Sidebar>
    );
    expectSlots(container, [
      'sidebar',
      'sidebar-toggle',
      'sidebar-header',
      'sidebar-main',
      'sidebar-footer',
      'sidebar-group',
      'sidebar-group-header',
      'sidebar-group-label',
      'sidebar-group-items',
      'sidebar-item',
      'sidebar-item-text',
      'sidebar-leading-icon'
    ]);
  });

  it('exposes the trigger slot on Sidebar.Trigger', () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Trigger />
        <Sidebar.Main />
      </Sidebar>
    );
    expect(getSlot(container, 'sidebar-trigger')).not.toBeNull();
  });

  it('omits the toggle slot when the sidebar is not collapsible', () => {
    const { container } = render(
      <Sidebar collapsible='none'>
        <Sidebar.Main />
      </Sidebar>
    );
    expect(getSlot(container, 'sidebar-toggle')).toBeNull();
  });

  it('exposes trailing icon slot on a group when provided', () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Main>
          <Sidebar.Group label='Main' trailingIcon={<span>trail</span>}>
            <Sidebar.Item href='#'>Item</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Main>
      </Sidebar>
    );
    expect(getSlot(container, 'sidebar-trailing-icon')).not.toBeNull();
  });

  it('exposes collapsible group slots (accordion variant)', () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Main>
          <Sidebar.Group label='Main' collapsible>
            <Sidebar.Item href='#'>Item</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Main>
      </Sidebar>
    );
    expectSlots(container, [
      'sidebar-group-trigger',
      'sidebar-group-chevron',
      'sidebar-group-panel'
    ]);
  });

  it('exposes More trigger/text slots and menu item slots on open', () => {
    render(
      <Sidebar>
        <Sidebar.Main>
          <Sidebar.More label='More items'>
            <Sidebar.Item href='#'>Logs</Sidebar.Item>
          </Sidebar.More>
        </Sidebar.Main>
      </Sidebar>
    );
    expect(getSlot(document.body, 'sidebar-more-trigger')).not.toBeNull();
    expect(getSlot(document.body, 'sidebar-more-text')).not.toBeNull();

    const trigger = screen.getByText('More items').closest('button');
    expect(trigger).toBeInTheDocument();
    if (!trigger) return;
    fireEvent.click(trigger);

    // Sidebar.Item reuses its sidebar-item/-item-text slots inside the menu.
    expect(getSlot(document.body, 'sidebar-item')).not.toBeNull();
    expect(getSlot(document.body, 'sidebar-item-text')).not.toBeNull();
  });
});
