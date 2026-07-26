import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../prompt-input';

const BasicPromptInput = (
  props: Partial<Parameters<typeof PromptInput>[0]>
) => (
  <PromptInput {...props}>
    <PromptInput.Header data-testid='header' />
    <PromptInput.Textarea placeholder='Reply…' />
    <PromptInput.Footer data-testid='footer'>
      <PromptInput.Submit data-testid='submit' />
    </PromptInput.Footer>
  </PromptInput>
);

describe('PromptInput', () => {
  describe('Basic Rendering', () => {
    it('renders the textarea and submit', () => {
      render(<BasicPromptInput />);

      expect(screen.getByPlaceholderText('Reply…')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Send message' })
      ).toBeInTheDocument();
    });

    it('applies custom className to the root form', () => {
      const { container } = render(
        <PromptInput className='custom-root'>
          <PromptInput.Textarea />
        </PromptInput>
      );
      expect(container.querySelector('form')).toHaveClass('custom-root');
    });

    it('renders header and footer slots', () => {
      render(<BasicPromptInput />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('throws when parts are used outside the root', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() => render(<PromptInput.Textarea />)).toThrow(
        /must be used within <PromptInput>/
      );
      spy.mockRestore();
    });
  });

  describe('Value and submission', () => {
    it('updates the value while typing and calls onValueChange', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput onValueChange={onValueChange} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, 'hello');

      expect(textarea).toHaveValue('hello');
      expect(onValueChange).toHaveBeenLastCalledWith('hello');
    });

    it('submits the trimmed value on Enter', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, '  hello world  ');
      await user.keyboard('{Enter}');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toBe('hello world');
    });

    it('inserts a newline on Shift+Enter instead of submitting', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, 'line one');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      await user.type(textarea, 'line two');

      expect(onSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('line one\nline two');
    });

    it('does not submit while composing with an IME', async () => {
      const onSubmit = vi.fn();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      fireEvent.change(textarea, { target: { value: 'かな' } });
      fireEvent.keyDown(textarea, { key: 'Enter', isComposing: true });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit when the value is empty or whitespace', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, '   ');
      await user.keyboard('{Enter}');

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits via the submit button', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      await user.type(screen.getByPlaceholderText('Reply…'), 'hi');
      await user.click(screen.getByRole('button', { name: 'Send message' }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toBe('hi');
    });

    it('supports a controlled value', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <BasicPromptInput value='controlled' onValueChange={onValueChange} />
      );

      const textarea = screen.getByPlaceholderText('Reply…');
      expect(textarea).toHaveValue('controlled');
      await user.type(textarea, '!');
      // Parent did not update the prop, so the value stays.
      expect(textarea).toHaveValue('controlled');
      expect(onValueChange).toHaveBeenCalledWith('controlled!');
    });

    it('clears the value when the form is reset from onSubmit', async () => {
      const onSubmit = vi.fn((_value, event) => event.currentTarget.reset());
      const user = userEvent.setup();
      render(<BasicPromptInput onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, 'clear me');
      await user.keyboard('{Enter}');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveValue('');
    });
  });

  describe('Submit button states', () => {
    it('is disabled while the value is empty', async () => {
      const user = userEvent.setup();
      render(<BasicPromptInput />);

      const submit = screen.getByRole('button', { name: 'Send message' });
      expect(submit).toBeDisabled();

      await user.type(screen.getByPlaceholderText('Reply…'), 'x');
      expect(submit).toBeEnabled();
    });

    it('becomes a stop control while streaming', async () => {
      const onStop = vi.fn();
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(
        <BasicPromptInput
          status='streaming'
          onStop={onStop}
          onSubmit={onSubmit}
        />
      );

      const stop = screen.getByRole('button', { name: 'Stop response' });
      expect(stop).toBeEnabled();
      expect(stop).toHaveAttribute('type', 'button');

      await user.click(stop);
      expect(onStop).toHaveBeenCalledTimes(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows the stop control while submitted', () => {
      render(<BasicPromptInput status='submitted' />);
      expect(
        screen.getByRole('button', { name: 'Stop response' })
      ).toBeInTheDocument();
    });

    it('does not submit on Enter while streaming', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<BasicPromptInput status='streaming' onSubmit={onSubmit} />);

      const textarea = screen.getByPlaceholderText('Reply…');
      await user.type(textarea, 'queued');
      await user.keyboard('{Enter}');

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('disables the textarea and submit', () => {
      render(<BasicPromptInput disabled />);

      expect(screen.getByPlaceholderText('Reply…')).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'Send message' })
      ).toBeDisabled();
    });
  });
});
