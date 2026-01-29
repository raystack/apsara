import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from '../radio';

describe('Radio', () => {
  describe('Basic Rendering', () => {
    it('renders radio group', () => {
      render(
        <Radio.Group>
          <Radio value='option1' />
        </Radio.Group>
      );
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <Radio.Group>
          <Radio value='option1' />
          <Radio value='option2' />
          <Radio value='option3' />
        </Radio.Group>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });
  });

  describe('Selection Behavior', () => {
    it('allows single selection', () => {
      render(
        <Radio.Group>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
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
        <Radio.Group defaultValue='option2'>
          <Radio value='option1' />
          <Radio value='option2' />
          <Radio value='option3' />
        </Radio.Group>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
      expect(radios[2]).not.toBeChecked();
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Radio.Group value='option1'>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();

      rerender(
        <Radio.Group value='option2'>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
      );

      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
    });

    it('calls onValueChange when selection changes', () => {
      const handleChange = vi.fn();
      render(
        <Radio.Group onValueChange={handleChange}>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
      );

      const radio2 = screen.getAllByRole('radio')[1];
      fireEvent.click(radio2);

      expect(handleChange).toHaveBeenCalledWith('option2', expect.anything());
    });
  });

  describe('Disabled State', () => {
    it('disables entire radio group', () => {
      render(
        <Radio.Group disabled>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
      );

      const radios = screen.getAllByRole('radio');
      radios.forEach(radio => {
        expect(radio).toHaveAttribute('data-disabled');
      });
    });

    it('disables individual radio items', () => {
      render(
        <Radio.Group>
          <Radio value='option1' />
          <Radio value='option2' disabled />
          <Radio value='option3' />
        </Radio.Group>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toHaveAttribute('data-disabled');
      expect(radios[1]).toHaveAttribute('data-disabled');
      expect(radios[2]).not.toHaveAttribute('data-disabled');
    });

    it('does not allow selection of disabled items', () => {
      const handleChange = vi.fn();
      render(
        <Radio.Group onValueChange={handleChange}>
          <Radio value='option1' />
          <Radio value='option2' disabled />
        </Radio.Group>
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
        <Radio.Group>
          <Radio value='option1' />
          <Radio value='option2' />
          <Radio value='option3' />
        </Radio.Group>
      );

      const [radio1, radio2, radio3] = screen.getAllByRole('radio');

      // Focus first radio
      radio1.focus();
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
        <Radio.Group>
          <Radio value='option1' />
          <Radio value='option2' />
          <Radio value='option3' />
        </Radio.Group>
      );

      const [radio1, , radio3] = screen.getAllByRole('radio');

      // Focus last radio
      radio3.focus();

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
        <Radio.Group aria-label='Select an option'>
          <Radio value='option1' />
        </Radio.Group>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', 'Select an option');
    });

    it('has correct ARIA attributes on items', () => {
      render(
        <Radio.Group defaultValue='option1'>
          <Radio value='option1' aria-label='First option' />
          <Radio value='option2' aria-label='Second option' />
        </Radio.Group>
      );

      const radio1 = screen.getByLabelText('First option');
      const radio2 = screen.getByLabelText('Second option');

      expect(radio1).toHaveAttribute('aria-checked', 'true');
      expect(radio2).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Data Attributes', () => {
    it('has data-checked attribute on selected items', () => {
      render(
        <Radio.Group defaultValue='option1'>
          <Radio value='option1' />
          <Radio value='option2' />
        </Radio.Group>
      );

      const [radio1, radio2] = screen.getAllByRole('radio');
      expect(radio1).toHaveAttribute('data-checked');
      expect(radio2).toHaveAttribute('data-unchecked');
    });

    it('has data-disabled attribute when disabled', () => {
      render(
        <Radio.Group>
          <Radio value='option1' disabled />
        </Radio.Group>
      );

      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('data-disabled');
    });
  });
});
