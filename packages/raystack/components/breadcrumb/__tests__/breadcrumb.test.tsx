import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

    it('renders medium size by default', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass(styles['breadcrumb-medium']);
    });

    it('renders small size', () => {
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

    it('renders with trailing icon', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item
            trailingIcon={<span data-testid='trailing-icon'>▶</span>}
          >
            Next
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const icon = screen.getByTestId('trailing-icon');
      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass(styles['breadcrumb-icon']);
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('renders with both leading and trailing icons', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item
            leadingIcon={<span data-testid='leading'>L</span>}
            trailingIcon={<span data-testid='trailing'>T</span>}
          >
            Label
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const leading = screen.getByTestId('leading');
      const trailing = screen.getByTestId('trailing');
      const label = screen.getByText('Label');

      expect(leading).toBeInTheDocument();
      expect(trailing).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(leading.parentElement).toHaveClass(styles['breadcrumb-icon']);
      expect(trailing.parentElement).toHaveClass(styles['breadcrumb-icon']);

      const link = container.querySelector(`.${styles['breadcrumb-link']}`);
      const iconWrappers = link?.querySelectorAll(
        `.${styles['breadcrumb-icon']}`
      );
      expect(iconWrappers).toHaveLength(2);
      expect(iconWrappers?.[0]).toContainElement(leading);
      expect(iconWrappers?.[1]).toContainElement(trailing);
      expect(link?.textContent).toMatch(/L\s*Label\s*T/);
    });

    it('applies current/active state and renders as span with aria-current', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item current>Current Page</Breadcrumb.Item>
        </Breadcrumb>
      );

      const link = container.querySelector('a');
      expect(link).not.toBeInTheDocument();

      const span = container.querySelector(
        `span.${styles['breadcrumb-link-active']}`
      );
      expect(span).toBeInTheDocument();
      expect(span).toHaveClass(styles['breadcrumb-link']);
      expect(span).toHaveClass(styles['breadcrumb-link-active']);
      expect(span).toHaveAttribute('aria-current', 'page');
      expect(span).toHaveTextContent('Current Page');
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
      expect(link).toHaveAttribute('data-testid', 'item');
    });

    it('renders as span with disabled styles when disabled', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item disabled>Loading…</Breadcrumb.Item>
        </Breadcrumb>
      );

      const link = container.querySelector('a');
      expect(link).not.toBeInTheDocument();

      const span = container.querySelector(
        `span.${styles['breadcrumb-link-disabled']}`
      );
      expect(span).toBeInTheDocument();
      expect(span).toHaveClass(styles['breadcrumb-link']);
      expect(span).toHaveClass(styles['breadcrumb-link-disabled']);
      expect(span).toHaveAttribute('aria-disabled', 'true');
      expect(span).toHaveTextContent('Loading…');
    });

    it('disabled item has no href and is not focusable as link', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item disabled href='/skipped'>
            No access
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const span = container.querySelector(
        `span.${styles['breadcrumb-link-disabled']}`
      );
      expect(span).toBeInTheDocument();
      expect(container.querySelector('a')).not.toBeInTheDocument();
    });

    it('disabled with dropdownItems renders as disabled span not dropdown', () => {
      const items = [
        { label: 'Option 1', onClick: vi.fn() },
        { label: 'Option 2', onClick: vi.fn() }
      ];
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item disabled dropdownItems={items}>
            Categories
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const span = container.querySelector(
        `span.${styles['breadcrumb-link-disabled']}`
      );
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('Categories');
      fireEvent.click(span!);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
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
          <Breadcrumb.Item dropdownItems={items} data-testid='breadcrumb-item'>
            Categories
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Categories')).toBeInTheDocument();
      const trigger = screen.getByText('Categories');
      expect(trigger).toBeInTheDocument();
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

      const trigger = screen.getByText('Categories');

      fireEvent.click(trigger!);

      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders default separator', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
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

    it('has role="presentation" and aria-hidden="true" for screen readers', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
      );

      const separator = container.querySelector(
        `.${styles['breadcrumb-separator']}`
      );
      expect(separator).toHaveAttribute('role', 'presentation');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('BreadcrumbEllipsis', () => {
    it('renders default ellipsis icon', () => {
      const { container } = render(
        <Breadcrumb>
          <Breadcrumb.Ellipsis data-testid='breadcrumb-ellipsis' />
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId('breadcrumb-ellipsis');
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
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
          <Breadcrumb.Item href='/products'>Products</Breadcrumb.Item>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
          <Breadcrumb.Item href='/products/electronics'>
            Electronics
          </Breadcrumb.Item>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
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

  describe('maxItems auto-collapse', () => {
    // API: maxItems (required for collapse) + optional itemsBeforeCollapse. After count is always derived (maxItems - before); at least 1 item is shown after the ellipsis when there are hidden items.
    it('renders all items when item count is less than or equal to maxItems', () => {
      render(
        <Breadcrumb maxItems={5}>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b' current>
            B
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).not.toBeInTheDocument();
    });

    it('collapses middle items when item count exceeds maxItems', () => {
      render(
        <Breadcrumb maxItems={3}>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/products'>Products</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/electronics'>Electronics</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/laptops' current>
            Laptops
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      // maxItems=3 → 1 before, 2 after: Home, ..., Electronics, Laptops
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Laptops')).toBeInTheDocument();
      expect(screen.queryByText('Products')).not.toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('respects itemsBeforeCollapse (after count derived from maxItems)', () => {
      render(
        <Breadcrumb maxItems={3} itemsBeforeCollapse={2}>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b'>B</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/c' current>
            C
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('shows at least 1 item after ellipsis when before uses full budget (4 before, 1 after)', () => {
      render(
        <Breadcrumb maxItems={5} itemsBeforeCollapse={5}>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>Products</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b'>Electronics</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/c'>Laptops</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/d'>Gaming</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/e'>Accessories</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/f' current>
            Footwear
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Laptops')).toBeInTheDocument();
      expect(screen.queryByText('Gaming')).not.toBeInTheDocument();
      expect(screen.queryByText('Accessories')).not.toBeInTheDocument();
      expect(screen.getByText('Footwear')).toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('uses custom separator when collapsed', () => {
      render(
        <Breadcrumb maxItems={2}>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator>|</Breadcrumb.Separator>
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator>|</Breadcrumb.Separator>
          <Breadcrumb.Item href='/b' current>
            B
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      const separators = screen.getAllByText('|');
      expect(separators.length).toBeGreaterThanOrEqual(2);
    });

    it('renders as normal when maxItems is not set (backward compatibility)', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b'>B</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/c' current>
            C
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).not.toBeInTheDocument();
    });

    it('collapses when children are passed via a Fragment (e.g. {trail})', () => {
      const trail = (
        <>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b' current>
            B
          </Breadcrumb.Item>
        </>
      );
      render(<Breadcrumb maxItems={2}>{trail}</Breadcrumb>);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('treats negative maxItems (e.g. -10) as 2 and collapses', () => {
      const trail = (
        <>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b' current>
            B
          </Breadcrumb.Item>
        </>
      );
      render(<Breadcrumb maxItems={-10}>{trail}</Breadcrumb>);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });

    it('treats maxItems=1 as 2 (1 before, 1 after) so collapse always shows first + last', () => {
      const trail = (
        <>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/a'>A</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/b' current>
            B
          </Breadcrumb.Item>
        </>
      );
      render(<Breadcrumb maxItems={1}>{trail}</Breadcrumb>);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      const ellipsis = document.querySelector(
        `.${styles['breadcrumb-ellipsis']}`
      );
      expect(ellipsis).toBeInTheDocument();
    });
  });
});
