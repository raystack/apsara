import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type IconProps, IconProvider } from '~/icons';
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

    it('renders an icon-only chip with no children', () => {
      render(
        <Chip
          leadingIcon={<span data-testid='leading-icon'>🏷️</span>}
          aria-label='Filter'
        />
      );

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Filter');
      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
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
    const colors = [
      'neutral',
      'accent',
      'danger',
      'success',
      'warning'
    ] as const;

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

  describe('Ref', () => {
    it('attaches to the span on the default branch', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Chip ref={ref}>Test Chip</Chip>);

      expect(ref.current?.tagName).toBe('SPAN');
    });

    it('attaches to the button on the interactive branch', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Chip ref={ref} onClick={vi.fn()}>
          Test Chip
        </Chip>
      );

      expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('stays a span with Chip.Remove, even with onClick', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Chip ref={ref} onClick={vi.fn()}>
          Test Chip
          <Chip.Remove />
        </Chip>
      );

      expect(ref.current?.tagName).toBe('SPAN');
    });
  });

  describe('Render', () => {
    it('renders as the render element with the chip props', () => {
      render(<Chip render={<div data-testid='custom' />}>Test Chip</Chip>);

      const chip = screen.getByTestId('custom');
      expect(chip.tagName).toBe('DIV');
      expect(chip).toHaveClass(styles.chip);
      expect(chip).toHaveAttribute('data-slot', 'chip');
      expect(chip).toHaveTextContent('Test Chip');
    });
  });

  describe('Chip.Remove', () => {
    it('renders a remove button named after the chip', () => {
      render(
        <Chip>
          Removable Chip
          <Chip.Remove />
        </Chip>
      );

      const removeButton = screen.getByRole('button', {
        name: 'Remove Removable Chip'
      });
      expect(removeButton).toHaveClass(styles.remove);
      expect(removeButton).toHaveAttribute('type', 'button');
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Removable Chip'
      );
    });

    it('uses the shared XIcon registry icon', () => {
      const { container } = render(
        <Chip>
          Removable Chip
          <Chip.Remove />
        </Chip>
      );

      const icon = container.querySelector('[data-icon="XIcon"]');
      expect(icon).toHaveAttribute('data-slot', 'chip-remove-icon');
      expect(icon).toHaveAttribute('width', '12');
      expect(icon).toHaveAttribute('height', '12');
    });

    it('passes the icon size to an XIcon override', () => {
      const CustomX = (props: IconProps) => (
        <svg data-testid='custom-x' {...props} />
      );
      render(
        <IconProvider components={{ XIcon: CustomX }}>
          <Chip>
            Removable Chip
            <Chip.Remove />
          </Chip>
        </IconProvider>
      );

      const icon = screen.getByTestId('custom-x');
      expect(icon).toHaveAttribute('data-icon', 'XIcon');
      expect(icon).toHaveAttribute('width', '12');
      expect(icon).toHaveAttribute('height', '12');
    });

    it('calls onClick without triggering the chip onClick', () => {
      const onClick = vi.fn();
      const onRemove = vi.fn();
      render(
        <Chip onClick={onClick}>
          Removable Chip
          <Chip.Remove onClick={onRemove} />
        </Chip>
      );

      fireEvent.click(
        screen.getByRole('button', { name: 'Remove Removable Chip' })
      );

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is disabled when the chip is disabled', () => {
      render(
        <Chip disabled>
          Removable Chip
          <Chip.Remove />
        </Chip>
      );

      expect(
        screen.getByRole('button', { name: 'Remove Removable Chip' })
      ).toBeDisabled();
    });

    it('renders as the render element', () => {
      render(
        <Chip>
          Removable Chip
          <Chip.Remove render={<span data-testid='custom-remove' />} />
        </Chip>
      );

      const remove = screen.getByTestId('custom-remove');
      expect(remove.tagName).toBe('SPAN');
      expect(remove).toHaveAttribute('aria-label', 'Remove Removable Chip');
    });
  });

  describe('Click Behavior', () => {
    it('calls onClick when chip is clicked', () => {
      const onClick = vi.fn();
      render(<Chip onClick={onClick}>Clickable Chip</Chip>);

      const chip = screen.getByRole('button', { name: 'Clickable Chip' });
      fireEvent.click(chip);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders a real button element for clickable chips', () => {
      render(<Chip onClick={vi.fn()}>Clickable Chip</Chip>);

      const chip = screen.getByRole('button', { name: 'Clickable Chip' });
      expect(chip.tagName).toBe('BUTTON');
      expect(chip).toHaveAttribute('type', 'button');
    });

    it('activates via keyboard Enter when focused', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Chip onClick={onClick}>Clickable Chip</Chip>);

      const chip = screen.getByRole('button', { name: 'Clickable Chip' });
      chip.focus();
      await user.keyboard('{Enter}');

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

  describe('Disabled State', () => {
    it('sets data-disabled attribute when disabled', () => {
      render(<Chip disabled>Disabled Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('data-disabled');
    });

    it('does not set data-disabled when not disabled', () => {
      render(<Chip>Active Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).not.toHaveAttribute('data-disabled');
    });

    it('does not call onClick when disabled', () => {
      const onClick = vi.fn();
      render(
        <Chip disabled onClick={onClick}>
          Disabled Chip
        </Chip>
      );

      const chip = screen.getByRole('button', { name: 'Disabled Chip' });
      fireEvent.click(chip);
      expect(onClick).not.toHaveBeenCalled();
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

    it('uses custom aria-label when provided', () => {
      render(<Chip aria-label='Custom Label'>Test Chip</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('custom aria-label overrides string children', () => {
      render(<Chip aria-label='Override Label'>String Child</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Override Label');
    });

    it('accepts native aria-label attribute', () => {
      render(<Chip aria-label='Native Label'>String Child</Chip>);

      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Native Label');
    });
  });

  describe('Forwarded HTML attributes', () => {
    it('forwards arbitrary HTML attributes onto the root span', () => {
      render(
        <Chip
          id='my-chip'
          data-testid='chip-root'
          data-state='active'
          title='Tooltip'
        >
          Test Chip
        </Chip>
      );

      const chip = screen.getByTestId('chip-root');
      expect(chip).toHaveAttribute('id', 'my-chip');
      expect(chip).toHaveAttribute('data-state', 'active');
      expect(chip).toHaveAttribute('title', 'Tooltip');
    });

    it('forwards mouse events from the spread props', () => {
      const onMouseEnter = vi.fn();
      render(
        <Chip onMouseEnter={onMouseEnter} data-testid='chip-root'>
          Test Chip
        </Chip>
      );

      fireEvent.mouseEnter(screen.getByTestId('chip-root'));
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
  });
});
