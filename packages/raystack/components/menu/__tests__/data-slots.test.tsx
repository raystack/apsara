import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Menu } from '../menu';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const TRIGGER_TEXT = 'Open Menu';

const openMenu = () => {
  fireEvent.click(screen.getByText(TRIGGER_TEXT));
};

describe('Menu data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    render(
      <Menu>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          <Menu.Group>
            <Menu.Label>Group label</Menu.Label>
            <Menu.Item leadingIcon={<span />} trailingIcon={<span />}>
              Item one
            </Menu.Item>
          </Menu.Group>
          <Menu.Separator />
          <Menu.Submenu>
            <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
            <Menu.SubmenuContent>
              <Menu.Item>Nested</Menu.Item>
            </Menu.SubmenuContent>
          </Menu.Submenu>
          <Menu.EmptyState>Nothing here</Menu.EmptyState>
        </Menu.Content>
      </Menu>
    );

    expectSlots(document.body, ['menu-trigger']);
    openMenu();

    // Content portals to the body.
    expectSlots(document.body, [
      'menu-positioner',
      'menu-content',
      'menu-group',
      'menu-label',
      'menu-item',
      'menu-cell-leading-icon',
      'menu-cell-trailing-icon',
      'menu-separator',
      'menu-subtrigger',
      'menu-empty-state'
    ]);
  });

  it('lets callers override the item slot via props', () => {
    render(
      <Menu>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          <Menu.Item data-slot='custom-item'>Item</Menu.Item>
        </Menu.Content>
      </Menu>
    );
    openMenu();
    expect(getSlot(document.body, 'custom-item')).not.toBeNull();
    expect(getSlot(document.body, 'menu-item')).toBeNull();
  });

  it('omits icon slots when the item has no icons', () => {
    render(
      <Menu>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu>
    );
    openMenu();
    expect(getSlot(document.body, 'menu-cell-leading-icon')).toBeNull();
    expect(getSlot(document.body, 'menu-cell-trailing-icon')).toBeNull();
  });

  it('exposes search slots only in autocomplete mode', () => {
    const { unmount } = render(
      <Menu>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu>
    );
    openMenu();
    expect(getSlot(document.body, 'menu-search-input')).toBeNull();
    expect(getSlot(document.body, 'menu-search-list')).toBeNull();
    unmount();

    render(
      <Menu autocomplete>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          <Menu.Item value='item'>Item</Menu.Item>
        </Menu.Content>
      </Menu>
    );
    openMenu();
    expectSlots(document.body, [
      'menu-search-input',
      'menu-search-list',
      'menu-item'
    ]);
  });
});
