import { fireEvent, render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../button/button';
import { DropdownMenu } from '../dropdown-menu';
import { DropdownMenuRootProps } from '../dropdown-menu-root';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

// String constants
const TRIGGER_TEXT = 'Open Menu';
const MENU_ITEMS = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
  { id: 'logout', label: 'Logout' }
];

const BasicDropdown = ({
  onClick,
  children,
  ...props
}: DropdownMenuRootProps & { onClick?: (value: string) => void }) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenu.Trigger asChild>
        <Button color='neutral'>{TRIGGER_TEXT}</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {MENU_ITEMS.map(item => (
          <DropdownMenu.Item key={item.id} onClick={() => onClick?.(item.id)}>
            {item.label}
          </DropdownMenu.Item>
        ))}
        {children}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const renderAndOpenDropdown = async (Dropdown: React.ReactElement) => {
  await fireEvent.click(render(Dropdown).getByText(TRIGGER_TEXT));
};

describe('DropdownMenu', () => {
  describe('Basic Rendering', () => {
    it('renders dropdown trigger', () => {
      render(<BasicDropdown />);
      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });

    it('renders with custom className on trigger', () => {
      render(
        <DropdownMenu>
          <DropdownMenu.Trigger className='custom-trigger'>
            Custom Trigger
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Menu Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Custom Trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('does not show content initially', () => {
      render(<BasicDropdown />);
      MENU_ITEMS.forEach(item => {
        expect(screen.queryByText(item.label)).not.toBeInTheDocument();
      });
    });

    it('shows content when opened', async () => {
      await renderAndOpenDropdown(<BasicDropdown />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      MENU_ITEMS.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('renders in portal', async () => {
      await renderAndOpenDropdown(<BasicDropdown />);

      const content = screen.getByRole('menu');
      expect(content.closest('body')).toBe(document.body);
    });
  });

  describe('Trigger Interaction', () => {
    it('opens menu when trigger is clicked', async () => {
      await renderAndOpenDropdown(<BasicDropdown />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText(MENU_ITEMS[0].label)).toBeInTheDocument();
    });
  });

  describe('Menu Items', () => {
    it('handles item clicks with onClick', async () => {
      const onClick = vi.fn();

      await renderAndOpenDropdown(<BasicDropdown onClick={onClick} />);

      const item = screen.getByText(MENU_ITEMS[0].label);
      fireEvent.click(item);

      expect(onClick).toHaveBeenCalled();
    });

    it('closes menu after item selection by default', async () => {
      await renderAndOpenDropdown(<BasicDropdown />);

      const item = screen.getByText(MENU_ITEMS[0].label);
      fireEvent.click(item);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('supports disabled items', async () => {
      const onClick = vi.fn();

      await renderAndOpenDropdown(
        <BasicDropdown>
          <DropdownMenu.Item
            disabled
            onClick={onClick}
            data-testid='disabled-item'
          >
            Disabled Item
          </DropdownMenu.Item>
        </BasicDropdown>
      );

      const disabledItem = screen.getByTestId('disabled-item');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(disabledItem);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Controlled State', () => {
    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();

      await render(<BasicDropdown onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Autocomplete Mode', () => {
    it('renders search input in autocomplete mode', async () => {
      await renderAndOpenDropdown(<BasicDropdown autocomplete />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search...');
    });

    it('filters items based on search', async () => {
      const user = userEvent.setup();

      await renderAndOpenDropdown(<BasicDropdown autocomplete />);

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'pro');

      const menuItems = await screen.findAllByRole('option');
      expect(menuItems.length).toBe(1);
      expect(menuItems[0].textContent).toBe('Profile');
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      render(<BasicDropdown />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('opens with Space key', async () => {
      const user = userEvent.setup();
      render(<BasicDropdown />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      trigger.focus();
      await user.keyboard('[Space]');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      await renderAndOpenDropdown(<BasicDropdown />);

      await user.keyboard('{ArrowDown}{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('navigates items with arrow keys', async () => {
      const user = userEvent.setup();
      await renderAndOpenDropdown(<BasicDropdown />);

      const items = await screen.findAllByRole('menuitem');
      await user.hover(items[0]);

      await user.keyboard('{ArrowDown}');
      expect(items[1]).toHaveAttribute('data-active-item', 'true');
    });

    it('selects item with Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      await renderAndOpenDropdown(<BasicDropdown onClick={onClick} />);
      const items = await screen.findAllByRole('menuitem');
      await user.hover(items[0]);

      await user.keyboard('{ArrowDown}{Enter}');

      expect(onClick).toHaveBeenCalledWith(MENU_ITEMS[1].id);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
