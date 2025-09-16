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
    it('defaults to 100% width', () => {
      const { container } = render(<TextArea />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '100%' });
    });

    it('accepts custom width as string', () => {
      const { container } = render(<TextArea width='500px' />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '500px' });
    });
  });

  describe('Label and Helper Text', () => {
    it('renders with label', () => {
      render(<TextArea label='Description' />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('shows optional indicator when not required', () => {
      render(<TextArea label='Comments' required={false} />);
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('does not show optional indicator when required', () => {
      render(<TextArea label='Comments' required={true} />);
      expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(<TextArea helperText='Maximum 500 characters' />);
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });

    it('renders info tooltip with label', () => {
      const { container } = render(
        <TextArea label='Bio' infoTooltip='Tell us about yourself' />
      );
      const helpIcon = container.querySelector(`.${styles.helpIcon}`);
      expect(helpIcon).toBeInTheDocument();
    });

    it('does not render info tooltip without label', () => {
      const { container } = render(<TextArea infoTooltip='Info text' />);
      const helpIcon = container.querySelector(`.${styles.helpIcon}`);
      expect(helpIcon).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('applies error styles when error is true', () => {
      render(<TextArea error />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass(styles.error);
    });

    it('applies error styles to helper text', () => {
      render(<TextArea error helperText='Invalid input' />);
      const helperText = screen.getByText('Invalid input');
      expect(helperText).toHaveClass(styles.helperTextError);
    });

    it('shows helper text with error styling', () => {
      render(<TextArea error helperText='Please enter valid text' />);
      const helperText = screen.getByText('Please enter valid text');
      expect(helperText).toHaveClass(styles.helperText);
      expect(helperText).toHaveClass(styles.helperTextError);
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

    it('applies disabled styles to label', () => {
      render(<TextArea label='Notes' disabled />);
      const label = screen.getByText('Notes').closest('label');
      expect(label).toHaveClass(styles.labelDisabled);
    });

    it('applies disabled styles to helper text', () => {
      render(<TextArea helperText='Help text' disabled />);
      const helperText = screen.getByText('Help text');
      expect(helperText).toHaveClass(styles.helperTextDisabled);
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

  describe('Required State', () => {
    it('sets required attribute on textarea', () => {
      render(<TextArea required />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('does not set required when false', () => {
      render(<TextArea required={false} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeRequired();
    });
  });

  describe('Event Handling', () => {
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
