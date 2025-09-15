import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../badge';
import styles from '../badge.module.css';

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('renders with children text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
      expect(badge?.tagName).toBe('SPAN');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Badge className='custom-badge'>Custom</Badge>
      );
      const badge = container.querySelector('.custom-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(styles.badge);
    });

    it('renders with multiple children', () => {
      render(
        <Badge>
          <span>Count:</span> 5
        </Badge>
      );
      expect(screen.getByText('Count:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants = [
      'accent',
      'warning',
      'danger',
      'success',
      'neutral',
      'gradient'
    ] as const;

    it.each(variants)('renders %s variant correctly', variant => {
      const { container } = render(<Badge variant={variant}>Badge</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles[`badge-${variant}`]);
    });

    it('defaults to accent variant', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles['badge-accent']);
    });
  });

  describe('Sizes', () => {
    const sizes = ['micro', 'small', 'regular'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      const { container } = render(<Badge size={size}>Badge</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles[`badge-${size}`]);
    });

    it('defaults to small size', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles['badge-small']);
    });
  });

  describe('Icon Support', () => {
    it('renders with icon', () => {
      const icon = <svg data-testid='badge-icon' />;
      render(<Badge icon={icon}>With Icon</Badge>);

      expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('wraps icon in icon span', () => {
      const icon = <svg data-testid='badge-icon' />;
      const { container } = render(<Badge icon={icon}>Badge</Badge>);

      const iconWrapper = container.querySelector(`.${styles.icon}`);
      expect(iconWrapper).toBeInTheDocument();
      expect(
        iconWrapper?.querySelector('[data-testid="badge-icon"]')
      ).toBeInTheDocument();
    });

    it('renders without icon when not provided', () => {
      const { container } = render(<Badge>No Icon</Badge>);
      const iconWrapper = container.querySelector(`.${styles.icon}`);
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it('renders complex icon components', () => {
      const ComplexIcon = () => <span data-testid='complex-icon'>★</span>;
      render(<Badge icon={<ComplexIcon />}>Badge</Badge>);

      expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
      expect(screen.getByText('★')).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('renders screen reader text', () => {
      render(<Badge screenReaderText='New feature available'>New</Badge>);

      const srText = screen.getByText('New feature available');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass(styles['sr-only']);
    });

    it('renders without screen reader text when not provided', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const srText = container.querySelector(`.${styles['sr-only']}`);
      expect(srText).not.toBeInTheDocument();
    });

    it('renders both visible and screen reader text', () => {
      render(<Badge screenReaderText='5 unread messages'>5</Badge>);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('5 unread messages')).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      const icon = <span data-testid='icon'>●</span>;
      const { container } = render(
        <Badge
          variant='success'
          size='regular'
          icon={icon}
          className='custom-class'
          screenReaderText='Success message'
        >
          Complete
        </Badge>
      );

      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles['badge-success']);
      expect(badge).toHaveClass(styles['badge-regular']);
      expect(badge).toHaveClass('custom-class');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    // it.each(variants)('renders %s variant with icon', variant => {
    //   const icon = <span data-testid={`icon-${variant}`}>!</span>;
    //   render(
    //     <Badge variant={variant} icon={icon}>
    //       {variant}
    //     </Badge>
    //   );

    //   expect(screen.getByTestId(`icon-${variant}`)).toBeInTheDocument();
    //   expect(screen.getByText(variant)).toBeInTheDocument();
    // });

    // it.each(sizes)('renders %s size with icon', size => {
    //   const icon = <span data-testid={`icon-${size}`}>✓</span>;
    //   render(
    //     <Badge size={size} icon={icon}>
    //       {size}
    //     </Badge>
    //   );

    //   expect(screen.getByTestId(`icon-${size}`)).toBeInTheDocument();
    //   expect(screen.getByText(size)).toBeInTheDocument();
    // });
  });

  describe('Content Types', () => {
    it('renders with number content', () => {
      render(<Badge>{42}</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with JSX content', () => {
      render(
        <Badge>
          <strong>Important</strong> message
        </Badge>
      );

      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByText('message')).toBeInTheDocument();
    });

    it('renders with empty string', () => {
      const { container } = render(<Badge>{``}</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('renders with zero', () => {
      render(<Badge>{0}</Badge>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('maintains consistent structure across variants', () => {
      const variants = [
        'accent',
        'warning',
        'danger',
        'success',
        'neutral',
        'gradient'
      ] as const;

      variants.forEach(variant => {
        const { container } = render(<Badge variant={variant}>Test</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass(styles.badge);
        expect(badge).toHaveClass(styles[`badge-${variant}`]);
      });
    });

    it('maintains consistent structure across sizes', () => {
      const sizes = ['micro', 'small', 'regular'] as const;

      sizes.forEach(size => {
        const { container } = render(<Badge size={size}>Test</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass(styles.badge);
        expect(badge).toHaveClass(styles[`badge-${size}`]);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined variant gracefully', () => {
      const { container } = render(<Badge variant={undefined}>Badge</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles['badge-accent']); // Falls back to default
    });

    it('handles undefined size gracefully', () => {
      const { container } = render(<Badge size={undefined}>Badge</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass(styles['badge-small']); // Falls back to default
    });

    it('handles null icon gracefully', () => {
      const { container } = render(<Badge icon={null}>Badge</Badge>);
      const iconWrapper = container.querySelector(`.${styles.icon}`);
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it('handles undefined icon gracefully', () => {
      const { container } = render(<Badge icon={undefined}>Badge</Badge>);
      const iconWrapper = container.querySelector(`.${styles.icon}`);
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText =
        'This is a very long badge text that might overflow in certain layouts';
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(<Badge>{`<>&"\'©™`}</Badge>);
      expect(screen.getByText('<>&"\'©™')).toBeInTheDocument();
    });
  });
});
