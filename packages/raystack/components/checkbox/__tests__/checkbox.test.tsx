import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox';
import styles from '../checkbox.module.css';

describe('Checkbox', () => {
  describe('Basic Rendering', () => {
    it('renders checkbox element', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('applies checkbox class', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(styles.checkbox);
    });

    it('applies custom className', () => {
      render(<Checkbox className='custom-checkbox' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-checkbox');
      expect(checkbox).toHaveClass(styles.checkbox);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Checkbox ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Checked State', () => {
    it('renders unchecked by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('renders as checked when checked prop is true', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('renders as unchecked when checked prop is false', () => {
      render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('shows check icon when checked', () => {
      const { container } = render(<Checkbox checked={true} />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toBeInTheDocument();

      // Check for checkmark path
      const svg = indicator?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not show indicator when unchecked', () => {
      const { container } = render(<Checkbox checked={false} />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      if (indicator) {
        expect(indicator.children.length).toBe(0);
      }
    });
  });

  describe('Indeterminate State', () => {
    it('applies indeterminate class', () => {
      render(<Checkbox checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(styles['checkbox-indeterminate']);
    });

    it('renders with defaultChecked as indeterminate', () => {
      render(<Checkbox defaultChecked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(styles['checkbox-indeterminate']);
    });

    it('transitions from indeterminate to unchecked on click', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox checked='indeterminate' onCheckedChange={handleChange} />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('applies disabled class', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(styles['checkbox-disabled']);
    });

    it('does not trigger onCheckedChange when disabled', () => {
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('can be disabled while checked', () => {
      render(<Checkbox disabled checked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toBeChecked();
    });

    it('can be disabled while indeterminate', () => {
      render(<Checkbox disabled checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveClass(styles['checkbox-indeterminate']);
    });
  });

  describe('Event Handling', () => {
    it('calls onCheckedChange when clicked', () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles from unchecked to checked', () => {
      const handleChange = vi.fn();
      render(<Checkbox checked={false} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles from checked to unchecked', () => {
      const handleChange = vi.fn();
      render(<Checkbox checked={true} onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('supports focus events', () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Checkbox onFocus={handleFocus} onBlur={handleBlur} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.focus(checkbox);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(checkbox);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes when unchecked', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('role', 'checkbox');
    });

    it('has correct ARIA attributes when checked', () => {
      render(<Checkbox checked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('supports aria-label', () => {
      render(<Checkbox aria-label='Accept terms' />);
      const checkbox = screen.getByLabelText('Accept terms');
      expect(checkbox).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id='label'>Accept terms</span>
          <Checkbox aria-labelledby='label' />
        </>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-labelledby', 'label');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Checkbox aria-describedby='description' />
          <span id='description'>You must accept to continue</span>
        </>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-required', () => {
      render(<Checkbox aria-required='true' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('supports aria-invalid', () => {
      render(<Checkbox aria-invalid='true' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
