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

  describe('Selection and Link Items', () => {
    it('toggles checkbox items and keeps one radio item checked', async () => {
      await renderAndOpenContextMenu(
        <ContextMenu>
          <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.CheckboxItem>Show grid</ContextMenu.CheckboxItem>
            <ContextMenu.RadioGroup defaultValue='list'>
              <ContextMenu.RadioItem value='list'>List</ContextMenu.RadioItem>
              <ContextMenu.RadioItem value='board'>Board</ContextMenu.RadioItem>
            </ContextMenu.RadioGroup>
          </ContextMenu.Content>
        </ContextMenu>
      );

      const checkbox = screen.getByRole('menuitemcheckbox');
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      const [list, board] = screen.getAllByRole('menuitemradio');
      fireEvent.click(board);
      expect(list).toHaveAttribute('aria-checked', 'false');
      expect(board).toHaveAttribute('aria-checked', 'true');
    });

    it('renders link items as anchors with role menuitem', async () => {
      await renderAndOpenContextMenu(
        <ContextMenu>
          <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.LinkItem href='/docs'>Docs</ContextMenu.LinkItem>
          </ContextMenu.Content>
        </ContextMenu>
      );

      const link = screen.getByRole('menuitem', { name: 'Docs' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/docs');
    });
  });

  describe('Autocomplete', () => {
    it('filters items and shows the empty state only with no matches', async () => {
      await renderAndOpenContextMenu(
        <ContextMenu autocomplete>
          <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
          <ContextMenu.Content>
            {MENU_ITEMS.map(item => (
              <ContextMenu.Item key={item.id}>{item.label}</ContextMenu.Item>
            ))}
            <ContextMenu.CheckboxItem>Show grid</ContextMenu.CheckboxItem>
            <ContextMenu.EmptyState>No results</ContextMenu.EmptyState>
            <ContextMenu.Status />
          </ContextMenu.Content>
        </ContextMenu>
      );

      const input = screen.getByRole('combobox');
      const empty = document.querySelector(
        '[data-slot="context-menu-empty-state"]'
      );
      const status = document.querySelector(
        '[data-slot="context-menu-status"]'
      );
      expect(empty).toBeEmptyDOMElement();

      fireEvent.change(input, { target: { value: 'grid' } });
      expect(screen.getAllByRole('option')).toHaveLength(1);
      expect(status).toHaveTextContent('1 result');
      expect(empty).toBeEmptyDOMElement();

      fireEvent.change(input, { target: { value: 'zzz' } });
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(empty).toHaveTextContent('No results');
    });
  });
});
