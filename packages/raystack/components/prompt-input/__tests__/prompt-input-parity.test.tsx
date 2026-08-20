import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../prompt-input';
import type { PromptInputMessage } from '../prompt-input-context';

/**
 * Keeping `PromptInput.Textarea` is what buys plain composers a composer with no
 * editor engine in it, and the price is two implementations of one contract.
 * This is the guard against them drifting: every case below runs against both
 * parts from one table.
 */
interface Substrate {
  name: string;
  render: (props: Partial<Parameters<typeof PromptInput>[0]>) => ReactElement;
  /** The element that receives keys — a textarea or an editing host. */
  input: (container: HTMLElement) => HTMLElement;
  /** Enters text the way that substrate accepts it in jsdom. */
  type: (element: HTMLElement, text: string) => void;
  /** The visible value. */
  read: (element: HTMLElement) => string;
  /**
   * Whether the placeholder is showing. A textarea has the native attribute; the
   * editor renders a decoration, because a ProseMirror-empty paragraph still
   * holds a trailing `<br>` and would defeat CSS `:empty`.
   */
  placeholderShown: (container: HTMLElement) => boolean;
}

const Frame = ({
  children,
  ...props
}: Partial<Parameters<typeof PromptInput>[0]> & { children: ReactElement }) => (
  <PromptInput {...props}>
    {children}
    <PromptInput.Footer>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
);

const substrates: Substrate[] = [
  {
    name: 'Textarea',
    render: props => (
      <Frame {...props}>
        <PromptInput.Textarea placeholder='Reply…' />
      </Frame>
    ),
    input: () => screen.getByPlaceholderText('Reply…'),
    type: (element, text) => {
      const field = element as HTMLTextAreaElement;
      fireEvent.change(field, { target: { value: field.value + text } });
    },
    read: element => (element as HTMLTextAreaElement).value,
    // A browser paints the native placeholder only while the value is empty.
    placeholderShown: container => {
      const field = container.querySelector<HTMLTextAreaElement>(
        '[placeholder="Reply…"]'
      );
      return field !== null && field.value === '';
    }
  },
  {
    name: 'Editor',
    render: props => (
      <Frame {...props}>
        <PromptInput.Editor placeholder='Reply…' />
      </Frame>
    ),
    input: container => {
      const node = container.querySelector('[role="textbox"]');
      if (!node) throw new Error('editor not found');
      return node as HTMLElement;
    },
    // jsdom has no contentEditable text input; paste is the one text-entry route
    // ProseMirror exposes to synthetic events, and it lands in the same place.
    type: (element, text) => {
      fireEvent.paste(element, {
        clipboardData: {
          types: ['text/plain'],
          files: [],
          getData: (kind: string) => (kind === 'text/plain' ? text : '')
        }
      });
    },
    read: element => element.textContent ?? '',
    placeholderShown: container =>
      container.querySelector('[data-placeholder="Reply…"]') !== null
  }
];

describe.each(substrates)('PromptInput shared contract — $name', substrate => {
  const setup = (props: Partial<Parameters<typeof PromptInput>[0]> = {}) => {
    const result = render(substrate.render(props));
    return { ...result, input: substrate.input(result.container) };
  };

  it('shows the placeholder while empty and drops it once there is content', () => {
    const { container, input } = setup();

    expect(substrate.placeholderShown(container)).toBe(true);

    substrate.type(input, 'x');
    expect(substrate.placeholderShown(container)).toBe(false);
  });

  it('reports value changes in the same shape', () => {
    const onValueChange = vi.fn();
    const { input } = setup({ onValueChange });

    substrate.type(input, 'hello');

    expect(onValueChange).toHaveBeenLastCalledWith('hello', {
      text: 'hello',
      mentions: []
    });
  });

  it('submits the trimmed message on Enter', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    substrate.type(input, '  hello world  ');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const message: PromptInputMessage = onSubmit.mock.calls[0][0];
    expect(message).toEqual({
      text: 'hello world',
      markup: 'hello world',
      mentions: []
    });
  });

  it('does not submit on Shift+Enter', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    substrate.type(input, 'line one');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit while composing with an IME', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    substrate.type(input, 'かな');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit an empty or whitespace-only value', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    fireEvent.keyDown(input, { key: 'Enter' });
    substrate.type(input, '   ');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('marks the frame empty until there is content', () => {
    const { container, input } = setup();
    const form = container.querySelector('form') as HTMLFormElement;

    expect(form).toHaveAttribute('data-empty');

    substrate.type(input, 'x');
    expect(form).not.toHaveAttribute('data-empty');
  });

  it('disables the submit button while empty', () => {
    const { input } = setup();
    const submit = screen.getByRole('button', { name: 'Send message' });

    expect(submit).toBeDisabled();

    substrate.type(input, 'x');
    expect(submit).toBeEnabled();
  });

  it('submits through the submit button', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    substrate.type(input, 'hi');
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].text).toBe('hi');
  });

  it('does not submit on Enter while streaming', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ status: 'streaming', onSubmit });

    substrate.type(input, 'queued');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('routes the stop control to onStop', () => {
    const onStop = vi.fn();
    setup({ status: 'streaming', onStop });

    const stop = screen.getByRole('button', { name: 'Stop response' });
    expect(stop).toHaveAttribute('type', 'button');

    fireEvent.click(stop);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('clears on form.reset() from onSubmit', () => {
    const onSubmit = vi.fn(
      (
        _message: PromptInputMessage,
        event: { currentTarget: HTMLFormElement }
      ) => event.currentTarget.reset()
    );
    const { input } = setup({ onSubmit });

    substrate.type(input, 'clear me');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(substrate.read(input)).toBe('');
  });

  it('renders defaultValue', () => {
    const { input } = setup({ defaultValue: 'restored draft' });
    expect(substrate.read(input)).toBe('restored draft');
  });

  it('keeps a controlled value the parent did not accept', () => {
    const { input } = setup({ value: 'controlled' });

    substrate.type(input, '!');

    expect(substrate.read(input)).toBe('controlled');
  });

  it('focuses the input when the frame is pressed', () => {
    const { container, input } = setup();
    const form = container.querySelector('form') as HTMLFormElement;

    const notCancelled = fireEvent.mouseDown(form);

    expect(notCancelled).toBe(false);
    expect(input).toHaveFocus();
  });

  it('leaves a press on the input itself alone', () => {
    const { input } = setup({ defaultValue: 'hello' });

    expect(fireEvent.mouseDown(input)).toBe(true);
  });

  it('does nothing on a frame press while disabled', () => {
    const { container, input } = setup({ disabled: true });
    const form = container.querySelector('form') as HTMLFormElement;

    fireEvent.mouseDown(form);

    expect(input).not.toHaveFocus();
  });

  it('keeps a literal markup-shaped string literal', () => {
    const onSubmit = vi.fn();
    const { input } = setup({ onSubmit });

    substrate.type(input, 'ship @[x](y:z) today');
    fireEvent.keyDown(input, { key: 'Enter' });

    const message: PromptInputMessage = onSubmit.mock.calls[0][0];
    expect(message.text).toBe('ship @[x](y:z) today');
    expect(message.mentions).toHaveLength(0);
  });
});
