import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextArea } from '../text-area';
import styles from '../text-area.module.css';

describe('TextArea', () => {
  describe('Basic Rendering', () => {
    it('renders textarea element', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('applies textarea class', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles.textarea);
    });

    it('applies custom className', () => {
      render(<TextArea className='custom-textarea' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('custom-textarea');
      expect(textarea).toHaveClass(styles.textarea);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<TextArea ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('disables textarea when disabled prop is true', () => {
      render(<TextArea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('applies disabled styles to textarea', () => {
      render(<TextArea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles.disabled);
    });

    it('does not respond to events when disabled', () => {
      const handleChange = vi.fn();
      render(<TextArea disabled onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('disabled');

      fireEvent.change(textarea, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('calls onValueChange with the new string value', () => {
      const handleValueChange = vi.fn();
      render(<TextArea onValueChange={handleValueChange} />);
      const textarea = screen.getByRole('textbox');

      fireEvent.change(textarea, { target: { value: 'hello' } });
      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange.mock.calls[0][0]).toBe('hello');
      expect(handleValueChange.mock.calls[0][1]).toBeDefined();
    });

    it('calls both onChange and onValueChange', () => {
      const handleChange = vi.fn();
      const handleValueChange = vi.fn();
      render(
        <TextArea onChange={handleChange} onValueChange={handleValueChange} />
      );
      const textarea = screen.getByRole('textbox');

      fireEvent.change(textarea, { target: { value: 'hi' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus event', () => {
      const handleFocus = vi.fn();
      render(<TextArea onFocus={handleFocus} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.focus(textarea);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', () => {
      const handleBlur = vi.fn();
      render(<TextArea onBlur={handleBlur} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.blur(textarea);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('handles onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<TextArea onKeyDown={handleKeyDown} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('handles onKeyUp event', () => {
      const handleKeyUp = vi.fn();
      render(<TextArea onKeyUp={handleKeyUp} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.keyUp(textarea, { key: 'a' });
      expect(handleKeyUp).toHaveBeenCalled();
    });
  });

  describe('Rows', () => {
    it('defaults to 3 rows', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });

    it('allows overriding rows', () => {
      render(<TextArea rows={6} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '6');
    });
  });

  describe('Sizes', () => {
    it('renders large size by default', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles['size-large']);
    });

    it('renders small size when specified', () => {
      render(<TextArea size='small' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles['size-small']);
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles['variant-default']);
    });

    it('renders borderless variant when specified', () => {
      render(<TextArea variant='borderless' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles['variant-borderless']);
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<TextArea aria-label='Message input' />);
      const textarea = screen.getByLabelText('Message input');
      expect(textarea).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<TextArea aria-describedby='help-text' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('supports aria-invalid', () => {
      render(<TextArea aria-invalid='true' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('supports aria-required', () => {
      render(<TextArea aria-required='true' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });
  });
});
