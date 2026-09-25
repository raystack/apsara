import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { ContextMenu } from '../context-menu';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const TRIGGER_TEXT = 'Right click here';

const openContextMenu = () => {
  fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
};

describe('ContextMenu data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Group>
            <ContextMenu.Label>Group label</ContextMenu.Label>
            <ContextMenu.Item leadingIcon={<span />} trailingIcon={<span />}>
              Item one
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Submenu>
            <ContextMenu.SubmenuTrigger>More</ContextMenu.SubmenuTrigger>
            <ContextMenu.SubmenuContent>
              <ContextMenu.Item>Nested</ContextMenu.Item>
            </ContextMenu.SubmenuContent>
          </ContextMenu.Submenu>
          <ContextMenu.EmptyState>Nothing here</ContextMenu.EmptyState>
        </ContextMenu.Content>
      </ContextMenu>
    );

    expectSlots(document.body, ['context-menu-trigger']);
    openContextMenu();

    // Content portals to the body. The submenu trigger keeps the shared
    // `menu-subtrigger` slot, and cell icons keep the shared `menu-cell-*`
    // slots (both come from the menu internals ContextMenu reuses).
    expectSlots(document.body, [
      'context-menu-positioner',
      'context-menu-content',
      'context-menu-group',
      'context-menu-label',
      'context-menu-item',
      'context-menu-separator',
      'context-menu-empty-state',
      'menu-subtrigger',
      'menu-cell-leading-icon',
      'menu-cell-trailing-icon'
    ]);
  });

  it('lets callers override the item slot via props', () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item data-slot='custom-item'>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    openContextMenu();
    expect(getSlot(document.body, 'custom-item')).not.toBeNull();
    expect(getSlot(document.body, 'context-menu-item')).toBeNull();
  });

  it('exposes search slots only in autocomplete mode', () => {
    const { unmount } = render(
      <ContextMenu>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    openContextMenu();
    expect(getSlot(document.body, 'context-menu-search-input')).toBeNull();
    expect(getSlot(document.body, 'context-menu-search-list')).toBeNull();
    unmount();

    render(
      <ContextMenu autocomplete>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item value='item'>Item</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    );
    openContextMenu();
    expectSlots(document.body, [
      'context-menu-search-input',
      'context-menu-search-list',
      'context-menu-item'
    ]);
  });
});
