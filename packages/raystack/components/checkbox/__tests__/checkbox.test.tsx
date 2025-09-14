import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
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

    it('renders with defaultChecked', () => {
      render(<Checkbox defaultChecked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('shows check icon when checked', () => {
      const { container } = render(<Checkbox checked={true} />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toBeInTheDocument();

      // Check for checkmark path
      const svg = indicator?.querySelector('svg');
      expect(svg).toBeInTheDocument();
      const path = svg?.querySelector('path');
      expect(path).toHaveAttribute(
        'd',
        expect.stringContaining('M11.9005 4.9671')
      );
    });

    it('does not show indicator when unchecked', () => {
      const { container } = render(<Checkbox checked={false} />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      // Indicator might exist but should be empty or hidden
      if (indicator) {
        expect(indicator.children.length).toBe(0);
      }
    });
  });

  describe('Indeterminate State', () => {
    it('renders as indeterminate when checked is "indeterminate"', () => {
      render(<Checkbox checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('applies indeterminate class', () => {
      render(<Checkbox checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(styles['checkbox-indeterminate']);
    });

    it('shows indeterminate icon', () => {
      const { container } = render(<Checkbox checked='indeterminate' />);
      const indicator = container.querySelector(`.${styles.indicator}`);
      expect(indicator).toBeInTheDocument();

      // Check for indeterminate line path
      const svg = indicator?.querySelector('svg');
      expect(svg).toBeInTheDocument();
      const path = svg?.querySelector('path');
      expect(path).toHaveAttribute(
        'd',
        expect.stringContaining('M11.5 8.5H4.5')
      );
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

    it('supports keyboard navigation (Space key)', () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      fireEvent.keyDown(checkbox, { key: ' ' });

      expect(handleChange).toHaveBeenCalled();
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

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', () => {
      const Component = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox
            checked={checked}
            onCheckedChange={setChecked}
            data-testid='controlled'
          />
        );
      };

      render(<Component />);
      const checkbox = screen.getByTestId('controlled');

      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('works as uncontrolled component with defaultChecked', () => {
      render(<Checkbox defaultChecked={false} data-testid='uncontrolled' />);
      const checkbox = screen.getByTestId('uncontrolled');

      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('controlled checked prop overrides defaultChecked', () => {
      render(<Checkbox checked={true} defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
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

    it('has correct ARIA attributes when indeterminate', () => {
      render(<Checkbox checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
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

  describe('Icon Rendering', () => {
    it('renders correct icon class', () => {
      const { container } = render(<Checkbox checked />);
      const icon = container.querySelector(`.${styles.icon}`);
      expect(icon).toBeInTheDocument();
    });

    it('icon has correct dimensions', () => {
      const { container } = render(<Checkbox checked />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    });

    it('icon uses currentColor for fill', () => {
      const { container } = render(<Checkbox checked />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('Additional Props', () => {
    it('supports name attribute', () => {
      render(<Checkbox name='terms' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'terms');
    });

    it('supports value attribute', () => {
      render(<Checkbox value='accept' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'accept');
    });

    it('supports data attributes', () => {
      render(<Checkbox data-testid='custom-checkbox' data-form='signup' />);
      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toHaveAttribute('data-form', 'signup');
    });

    it('supports id attribute', () => {
      render(<Checkbox id='terms-checkbox' />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'terms-checkbox');
    });
  });

  describe('State Transitions', () => {
    it('transitions through states correctly', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <Checkbox checked={false} onCheckedChange={handleChange} />
      );

      const checkbox = screen.getByRole('checkbox');

      // Unchecked -> Checked
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(<Checkbox checked={true} onCheckedChange={handleChange} />);

      // Checked -> Unchecked
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);

      rerender(
        <Checkbox checked='indeterminate' onCheckedChange={handleChange} />
      );

      // Indeterminate -> Unchecked
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });
});
