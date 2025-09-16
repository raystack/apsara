import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from '../icon-button';
import styles from '../icon-button.module.css';

describe('IconButton', () => {
  describe('Basic Rendering', () => {
    it('renders as button element', () => {
      render(<IconButton>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders children inside flex container', () => {
      render(
        <IconButton>
          <span data-testid='icon'>✓</span>
        </IconButton>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<IconButton ref={ref}>Icon</IconButton>);
      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<IconButton className='custom-class'>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass(styles.iconButton);
    });
  });

  describe('Sizes', () => {
    const sizes = [1, 2, 3, 4] as const;

    it.each(sizes)('renders size %s correctly', size => {
      render(<IconButton size={size}>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles[`iconButton-size-${size}`]);
    });

    it('defaults to size 2', () => {
      render(<IconButton>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(styles['iconButton-size-2']);
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<IconButton disabled>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('sets aria-disabled when disabled', () => {
      render(<IconButton disabled>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not trigger click when disabled', () => {
      const handleClick = vi.fn();
      render(
        <IconButton disabled onClick={handleClick}>
          Icon
        </IconButton>
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('sets aria-label', () => {
      render(<IconButton aria-label='Close dialog'>X</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('has type="button" by default', () => {
      render(<IconButton>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('can override type attribute', () => {
      render(<IconButton type='submit'>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Event Handlers', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<IconButton onClick={handleClick}>Icon</IconButton>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles focus events', () => {
      const handleFocus = vi.fn();
      render(<IconButton onFocus={handleFocus}>Icon</IconButton>);
      const button = screen.getByRole('button');
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles blur events', () => {
      const handleBlur = vi.fn();
      render(<IconButton onBlur={handleBlur}>Icon</IconButton>);
      const button = screen.getByRole('button');
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn();
      render(<IconButton onKeyDown={handleKeyDown}>Icon</IconButton>);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTML Button Attributes', () => {
    it('supports id attribute', () => {
      render(<IconButton id='close-btn'>X</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'close-btn');
    });

    it('supports data attributes', () => {
      render(<IconButton data-testid='icon-btn'>Icon</IconButton>);
      expect(screen.getByTestId('icon-btn')).toBeInTheDocument();
    });

    it('supports title attribute', () => {
      render(<IconButton title='Close'>X</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Close');
    });

    it('supports form attribute', () => {
      render(<IconButton form='myForm'>Icon</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'myForm');
    });
  });

  describe('Content Types', () => {
    it('renders text content', () => {
      render(<IconButton>×</IconButton>);
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('renders SVG icons', () => {
      render(
        <IconButton>
          <svg data-testid='svg-icon'>
            <circle cx='12' cy='12' r='10' />
          </svg>
        </IconButton>
      );
      expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
    });

    it('renders complex JSX', () => {
      render(
        <IconButton>
          <div data-testid='complex'>
            <span>A</span>
            <span>B</span>
          </div>
        </IconButton>
      );
      expect(screen.getByTestId('complex')).toBeInTheDocument();
    });
  });
});
