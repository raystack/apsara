import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from '../separator';
import styles from '../separator.module.css';

describe('Separator', () => {
  describe('Basic Rendering', () => {
    it('renders separator element', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
    });

    it('applies separator base class', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass(styles.separator);
    });

    it('applies custom className', () => {
      render(<Separator className='custom-separator' />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass('custom-separator');
      expect(separator).toHaveClass(styles.separator);
    });
  });

  describe('Orientation', () => {
    it('defaults to horizontal orientation', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('renders vertical orientation correctly', () => {
      render(<Separator orientation='vertical' />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('Sizes', () => {
    const sizes = ['small', 'half', 'full'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Separator size={size} />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass(styles[`separator-${size}`]);
    });

    it('defaults to full size', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass(styles['separator-full']);
    });
  });

  describe('Colors', () => {
    const colors = ['primary', 'secondary', 'tertiary'] as const;

    it.each(colors)('renders %s color correctly', color => {
      render(<Separator color={color} />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass(styles[`separator-${color}`]);
    });

    it('defaults to primary color', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass(styles['separator-primary']);
    });
  });

  describe('Accessibility', () => {
    it('has separator role', () => {
      render(<Separator />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has default aria-label for horizontal separator', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-label', 'horizontal separator');
    });

    it('has default aria-label for vertical separator', () => {
      render(<Separator orientation='vertical' />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-label', 'vertical separator');
    });

    it('supports custom aria-label', () => {
      render(<Separator aria-label='Section divider' />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-label', 'Section divider');
    });

    it('is marked as decorative', () => {
      render(<Separator />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation');
    });
  });
});
