import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';
import styles from '../button.module.css';

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument();
    });

    it('renders as a button element by default', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<Button className='custom-class'>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass(styles.button);
    });

    it('applies custom styles', () => {
      render(
        <Button style={{ backgroundColor: 'red', marginTop: '10px' }}>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveStyle("backgroundColor: 'red', marginTop: '10px'");
    });
  });

  describe('Variants', () => {
    const variants = ['solid', 'outline', 'ghost', 'text'] as const;

    it.each(variants)('renders %s variant correctly', variant => {
      render(<Button variant={variant}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles[`button-${variant}`]);
    });

    it('defaults to solid variant', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles['button-solid']);
    });
  });

  describe('Colors', () => {
    const colors = ['accent', 'danger', 'neutral', 'success'] as const;

    it.each(colors)('renders %s color correctly', color => {
      render(<Button color={color}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles[`button-color-${color}`]);
    });

    it('defaults to accent color', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles['button-color-accent']);
    });
  });

  describe('Sizes', () => {
    const sizes = ['small', 'normal'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Button size={size}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles[`button-${size}`]);
    });

    it('defaults to normal size', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles['button-normal']);
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles loading state', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles['button-loading']);
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('shows loader text when loading', () => {
      render(
        <Button loading loaderText='Please wait...'>
          Button
        </Button>
      );
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('does not show children when loading', () => {
      render(<Button loading>Original Text</Button>);
      expect(screen.queryByText('Original Text')).not.toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders leading icon', () => {
      const icon = <span data-testid='leading-icon'>→</span>;
      render(<Button leadingIcon={icon}>Button</Button>);
      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    });

    it('renders trailing icon', () => {
      const icon = <span data-testid='trailing-icon'>←</span>;
      render(<Button trailingIcon={icon}>Button</Button>);
      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
    });

    it('renders both leading and trailing icons', () => {
      const leadingIcon = <span data-testid='leading'>L</span>;
      const trailingIcon = <span data-testid='trailing'>T</span>;
      render(
        <Button leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
          Button
        </Button>
      );
      expect(screen.getByTestId('leading')).toBeInTheDocument();
      expect(screen.getByTestId('trailing')).toBeInTheDocument();
    });

    it('does not show icons when loading', () => {
      const leadingIcon = <span data-testid='leading'>L</span>;
      const trailingIcon = <span data-testid='trailing'>T</span>;
      render(
        <Button loading leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
          Button
        </Button>
      );
      expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trailing')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles focus events', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Button</Button>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles blur events', () => {
      const handleBlur = vi.fn();
      render(<Button onBlur={handleBlur}>Button</Button>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles mouse events', () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();
      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label='Custom label'>Icon</Button>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('supports aria-pressed', () => {
      render(<Button aria-pressed='true'>Toggle</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('supports aria-expanded', () => {
      render(<Button aria-expanded='false'>Expand</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Button aria-describedby='description'>Button</Button>
          <span id='description'>This is a description</span>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('maintains button role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('HTML Button Attributes', () => {
    it('supports type attribute', () => {
      render(<Button type='submit'>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('supports form attribute', () => {
      render(<Button form='myForm'>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'myForm');
    });

    it('supports name attribute', () => {
      render(
        <Button name='action' value='save'>
          Save
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('name', 'action');
      expect(button).toHaveAttribute('value', 'save');
    });

    it('supports data attributes', () => {
      render(
        <Button data-testid='custom-button' data-action='save'>
          Button
        </Button>
      );
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('data-action', 'save');
    });
  });
});
