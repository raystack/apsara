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

  describe('Accessibility', () => {
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
});
