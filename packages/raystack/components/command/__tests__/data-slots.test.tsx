import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Kbd } from '../../kbd';
import { Command } from '../command';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const BasicCommand = () => (
  <Command>
    <Command.Input placeholder='Type a command or search...' />
    <Command.Content>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group>
        <Command.Label>Suggestions</Command.Label>
        <Command.Item
          leadingIcon={<span />}
          trailingIcon={
            <Kbd.Group variant='ghost'>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </Kbd.Group>
          }
        >
          Calendar
        </Command.Item>
      </Command.Group>
      <Command.Separator />
      <Command.Item disabled>Disabled item</Command.Item>
    </Command.Content>
  </Command>
);

describe('Command data-slot contract', () => {
  it('exposes slots for every rendered part', () => {
    const { container } = render(<BasicCommand />);
    expectSlots(container, [
      'command',
      'command-input-container',
      'command-input',
      'command-content',
      'command-empty',
      'command-group',
      'command-label',
      'command-item',
      'command-item-leading-icon',
      'command-item-label',
      'command-item-trailing-icon',
      'command-separator'
    ]);
  });

  it('puts the input slot on the input element itself', () => {
    const { container } = render(<BasicCommand />);
    expect(getSlot(container, 'command-input')?.tagName).toBe('INPUT');
  });

  it('exposes the item slot on disabled items too', () => {
    const { container } = render(
      <Command>
        <Command.Content>
          <Command.Item disabled>Disabled item</Command.Item>
        </Command.Content>
      </Command>
    );
    const item = getSlot(container, 'command-item');
    expect(item).not.toBeNull();
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('omits icon slots when the item has no icons', () => {
    const { container } = render(
      <Command>
        <Command.Content>
          <Command.Item>Plain item</Command.Item>
        </Command.Content>
      </Command>
    );
    expect(getSlot(container, 'command-item-leading-icon')).toBeNull();
    expect(getSlot(container, 'command-item-trailing-icon')).toBeNull();
  });

  it('exposes slots on the dialog parts', () => {
    render(
      <Command.Dialog open>
        <Command.DialogTrigger>Open palette</Command.DialogTrigger>
        <Command.DialogContent>
          <BasicCommand />
        </Command.DialogContent>
      </Command.Dialog>
    );
    // The trigger sits behind an aria-hidden inert wrapper while the modal
    // dialog is open, so query by slot rather than accessible role.
    expect(getSlot(document.body, 'command-dialog-trigger')?.tagName).toBe(
      'BUTTON'
    );
    // Dialog content portals to the body.
    expectSlots(document.body, [
      'command-dialog-viewport',
      'command-dialog-content',
      'command'
    ]);
  });
});
