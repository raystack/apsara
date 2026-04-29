import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../input';
import styles from '../input.module.css';

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Input className='custom-input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass(styles['input-field']);
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder='Enter text here' />);
      const input = screen.getByPlaceholderText('Enter text here');
      expect(input).toBeInTheDocument();
    });

    it('sets custom width', () => {
      const { container } = render(<Input width='300px' />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveStyle({ width: '300px' });
    });

    it('sets numeric width as pixels', () => {
      const { container } = render(<Input width={400} />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveStyle({ width: '400px' });
    });

    it('defaults to 100% width', () => {
      const { container } = render(<Input />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveStyle({ width: '100%' });
    });

    it('disables input when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Sizes', () => {
    it('renders large size by default', () => {
      const { container } = render(<Input />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveClass(styles['size-large']);
    });

    it('renders small size when specified', () => {
      const { container } = render(<Input size='small' />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveClass(styles['size-small']);
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      const { container } = render(<Input />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveClass(styles['variant-default']);
    });

    it('renders borderless variant when specified', () => {
      const { container } = render(<Input variant='borderless' />);
      const wrapper = container.querySelector(`.${styles['input-wrapper']}`);
      expect(wrapper).toHaveClass(styles['variant-borderless']);
    });
  });

  describe('Icons', () => {
    it('renders leading icon', () => {
      const icon = <span data-testid='search-icon'>🔍</span>;
      const { container } = render(<Input leadingIcon={icon} />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      const iconContainer = container.querySelector(
        `.${styles['leading-icon']}`
      );
      expect(iconContainer).toBeInTheDocument();
    });

    it('renders trailing icon', () => {
      const icon = <span data-testid='clear-icon'>✕</span>;
      const { container } = render(<Input trailingIcon={icon} />);
      expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
      const iconContainer = container.querySelector(
        `.${styles['trailing-icon']}`
      );
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Prefix and Suffix', () => {
    it('renders prefix', () => {
      render(<Input prefix='$' />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders suffix', () => {
      render(<Input suffix='USD' />);
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('renders both prefix and suffix', () => {
      render(<Input prefix='$' suffix='USD' />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
  });

  describe('Chips', () => {
    it('renders chips', () => {
      const chips = [{ label: 'Tag1' }, { label: 'Tag2' }];
      render(<Input chips={chips} />);
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
      render(<Input chips={chips} maxChipsVisible={2} />);
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
      expect(screen.queryByText('Tag3')).not.toBeInTheDocument();
      expect(screen.queryByText('Tag4')).not.toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('renders dismissible chips with onRemove', () => {
      const handleRemove = vi.fn();
      const chips = [{ label: 'Tag1', onRemove: handleRemove }];
      const { container } = render(<Input chips={chips} />);
      const chip = container.querySelector(`.${styles.chip}`);
      expect(chip).toBeInTheDocument();
    });

    it('shows overflow count correctly', () => {
      const chips = Array.from({ length: 5 }, (_, i) => ({
        label: `Tag${i + 1}`
      }));
      render(<Input chips={chips} maxChipsVisible={3} />);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('does not render dismiss button on chips when disabled', () => {
      const handleRemove = vi.fn();
      const chips = [{ label: 'Tag1', onRemove: handleRemove }];
      render(<Input chips={chips} disabled />);
      const dismissButton = screen.queryByRole('button', {
        name: 'Remove Tag1'
      });
      expect(dismissButton).not.toBeInTheDocument();
    });

    it('chips are non-interactive when disabled', () => {
      const handleRemove = vi.fn();
      const chips = [{ label: 'Tag1', onRemove: handleRemove }];
      const { container } = render(<Input chips={chips} disabled />);
      const chip = container.querySelector(`.${styles.chip}`);
      expect(chip).toHaveAttribute('data-disabled');
    });

    it('chips remain interactive when not disabled', () => {
      const handleRemove = vi.fn();
      const chips = [{ label: 'Tag1', onRemove: handleRemove }];
      render(<Input chips={chips} />);
      const dismissButton = screen.getByRole('button', {
        name: 'Remove Tag1'
      });
      fireEvent.click(dismissButton);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Handling', () => {
    it('handles onChange event', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('handles onFocus event', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles onBlur event', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('handles onKeyDown event', () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    const inputTypes = ['text', 'email', 'password', 'number', 'tel', 'url'];
    it.each(inputTypes)('supports %s type', type => {
      const { container } = render(<Input type={type} />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', type);
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label='Search input' />);
      const input = screen.getByLabelText('Search input');
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(<Input aria-describedby='description' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports aria-required', () => {
      render(<Input required aria-required='true' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Attributes', () => {
    it('supports name attribute', () => {
      render(<Input name='email' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('supports id attribute', () => {
      render(<Input id='email-input' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('supports autoComplete attribute', () => {
      render(<Input autoComplete='email' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('supports required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('supports readOnly attribute', () => {
      render(<Input readOnly value='Read only text' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
    });

    it('supports maxLength attribute', () => {
      render(<Input maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('supports pattern attribute', () => {
      render(<Input pattern='[0-9]*' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });
  });
});
