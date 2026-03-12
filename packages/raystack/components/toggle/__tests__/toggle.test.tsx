import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from '../toggle';
import styles from '../toggle.module.css';

describe('Toggle', () => {
  describe('Basic Rendering', () => {
    it('renders a button element', () => {
      render(<Toggle aria-label='Bold'>B</Toggle>);
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toBeInTheDocument();
    });

    it('applies toggle class', () => {
      render(<Toggle aria-label='Bold'>B</Toggle>);
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass(styles.toggle);
    });

    it('applies custom className', () => {
      render(
        <Toggle aria-label='Bold' className='custom'>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass('custom');
      expect(toggle).toHaveClass(styles.toggle);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Toggle ref={ref} aria-label='Bold'>
          B
        </Toggle>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('renders children', () => {
      render(<Toggle aria-label='Bold'>Bold Text</Toggle>);
      expect(screen.getByText('Bold Text')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies default size class (size 3)', () => {
      render(<Toggle aria-label='Bold'>B</Toggle>);
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass(styles['size-3']);
    });

    it('applies size 1 class', () => {
      render(
        <Toggle aria-label='Bold' size={1}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass(styles['size-1']);
    });

    it('applies size 3 class', () => {
      render(
        <Toggle aria-label='Bold' size={3}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass(styles['size-3']);
    });

    it('applies size 4 class', () => {
      render(
        <Toggle aria-label='Bold' size={4}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveClass(styles['size-4']);
    });
  });

  describe('Pressed State', () => {
    it('is not pressed by default', () => {
      render(<Toggle aria-label='Bold'>B</Toggle>);
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders as pressed with defaultPressed', () => {
      render(
        <Toggle aria-label='Bold' defaultPressed>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders as pressed with controlled pressed prop', () => {
      render(
        <Toggle aria-label='Bold' pressed>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    it('toggles pressed state on click', () => {
      render(<Toggle aria-label='Bold'>B</Toggle>);
      const toggle = screen.getByRole('button', { name: 'Bold' });

      expect(toggle).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Event Handling', () => {
    it('calls onPressedChange when toggled', () => {
      const handleChange = vi.fn();
      render(
        <Toggle aria-label='Bold' onPressedChange={handleChange}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('supports keyboard activation with Space', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Toggle aria-label='Bold' onPressedChange={handleChange}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      toggle.focus();
      await user.keyboard('[Space]');

      expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('supports keyboard activation with Enter', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <Toggle aria-label='Bold' onPressedChange={handleChange}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      toggle.focus();
      await user.keyboard('[Enter]');

      expect(handleChange).toHaveBeenCalledWith(true, expect.anything());
    });
  });

  describe('Disabled State', () => {
    it('does not toggle when disabled', () => {
      const handleChange = vi.fn();
      render(
        <Toggle aria-label='Bold' disabled onPressedChange={handleChange}>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      fireEvent.click(toggle);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('is disabled when disabled prop is set', () => {
      render(
        <Toggle aria-label='Bold' disabled>
          B
        </Toggle>
      );
      const toggle = screen.getByRole('button', { name: 'Bold' });
      expect(toggle).toBeDisabled();
    });
  });
});

describe('Toggle.Group', () => {
  describe('Basic Rendering', () => {
    it('renders a group element', () => {
      render(
        <Toggle.Group aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
          <Toggle value='center' aria-label='Center'>
            C
          </Toggle>
        </Toggle.Group>
      );
      const group = screen.getByRole('group', { name: 'Text alignment' });
      expect(group).toBeInTheDocument();
    });

    it('applies group class', () => {
      render(
        <Toggle.Group aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
        </Toggle.Group>
      );
      const group = screen.getByRole('group', { name: 'Text alignment' });
      expect(group).toHaveClass(styles.group);
    });

    it('applies custom className', () => {
      render(
        <Toggle.Group aria-label='Text alignment' className='custom'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
        </Toggle.Group>
      );
      const group = screen.getByRole('group', { name: 'Text alignment' });
      expect(group).toHaveClass('custom');
      expect(group).toHaveClass(styles.group);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Toggle.Group ref={ref} aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
        </Toggle.Group>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('supports single selection by default', () => {
      render(
        <Toggle.Group defaultValue={['left']} aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
          <Toggle value='center' aria-label='Center'>
            C
          </Toggle>
        </Toggle.Group>
      );
      expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });

    it('toggles selection on click', () => {
      render(
        <Toggle.Group defaultValue={['left']} aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
          <Toggle value='center' aria-label='Center'>
            C
          </Toggle>
        </Toggle.Group>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Center' }));
      expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });

    it('supports multiple selection', () => {
      render(
        <Toggle.Group multiple aria-label='Formatting'>
          <Toggle value='bold' aria-label='Bold'>
            B
          </Toggle>
          <Toggle value='italic' aria-label='Italic'>
            I
          </Toggle>
        </Toggle.Group>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
      fireEvent.click(screen.getByRole('button', { name: 'Italic' }));

      expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    });

    it('calls onValueChange when selection changes', () => {
      const handleChange = vi.fn();
      render(
        <Toggle.Group onValueChange={handleChange} aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
          <Toggle value='center' aria-label='Center'>
            C
          </Toggle>
        </Toggle.Group>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Left' }));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(['left'], expect.anything());
    });
  });

  describe('Disabled State', () => {
    it('disables all toggles when group is disabled', () => {
      render(
        <Toggle.Group disabled aria-label='Text alignment'>
          <Toggle value='left' aria-label='Left'>
            L
          </Toggle>
          <Toggle value='center' aria-label='Center'>
            C
          </Toggle>
        </Toggle.Group>
      );

      expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
      expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });
  });
});
