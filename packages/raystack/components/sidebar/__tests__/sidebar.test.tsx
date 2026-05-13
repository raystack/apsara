import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from '../sidebar';
import styles from '../sidebar.module.css';
import { SidebarRootProps } from '../sidebar-root';

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
}: SidebarRootProps) => (
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
      expect(nav).toHaveAttribute('data-closed');
      expect(nav).not.toHaveAttribute('data-open');
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

    it('applies floating variant when specified', () => {
      const { container } = render(<BasicSidebar variant='floating' />);

      const sidebar = container.querySelector('[data-variant="floating"]');
      expect(sidebar).toBeInTheDocument();
    });

    it('applies inset variant when specified', () => {
      const { container } = render(<BasicSidebar variant='inset' />);

      const sidebar = container.querySelector('[data-variant="inset"]');
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

      const footer = screen.getByRole('list', { name: 'Footer navigation' });
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

    it('renders custom element via render prop', () => {
      render(
        <BasicSidebar>
          <Sidebar.Item render={<button />} data-testid='custom-render-item'>
            Custom Item
          </Sidebar.Item>
        </BasicSidebar>
      );

      const item = screen.getByTestId('custom-render-item');
      expect(item.tagName).toBe('BUTTON');
      // role="listitem" is not applied — items rely on their native semantics
      expect(item).not.toHaveAttribute('role');
      expect(item).toHaveTextContent('Custom Item');
    });

    it('hides text when collapsed and sets aria-label for screen readers', () => {
      render(<BasicSidebar open={false} />);

      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();
      const dashboardLink = screen.getByLabelText(DASHBOARD_ITEM_TEXT);
      expect(dashboardLink).toHaveAttribute('aria-label', DASHBOARD_ITEM_TEXT);
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

    it('renders collapsible trigger when collapsible is enabled', () => {
      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              leadingIcon={<TestIcon />}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      const trigger = screen.getByRole('button', { name: /Main/ });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-panel-open');
    });

    it('toggles group items when collapsible is enabled', () => {
      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              leadingIcon={<TestIcon />}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      const trigger = screen.getByRole('button', { name: /Main/ });
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('forces collapsible panel open when sidebar is collapsed', () => {
      const { rerender } = render(
        <Sidebar open>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              leadingIcon={<TestIcon />}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      const trigger = screen.getByRole('button', { name: /Main/ });
      fireEvent.click(trigger);
      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();

      rerender(
        <Sidebar open={false}>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              leadingIcon={<TestIcon />}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      expect(screen.getByLabelText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('renders right icon when provided in collapsible header', () => {
      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              trailingIcon={<span data-testid='group-trailing-icon'>+</span>}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      expect(screen.getByTestId('group-trailing-icon')).toBeInTheDocument();
    });

    it('does not toggle collapsible when trailing icon is clicked', () => {
      const onTrailingIconClick = vi.fn();

      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              trailingIcon={
                <button
                  type='button'
                  data-testid='group-trailing-action'
                  onClick={onTrailingIconClick}
                >
                  +
                </button>
              }
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      const trigger = screen.getByRole('button', { name: /Main/ });
      expect(trigger).toHaveAttribute('data-panel-open');

      fireEvent.click(screen.getByTestId('group-trailing-action'));

      expect(onTrailingIconClick).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveAttribute('data-panel-open');
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });
  });

  describe('Sidebar More', () => {
    it('renders More trigger and opens menu items', () => {
      render(
        <BasicSidebar>
          <Sidebar.More label='More items'>
            <Sidebar.Item href='#'>Logs</Sidebar.Item>
            <Sidebar.Item href='#'>Audit</Sidebar.Item>
          </Sidebar.More>
        </BasicSidebar>
      );

      const trigger = screen.getByText('More items').closest('button');
      expect(trigger).toBeInTheDocument();
      if (!trigger) return;
      fireEvent.click(trigger);

      expect(screen.getByText('Logs')).toBeInTheDocument();
      expect(screen.getByText('Audit')).toBeInTheDocument();
    });

    it('sets aria-label for collapsed More trigger', () => {
      render(
        <BasicSidebar open={false}>
          <Sidebar.More label='Overflow'>
            <Sidebar.Item href='#'>Logs</Sidebar.Item>
          </Sidebar.More>
        </BasicSidebar>
      );

      const trigger = screen.getByRole('listitem', { name: 'Overflow' });
      expect(trigger).toHaveAttribute('aria-label', 'Overflow');
    });
  });
});
