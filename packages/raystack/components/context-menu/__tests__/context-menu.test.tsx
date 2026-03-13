import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from '../context-menu';

// Mock scrollIntoView for test environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

// String constants
const TRIGGER_TEXT = 'Right click here';
const MENU_ITEMS = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
  { id: 'logout', label: 'Logout' }
];

interface BasicContextMenuProps {
  onClick?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

const BasicContextMenu = ({
  onClick,
  children,
  ...props
}: BasicContextMenuProps) => {
  return (
    <ContextMenu {...props}>
      <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {MENU_ITEMS.map(item => (
          <ContextMenu.Item key={item.id} onClick={() => onClick?.(item.id)}>
            {item.label}
          </ContextMenu.Item>
        ))}
        {children}
      </ContextMenu.Content>
    </ContextMenu>
  );
};

const renderAndOpenContextMenu = async (element: React.ReactElement) => {
  const { getByText } = render(element);
  const trigger = getByText(TRIGGER_TEXT);
  await fireEvent.contextMenu(trigger);
};

describe('ContextMenu', () => {
  describe('Basic Rendering', () => {
    it('renders trigger', () => {
      render(<BasicContextMenu />);
      expect(screen.getByText(TRIGGER_TEXT)).toBeInTheDocument();
    });

    it('renders with custom className on trigger', () => {
      render(
        <ContextMenu>
          <ContextMenu.Trigger className='custom-trigger'>
            Custom Trigger
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Menu Item</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      );

      const trigger = screen.getByText('Custom Trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('does not show content initially', () => {
      render(<BasicContextMenu />);
      MENU_ITEMS.forEach(item => {
        expect(screen.queryByText(item.label)).not.toBeInTheDocument();
      });
    });

    it('shows content when right-clicked', async () => {
      await renderAndOpenContextMenu(<BasicContextMenu />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      MENU_ITEMS.forEach(item => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });
  });

  describe('Trigger Interaction', () => {
    it('opens menu on right-click (contextmenu event)', async () => {
      await renderAndOpenContextMenu(<BasicContextMenu />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText(MENU_ITEMS[0].label)).toBeInTheDocument();
    });
  });

  describe('Menu Items', () => {
    it('handles item clicks with onClick', async () => {
      const onClick = vi.fn();

      await renderAndOpenContextMenu(<BasicContextMenu onClick={onClick} />);

      const item = screen.getByText(MENU_ITEMS[0].label);
      fireEvent.click(item);

      expect(onClick).toHaveBeenCalled();
    });

    it('supports disabled items', async () => {
      const onClick = vi.fn();

      await renderAndOpenContextMenu(
        <BasicContextMenu>
          <ContextMenu.Item
            disabled
            onClick={onClick}
            data-testid='disabled-item'
          >
            Disabled Item
          </ContextMenu.Item>
        </BasicContextMenu>
      );

      const disabledItem = screen.getByTestId('disabled-item');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Controlled State', () => {
    it('calls onOpenChange when state changes', async () => {
      const onOpenChange = vi.fn();

      render(<BasicContextMenu onOpenChange={onOpenChange} />);

      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.contextMenu(trigger);

      expect(onOpenChange).toHaveBeenCalled();
    });
  });
});
