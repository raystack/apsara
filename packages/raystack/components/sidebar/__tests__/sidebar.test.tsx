import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarProps } from '../sidebar';
import styles from '../sidebar.module.css';

const HEADER_TEXT = 'Apsara';
const MAIN_GROUP_LABEL = 'Main';
const SUPPORT_GROUP_LABEL = 'Support';
const DASHBOARD_ITEM_TEXT = 'Dashboard';
const SETTINGS_ITEM_TEXT = 'Settings';
const HELP_ITEM_TEXT = 'Help';
const FOOTER_ITEM_TEXT = 'Footer';
const COLLAPSE_TEXT = 'Collapse sidebar';

const TestIcon = () => <span data-testid='test-icon'>📁</span>;
const HomeIcon = () => <span data-testid='home-icon'>🏠</span>;
const InfoIcon = () => <span data-testid='info-icon'>ℹ️</span>;

const BasicSidebar = ({
  defaultOpen = true,
  open,
  onOpenChange,
  collapsible = true,
  position = 'left',
  children,
  ...props
}: SidebarProps) => (
  <Sidebar
    defaultOpen={defaultOpen}
    open={open}
    onOpenChange={onOpenChange}
    collapsible={collapsible}
    position={position}
    {...props}
  >
    <Sidebar.Header>
      <div>
        <HomeIcon />
        <span data-collapse-hidden>{HEADER_TEXT}</span>
      </div>
    </Sidebar.Header>
    <Sidebar.Main>
      <Sidebar.Group label={MAIN_GROUP_LABEL} leadingIcon={<TestIcon />}>
        <Sidebar.Item href='#' leadingIcon={<InfoIcon />} active>
          {DASHBOARD_ITEM_TEXT}
        </Sidebar.Item>
        <Sidebar.Item href='#' leadingIcon={<InfoIcon />} disabled>
          {SETTINGS_ITEM_TEXT}
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group label={SUPPORT_GROUP_LABEL}>
        <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
          {HELP_ITEM_TEXT}
        </Sidebar.Item>
      </Sidebar.Group>
      {children}
    </Sidebar.Main>
    <Sidebar.Footer>
      <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
        {FOOTER_ITEM_TEXT}
      </Sidebar.Item>
    </Sidebar.Footer>
  </Sidebar>
);

describe('Sidebar', () => {
  describe('Basic Rendering', () => {
    it('renders sidebar with children', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('renders as aside element', () => {
      const { container } = render(<BasicSidebar />);

      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('applies root styles', () => {
      const { container } = render(<BasicSidebar />);

      const sidebar = container.querySelector(`.${styles.root}`);
      expect(sidebar).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicSidebar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Navigation Sidebar');
    });
  });

  describe('Collapsible Functionality', () => {
    it('can be collapsed', () => {
      render(<BasicSidebar open={false} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-state', 'collapsed');
    });

    it('does not show handle when not collapsible', () => {
      render(<BasicSidebar collapsible={false} />);

      const handle = screen.queryByRole('button', { name: COLLAPSE_TEXT });
      expect(handle).not.toBeInTheDocument();
    });

    it('toggles state when handle is clicked', () => {
      const onOpenChange = vi.fn();
      render(<BasicSidebar open onOpenChange={onOpenChange} collapsible />);

      const handle = screen.getByRole('button', { name: COLLAPSE_TEXT });
      fireEvent.click(handle);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('supports keyboard navigation on handle', () => {
      const onOpenChange = vi.fn();
      render(<BasicSidebar open onOpenChange={onOpenChange} collapsible />);

      const handle = screen.getByRole('button', { name: COLLAPSE_TEXT });
      fireEvent.keyDown(handle, { key: 'Enter' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('supports space key on handle', () => {
      const onOpenChange = vi.fn();
      render(<BasicSidebar open onOpenChange={onOpenChange} collapsible />);

      const handle = screen.getByRole('button', { name: COLLAPSE_TEXT });
      fireEvent.keyDown(handle, { key: ' ' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Position Variants', () => {
    it('applies left position by default', () => {
      const { container } = render(<BasicSidebar />);

      const sidebar = container.querySelector('[data-position="left"]');
      expect(sidebar).toBeInTheDocument();
    });

    it('applies right position when specified', () => {
      const { container } = render(<BasicSidebar position='right' />);

      const sidebar = container.querySelector('[data-position="right"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Sidebar Header', () => {
    it('renders header content', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
    });

    it('has proper role', () => {
      render(<BasicSidebar />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Sidebar Main', () => {
    it('renders main content', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicSidebar />);

      const main = screen.getByRole('group', { name: 'Main navigation' });
      expect(main).toBeInTheDocument();
    });
  });

  describe('Sidebar Footer', () => {
    it('renders footer content', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(FOOTER_ITEM_TEXT)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicSidebar />);

      const footer = screen.getByRole('group', { name: 'Footer navigation' });
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Sidebar Item', () => {
    it('renders item with text', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('renders item with leading icon', () => {
      render(<BasicSidebar />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('shows active state', () => {
      render(
        <BasicSidebar>
          <Sidebar.Item active data-testid='active-item'>
            Active Item
          </Sidebar.Item>
        </BasicSidebar>
      );

      const item = screen.getByTestId('active-item');
      expect(item).toHaveAttribute('data-active', 'true');
      expect(item).toHaveAttribute('aria-current', 'page');
    });

    it('shows disabled state', () => {
      render(
        <BasicSidebar>
          <Sidebar.Item disabled data-testid='disabled-item'>
            Disabled Item
          </Sidebar.Item>
        </BasicSidebar>
      );

      const item = screen.getByTestId('disabled-item');
      expect(item).toHaveAttribute('data-disabled', 'true');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });

    it('hides text when collapsed', () => {
      render(<BasicSidebar open={false} />);

      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation Group', () => {
    it('renders group label and leading icon', () => {
      render(<BasicSidebar />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText(MAIN_GROUP_LABEL)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicSidebar />);

      const group = screen.getByLabelText(MAIN_GROUP_LABEL);
      expect(group).toBeInTheDocument();
    });
  });
});
