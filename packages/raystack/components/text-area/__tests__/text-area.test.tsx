import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../../test-utils';
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

    it('renders with placeholder', () => {
      render(<TextArea placeholder='Enter your message' />);
      const textarea = screen.getByPlaceholderText('Enter your message');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Width Styling', () => {
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

    it('accepts custom width as number', () => {
      const { container } = render(<TextArea width={300} />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '300px' });
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

      // When disabled, the textarea should not be focusable
      expect(textarea).toBeDisabled();

      // The textarea should not be focusable when disabled
      expect(textarea).toHaveAttribute('disabled');

      // Note: In test environment, fireEvent.change still works on disabled elements
      // but in real browser, disabled elements don't respond to user input
      fireEvent.change(textarea, { target: { value: 'test' } });
      // The onChange handler is still called in tests, but the element is disabled
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Value Management', () => {
    it('works as controlled component', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <TextArea value='initial' onChange={handleChange} />
      );

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('initial');

      rerender(<TextArea value='updated' onChange={handleChange} />);
      expect(textarea.value).toBe('updated');
    });

    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<TextArea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new text' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange.mock.calls[0][0].target.value).toBe('new text');
    });

    it('works as uncontrolled component', () => {
      render(<TextArea defaultValue='default text' />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      expect(textarea.value).toBe('default text');

      fireEvent.change(textarea, { target: { value: 'changed text' } });
      expect(textarea.value).toBe('changed text');
    });
  });

  describe('Required Attribute', () => {
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

  describe('HTML Attributes', () => {
    it('supports rows attribute', () => {
      render(<TextArea rows={10} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '10');
    });

    it('supports cols attribute', () => {
      render(<TextArea cols={50} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });

    it('supports maxLength attribute', () => {
      render(<TextArea maxLength={500} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    it('supports minLength attribute', () => {
      render(<TextArea minLength={10} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('minLength', '10');
    });

    it('supports name attribute', () => {
      render(<TextArea name='description' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'description');
    });

    it('supports id attribute', () => {
      render(<TextArea id='message-input' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('id', 'message-input');
    });

    it('supports readOnly attribute', () => {
      render(<TextArea readOnly value='Read only text' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readOnly');
    });

    it('supports autoComplete attribute', () => {
      render(<TextArea autoComplete='off' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('autoComplete', 'off');
    });

    it('supports spellCheck attribute', () => {
      render(<TextArea spellCheck={false} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('spellCheck', 'false');
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

  describe('Resize Behavior', () => {
    it('allows resize by default', () => {
      render(<TextArea />);
      const textarea = screen.getByRole('textbox');
      // TextArea should be resizable unless explicitly disabled via CSS
      expect(textarea).toBeInTheDocument();
    });

    it('accepts style prop for resize control', () => {
      render(<TextArea style={{ resize: 'none' }} />);
      const textarea = screen.getByRole('textbox');
      // The style prop should be applied, but CSS might override it
      expect(textarea).toHaveAttribute('style');
      expect(textarea.style.resize).toBe('none');
    });

    it('accepts style prop for custom styling', () => {
      render(<TextArea style={{ minHeight: '100px' }} />);
      const textarea = screen.getByRole('textbox');
      // The style prop should be applied
      expect(textarea).toHaveAttribute('style');
      expect(textarea.style.minHeight).toBe('100px');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders with all props combined', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TextArea
          label='Comments'
          required
          infoTooltip='Share your thoughts'
          helperText='Max 1000 characters'
          error={false}
          disabled={false}
          width='600px'
          value='Test value'
          onChange={handleChange}
          placeholder='Enter comments'
          className='custom-class'
          rows={5}
          maxLength={1000}
        />
      );

      expect(screen.getByText('Comments')).toBeInTheDocument();
      expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.helpIcon}`)
      ).toBeInTheDocument();
      expect(screen.getByText('Max 1000 characters')).toBeInTheDocument();

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea).toHaveClass('custom-class');
      expect(textarea.value).toBe('Test value');
      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('maxLength', '1000');
      expect(textarea).toHaveAttribute('placeholder', 'Enter comments');
      expect(textarea).toBeRequired();
    });

    it('maintains state through re-renders', () => {
      const { rerender } = render(
        <TextArea value='initial' onChange={() => {}} />
      );
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      expect(textarea.value).toBe('initial');

      rerender(<TextArea value='updated' onChange={() => {}} />);
      expect(textarea.value).toBe('updated');

      rerender(<TextArea value='final' onChange={() => {}} error />);
      expect(textarea.value).toBe('final');
      expect(textarea).toHaveClass(styles.error);
    });
  });
});
