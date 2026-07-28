import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from '../sidebar';
import styles from '../sidebar.module.css';
import { SidebarRootProps, useSidebar } from '../sidebar-root';

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

    it('shows a custom handle tooltip via collapseTooltip', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar open collapseTooltip='Toggle navigation' />);

      await user.hover(screen.getByRole('button', { name: COLLAPSE_TEXT }));

      await waitFor(() => {
        expect(screen.getByText('Toggle navigation')).toBeInTheDocument();
      });
    });

    it('still honors the deprecated tooltipMessage prop', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar open tooltipMessage='Legacy tooltip' />);

      await user.hover(screen.getByRole('button', { name: COLLAPSE_TEXT }));

      await waitFor(() => {
        expect(screen.getByText('Legacy tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('collapseMode', () => {
    it('defaults to icon rail collapse (unchanged behavior)', () => {
      const { container } = render(<BasicSidebar open={false} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-collapse-mode', 'icon');
      expect(nav).not.toHaveAttribute('data-floating');
      expect(container.querySelector(`.${styles.backdrop}`)).toBeNull();
    });

    it('hides header/main/footer content when collapsed and hidden', () => {
      render(<BasicSidebar open={false} collapseMode='hidden' />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-collapse-mode', 'hidden');
      expect(nav).not.toHaveAttribute('data-floating');
    });

    it('renders as a floating panel with a backdrop when opened', () => {
      const { container } = render(<BasicSidebar open collapseMode='hidden' />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-floating');
      const backdrop = container.querySelector(`.${styles.backdrop}`);
      expect(backdrop).toHaveAttribute('data-open');
    });

    it('closes when the backdrop is clicked', () => {
      const onOpenChange = vi.fn();
      const { container } = render(
        <BasicSidebar open collapseMode='hidden' onOpenChange={onOpenChange} />
      );

      const backdrop = container.querySelector(`.${styles.backdrop}`);
      expect(backdrop).not.toBeNull();
      fireEvent.click(backdrop!);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('closes on Escape while floating', () => {
      const onOpenChange = vi.fn();
      render(
        <BasicSidebar open collapseMode='hidden' onOpenChange={onOpenChange} />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('peekOnHover', () => {
    const PeekStatus = () => {
      const { isCollapsed, isPeeking } = useSidebar();
      return (
        <div data-testid='peek-status'>
          {isCollapsed ? 'collapsed' : 'expanded'}:
          {isPeeking ? 'peeking' : 'not-peeking'}
        </div>
      );
    };

    it('reveals a collapsed sidebar on hover without changing open state', async () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open={false} peekOnHover onOpenChange={onOpenChange}>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      expect(screen.getByTestId('peek-status')).toHaveTextContent(
        'collapsed:not-peeking'
      );

      fireEvent.mouseEnter(nav);

      await waitFor(() => {
        expect(screen.getByTestId('peek-status')).toHaveTextContent(
          'expanded:peeking'
        );
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('reverts when the mouse leaves', async () => {
      render(
        <Sidebar open={false} peekOnHover>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);
      await waitFor(() => {
        expect(screen.getByTestId('peek-status')).toHaveTextContent(
          'expanded:peeking'
        );
      });

      fireEvent.mouseLeave(nav);
      expect(screen.getByTestId('peek-status')).toHaveTextContent(
        'collapsed:not-peeking'
      );
    });

    it('pins the sidebar open when the handle is clicked while peeking', async () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open={false} peekOnHover onOpenChange={onOpenChange}>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);
      await waitFor(() => {
        expect(screen.getByTestId('peek-status')).toHaveTextContent(
          'expanded:peeking'
        );
      });

      // `open` is still false during a peek, so the handle still reads as
      // "Expand sidebar" — clicking it pins the sidebar open for real.
      const handle = screen.getByRole('button', { name: 'Expand sidebar' });
      fireEvent.click(handle);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('flips the visual open state so collapse-hiding styles turn off', async () => {
      render(
        <Sidebar open={false} peekOnHover>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);

      await waitFor(() => {
        expect(nav).toHaveAttribute('data-floating');
      });
      // data-open/data-closed track the visual state (peek counts as open);
      // the real state stays on aria-expanded.
      expect(nav).toHaveAttribute('data-open');
      expect(nav).not.toHaveAttribute('data-closed');
      expect(nav).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows the floating panel content when peeking with collapseMode="hidden"', async () => {
      render(
        <Sidebar open={false} peekOnHover collapseMode='hidden'>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);

      await waitFor(() => {
        expect(nav).toHaveAttribute('data-floating');
      });
      // Regression: the hidden-mode hiding rules key off data-closed, which
      // must clear during a peek or the panel reveals 8px wide and empty.
      expect(nav).not.toHaveAttribute('data-closed');
    });

    it('stops floating once the sidebar is pinned open while peeking', async () => {
      render(
        <Sidebar defaultOpen={false} peekOnHover>
          <PeekStatus />
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);
      await waitFor(() => {
        expect(nav).toHaveAttribute('data-floating');
      });

      fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));

      // Opening for real supersedes the peek — the sidebar must return to
      // the layout flow immediately, not stay a fixed overlay.
      expect(nav).not.toHaveAttribute('data-floating');
      expect(screen.getByTestId('peek-status')).toHaveTextContent(
        'expanded:not-peeking'
      );
    });

    it('holds the peek while a Sidebar.More menu is open', async () => {
      render(
        <Sidebar open={false} peekOnHover>
          <PeekStatus />
          <Sidebar.Main>
            <Sidebar.More label='Overflow'>
              <Sidebar.Item href='#'>Extra</Sidebar.Item>
            </Sidebar.More>
          </Sidebar.Main>
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      fireEvent.mouseEnter(nav);
      await waitFor(() => {
        expect(screen.getByTestId('peek-status')).toHaveTextContent(
          'expanded:peeking'
        );
      });

      fireEvent.click(screen.getByText('Overflow').closest('button')!);
      expect(screen.getByText('Extra')).toBeInTheDocument();

      // The menu portals to document.body, so moving the pointer into it
      // fires mouseleave on the sidebar — the peek must survive that.
      fireEvent.mouseLeave(nav);

      expect(screen.getByTestId('peek-status')).toHaveTextContent(
        'expanded:peeking'
      );

      // Once the menu closes with the pointer still outside, the peek ends.
      fireEvent.keyDown(document.activeElement ?? document, {
        key: 'Escape'
      });
      await waitFor(() => {
        expect(screen.getByTestId('peek-status')).toHaveTextContent(
          'collapsed:not-peeking'
        );
      });
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

    it('does not expose a banner landmark', () => {
      render(<BasicSidebar />);

      // banner is a page-level landmark and must not be nested in the nav
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar Main', () => {
    it('renders main content', () => {
      render(<BasicSidebar />);

      expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<BasicSidebar />);

      const main = screen.getByRole('list', { name: 'Main navigation' });
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
      expect(item).toHaveAttribute('role', 'listitem');
      expect(item).toHaveTextContent('Custom Item');
    });

    it('keeps text mounted and sets aria-label when collapsed', () => {
      render(<BasicSidebar open={false} />);

      // The label stays mounted so it can collapse with the sidebar (CSS hides
      // it); the item is named via aria-label so screen readers still get it.
      const dashboardLink = screen.getByRole('listitem', {
        name: DASHBOARD_ITEM_TEXT
      });
      expect(dashboardLink).toHaveAttribute('aria-label', DASHBOARD_ITEM_TEXT);
    });

    it('shows a tooltip with the full label when the text is clipped', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar />);

      const text = screen.getByText(HELP_ITEM_TEXT);
      // jsdom has no layout, so simulate a clipped label
      Object.defineProperty(text, 'scrollWidth', {
        value: 300,
        configurable: true
      });
      Object.defineProperty(text, 'clientWidth', {
        value: 100,
        configurable: true
      });

      await user.hover(text.closest('a')!);

      await waitFor(() => {
        // label + tooltip content
        expect(screen.getAllByText(HELP_ITEM_TEXT)).toHaveLength(2);
      });
    });

    it('does not show a tooltip when the label is not clipped', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar />);

      const text = screen.getByText(HELP_ITEM_TEXT);
      // jsdom default: scrollWidth === clientWidth → not clipped
      await user.hover(text.closest('a')!);

      // wait out the tooltip open delay (200ms)
      await act(() => new Promise(resolve => setTimeout(resolve, 300)));
      expect(screen.getAllByText(HELP_ITEM_TEXT)).toHaveLength(1);
    });

    it('suppresses the clipped-label tooltip via hideCollapsedItemTooltip', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar hideCollapsedItemTooltip />);

      const text = screen.getByText(HELP_ITEM_TEXT);
      Object.defineProperty(text, 'scrollWidth', {
        value: 300,
        configurable: true
      });
      Object.defineProperty(text, 'clientWidth', {
        value: 100,
        configurable: true
      });

      await user.hover(text.closest('a')!);

      // wait out the tooltip open delay (200ms)
      await act(() => new Promise(resolve => setTimeout(resolve, 300)));
      expect(screen.getAllByText(HELP_ITEM_TEXT)).toHaveLength(1);
    });

    it('opens the clipped-label tooltip away from a right-positioned sidebar', async () => {
      const user = userEvent.setup();
      render(<BasicSidebar position='right' />);

      const text = screen.getByText(HELP_ITEM_TEXT);
      Object.defineProperty(text, 'scrollWidth', {
        value: 300,
        configurable: true
      });
      Object.defineProperty(text, 'clientWidth', {
        value: 100,
        configurable: true
      });

      await user.hover(text.closest('a')!);

      await waitFor(() => {
        expect(screen.getAllByText(HELP_ITEM_TEXT)).toHaveLength(2);
      });
      const tooltip = screen
        .getAllByText(HELP_ITEM_TEXT)
        .map(el => el.closest('[data-side]'))
        .find(Boolean);
      expect(tooltip).toHaveAttribute('data-side', 'left');
    });

    it('renders standalone outside a Sidebar without crashing', () => {
      render(<Sidebar.Item href='#'>Alone</Sidebar.Item>);

      expect(screen.getByText('Alone')).toBeInTheDocument();
    });
  });

  describe('Sidebar Navigation Group', () => {
    it('renders group label and leading icon', () => {
      render(<BasicSidebar />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText(MAIN_GROUP_LABEL)).toBeInTheDocument();
    });

    it('participates in the main list as a list item', () => {
      render(<BasicSidebar />);

      // Groups are listitem children of Sidebar.Main's list (ul > li > ul),
      // not sections, so the list structure stays valid.
      const group = screen.getByRole('listitem', { name: MAIN_GROUP_LABEL });
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

      expect(
        screen.getByRole('listitem', { name: DASHBOARD_ITEM_TEXT })
      ).toBeInTheDocument();
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

    it('respects defaultOpen=false for uncontrolled collapsible group', () => {
      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              defaultOpen={false}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      const trigger = screen.getByRole('button', { name: /Main/ });
      expect(trigger).not.toHaveAttribute('data-panel-open');
      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();
    });

    it('controls open state via open prop and fires onOpenChange', () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              open={false}
              onOpenChange={onOpenChange}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();

      const trigger = screen.getByRole('button', { name: /Main/ });
      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();

      rerender(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              open={true}
              onOpenChange={onOpenChange}
            >
              <Sidebar.Item href='#' leadingIcon={<InfoIcon />}>
                {DASHBOARD_ITEM_TEXT}
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>
      );

      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
    });

    it('fires onOpenChange when uncontrolled group is toggled', () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar>
          <Sidebar.Main>
            <Sidebar.Group
              label={MAIN_GROUP_LABEL}
              collapsible
              onOpenChange={onOpenChange}
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
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      expect(screen.queryByText(DASHBOARD_ITEM_TEXT)).not.toBeInTheDocument();

      fireEvent.click(trigger);
      expect(onOpenChange).toHaveBeenLastCalledWith(true);
      expect(screen.getByText(DASHBOARD_ITEM_TEXT)).toBeInTheDocument();
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

    it('marks the keyboard-focused More item with data-highlighted', async () => {
      const user = userEvent.setup();
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
      trigger.focus();
      await user.keyboard('{Enter}');

      const items = await screen.findAllByRole('menuitem');
      expect(items.length).toBeGreaterThan(0);
      await user.keyboard('{ArrowDown}');

      // The CSS keys the keyboard highlight off [data-highlighted]; exactly
      // one item should carry it as focus moves through the menu.
      const highlighted = items.filter(el =>
        el.hasAttribute('data-highlighted')
      );
      expect(highlighted).toHaveLength(1);
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

  describe('Sidebar Trigger', () => {
    it('toggles an uncontrolled sidebar without the consumer managing state', () => {
      render(
        <Sidebar defaultOpen>
          <Sidebar.Header>
            <Sidebar.Trigger data-testid='sidebar-trigger' />
          </Sidebar.Header>
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      const trigger = screen.getByTestId('sidebar-trigger');
      expect(nav).toHaveAttribute('data-open');
      expect(trigger).toHaveAttribute('aria-label', 'Collapse sidebar');

      fireEvent.click(trigger);
      expect(nav).toHaveAttribute('data-closed');
      expect(trigger).toHaveAttribute('aria-label', 'Expand sidebar');

      fireEvent.click(trigger);
      expect(nav).toHaveAttribute('data-open');
    });

    it('calls onOpenChange when the sidebar is controlled', () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open onOpenChange={onOpenChange}>
          <Sidebar.Header>
            <Sidebar.Trigger data-testid='sidebar-trigger' />
          </Sidebar.Header>
        </Sidebar>
      );

      fireEvent.click(screen.getByTestId('sidebar-trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('is disabled when the sidebar is not collapsible', () => {
      render(
        <Sidebar defaultOpen collapsible={false}>
          <Sidebar.Header>
            <Sidebar.Trigger data-testid='sidebar-trigger' />
          </Sidebar.Header>
        </Sidebar>
      );

      expect(screen.getByTestId('sidebar-trigger')).toBeDisabled();
    });

    it('accepts a custom icon and aria-label', () => {
      render(
        <Sidebar defaultOpen>
          <Sidebar.Header>
            <Sidebar.Trigger aria-label='Toggle navigation'>
              <span data-testid='custom-trigger-icon' />
            </Sidebar.Trigger>
          </Sidebar.Header>
        </Sidebar>
      );

      expect(screen.getByTestId('custom-trigger-icon')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Toggle navigation' })
      ).toBeInTheDocument();
    });
  });

  describe('useSidebar', () => {
    const CollapseStatus = () => {
      const { isCollapsed, open, position, collapsible } = useSidebar();
      return (
        <div
          data-testid='collapse-status'
          data-position={position}
          data-collapsible={collapsible}
        >
          {isCollapsed ? 'collapsed' : 'expanded'}:{open ? 'open' : 'closed'}
        </div>
      );
    };

    it('exposes the collapsed state to custom children', () => {
      render(
        <Sidebar defaultOpen>
          <Sidebar.Header>
            <CollapseStatus />
            <Sidebar.Trigger data-testid='sidebar-trigger' />
          </Sidebar.Header>
        </Sidebar>
      );

      const status = screen.getByTestId('collapse-status');
      expect(status).toHaveTextContent('expanded:open');
      expect(status).toHaveAttribute('data-position', 'left');
      expect(status).toHaveAttribute('data-collapsible', 'true');

      fireEvent.click(screen.getByTestId('sidebar-trigger'));
      expect(status).toHaveTextContent('collapsed:closed');
    });

    it('allows custom children to toggle the sidebar via setOpen', () => {
      const ToggleButton = () => {
        const { open, setOpen } = useSidebar();
        return (
          <button data-testid='custom-toggle' onClick={() => setOpen(!open)}>
            toggle
          </button>
        );
      };

      render(
        <Sidebar defaultOpen>
          <Sidebar.Header>
            <ToggleButton />
          </Sidebar.Header>
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-open');

      fireEvent.click(screen.getByTestId('custom-toggle'));
      expect(nav).toHaveAttribute('data-closed');
    });

    it('throws when used outside of a Sidebar', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() => render(<CollapseStatus />)).toThrow(
        'useSidebar must be used inside of a <Sidebar> provider'
      );
      spy.mockRestore();
    });
  });
});
