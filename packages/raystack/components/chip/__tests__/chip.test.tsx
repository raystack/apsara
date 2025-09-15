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

      const leadingIcon = screen
        .getByTestId('leading-icon')
        .closest(`.${styles['leading-icon']}`);
      expect(leadingIcon).toHaveAttribute('aria-hidden', 'true');
      expect(leadingIcon).toHaveAttribute('role', 'presentation');
    });

    it('renders with trailing icon', () => {
      render(
        <Chip trailingIcon={<span data-testid='trailing-icon'>➡️</span>}>
          Chip with trailing icon
        </Chip>
      );

      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
      expect(screen.getByText('Chip with trailing icon')).toBeInTheDocument();

      const trailingIcon = screen
        .getByTestId('trailing-icon')
        .closest(`.${styles['trailing-icon']}`);
      expect(trailingIcon).toHaveAttribute('aria-hidden', 'true');
      expect(trailingIcon).toHaveAttribute('role', 'presentation');
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

    it('generates correct aria-label for dismiss button with string children', () => {
      render(<Chip isDismissible>Test Label</Chip>);

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Test Label'
      });
      expect(dismissButton).toBeInTheDocument();
    });

    it('generates generic aria-label for dismiss button with non-string children', () => {
      render(
        <Chip isDismissible>
          <span>Complex Child</span>
        </Chip>
      );

      const dismissButton = screen.getByRole('button', { name: 'Remove item' });
      expect(dismissButton).toBeInTheDocument();
    });

    it('dismiss button has correct SVG attributes', () => {
      render(<Chip isDismissible>Test Chip</Chip>);

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Test Chip'
      });
      const svg = dismissButton.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('role', 'presentation');
      expect(svg).toHaveAttribute('width', '12');
      expect(svg).toHaveAttribute('height', '12');
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

    it('does not have aria-label for non-string children without custom ariaLabel', () => {
      render(
        <Chip>
          <span>Complex Child</span>
        </Chip>
      );

      const chip = screen.getByRole('status');
      expect(chip).not.toHaveAttribute('aria-label');
    });

    it('custom ariaLabel overrides string children', () => {
      render(<Chip ariaLabel='Override Label'>String Child</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Override Label');
    });
  });

  describe('Data State', () => {
    it('applies data-state attribute', () => {
      render(<Chip data-state='active'>Stateful Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Icon Combinations', () => {
    it('renders both leading and trailing icons', () => {
      render(
        <Chip
          leadingIcon={<span data-testid='leading'>🏷️</span>}
          trailingIcon={<span data-testid='trailing'>➡️</span>}
        >
          Full Chip
        </Chip>
      );

      expect(screen.getByTestId('leading')).toBeInTheDocument();
      expect(screen.getByTestId('trailing')).toBeInTheDocument();
    });

    it('prioritizes dismiss button over trailing icon when dismissible', () => {
      render(
        <Chip
          isDismissible
          trailingIcon={<span data-testid='trailing'>➡️</span>}
        >
          Dismissible Chip
        </Chip>
      );

      expect(screen.queryByTestId('trailing')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Dismissible Chip' })
      ).toBeInTheDocument();
    });

    it('shows trailing icon when not dismissible', () => {
      render(
        <Chip
          isDismissible={false}
          trailingIcon={<span data-testid='trailing'>➡️</span>}
        >
          Non-dismissible Chip
        </Chip>
      );

      expect(screen.getByTestId('trailing')).toBeInTheDocument();
    });

    it('renders leading icon with dismissible chip', () => {
      render(
        <Chip isDismissible leadingIcon={<span data-testid='leading'>🏷️</span>}>
          Dismissible with Leading
        </Chip>
      );

      expect(screen.getByTestId('leading')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Dismissible with Leading' })
      ).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(Chip.displayName).toBe('Chip');
    });
  });

  describe('Combination Variants', () => {
    it('combines all variant props', () => {
      render(
        <Chip variant='filled' size='large' color='accent'>
          Combined Chip
        </Chip>
      );

      const chip = screen.getByRole('status');
      expect(chip).toHaveClass(styles['chip-variant-filled']);
      expect(chip).toHaveClass(styles['chip-size-large']);
      expect(chip).toHaveClass(styles['chip-color-accent']);
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined onDismiss gracefully', () => {
      render(<Chip isDismissible>Dismissible without handler</Chip>);

      const dismissButton = screen.getByRole('button', {
        name: 'Remove Dismissible without handler'
      });
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
    });

    it('handles undefined onClick gracefully', () => {
      render(<Chip>Non-clickable Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(() => fireEvent.click(chip)).not.toThrow();
    });

    it('renders with empty string children', () => {
      render(<Chip></Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toBeInTheDocument();
    });

    it('renders with number children', () => {
      render(<Chip>{42}</Chip>);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with complex JSX children', () => {
      render(
        <Chip>
          <strong>Bold</strong> and <em>italic</em>
        </Chip>
      );

      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });
  });
});
