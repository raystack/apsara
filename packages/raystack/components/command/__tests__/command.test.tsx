import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Command } from '../command';
import styles from '../command.module.css';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

const ITEMS = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'emoji', label: 'Search Emoji' },
  { value: 'calculator', label: 'Calculator' },
  { value: 'profile', label: 'Profile' },
  { value: 'billing', label: 'Billing' },
  { value: 'settings', label: 'Settings' }
];

const BasicCommand = (props: React.ComponentProps<typeof Command>) => (
  <Command {...props}>
    <Command.Panel>
      <Command.Input placeholder='Type a command or search...' />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {ITEMS.map(item => (
          <Command.Item key={item.value} value={item.value}>
            {item.label}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Panel>
  </Command>
);

const selectOption = async (element: HTMLElement) => {
  const option = element.closest('[role="option"]') ?? element;
  fireEvent.pointerDown(option);
  fireEvent.click(option);
};

describe('Command', () => {
  describe('Basic Rendering', () => {
    it('renders input and items', () => {
      render(<BasicCommand />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Type a command or search...')
      ).toBeInTheDocument();
      ITEMS.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('items have option role', () => {
      render(<BasicCommand />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(ITEMS.length);
    });

    it('list has listbox role', () => {
      render(<BasicCommand />);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Auto-search (no items prop)', () => {
    it('filters items based on input value', async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'cal');

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(screen.getByText('Calendar')).toBeInTheDocument();
        expect(screen.getByText('Calculator')).toBeInTheDocument();
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });

    it('matches case-insensitively', async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'PROFILE');

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    it('restores all items when search is cleared', async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'cal');
      await waitFor(() =>
        expect(screen.getAllByRole('option')).toHaveLength(2)
      );

      await user.clear(input);
      await waitFor(() =>
        expect(screen.getAllByRole('option')).toHaveLength(ITEMS.length)
      );
    });

    it('shows empty state when no items match', async () => {
      const user = userEvent.setup();
      render(<BasicCommand />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'zzzzz');

      await waitFor(() => {
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        expect(screen.getByText('No results found.')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-search disabled when items prop is passed', () => {
    it('does not apply custom filtering to CommandItem when items is provided', async () => {
      const user = userEvent.setup();
      const items = ['Calendar', 'Search Emoji', 'Calculator'];

      render(
        <Command items={items}>
          <Command.Panel>
            <Command.Input placeholder='Search...' />
            <Command.List>
              <Command.Item>Always Visible Custom</Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      );

      // Our per-item filtering does not apply (because items was passed).
      // Even with an unrelated query, the hardcoded item should still render.
      const input = screen.getByRole('combobox');
      await user.type(input, 'zzzzz');

      expect(screen.getByText('Always Visible Custom')).toBeInTheDocument();
    });
  });

  describe('Groups and Separators', () => {
    const GroupedCommand = () => (
      <Command>
        <Command.Panel>
          <Command.Input placeholder='Search' />
          <Command.List>
            <Command.Empty>No results</Command.Empty>
            <Command.Group>
              <Command.Label>Suggestions</Command.Label>
              <Command.Item>Calendar</Command.Item>
              <Command.Item>Calculator</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group>
              <Command.Label>Settings</Command.Label>
              <Command.Item>Profile</Command.Item>
              <Command.Item>Billing</Command.Item>
            </Command.Group>
          </Command.List>
        </Command.Panel>
      </Command>
    );

    it('renders group labels and separator when not searching', () => {
      render(<GroupedCommand />);
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('hides group labels and separators while searching', async () => {
      const user = userEvent.setup();
      render(<GroupedCommand />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'cal');

      await waitFor(() => {
        expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
        expect(screen.getByText('Calendar')).toBeInTheDocument();
        expect(screen.getByText('Calculator')).toBeInTheDocument();
      });
    });
  });

  describe('Item selection', () => {
    it('invokes onClick when item is clicked', async () => {
      const handleClick = vi.fn();
      render(
        <Command>
          <Command.Panel>
            <Command.Input placeholder='Search' />
            <Command.List>
              <Command.Item onClick={handleClick}>Calendar</Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      );

      await selectOption(screen.getByText('Calendar'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('selects highlighted item with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Command>
          <Command.Panel>
            <Command.Input placeholder='Search' />
            <Command.List>
              <Command.Item onClick={handleClick}>Calendar</Command.Item>
              <Command.Item>Calculator</Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Controlled input value', () => {
    it('supports controlled value / onValueChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const Wrapper = () => {
        const [value, setValue] = React.useState('');
        return (
          <Command
            value={value}
            onValueChange={(v, details) => {
              setValue(v);
              handleChange(v, details);
            }}
          >
            <Command.Panel>
              <Command.Input placeholder='Search' />
              <Command.List>
                <Command.Item>Calendar</Command.Item>
                <Command.Item>Calculator</Command.Item>
              </Command.List>
            </Command.Panel>
          </Command>
        );
      };

      render(<Wrapper />);
      const input = screen.getByRole('combobox');
      await user.type(input, 'cal');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('cal');
    });
  });

  describe('Disabled Item', () => {
    it('marks item as disabled via aria-disabled', () => {
      render(
        <Command>
          <Command.Panel>
            <Command.Input placeholder='Search' />
            <Command.List>
              <Command.Item disabled>Calendar</Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      );

      const option = screen.getByText('Calendar').closest('[role="option"]');
      expect(option).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Panel / Footer / Shortcut', () => {
    it('renders Command.Panel wrapper with default class', () => {
      render(
        <Command>
          <Command.Panel data-testid='panel'>
            <Command.Input placeholder='Search' />
          </Command.Panel>
        </Command>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toHaveClass(styles.panel);
    });

    it('merges custom className on Panel', () => {
      render(
        <Command>
          <Command.Panel className='custom-panel' data-testid='panel'>
            <Command.Input placeholder='Search' />
          </Command.Panel>
        </Command>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toHaveClass('custom-panel');
      expect(panel).toHaveClass(styles.panel);
    });

    it('renders Command.Footer', () => {
      render(
        <Command>
          <Command.Panel>
            <Command.Input placeholder='Search' />
            <Command.Footer data-testid='footer'>Footer content</Command.Footer>
          </Command.Panel>
        </Command>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveTextContent('Footer content');
      expect(footer).toHaveClass(styles.footer);
    });

    it('renders Command.Shortcut as <kbd>', () => {
      render(
        <Command>
          <Command.Panel>
            <Command.Input placeholder='Search' />
            <Command.List>
              <Command.Item>
                Profile <Command.Shortcut>⌘P</Command.Shortcut>
              </Command.Item>
            </Command.List>
          </Command.Panel>
        </Command>
      );

      const kbd = screen.getByText('⌘P');
      expect(kbd.tagName).toBe('KBD');
    });
  });

  describe('CommandDialog', () => {
    it('shows dialog when trigger is clicked and dismisses on Escape', async () => {
      const user = userEvent.setup();

      render(
        <Command.Dialog>
          <Command.Dialog.Trigger>Open Menu</Command.Dialog.Trigger>
          <Command.Dialog.Content>
            <Command>
              <Command.Input placeholder='Search' />
              <Command.List>
                <Command.Item>Calendar</Command.Item>
              </Command.List>
            </Command>
          </Command.Dialog.Content>
        </Command.Dialog>
      );

      expect(screen.queryByText('Calendar')).not.toBeInTheDocument();

      await user.click(screen.getByText('Open Menu'));
      await waitFor(() => {
        expect(screen.getByText('Calendar')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
      });
    });
  });
});
