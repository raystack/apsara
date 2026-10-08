import { fireEvent, render, screen } from '@testing-library/react';
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
        {children}
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
  });

  describe('Checkbox Items', () => {
    it('toggles the checked state and aria-checked', async () => {
      const onCheckedChange = vi.fn();
      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem onCheckedChange={onCheckedChange}>
              Show grid
            </Menu.CheckboxItem>
          </Menu.Content>
        </Menu>
      );

      const item = screen.getByRole('menuitemcheckbox');
      expect(item).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(item);
      expect(item).toHaveAttribute('aria-checked', 'true');
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.click(item);
      expect(item).toHaveAttribute('aria-checked', 'false');
    });

    it('respects the controlled checked prop', async () => {
      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem checked>Show grid</Menu.CheckboxItem>
          </Menu.Content>
        </Menu>
      );

      const item = screen.getByRole('menuitemcheckbox');
      fireEvent.click(item);
      expect(item).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Radio Items', () => {
    it('keeps a single item checked in a group', async () => {
      const onValueChange = vi.fn();
      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.RadioGroup defaultValue='list' onValueChange={onValueChange}>
              <Menu.RadioItem value='list'>List</Menu.RadioItem>
              <Menu.RadioItem value='board'>Board</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Content>
        </Menu>
      );

      const [list, board] = screen.getAllByRole('menuitemradio');
      expect(list).toHaveAttribute('aria-checked', 'true');
      expect(board).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(board);
      expect(list).toHaveAttribute('aria-checked', 'false');
      expect(board).toHaveAttribute('aria-checked', 'true');
      expect(onValueChange).toHaveBeenCalledWith('board', expect.anything());
    });
  });

  describe('Link Items', () => {
    it('renders an anchor with role menuitem', async () => {
      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.LinkItem href='/projects'>Projects</Menu.LinkItem>
          </Menu.Content>
        </Menu>
      );

      const link = screen.getByRole('menuitem', { name: 'Projects' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/projects');
    });

    it('renders a custom link element through render', async () => {
      const RouterLink = (props: React.ComponentProps<'a'>) => (
        <a data-router='' {...props} />
      );
      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.LinkItem render={<RouterLink href='/settings' />}>
              Settings
            </Menu.LinkItem>
          </Menu.Content>
        </Menu>
      );

      const link = screen.getByRole('menuitem', { name: 'Settings' });
      expect(link).toHaveAttribute('data-router');
      expect(link).toHaveAttribute('href', '/settings');
    });
  });

  describe('Empty State', () => {
    it('shows only when the menu has no items', async () => {
      const { unmount } = render(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Profile</Menu.Item>
            <Menu.EmptyState>No actions</Menu.EmptyState>
          </Menu.Content>
        </Menu>
      );
      fireEvent.click(screen.getByText(TRIGGER_TEXT));
      expect(screen.queryByText(/No actions/)).not.toBeInTheDocument();
      unmount();

      await renderAndOpenDropdown(
        <Menu>
          <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
          <Menu.Content>
            <Menu.EmptyState>No actions</Menu.EmptyState>
          </Menu.Content>
        </Menu>
      );
      expect(screen.getByRole('status')).toHaveTextContent('No actions');
    });
  });

  describe('Autocomplete', () => {
    const SearchMenu = () => (
      <Menu autocomplete>
        <Menu.Trigger>{TRIGGER_TEXT}</Menu.Trigger>
        <Menu.Content>
          {MENU_ITEMS.map(item => (
            <Menu.Item key={item.id}>{item.label}</Menu.Item>
          ))}
          <Menu.CheckboxItem>Show grid</Menu.CheckboxItem>
          <Menu.RadioGroup defaultValue='list'>
            <Menu.RadioItem value='list'>List view</Menu.RadioItem>
            <Menu.RadioItem value='board'>Board view</Menu.RadioItem>
          </Menu.RadioGroup>
          <Menu.LinkItem href='/docs'>Docs</Menu.LinkItem>
          <Menu.EmptyState>No results</Menu.EmptyState>
          <Menu.Status />
        </Menu.Content>
      </Menu>
    );

    const search = (value: string) => {
      fireEvent.change(screen.getByRole('combobox'), { target: { value } });
    };

    it('filters items as the user types', async () => {
      await renderAndOpenDropdown(<SearchMenu />);
      expect(screen.getAllByRole('option')).toHaveLength(9);

      search('set');
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Settings');

      search('view');
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('shows the empty state only when nothing matches', async () => {
      await renderAndOpenDropdown(<SearchMenu />);
      const empty = document.querySelector('[data-slot="menu-empty-state"]');
      expect(empty).toHaveAttribute('role', 'status');
      expect(empty).toBeEmptyDOMElement();

      search('zzz');
      expect(empty).toHaveTextContent('No results');

      search('team');
      expect(empty).toBeEmptyDOMElement();
    });

    it('announces the number of matches', async () => {
      await renderAndOpenDropdown(<SearchMenu />);
      const status = document.querySelector('[data-slot="menu-status"]');
      expect(status).toHaveAttribute('role', 'status');
      expect(status).toBeEmptyDOMElement();

      search('view');
      expect(status).toHaveTextContent('2 results');

      search('docs');
      expect(status).toHaveTextContent('1 result');

      search('zzz');
      expect(status).toHaveTextContent('0 results');
    });

    it('toggles checkbox and radio items and keeps the search', async () => {
      await renderAndOpenDropdown(<SearchMenu />);

      search('grid');
      const checkbox = screen.getByRole('option', { name: 'Show grid' });
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('combobox')).toHaveValue('grid');

      search('view');
      const board = screen.getByRole('option', { name: 'Board view' });
      fireEvent.click(board);
      expect(board).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('option', { name: 'List view' })).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });

    it('renders link items as anchors', async () => {
      await renderAndOpenDropdown(<SearchMenu />);
      const link = screen.getByRole('option', { name: 'Docs' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/docs');
    });
  });
});
