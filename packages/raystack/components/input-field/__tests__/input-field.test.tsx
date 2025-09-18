import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InputField } from '../input-field';
import styles from '../input-field.module.css';

describe('InputField', () => {
  describe('Basic Rendering', () => {
    it('renders input element', () => {
      render(<InputField />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<InputField className='custom-input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass(styles['input-field']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<InputField ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('renders with placeholder', () => {
      render(<InputField placeholder='Enter text here' />);
      const input = screen.getByPlaceholderText('Enter text here');
      expect(input).toBeInTheDocument();
    });

    it('sets custom width', () => {
      const { container } = render(<InputField width='300px' />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '300px' });
    });

    it('sets numeric width as pixels', () => {
      const { container } = render(<InputField width={400} />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '400px' });
    });

    it('defaults to 100% width', () => {
      const { container } = render(<InputField />);
      const wrapper = container.querySelector(`.${styles.container}`);
      expect(wrapper).toHaveStyle({ width: '100%' });
    });

    it('disables input when disabled prop is true', () => {
      render(<InputField disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Sizes', () => {
    it('renders large size by default', () => {
      const { container } = render(<InputField />);
      const wrapper = container.querySelector(`.${styles.inputWrapper}`);
      expect(wrapper).toHaveClass(styles['size-large']);
    });

    it('renders small size when specified', () => {
      const { container } = render(<InputField size='small' />);
      const wrapper = container.querySelector(`.${styles.inputWrapper}`);
      expect(wrapper).toHaveClass(styles['size-small']);
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      const { container } = render(<InputField />);
      const wrapper = container.querySelector(`.${styles.inputWrapper}`);
      expect(wrapper).toHaveClass(styles['variant-default']);
    });

    it('renders borderless variant when specified', () => {
      const { container } = render(<InputField variant='borderless' />);
      const wrapper = container.querySelector(`.${styles.inputWrapper}`);
      expect(wrapper).toHaveClass(styles['variant-borderless']);
    });
  });

  describe('Label and Helper Text', () => {
    it('renders with label', () => {
      render(<InputField label='Email Address' />);
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('renders optional indicator', () => {
      render(<InputField label='Phone' optional />);
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(<InputField helperText='Enter a valid email' />);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });

    it('renders info tooltip with label', () => {
      const { container } = render(
        <InputField label='Username' infoTooltip='Must be unique' />
      );
      const helpIcon = container.querySelector(`.${styles.helpIcon}`);
      expect(helpIcon).toBeInTheDocument();
    });

    it('does not render info tooltip without label', () => {
      const { container } = render(<InputField infoTooltip='Must be unique' />);
      const helpIcon = container.querySelector(`.${styles.helpIcon}`);
      expect(helpIcon).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error message', () => {
      render(<InputField error='Invalid input' />);
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    it('applies error styles to input', () => {
      render(<InputField error='Invalid' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(styles['input-error']);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styles to wrapper', () => {
      const { container } = render(<InputField error='Invalid' />);
      const wrapper = container.querySelector(`.${styles.inputWrapper}`);
      expect(wrapper).toHaveClass(styles['input-error-wrapper']);
    });

    it('shows error message instead of helper text', () => {
      render(
        <InputField helperText='Enter email' error='Invalid email format' />
      );
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.queryByText('Enter email')).not.toBeInTheDocument();
    });

    it('error text has error styles', () => {
      render(<InputField error='Invalid input' />);
      const errorText = screen.getByText('Invalid input');
      expect(errorText).toHaveClass(styles['helper-text-error']);
    });
  });

  describe('Icons', () => {
    it('renders leading icon', () => {
      const icon = <span data-testid='search-icon'>🔍</span>;
      const { container } = render(<InputField leadingIcon={icon} />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      const iconContainer = container.querySelector(
        `.${styles['leading-icon']}`
      );
      expect(iconContainer).toBeInTheDocument();
    });

    it('renders trailing icon', () => {
      const icon = <span data-testid='clear-icon'>✕</span>;
      const { container } = render(<InputField trailingIcon={icon} />);
      expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
      const iconContainer = container.querySelector(
        `.${styles['trailing-icon']}`
      );
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Prefix and Suffix', () => {
    it('renders prefix', () => {
      render(<InputField prefix='$' />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders suffix', () => {
      render(<InputField suffix='USD' />);
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('renders both prefix and suffix', () => {
      render(<InputField prefix='$' suffix='USD' />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
  });

  describe('Chips', () => {
    it('renders chips', () => {
      const chips = [{ label: 'Tag1' }, { label: 'Tag2' }];
      render(<InputField chips={chips} />);
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
    });

    it('limits visible chips to maxChipsVisible', () => {
      const chips = [
        { label: 'Tag1' },
        { label: 'Tag2' },
        { label: 'Tag3' },
        { label: 'Tag4' }
      ];
      render(<InputField chips={chips} maxChipsVisible={2} />);
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
      expect(screen.queryByText('Tag3')).not.toBeInTheDocument();
      expect(screen.queryByText('Tag4')).not.toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('renders dismissible chips with onRemove', () => {
      const handleRemove = vi.fn();
      const chips = [{ label: 'Tag1', onRemove: handleRemove }];
      const { container } = render(<InputField chips={chips} />);
      const chip = container.querySelector(`.${styles.chip}`);
      expect(chip).toBeInTheDocument();
    });

    it('shows overflow count correctly', () => {
      const chips = Array.from({ length: 5 }, (_, i) => ({
        label: `Tag${i + 1}`
      }));
      render(<InputField chips={chips} maxChipsVisible={3} />);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('handles onChange event', () => {
      const handleChange = vi.fn();
      render(<InputField onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', () => {
      const handleFocus = vi.fn();
      render(<InputField onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', () => {
      const handleBlur = vi.fn();
      render(<InputField onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('handles onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<InputField onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url'];
    it.each(inputTypes)('supports %s type', type => {
      const { container } = render(<InputField type={type} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', type);
    });
  });

  describe('Accessibility', () => {
    it('sets aria-invalid when error is present', () => {
      render(<InputField error='Invalid input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when no error', () => {
      render(<InputField />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('supports aria-label', () => {
      render(<InputField aria-label='Search input' />);
      const input = screen.getByLabelText('Search input');
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<InputField aria-describedby='description' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-required', () => {
      render(<InputField required aria-required='true' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Attributes', () => {
    it('supports name attribute', () => {
      render(<InputField name='email' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('supports id attribute', () => {
      render(<InputField id='email-input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('supports autoComplete attribute', () => {
      render(<InputField autoComplete='email' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('supports required attribute', () => {
      render(<InputField required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('supports readOnly attribute', () => {
      render(<InputField readOnly value='Read only text' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
    });

    it('supports maxLength attribute', () => {
      render(<InputField maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('supports pattern attribute', () => {
      render(<InputField pattern='[0-9]*' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });
  });
});
