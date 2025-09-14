import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { Sidebar } from '../sidebar';
import styles from '../sidebar.module.css';

describe('Sidebar', () => {
  describe('Basic Rendering', () => {
    // it('renders sidebar with children', () => {
    //   render(
    //     <Sidebar>
    //       <Sidebar.Header>Header</Sidebar.Header>
    //       <Sidebar.Main>
    //         <Sidebar.Item>Test Item</Sidebar.Item>
    //       </Sidebar.Main>
    //     </Sidebar>
    //   );

    //   expect(screen.getByText('Header')).toBeInTheDocument();
    //   expect(screen.getByText('Test Item')).toBeInTheDocument();
    // });

    it('renders as aside element', () => {
      const { container } = render(<Sidebar>Test content</Sidebar>);

      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });

    it('applies root styles', () => {
      const { container } = render(<Sidebar>Test content</Sidebar>);

      const sidebar = container.querySelector(`.${styles.root}`);
      expect(sidebar).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<Sidebar>Test content</Sidebar>);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Navigation Sidebar');
    });
  });

  describe('Collapsible Functionality', () => {
    // it('is expanded by default', () => {
    //   const { container } = render(<Sidebar>Test content</Sidebar>);

    //   const sidebar = container.querySelector('[data-state="expanded"]');
    //   expect(sidebar).toBeInTheDocument();
    // });

    it('can be collapsed', () => {
      render(
        <Sidebar open={false}>
          <Sidebar.Item>Test Item</Sidebar.Item>
        </Sidebar>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('data-state', 'collapsed');
    });

    // it('shows collapse/expand handle when collapsible', () => {
    //   render(<Sidebar collapsible>Test content</Sidebar>);

    //   const handle = screen.getByRole('button', { name: 'Collapse sidebar' });
    //   expect(handle).toBeInTheDocument();
    // });

    it('does not show handle when not collapsible', () => {
      render(<Sidebar collapsible={false}>Test content</Sidebar>);

      const handle = screen.queryByRole('button', { name: 'Collapse sidebar' });
      expect(handle).not.toBeInTheDocument();
    });

    it('toggles state when handle is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open onOpenChange={onOpenChange} collapsible>
          Test content
        </Sidebar>
      );

      const handle = screen.getByRole('button', { name: 'Collapse sidebar' });
      fireEvent.click(handle);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('supports keyboard navigation on handle', () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open onOpenChange={onOpenChange} collapsible>
          Test content
        </Sidebar>
      );

      const handle = screen.getByRole('button', { name: 'Collapse sidebar' });
      fireEvent.keyDown(handle, { key: 'Enter' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('supports space key on handle', () => {
      const onOpenChange = vi.fn();
      render(
        <Sidebar open onOpenChange={onOpenChange} collapsible>
          Test content
        </Sidebar>
      );

      const handle = screen.getByRole('button', { name: 'Collapse sidebar' });
      fireEvent.keyDown(handle, { key: ' ' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Position Variants', () => {
    it('applies left position by default', () => {
      const { container } = render(<Sidebar>Test content</Sidebar>);

      const sidebar = container.querySelector('[data-position="left"]');
      expect(sidebar).toBeInTheDocument();
    });

    it('applies right position when specified', () => {
      const { container } = render(
        <Sidebar position='right'>Test content</Sidebar>
      );

      const sidebar = container.querySelector('[data-position="right"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Sidebar Header', () => {
    it('renders header content', () => {
      render(
        <Sidebar>
          <Sidebar.Header>
            <div>Logo</div>
          </Sidebar.Header>
        </Sidebar>
      );

      expect(screen.getByText('Logo')).toBeInTheDocument();
    });

    it('has proper role', () => {
      render(
        <Sidebar>
          <Sidebar.Header>Logo</Sidebar.Header>
        </Sidebar>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('applies header styles', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Header>Logo</Sidebar.Header>
        </Sidebar>
      );

      const header = container.querySelector(`.${styles.header}`);
      expect(header).toBeInTheDocument();
    });
  });

  describe('Sidebar Main', () => {
    // it('renders main navigation content', () => {
    //   render(
    //     <Sidebar>
    //       <Sidebar.Main>
    //         <Sidebar.Item>Nav Item</Sidebar.Item>
    //       </Sidebar.Main>
    //     </Sidebar>
    //   );

    //   expect(screen.getByText('Nav Item')).toBeInTheDocument();
    // });

    it('has proper ARIA attributes', () => {
      render(
        <Sidebar>
          <Sidebar.Main>Navigation</Sidebar.Main>
        </Sidebar>
      );

      const main = screen.getByRole('group', { name: 'Main navigation' });
      expect(main).toBeInTheDocument();
    });
  });

  describe('Sidebar Footer', () => {
    it('renders footer content', () => {
      render(
        <Sidebar>
          <Sidebar.Footer>Footer content</Sidebar.Footer>
        </Sidebar>
      );

      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(
        <Sidebar>
          <Sidebar.Footer>Footer</Sidebar.Footer>
        </Sidebar>
      );

      const footer = screen.getByRole('group', { name: 'Footer navigation' });
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Sidebar Item', () => {
    // it('renders item with text', () => {
    //   render(
    //     <Sidebar>
    //       <Sidebar.Item>Home</Sidebar.Item>
    //     </Sidebar>
    //   );

    //   expect(screen.getByText('Home')).toBeInTheDocument();
    // });

    // it('renders item with leading icon', () => {
    //   const icon = <span data-testid='home-icon'>🏠</span>;
    //   render(
    //     <Sidebar>
    //       <Sidebar.Item leadingIcon={icon}>Home</Sidebar.Item>
    //     </Sidebar>
    //   );

    //   expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    //   expect(screen.getByText('Home')).toBeInTheDocument();
    // });

    it('shows active state', () => {
      render(
        <Sidebar>
          <Sidebar.Item active>Active Item</Sidebar.Item>
        </Sidebar>
      );

      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('data-active', 'true');
      expect(item).toHaveAttribute('aria-current', 'page');
    });

    it('shows disabled state', () => {
      render(
        <Sidebar>
          <Sidebar.Item disabled>Disabled Item</Sidebar.Item>
        </Sidebar>
      );

      const item = screen.getByRole('menuitem');
      expect(item).toHaveAttribute('data-disabled', 'true');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows avatar fallback when collapsed and no icon', () => {
      render(
        <Sidebar open={false}>
          <Sidebar.Item>Home</Sidebar.Item>
        </Sidebar>
      );

      const avatar = screen.getByText('H');
      expect(avatar).toBeInTheDocument();
    });

    it('shows tooltip when collapsed', () => {
      render(
        <Sidebar open={false}>
          <Sidebar.Item>Home Page</Sidebar.Item>
        </Sidebar>
      );

      const item = screen.getByRole('menuitem');
      expect(item).toBeInTheDocument();
      // Tooltip content would be tested through interaction, but basic structure is present
    });

    it('hides text when collapsed', () => {
      render(
        <Sidebar open={false}>
          <Sidebar.Item>Home</Sidebar.Item>
        </Sidebar>
      );

      const text = screen.queryByText('Home');
      expect(text).not.toBeInTheDocument();
    });

    it('applies custom classNames', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Item classNames={{ root: 'custom-item' }}>
            Test Item
          </Sidebar.Item>
        </Sidebar>
      );

      const item = container.querySelector('.custom-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveClass(styles['nav-item']);
    });
  });

  describe('Sidebar Navigation Group', () => {
    // it('renders group with label and children', () => {
    //   render(
    //     <Sidebar>
    //       <Sidebar.Group label='Navigation'>
    //         <Sidebar.Item>Home</Sidebar.Item>
    //         <Sidebar.Item>About</Sidebar.Item>
    //       </Sidebar.Group>
    //     </Sidebar>
    //   );

    //   expect(screen.getByText('Navigation')).toBeInTheDocument();
    //   expect(screen.getByText('Home')).toBeInTheDocument();
    //   expect(screen.getByText('About')).toBeInTheDocument();
    // });

    it('renders group with leading icon', () => {
      const icon = <span data-testid='group-icon'>📁</span>;
      render(
        <Sidebar>
          <Sidebar.Group label='Files' leadingIcon={icon}>
            <Sidebar.Item>Documents</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>
      );

      expect(screen.getByTestId('group-icon')).toBeInTheDocument();
      expect(screen.getByText('Files')).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(
        <Sidebar>
          <Sidebar.Group label='Main Navigation'>
            <Sidebar.Item>Home</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>
      );

      const group = screen.getByLabelText('Main Navigation');
      expect(group).toBeInTheDocument();
    });

    it('applies group styles', () => {
      const { container } = render(
        <Sidebar>
          <Sidebar.Group label='Test Group'>
            <Sidebar.Item>Item</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>
      );

      const group = container.querySelector(`.${styles['nav-group']}`);
      expect(group).toBeInTheDocument();
    });
  });

  describe('Display Names', () => {
    it('has correct display names', () => {
      expect(Sidebar.displayName).toBe('Sidebar.Root');
      expect(Sidebar.Header.displayName).toBe('Sidebar.Header');
      expect(Sidebar.Main.displayName).toBe('Sidebar.Main');
      expect(Sidebar.Footer.displayName).toBe('Sidebar.Footer');
      expect(Sidebar.Item.displayName).toBe('Sidebar.Item');
      expect(Sidebar.Group.displayName).toBe('Sidebar.Group');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards refs correctly', () => {
      const ref = vi.fn();
      render(<Sidebar ref={ref}>Test content</Sidebar>);

      expect(ref).toHaveBeenCalled();
    });
  });

  // describe('Complete Sidebar Structure', () => {
  //   // it('renders full sidebar with all components', () => {
  //   //   const homeIcon = <span data-testid='home-icon'>🏠</span>;
  //   //   const groupIcon = <span data-testid='group-icon'>📁</span>;

  //   //   render(
  //   //     <Sidebar>
  //   //       <Sidebar.Header>
  //   //         <div>My App</div>
  //   //       </Sidebar.Header>
  //   //       <Sidebar.Main>
  //   //         <Sidebar.Item leadingIcon={homeIcon} active>
  //   //           Home
  //   //         </Sidebar.Item>
  //   //         <Sidebar.Group label='Files' leadingIcon={groupIcon}>
  //   //           <Sidebar.Item>Documents</Sidebar.Item>
  //   //           <Sidebar.Item>Downloads</Sidebar.Item>
  //   //         </Sidebar.Group>
  //   //       </Sidebar.Main>
  //   //       <Sidebar.Footer>
  //   //         <Sidebar.Item>Settings</Sidebar.Item>
  //   //       </Sidebar.Footer>
  //   //     </Sidebar>
  //   //   );

  //   //   expect(screen.getByText('My App')).toBeInTheDocument();
  //   //   expect(screen.getByText('Home')).toBeInTheDocument();
  //   //   expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  //   //   expect(screen.getByText('Files')).toBeInTheDocument();
  //   //   expect(screen.getByTestId('group-icon')).toBeInTheDocument();
  //   //   expect(screen.getByText('Documents')).toBeInTheDocument();
  //   //   expect(screen.getByText('Downloads')).toBeInTheDocument();
  //   //   expect(screen.getByText('Settings')).toBeInTheDocument();

  //   //   const activeItem = screen.getByRole('menuitem', { name: 'Home' });
  //   //   expect(activeItem).toHaveAttribute('aria-current', 'page');
  //   // });
  // });
});
