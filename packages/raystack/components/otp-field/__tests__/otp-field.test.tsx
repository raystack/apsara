import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OTPField } from '../otp-field';
import styles from '../otp-field.module.css';

const renderInputs = (length: number) =>
  Array.from({ length }, (_, i) => (
    <OTPField.Input
      key={i}
      data-testid={`slot-${i}`}
      aria-label={`Character ${i + 1} of ${length}`}
    />
  ));

const BasicOTPField = (
  props: Partial<Parameters<typeof OTPField>[0]> & { length?: number }
) => {
  const { length = 6, ...rest } = props;
  return (
    <OTPField length={length} {...rest}>
      {renderInputs(length)}
    </OTPField>
  );
};

describe('OTPField', () => {
  describe('Basic Rendering', () => {
    it('renders the expected number of input slots', () => {
      render(<BasicOTPField length={4} />);

      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`slot-${i}`)).toBeInTheDocument();
      }
    });

    it('applies the root className', () => {
      render(<BasicOTPField className='custom-root' data-testid='root' />);

      const root = screen.getByTestId('root');
      expect(root).toHaveClass(styles['otp-field']);
      expect(root).toHaveClass('custom-root');
    });

    it('applies the input className', () => {
      render(
        <OTPField length={2}>
          <OTPField.Input data-testid='slot-0' className='custom-slot' />
          <OTPField.Input data-testid='slot-1' />
        </OTPField>
      );

      const slot = screen.getByTestId('slot-0');
      expect(slot).toHaveClass(styles['otp-field-input']);
      expect(slot).toHaveClass('custom-slot');
    });

    it('renders the Separator subcomponent', () => {
      render(
        <OTPField length={2}>
          <OTPField.Input data-testid='slot-0' />
          <OTPField.Separator data-testid='separator' />
          <OTPField.Input data-testid='slot-1' />
        </OTPField>
      );

      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  describe('Controlled & Uncontrolled', () => {
    it('respects defaultValue', () => {
      render(<BasicOTPField length={4} defaultValue='12' />);

      expect(screen.getByTestId('slot-0')).toHaveValue('1');
      expect(screen.getByTestId('slot-1')).toHaveValue('2');
      expect(screen.getByTestId('slot-2')).toHaveValue('');
    });

    it('updates with controlled value', () => {
      const { rerender } = render(
        <BasicOTPField length={4} value='12' onValueChange={() => {}} />
      );
      expect(screen.getByTestId('slot-0')).toHaveValue('1');

      rerender(
        <BasicOTPField length={4} value='1234' onValueChange={() => {}} />
      );
      expect(screen.getByTestId('slot-3')).toHaveValue('4');
    });

    it('fires onValueChange when typing', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<BasicOTPField length={4} onValueChange={onValueChange} />);

      const first = screen.getByTestId('slot-0');
      first.focus();
      await user.keyboard('5');

      expect(onValueChange).toHaveBeenCalled();
      const lastCall =
        onValueChange.mock.calls[onValueChange.mock.calls.length - 1];
      expect(lastCall?.[0]).toBe('5');
    });

    it('fires onValueComplete when all slots are filled', async () => {
      const onValueComplete = vi.fn();
      const user = userEvent.setup();
      render(<BasicOTPField length={4} onValueComplete={onValueComplete} />);

      screen.getByTestId('slot-0').focus();
      await user.keyboard('1234');

      expect(onValueComplete).toHaveBeenCalled();
      const lastCall =
        onValueComplete.mock.calls[onValueComplete.mock.calls.length - 1];
      expect(lastCall?.[0]).toBe('1234');
    });
  });

  describe('Validation', () => {
    it('rejects non-numeric characters by default', async () => {
      const onValueInvalid = vi.fn();
      const user = userEvent.setup();
      render(<BasicOTPField length={4} onValueInvalid={onValueInvalid} />);

      const first = screen.getByTestId('slot-0');
      first.focus();
      await user.keyboard('a');

      expect(first).toHaveValue('');
      expect(onValueInvalid).toHaveBeenCalled();
    });

    it('accepts alpha characters when validationType is alpha', async () => {
      const user = userEvent.setup();
      render(<BasicOTPField length={4} validationType='alpha' />);

      const first = screen.getByTestId('slot-0');
      first.focus();
      await user.keyboard('a');

      expect(first).toHaveValue('a');
    });

    it('accepts both letters and digits when alphanumeric', async () => {
      const user = userEvent.setup();
      render(<BasicOTPField length={4} validationType='alphanumeric' />);

      screen.getByTestId('slot-0').focus();
      await user.keyboard('a1');

      expect(screen.getByTestId('slot-0')).toHaveValue('a');
      expect(screen.getByTestId('slot-1')).toHaveValue('1');
    });
  });

  describe('Disabled & ReadOnly', () => {
    it('marks slots as disabled', () => {
      render(<BasicOTPField length={4} disabled />);

      const first = screen.getByTestId('slot-0');
      expect(first).toBeDisabled();
    });

    it('does not change value when disabled', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <BasicOTPField length={4} disabled onValueChange={onValueChange} />
      );

      const first = screen.getByTestId('slot-0');
      await user.click(first);
      await user.keyboard('1');

      expect(first).toHaveValue('');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not change value when readOnly', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <BasicOTPField
          length={4}
          readOnly
          defaultValue='9'
          onValueChange={onValueChange}
        />
      );

      const first = screen.getByTestId('slot-0');
      first.focus();
      await user.keyboard('1');

      expect(first).toHaveValue('9');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Masking', () => {
    it('uses password input type when mask is set', () => {
      render(<BasicOTPField length={4} mask defaultValue='1' />);

      const first = screen.getByTestId('slot-0');
      expect(first).toHaveAttribute('type', 'password');
    });
  });

  describe('Keyboard navigation', () => {
    it('moves focus to the next slot after typing', async () => {
      const user = userEvent.setup();
      render(<BasicOTPField length={4} />);

      const first = screen.getByTestId('slot-0');
      first.focus();
      await user.keyboard('5');

      expect(screen.getByTestId('slot-1')).toHaveFocus();
    });

    it('moves focus back on Backspace', async () => {
      const user = userEvent.setup();
      render(<BasicOTPField length={4} defaultValue='12' />);

      screen.getByTestId('slot-1').focus();
      await user.keyboard('{Backspace}');

      // After deleting current value, backspace continues to previous slot.
      await user.keyboard('{Backspace}');
      expect(screen.getByTestId('slot-0')).toHaveFocus();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref on root', () => {
      const ref = vi.fn();
      render(
        <OTPField length={2} ref={ref}>
          {renderInputs(2)}
        </OTPField>
      );
      expect(ref).toHaveBeenCalled();
    });

    it('forwards ref on Input', () => {
      const ref = vi.fn();
      render(
        <OTPField length={2}>
          <OTPField.Input ref={ref} />
          <OTPField.Input />
        </OTPField>
      );
      expect(ref).toHaveBeenCalled();
    });
  });
});
