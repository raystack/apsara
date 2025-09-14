import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
import { Switch } from '../switch';
import styles from '../switch.module.css';

describe('Switch', () => {
  describe('Basic Rendering', () => {
    it('renders switch element', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
    });

    it('applies switch class', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(styles.switch);
    });

    it('renders thumb element', () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector(`.${styles.thumb}`);
      expect(thumb).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Switch className='custom-switch' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('custom-switch');
      expect(switchElement).toHaveClass(styles.switch);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Switch ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('renders large size by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(styles.large);
    });

    it('renders small size when specified', () => {
      render(<Switch size='small' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(styles.small);
    });

    it('renders large size when explicitly specified', () => {
      render(<Switch size='large' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(styles.large);
    });
  });

  describe('Checked State', () => {
    it('renders unchecked by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('renders as checked when checked prop is true', () => {
      render(<Switch checked={true} />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('renders with defaultChecked', () => {
      render(<Switch defaultChecked={true} />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles state on click', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');

      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled when disabled prop is true', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('data-disabled', 'true');
    });

    it('does not toggle when disabled', () => {
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('can be disabled while checked', () => {
      render(<Switch disabled checked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-disabled', 'true');
    });

    it('maintains disabled state with different sizes', () => {
      const { rerender } = render(<Switch disabled size='small' />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveClass(styles.small);

      rerender(<Switch disabled size='large' />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveClass(styles.large);
    });
  });

  describe('Event Handling', () => {
    it('calls onCheckedChange when toggled', () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles from checked to unchecked', () => {
      const handleChange = vi.fn();
      render(<Switch checked={true} onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('supports keyboard navigation (Space key)', () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      fireEvent.keyDown(switchElement, { key: ' ' });

      expect(handleChange).toHaveBeenCalled();
    });

    it('supports focus events', () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Switch onFocus={handleFocus} onBlur={handleBlur} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.focus(switchElement);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(switchElement);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', () => {
      const Component = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            data-testid='controlled'
          />
        );
      };

      render(<Component />);
      const switchElement = screen.getByTestId('controlled');

      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('works as uncontrolled component with defaultChecked', () => {
      render(<Switch defaultChecked={false} data-testid='uncontrolled' />);
      const switchElement = screen.getByTestId('uncontrolled');

      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('controlled checked prop overrides defaultChecked', () => {
      render(<Switch checked={true} defaultChecked={false} />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Required State', () => {
    it('supports required attribute', () => {
      render(<Switch required />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');
    });

    it('works with required and disabled', () => {
      render(<Switch required disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');
      expect(switchElement).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes when unchecked', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(switchElement).toHaveAttribute('role', 'switch');
    });

    it('has correct ARIA attributes when checked', () => {
      render(<Switch checked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('supports aria-label', () => {
      render(<Switch aria-label='Enable notifications' />);
      const switchElement = screen.getByLabelText('Enable notifications');
      expect(switchElement).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id='label'>Dark mode</span>
          <Switch aria-labelledby='label' />
        </>
      );
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'label');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Switch aria-describedby='description' />
          <span id='description'>Toggle to enable dark mode</span>
        </>
      );
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-invalid', () => {
      render(<Switch aria-invalid='true' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Data Attributes', () => {
    it('has data-state attribute for unchecked state', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    });

    it('has data-state attribute for checked state', () => {
      render(<Switch checked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('has data-disabled attribute when disabled', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled', 'true');
    });

    it('does not have data-disabled when enabled', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toHaveAttribute('data-disabled');
    });
  });

  describe('Additional Props', () => {
    it('supports name attribute', () => {
      render(<Switch name='notifications' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('name', 'notifications');
    });

    it('supports value attribute', () => {
      render(<Switch value='on' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('value', 'on');
    });

    it('supports data attributes', () => {
      render(<Switch data-testid='custom-switch' data-theme='dark' />);
      const switchElement = screen.getByTestId('custom-switch');
      expect(switchElement).toHaveAttribute('data-theme', 'dark');
    });

    it('supports id attribute', () => {
      render(<Switch id='theme-switch' />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('id', 'theme-switch');
    });
  });

  describe('Form Integration', () => {
    it('can be used in forms with name attribute', () => {
      render(
        <form>
          <Switch name='subscribe' />
        </form>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('name', 'subscribe');
    });

    it('respects form disabled state', () => {
      render(
        <fieldset disabled>
          <Switch />
        </fieldset>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });
  });

  describe('Visual States', () => {
    it('thumb moves when toggled', () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector(`.${styles.thumb}`);
      const switchElement = screen.getByRole('switch');

      expect(thumb).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      fireEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('maintains thumb with different sizes', () => {
      const { container, rerender } = render(<Switch size='small' />);
      let thumb = container.querySelector(`.${styles.thumb}`);
      expect(thumb).toBeInTheDocument();

      rerender(<Switch size='large' />);
      thumb = container.querySelector(`.${styles.thumb}`);
      expect(thumb).toBeInTheDocument();
    });
  });
});
