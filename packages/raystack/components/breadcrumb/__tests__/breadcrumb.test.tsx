import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { Breadcrumb } from '../breadcrumb';
import styles from '../breadcrumb.module.css';

describe('Breadcrumb', () => {
  describe('BreadcrumbRoot', () => {
    it('renders as navigation element', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass(styles.breadcrumb);
    });

    it('renders ordered list', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const ol = container.querySelector('ol');
      expect(ol).toBeInTheDocument();
      expect(ol).toHaveClass(styles['breadcrumb-list']);
    });

    it('applies medium size by default', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass(styles['breadcrumb-medium']);
    });

    it('applies small size', () => {
      render(
        <Breadcrumb size='small'>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass(styles['breadcrumb-small']);
    });

    it('applies custom className', () => {
      render(
        <Breadcrumb className='custom-class'>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-class');
      expect(nav).toHaveClass(styles.breadcrumb);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Breadcrumb ref={ref}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('passes HTML attributes', () => {
      render(
        <Breadcrumb aria-label='Breadcrumb navigation' data-testid='breadcrumb'>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByTestId('breadcrumb');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders as list item with link', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item href='/home'>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const li = container.querySelector('li');
      expect(li).toBeInTheDocument();
      expect(li).toHaveClass(styles['breadcrumb-item']);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass(styles['breadcrumb-link']);
      expect(link).toHaveAttribute('href', '/home');
    });

    it('renders text content', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('renders with leading icon', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item leadingIcon={<span data-testid='icon'>🏠</span>}>
            Home
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass(styles['breadcrumb-icon']);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('applies current/active state', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item current>Current Page</Breadcrumb.Item>
        </Breadcrumb>
      );

      const link = container.querySelector('a');
      expect(link).toHaveClass(styles['breadcrumb-link-active']);
    });

    it('renders with custom element using as prop', () => {
      const CustomLink = ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
      );

      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item as={<CustomLink />}>Custom</Breadcrumb.Item>
        </Breadcrumb>
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(styles['breadcrumb-link']);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Breadcrumb>
          <Breadcrumb.Item ref={ref}>Item</Breadcrumb.Item>
        </Breadcrumb>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item className='custom-item'>Item</Breadcrumb.Item>
        </Breadcrumb>
      );

      const li = container.querySelector('li');
      expect(li).toHaveClass('custom-item');
      expect(li).toHaveClass(styles['breadcrumb-item']);
    });

    it('passes HTML attributes', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item data-testid='item' aria-label='Products'>
            Products
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('aria-label', 'Products');
    });
  });

  describe('BreadcrumbItem with Dropdown', () => {
    it('renders dropdown trigger when dropdownItems provided', () => {
      const items = [
        { label: 'Option 1', onClick: vi.fn() },
        { label: 'Option 2', onClick: vi.fn() }
      ];

      render(
        <Breadcrumb>
          <Breadcrumb.Item dropdownItems={items}>Categories</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Categories')).toBeInTheDocument();
      const trigger = document.querySelector(
        `.${styles['breadcrumb-dropdown-trigger']}`
      );
      expect(trigger).toBeInTheDocument();
    });

    it('shows dropdown icon', () => {
      const items = [{ label: 'Option 1' }];

      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item dropdownItems={items}>Menu</Breadcrumb.Item>
        </Breadcrumb>
      );

      const icon = container.querySelector(
        `.${styles['breadcrumb-dropdown-icon']}`
      );
      expect(icon).toBeInTheDocument();
    });

    it('renders dropdown items on click', () => {
      const items = [
        { label: 'Electronics' },
        { label: 'Clothing' },
        { label: 'Books' }
      ];

      render(
        <Breadcrumb>
          <Breadcrumb.Item dropdownItems={items}>Categories</Breadcrumb.Item>
        </Breadcrumb>
      );

      const trigger = document.querySelector(
        `.${styles['breadcrumb-dropdown-trigger']}`
      );
      fireEvent.click(trigger!);

      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });

    it('handles dropdown item clicks', () => {
      const handleClick = vi.fn();
      const items = [{ label: 'Option 1', onClick: handleClick }];

      render(
        <Breadcrumb>
          <Breadcrumb.Item dropdownItems={items}>Menu</Breadcrumb.Item>
        </Breadcrumb>
      );

      const trigger = document.querySelector(
        `.${styles['breadcrumb-dropdown-trigger']}`
      );
      fireEvent.click(trigger!);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders default separator', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('/')).toBeInTheDocument();
    });

    it('renders custom separator content', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Separator>→</Breadcrumb.Separator>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('applies separator styles', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Separator />
        </Breadcrumb>
      );

      const separator = container.querySelector(
        `.${styles['breadcrumb-separator']}`
      );
      expect(separator).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Separator className='custom-separator' />
        </Breadcrumb>
      );

      const separator = container.querySelector('.custom-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass(styles['breadcrumb-separator']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Breadcrumb>
          <Breadcrumb.Separator ref={ref} />
        </Breadcrumb>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('BreadcrumbEllipsis', () => {
    it('renders default ellipsis icon', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis />
        </Breadcrumb>
      );

      const ellipsis = container.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
      // Default icon is DotsHorizontalIcon
      expect(ellipsis?.querySelector('svg')).toBeInTheDocument();
    });

    it('renders custom ellipsis content', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis>...</Breadcrumb.Ellipsis>
        </Breadcrumb>
      );

      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('applies ellipsis styles', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis />
        </Breadcrumb>
      );

      const ellipsis = container.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis className='custom-ellipsis' />
        </Breadcrumb>
      );

      const ellipsis = container.querySelector('.custom-ellipsis');
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis).toHaveClass(styles['breadcrumb-ellipsis']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis ref={ref} />
        </Breadcrumb>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Complete Breadcrumb Examples', () => {
    it('renders full breadcrumb with multiple items and separators', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/products'>Products</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/products/electronics'>
            Electronics
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item current>Laptop</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getAllByText('/')).toHaveLength(3);
    });

    it('renders breadcrumb with ellipsis for long paths', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Ellipsis />
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/final'>Final</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Final')).toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('renders breadcrumb with icons and dropdown', () => {
      const categories = [
        { label: 'Electronics' },
        { label: 'Clothing' },
        { label: 'Books' }
      ];

      render(
        <Breadcrumb>
          <Breadcrumb.Item leadingIcon={<span>🏠</span>} href='/'>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item dropdownItems={categories}>
            Categories
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item current>Product</Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Product')).toBeInTheDocument();
    });
  });

  describe('Display Names', () => {
    it('has correct display names for all components', () => {
      expect(Breadcrumb.displayName).toBe('BreadcrumbRoot');
      expect(Breadcrumb.Item.displayName).toBe('BreadcrumbItem');
      expect(Breadcrumb.Separator.displayName).toBe('BreadcrumbSeparator');
      expect(Breadcrumb.Ellipsis.displayName).toBe('BreadcrumbEllipsis');
    });
  });
});
