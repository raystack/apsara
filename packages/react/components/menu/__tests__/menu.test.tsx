import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../button/button';
import { Menu } from '../menu';
import { MenuRootProps } from '../menu-root';

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
}: MenuRootProps & { onClick?: (value: string) => void }) => {
  return (
    <Menu {...props}>
      <Menu.Trigger render={<Button color='neutral' />}>
        {TRIGGER_TEXT}
      </Menu.Trigger>
      <Menu.Content>
        {MENU_ITEMS.map(item => (
          <Menu.Item key={item.id} onClick={() => onClick?.(item.id)}>
            {item.label}
          </Menu.Item>
        ))}
        {typeof children === 'function' ? null : children}
      </Menu.Content>
    </Menu>
  );
};

const renderAndOpenDropdown = async (Dropdown: React.ReactElement) => {
  await fireEvent.click(render(Dropdown).getByText(TRIGGER_TEXT));
};

describe('Menu', () => {
  describe('Basic Rendering', () => {
    it('renders dropdown trigger', () => {
      render(<BasicDropdown />);
      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });

    it('renders with custom className on trigger', () => {
      render(
        <Menu>
          <Menu.Trigger className='custom-trigger'>Custom Trigger</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Menu Item</Menu.Item>
          </Menu.Content>
        </Menu>
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

    it('supports disabled items', async () => {
      const onClick = vi.fn();

      await renderAndOpenDropdown(
        <BasicDropdown>
          <Menu.Item disabled onClick={onClick} data-testid='disabled-item'>
            Disabled Item
          </Menu.Item>
        </BasicDropdown>
      );

      const disabledItem = screen.getByTestId('disabled-item');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Controlled State', () => {
    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();

      await render(<BasicDropdown onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.click(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });

    it('stays open until the parent closes a controlled menu', async () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <BasicDropdown open onOpenChange={onOpenChange} />
      );

      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(screen.getByText('Profile')).toBeInTheDocument();

      rerender(<BasicDropdown open={false} onOpenChange={onOpenChange} />);

      await waitFor(() => {
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });
  });

  describe('Autocomplete', () => {
    const FRUITS = (
      <Menu.Content>
        <Menu.Item value='apple'>Apple</Menu.Item>
        <Menu.Item value='banana'>Banana</Menu.Item>
      </Menu.Content>
    );

    it('filters items by a controlled inputValue', () => {
      const onInputValueChange = vi.fn();
      render(
        <Menu
          autocomplete
          defaultOpen
          inputValue='ban'
          onInputValueChange={onInputValueChange}
        >
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          {FRUITS}
        </Menu>
      );
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.change(input, { target: { value: 'app' } });

      expect(onInputValueChange).toHaveBeenCalledWith('app');
      expect(input).toHaveValue('ban');
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('clears an uncontrolled search when the menu closes', async () => {
      const onInputValueChange = vi.fn();
      render(
        <Menu
          autocomplete
          defaultOpen
          defaultInputValue='ban'
          onInputValueChange={onInputValueChange}
        >
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          {FRUITS}
        </Menu>
      );
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();

      fireEvent.keyDown(screen.getByPlaceholderText('Search...'), {
        key: 'Escape'
      });
      await waitFor(() => {
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByText(TRIGGER_TEXT));

      expect(onInputValueChange).toHaveBeenCalledWith('');
      expect(await screen.findByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });
});
