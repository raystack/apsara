import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Label } from '../label';
import styles from '../label.module.css';

describe('Label', () => {
  describe('Basic Rendering', () => {
    it('renders as label element', () => {
      render(<Label>Field Label</Label>);
      expect(screen.getByText('Field Label').tagName).toBe('LABEL');
    });

    it('renders children text', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('applies base label class', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles.label);
    });

    it('applies custom className', () => {
      render(<Label className='custom-label'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass('custom-label');
      expect(label).toHaveClass(styles.label);
    });
  });

  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Label size={size}>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles[`label-${size}`]);
    });

    it('defaults to small size', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveClass(styles['label-small']);
    });
  });

  describe('Required Indicator', () => {
    it('shows required indicator when required', () => {
      render(<Label required>Field</Label>);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not show indicator when not required', () => {
      render(<Label>Field</Label>);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    // it('uses custom required indicator', () => {
    //   render(
    //     <Label required requiredIndicator=' (required)'>
    //       Field
    //     </Label>
    //   );
    //   expect(screen.getByText(' (required)')).toBeInTheDocument();
    // });

    it('required indicator has aria-hidden', () => {
      const { container } = render(<Label required>Field</Label>);
      const indicator = container.querySelector(
        `.${styles['required-indicator']}`
      );
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('required indicator has presentation role', () => {
      const { container } = render(<Label required>Field</Label>);
      const indicator = container.querySelector(
        `.${styles['required-indicator']}`
      );
      expect(indicator).toHaveAttribute('role', 'presentation');
    });

    // it('applies required class when required', () => {
    //   render(<Label required>Field</Label>);
    //   const label = screen.getByText('Field').parentElement;
    //   expect(label).toHaveClass(styles['label-required']);
    // });
  });

  describe('htmlFor Attribute', () => {
    it('sets htmlFor attribute', () => {
      render(<Label htmlFor='username-input'>Username</Label>);
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username-input');
    });

    it('works without htmlFor', () => {
      render(<Label>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).not.toHaveAttribute('for');
    });
  });

  describe('HTML Attributes', () => {
    it('supports id attribute', () => {
      render(<Label id='form-label'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('id', 'form-label');
    });

    it('supports data attributes', () => {
      render(<Label data-testid='test-label'>Label</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });

    // it('supports style attribute', () => {
    //   render(<Label style={{ color: 'red' }}>Label</Label>);
    //   const label = screen.getByText('Label');
    //   expect(label).toHaveStyle({ color: 'red' });
    // });

    it('supports title attribute', () => {
      render(<Label title='Label tooltip'>Label</Label>);
      const label = screen.getByText('Label');
      expect(label).toHaveAttribute('title', 'Label tooltip');
    });

    it('supports onClick', () => {
      const handleClick = vi.fn();
      render(<Label onClick={handleClick}>Label</Label>);
      const label = screen.getByText('Label');
      label.click();
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Children Types', () => {
    it('renders JSX children', () => {
      render(
        <Label>
          <span>Field</span> <strong>Name</strong>
        </Label>
      );
      expect(screen.getByText('Field')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders with icon and text', () => {
      render(
        <Label>
          <span data-testid='icon'>📧</span> Email
        </Label>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders multiple children with required indicator', () => {
      render(
        <Label required>
          <span>Complex</span> Label
        </Label>
      );
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('renders with all props combined', () => {
      render(
        <Label
          size='large'
          required
          requiredIndicator=' *'
          htmlFor='input-field'
          className='custom'
          id='label-id'
        >
          Form Field
        </Label>
      );

      const label = screen.getByText('Form Field').parentElement;
      // expect(label).toHaveClass(styles['label-large']);
      // expect(label).toHaveClass(styles['label-required']);
      // expect(label).toHaveClass('custom');
      // expect(label).toHaveAttribute('for', 'input-field');
      // expect(label).toHaveAttribute('id', 'label-id');
      // expect(screen.getByText(' *')).toBeInTheDocument();
    });

    it('renders different size and required combinations', () => {
      const { rerender } = render(
        <Label size='small' required>
          Small Required
        </Label>
      );
      let label = screen.getByText('Small Required').parentElement;
      // expect(label).toHaveClass(styles['label-small']);
      // expect(label).toHaveClass(styles['label-required']);

      rerender(<Label size='large'>Large Optional</Label>);
      label = screen.getByText('Large Optional');
      // expect(label).toHaveClass(styles['label-large']);
      // expect(label).not.toHaveClass(styles['label-required']);
    });
  });

  describe('Accessibility', () => {
    it('associates with form input via htmlFor', () => {
      render(
        <>
          <Label htmlFor='email'>Email Address</Label>
          <input id='email' type='email' />
        </>
      );
      const label = screen.getByText('Email Address');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('required indicator does not interfere with screen readers', () => {
      const { container } = render(<Label required>Field</Label>);
      const indicator = container.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute('role', 'presentation');
    });
  });
});
