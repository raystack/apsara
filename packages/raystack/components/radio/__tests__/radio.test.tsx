import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioItem } from '../radio';

describe('Radio', () => {
  describe('Basic Rendering', () => {
    it('renders radio group', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
        </Radio>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });
  });

  describe('Selection Behavior', () => {
    it('allows single selection', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');

      fireEvent.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      fireEvent.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('works with defaultValue', () => {
      render(
        <Radio defaultValue='option2'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Radio value='option1'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      rerender(
        <Radio value='option2'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('calls onValueChange when selection changes', () => {
      const handleChange = vi.fn();
      render(
        <Radio onValueChange={handleChange}>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const radio2 = screen.getAllByRole('radio')[1];
      fireEvent.click(radio2);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Disabled State', () => {
    it('disables entire radio group', () => {
      render(
        <Radio disabled>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });

    it('disables individual radio items', () => {
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' disabled />
          <RadioItem value='option3' />
        </Radio>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
      expect(radios[2]).not.toBeDisabled();
    });

    it('does not allow selection of disabled items', () => {
      const handleChange = vi.fn();
      render(
        <Radio onValueChange={handleChange}>
          <RadioItem value='option1' />
          <RadioItem value='option2' disabled />
        </Radio>
      );

      const disabledRadio = screen.getAllByRole('radio')[1];
      fireEvent.click(disabledRadio);

      expect(handleChange).not.toHaveBeenCalled();
      expect(disabledRadio).not.toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      const user = userEvent.setup();
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const [radio1, radio2, radio3] = screen.getAllByRole('radio');

      // Focus first radio
      await radio1.focus();
      expect(document.activeElement).toBe(radio1);

      // Arrow down should move to next
      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(radio2);

      // Arrow down again
      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(radio3);

      // Arrow up should move to previous
      await user.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(radio2);
    });

    it('wraps around when navigating past boundaries', async () => {
      const user = userEvent.setup();
      render(
        <Radio>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
          <RadioItem value='option3' />
        </Radio>
      );

      const [radio1, , radio3] = screen.getAllByRole('radio');

      // Focus last radio
      await radio3.focus();

      // Arrow down from last should wrap to first
      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(radio1);

      // Arrow up from first should wrap to last
      await user.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(radio3);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes on group', () => {
      render(
        <Radio aria-label='Select an option'>
          <RadioItem value='option1' />
        </Radio>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', 'Select an option');
    });

    it('has correct ARIA attributes on items', () => {
      render(
        <Radio defaultValue='option1'>
          <RadioItem value='option1' aria-label='First option' />
          <RadioItem value='option2' aria-label='Second option' />
        </Radio>
      );

      const radio1 = screen.getByLabelText('First option');
      const radio2 = screen.getByLabelText('Second option');

      expect(radio1).toHaveAttribute('aria-checked', 'true');
      expect(radio2).toHaveAttribute('aria-checked', 'false');
    });

    it('supports required attribute', () => {
      render(
        <Radio required>
          <RadioItem value='option1' />
        </Radio>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Integration', () => {
    it('works with form name attribute', () => {
      const { container } = render(
        <form>
          <Radio name='preference'>
            <RadioItem value='yes' />
            <RadioItem value='no' />
          </Radio>
        </form>
      );

      const radios = container.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        expect(radio).toHaveAttribute('name', 'preference');
      });
    });

    it('respects form disabled state', () => {
      render(
        <fieldset disabled>
          <Radio>
            <RadioItem value='option1' />
            <RadioItem value='option2' />
          </Radio>
        </fieldset>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });
  });

  describe('Data Attributes', () => {
    it('has data-state attribute on items', () => {
      render(
        <Radio defaultValue='option1'>
          <RadioItem value='option1' />
          <RadioItem value='option2' />
        </Radio>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toHaveAttribute('data-state', 'checked');
      expect(radio2).toHaveAttribute('data-state', 'unchecked');
    });

    it('has data-disabled attribute when disabled', () => {
      render(
        <Radio>
          <RadioItem value='option1' disabled />
        </Radio>
      );

      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('data-disabled', '');
    });
  });
});
