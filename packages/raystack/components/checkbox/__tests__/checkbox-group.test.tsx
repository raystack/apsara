import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox';
import styles from '../checkbox.module.css';

describe('Checkbox.Group', () => {
  describe('Basic Rendering', () => {
    it('renders checkbox group', () => {
      render(
        <Checkbox.Group data-testid='group'>
          <label>
            <Checkbox name='apple' />
            Apple
          </label>
        </Checkbox.Group>
      );
      const group = screen.getByTestId('group');
      expect(group).toBeInTheDocument();
    });

    it('renders multiple checkboxes', () => {
      render(
        <Checkbox.Group>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
          <Checkbox name='cherry' />
        </Checkbox.Group>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('applies group class', () => {
      render(
        <Checkbox.Group data-testid='group'>
          <Checkbox name='apple' />
        </Checkbox.Group>
      );
      const group = screen.getByTestId('group');
      expect(group).toHaveClass(styles.group);
    });

    it('applies custom className', () => {
      render(
        <Checkbox.Group className='custom-group' data-testid='group'>
          <Checkbox name='apple' />
        </Checkbox.Group>
      );
      const group = screen.getByTestId('group');
      expect(group).toHaveClass('custom-group');
      expect(group).toHaveClass(styles.group);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Checkbox.Group ref={ref}>
          <Checkbox name='apple' />
        </Checkbox.Group>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Selection Behavior', () => {
    it('works with defaultValue', () => {
      render(
        <Checkbox.Group defaultValue={['banana']}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
          <Checkbox name='cherry' />
        </Checkbox.Group>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });

    it('supports multiple defaultValues', () => {
      render(
        <Checkbox.Group defaultValue={['apple', 'cherry']}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
          <Checkbox name='cherry' />
        </Checkbox.Group>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it('works as controlled component', () => {
      const { rerender } = render(
        <Checkbox.Group value={['apple']}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
        </Checkbox.Group>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();

      rerender(
        <Checkbox.Group value={['banana']}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
        </Checkbox.Group>
      );

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it('calls onValueChange when checkbox is toggled', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox.Group defaultValue={[]} onValueChange={handleChange}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
        </Checkbox.Group>
      );

      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(['apple'], expect.anything());
    });

    it('allows toggling multiple checkboxes', () => {
      render(
        <Checkbox.Group defaultValue={[]}>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
        </Checkbox.Group>
      );

      const [apple, banana] = screen.getAllByRole('checkbox');

      fireEvent.click(apple);
      expect(apple).toBeChecked();
      expect(banana).not.toBeChecked();

      fireEvent.click(banana);
      expect(apple).toBeChecked();
      expect(banana).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('disables entire checkbox group', () => {
      render(
        <Checkbox.Group disabled>
          <Checkbox name='apple' />
          <Checkbox name='banana' />
        </Checkbox.Group>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('does not trigger onValueChange when group is disabled', () => {
      const handleChange = vi.fn();
      render(
        <Checkbox.Group disabled onValueChange={handleChange}>
          <Checkbox name='apple' />
        </Checkbox.Group>
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(
        <Checkbox.Group aria-label='Select fruits' data-testid='group'>
          <Checkbox name='apple' />
        </Checkbox.Group>
      );
      const group = screen.getByTestId('group');
      expect(group).toHaveAttribute('aria-label', 'Select fruits');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id='group-label'>Select fruits</span>
          <Checkbox.Group aria-labelledby='group-label' data-testid='group'>
            <Checkbox name='apple' />
          </Checkbox.Group>
        </>
      );
      const group = screen.getByTestId('group');
      expect(group).toHaveAttribute('aria-labelledby', 'group-label');
    });
  });
});
