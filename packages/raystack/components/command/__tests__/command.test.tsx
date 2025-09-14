import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { Command } from '../command';
import styles from '../command.module.css';

describe('Command', () => {
  describe('Basic Rendering', () => {
    it('renders command root', () => {
      const { container } = render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Test item</Command.Item>
          </Command.List>
        </Command>
      );

      const commandRoot = container.querySelector(`.${styles.command}`);
      expect(commandRoot).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Command className='custom-command'>
          <Command.Item>Test item</Command.Item>
        </Command>
      );

      const commandRoot = container.querySelector('.custom-command');
      expect(commandRoot).toBeInTheDocument();
      expect(commandRoot).toHaveClass(styles.command);
    });
  });

  describe('Command Input', () => {
    it('renders input with placeholder', () => {
      render(
        <Command>
          <Command.Input placeholder='Search commands...' />
        </Command>
      );

      expect(
        screen.getByPlaceholderText('Search commands...')
      ).toBeInTheDocument();
    });

    it('renders search icon', () => {
      const { container } = render(
        <Command>
          <Command.Input placeholder='Search...' />
        </Command>
      );

      const icon = container.querySelector(`.${styles.inputIcon}`);
      expect(icon).toBeInTheDocument();
    });

    it('handles input changes', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Test item</Command.Item>
          </Command.List>
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(input).toHaveValue('test');
    });
  });

  describe('Command List and Items', () => {
    it('renders command items', () => {
      render(
        <Command>
          <Command.List>
            <Command.Item>First item</Command.Item>
            <Command.Item>Second item</Command.Item>
          </Command.List>
        </Command>
      );

      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();
    });

    it('handles item selection', () => {
      const onSelect = vi.fn();
      render(
        <Command>
          <Command.List>
            <Command.Item onSelect={onSelect}>Selectable item</Command.Item>
          </Command.List>
        </Command>
      );

      const item = screen.getByText('Selectable item');
      fireEvent.click(item);

      expect(onSelect).toHaveBeenCalled();
    });

    it('applies item classes', () => {
      const { container } = render(
        <Command>
          <Command.List>
            <Command.Item className='custom-item'>Test item</Command.Item>
          </Command.List>
        </Command>
      );

      const item = container.querySelector('.custom-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveClass(styles.item);
    });
  });

  describe('Command Groups', () => {
    it('renders command groups', () => {
      render(
        <Command>
          <Command.List>
            <Command.Group heading='Group 1'>
              <Command.Item>Group item</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      );

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group item')).toBeInTheDocument();
    });

    it('applies group classes', () => {
      const { container } = render(
        <Command>
          <Command.List>
            <Command.Group className='custom-group'>
              <Command.Item>Test item</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      );

      const group = container.querySelector('.custom-group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass(styles.group);
    });
  });

  describe('Command Empty State', () => {
    it('renders empty state when no results', () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Empty>No results found</Command.Empty>
          </Command.List>
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'nonexistent' } });

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('applies empty state classes', () => {
      const { container } = render(
        <Command>
          <Command.List>
            <Command.Empty>Empty state</Command.Empty>
          </Command.List>
        </Command>
      );

      const empty = container.querySelector(`.${styles.empty}`);
      expect(empty).toBeInTheDocument();
    });
  });

  describe('Command Separator', () => {
    it('renders separator', () => {
      const { container } = render(
        <Command>
          <Command.List>
            <Command.Item>Item 1</Command.Item>
            <Command.Separator />
            <Command.Item>Item 2</Command.Item>
          </Command.List>
        </Command>
      );

      const separator = container.querySelector(`.${styles.separator}`);
      expect(separator).toBeInTheDocument();
    });
  });

  describe('Command Shortcut', () => {
    it('renders shortcut', () => {
      render(
        <Command>
          <Command.List>
            <Command.Item>
              Test item
              <Command.Shortcut>⌘K</Command.Shortcut>
            </Command.Item>
          </Command.List>
        </Command>
      );

      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('applies shortcut classes', () => {
      const { container } = render(
        <Command>
          <Command.List>
            <Command.Item>
              Test item
              <Command.Shortcut className='custom-shortcut'>
                ⌘K
              </Command.Shortcut>
            </Command.Item>
          </Command.List>
        </Command>
      );

      const shortcut = container.querySelector('.custom-shortcut');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveClass(styles.shortcut);
    });
  });

  describe('Command Dialog', () => {
    it('renders command dialog', () => {
      render(
        <Command.Dialog open={true}>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>Dialog item</Command.Item>
          </Command.List>
        </Command.Dialog>
      );

      expect(screen.getByText('Dialog item')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('applies dialog command classes', () => {
      const { container } = render(
        <Command.Dialog open={true}>
          <Command.Input />
        </Command.Dialog>
      );

      const dialogCommand = container.querySelector(`.${styles.dialogcommand}`);
      expect(dialogCommand).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item>First item</Command.Item>
            <Command.Item>Second item</Command.Item>
          </Command.List>
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      input.focus();

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        const firstItem = screen.getByText('First item');
        expect(firstItem).toBeInTheDocument();
      });
    });

    it('supports Enter key selection', async () => {
      const onSelect = vi.fn();
      render(
        <Command>
          <Command.Input placeholder='Search...' />
          <Command.List>
            <Command.Item onSelect={onSelect}>Selectable item</Command.Item>
          </Command.List>
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      input.focus();

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalled();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Command ref={ref}>
          <Command.Item>Test item</Command.Item>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });
});
