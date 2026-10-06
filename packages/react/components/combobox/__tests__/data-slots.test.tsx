import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Combobox } from '../combobox';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' }
];

describe('Combobox data-slot contract', () => {
  it('exposes the input slot when closed', () => {
    const { container } = render(
      <Combobox>
        <Combobox.Input placeholder='Enter a fruit' />
        <Combobox.Content>
          {FRUIT_OPTIONS.map(option => (
            <Combobox.Item key={option.value} value={option.value}>
              {option.label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    );
    expect(getSlot(container, 'combobox-input')).not.toBeNull();
  });

  it('exposes content, list, group, label, separator and item slots when open', async () => {
    const user = userEvent.setup();
    render(
      <Combobox>
        <Combobox.Input placeholder='Enter a fruit' />
        <Combobox.Content>
          <Combobox.Group>
            <Combobox.Label>Fruits</Combobox.Label>
            {FRUIT_OPTIONS.map(option => (
              <Combobox.Item key={option.value} value={option.value}>
                {option.label}
              </Combobox.Item>
            ))}
          </Combobox.Group>
          <Combobox.Separator />
        </Combobox.Content>
      </Combobox>
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Popup content portals to the body.
    expectSlots(document.body, [
      'combobox-positioner',
      'combobox-content',
      'combobox-list',
      'combobox-group',
      'combobox-label',
      'combobox-separator',
      'combobox-item',
      'combobox-item-text'
    ]);
  });

  it('exposes the leading icon slot on items when provided', async () => {
    const user = userEvent.setup();
    render(
      <Combobox>
        <Combobox.Input placeholder='Enter a fruit' />
        <Combobox.Content>
          <Combobox.Item value='apple' leadingIcon={<span>i</span>}>
            Apple
          </Combobox.Item>
        </Combobox.Content>
      </Combobox>
    );
    const input = screen.getByRole('combobox');
    await user.click(input);

    await waitFor(() => {
      expect(getSlot(document.body, 'combobox-item-icon')).not.toBeNull();
    });
  });
});
