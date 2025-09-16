import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from '../chip';
import styles from '../chip.module.css';

describe('Chip', () => {
  describe('Basic Rendering', () => {
    it('renders with children', () => {
      render(<Chip>Test Chip</Chip>);

      expect(screen.getByText('Test Chip')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with leading icon', () => {
      render(
        <Chip leadingIcon={<span data-testid='leading-icon'>🏷️</span>}>
          Chip with leading icon
        </Chip>
      );

      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
      expect(screen.getByText('Chip with leading icon')).toBeInTheDocument();
    });

    it('renders with trailing icon', () => {
      render(
        <Chip trailingIcon={<span data-testid='trailing-icon'>➡️</span>}>
          Chip with trailing icon
        </Chip>
      );

      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
      expect(screen.getByText('Chip with trailing icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Chip className='custom-chip'>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles.chip);
      expect(chip).toHaveClass('custom-chip');
    });
  });

  describe('Variants', () => {
    const variants = ['outline', 'filled'] as const;

    it.each(variants)('renders %s variant correctly', variant => {
      render(<Chip variant={variant}>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles[`chip-variant-${variant}`]);
    });

    it('defaults to outline variant', () => {
      render(<Chip>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles['chip-variant-outline']);
    });
  });

  describe('Sizes', () => {
    const sizes = ['large', 'small'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Chip size={size}>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles[`chip-size-${size}`]);
    });

    it('defaults to small size', () => {
      render(<Chip>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles['chip-size-small']);
    });
  });

  describe('Colors', () => {
    const colors = ['neutral', 'accent'] as const;

    it.each(colors)('renders %s color correctly', color => {
      render(<Chip color={color}>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles[`chip-color-${color}`]);
    });

    it('defaults to neutral color', () => {
      render(<Chip>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles['chip-color-neutral']);
    });
  });

  describe('Dismissible Behavior', () => {
    it('renders dismiss button when isDismissible is true', () => {
      render(<Chip isDismissible>Dismissible Chip</Chip>);

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Dismissible Chip'
      });
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveClass(styles['dismiss-button']);
      expect(dismissButton).toHaveAttribute('type', 'button');
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(
        <Chip isDismissible onDismiss={onDismiss}>
          Dismissible Chip
        </Chip>
      );

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Dismissible Chip'
      });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when dismiss button is clicked', () => {
      const onClick = vi.fn();
      const onDismiss = vi.fn();

      render(
        <Chip isDismissible onClick={onClick} onDismiss={onDismiss}>
          Dismissible Chip
        </Chip>
      );

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Dismissible Chip'
      });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Behavior', () => {
    it('calls onClick when chip is clicked', () => {
      const onClick = vi.fn();
      render(<Chip onClick={onClick}>Clickable Chip</Chip>);

      const chip = screen.getByRole('status');
      fireEvent.click(chip);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', () => {
      expect(() => {
        render(<Chip>Non-clickable Chip</Chip>);
        const chip = screen.getByRole('status');
        fireEvent.click(chip);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('uses status role by default', () => {
      render(<Chip>Test Chip</Chip>);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('accepts custom role', () => {
      render(<Chip role='button'>Chip Button</Chip>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('generates aria-label from string children', () => {
      render(<Chip>Test Label</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Test Label');
    });

    it('uses custom ariaLabel when provided', () => {
      render(<Chip ariaLabel='Custom Label'>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('custom ariaLabel overrides string children', () => {
      render(<Chip ariaLabel='Override Label'>String Child</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Override Label');
    });
  });
});
