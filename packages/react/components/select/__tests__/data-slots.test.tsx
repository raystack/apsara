import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Select } from '../select';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' }
];

const openSelect = async (user: ReturnType<typeof userEvent.setup>) => {
  const trigger = screen.getByRole('combobox');
  await user.click(trigger);
  await screen.findByRole('listbox');
};

describe('Select data-slot contract', () => {
  it('exposes the trigger slots when closed', () => {
    const { container } = render(
      <Select>
        <Select.Trigger>
          <Select.Value placeholder='Select a fruit' />
        </Select.Trigger>
        <Select.Content>
          {FRUIT_OPTIONS.map(option => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
    expectSlots(container, [
      'select-trigger',
      'select-trigger-content',
      'select-trigger-icon',
      'select-value'
    ]);
  });

  it('exposes content, list, group, label, separator and item slots when open', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger>
          <Select.Value placeholder='Select a fruit' />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            {FRUIT_OPTIONS.map(option => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Group>
          <Select.Separator />
        </Select.Content>
      </Select>
    );
    await openSelect(user);

    // Popup content portals to the body.
    expectSlots(document.body, [
      'select-positioner',
      'select-content',
      'select-list',
      'select-group',
      'select-label',
      'select-separator',
      'select-item',
      'select-item-text'
    ]);
  });

  it('exposes the leading icon slot on items when provided', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger>
          <Select.Value placeholder='Select a fruit' />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='apple' leadingIcon={<span>i</span>}>
            Apple
          </Select.Item>
        </Select.Content>
      </Select>
    );
    await openSelect(user);
    expect(getSlot(document.body, 'select-item-icon')).not.toBeNull();
  });

  it('exposes the multiple-value slot once items are selected', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select multiple defaultValue={[]}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {FRUIT_OPTIONS.map(option => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    );
    await openSelect(user);
    await user.click(screen.getAllByRole('option')[0]);
    expect(getSlot(container, 'select-value')).not.toBeNull();
  });

  it('lets FilterChip/DataView-style overrides win over Select defaults', () => {
    const { container } = render(
      <Select>
        <Select.Trigger data-slot='filter-chip-value'>
          <Select.Value placeholder='Select value' />
        </Select.Trigger>
      </Select>
    );
    expect(getSlot(container, 'filter-chip-value')).not.toBeNull();
    expect(getSlot(container, 'select-trigger')).toBeNull();
  });
});
