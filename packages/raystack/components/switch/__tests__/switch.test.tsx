import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
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
    const sizes = ['small', 'large'] as const;
    sizes.forEach(size => {
      it(`renders ${size} size`, () => {
        render(<Switch size={size} />);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveClass(styles[size]);
      });
    });
    it('renders large size by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(styles.large);
    });
  });

  describe('Checked State', () => {
    it('renders unchecked by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(switchElement).toHaveAttribute('data-unchecked');
    });

    it('renders as checked when checked prop is true', () => {
      render(<Switch checked={true} />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-checked');
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
      expect(switchElement).toHaveAttribute('data-disabled');
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
      expect(switchElement).toHaveAttribute('data-disabled');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('maintains disabled state with different sizes', () => {
      const { rerender } = render(<Switch disabled size='small' />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled');
      expect(switchElement).toHaveClass(styles.small);

      rerender(<Switch disabled size='large' />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled');
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
      expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('toggles from checked to unchecked', () => {
      const handleChange = vi.fn();
      render(<Switch checked={true} onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(false, expect.anything());
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

    it('supports keyboard navigation (Space key)', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard('[Space]');

      expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
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
      expect(switchElement).toHaveAttribute('data-required');
    });

    it('works with required and disabled', () => {
      render(<Switch required disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-required');
      expect(switchElement).toHaveAttribute('data-disabled');
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
  });

  describe('Data Attributes', () => {
    it('supports data attributes', () => {
      render(<Switch data-testid='custom-switch' data-theme='dark' />);
      const switchElement = screen.getByTestId('custom-switch');
      expect(switchElement).toHaveAttribute('data-theme', 'dark');
    });

    it('has data-unchecked attribute for unchecked state', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-unchecked');
    });

    it('has data-checked attribute for checked state', () => {
      render(<Switch checked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-checked');
    });

    it('has data-disabled attribute when disabled', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-disabled');
    });

    it('does not have data-disabled when enabled', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toHaveAttribute('data-disabled');
    });
  });
});
