import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../prompt-input';
import type { PromptInputMessage } from '../prompt-input-context';
import type { PromptInputActions } from '../prompt-input-root';

/**
 * The editor host. ProseMirror owns its subtree, so tests reach it the way a
 * user does — through events on this element — rather than through React.
 */
function editorOf(container: HTMLElement): HTMLElement {
  const node = container.querySelector('[role="textbox"]');
  if (!node) throw new Error('editor not found');
  return node as HTMLElement;
}

/**
 * jsdom has no contentEditable text input, so paste stands in for typing: it
 * goes through the same `clipboardTextParser` and transaction path a keystroke
 * would, and it is the one text-entry route ProseMirror exposes to synthetic
 * events.
 */
function type(element: HTMLElement, text: string) {
  fireEvent.paste(element, {
    clipboardData: {
      types: ['text/plain'],
      files: [],
      getData: (kind: string) => (kind === 'text/plain' ? text : '')
    }
  });
}

const flush = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

const Composer = (props: Partial<Parameters<typeof PromptInput>[0]>) => (
  <PromptInput {...props}>
    <PromptInput.Editor placeholder='Reply…' />
    <PromptInput.Footer>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
);

describe('PromptInput.Editor', () => {
  describe('Basic rendering', () => {
    it('renders a multiline textbox', () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      expect(editor).toHaveAttribute('aria-multiline', 'true');
      expect(editor).toHaveAttribute('contenteditable', 'true');
    });

    it('shows the placeholder while empty, through a decoration', () => {
      const { container } = render(<Composer />);

      expect(
        container.querySelector('[data-placeholder="Reply…"]')
      ).not.toBeNull();
    });

    it('drops the placeholder once there is content', () => {
      const { container } = render(<Composer defaultValue='hi' />);

      expect(container.querySelector('[data-placeholder]')).toBeNull();
    });

    it('keeps the placeholder behind whitespace only', () => {
      const { container } = render(<Composer defaultValue='   ' />);

      expect(container.querySelector('[data-placeholder]')).not.toBeNull();
    });

    it('throws when used outside the root', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      expect(() => render(<PromptInput.Editor />)).toThrow(
        /must be used within <PromptInput>/
      );
      spy.mockRestore();
    });
  });

  describe('Markup parsing', () => {
    it('renders a chip for a mention in defaultValue', () => {
      const { container } = render(
        <Composer defaultValue='check @[Button](component:button) tokens' />
      );

      const chip = container.querySelector('[data-mention]');
      expect(chip).not.toBeNull();
      expect(chip).toHaveAttribute('data-mention-id', 'button');
      expect(chip).toHaveAttribute('data-mention-type', 'component');
      expect(chip).toHaveAttribute('aria-label', 'mention: Button');
      // The pill carries the label alone; the trigger lives in the serialized
      // text and markup, where the mention boundary has to survive.
      expect(chip?.textContent).toBe('Button');
      expect(editorOf(container).textContent).toBe('check Button tokens');
    });

    it('reports the parsed mention through onValueChange when it changes', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <Composer
          defaultValue='@[Button](component:button) '
          onValueChange={onValueChange}
        />
      );

      type(editorOf(container), 'ping');

      const calls = onValueChange.mock.calls;
      const [markup, details] = calls[calls.length - 1];
      expect(markup).toBe('@[Button](component:button) ping');
      expect(details.text).toBe('@Button ping');
      expect(details.mentions).toHaveLength(1);
      expect(details.mentions[0]).toMatchObject({
        id: 'button',
        type: 'component',
        trigger: '@',
        start: 0,
        end: 7
      });
    });

    it('leaves prose that merely looks like markup literal', () => {
      const onValueChange = vi.fn();
      const { container } = render(<Composer onValueChange={onValueChange} />);

      type(editorOf(container), 'ship @[x](y:z) today');

      const calls = onValueChange.mock.calls;
      const [, details] = calls[calls.length - 1];
      expect(details.mentions).toHaveLength(0);
      expect(details.text).toBe('ship @[x](y:z) today');
      expect(container.querySelector('[data-mention]')).toBeNull();
    });
  });

  describe('Chip behavior', () => {
    const chipOf = (container: HTMLElement) =>
      container.querySelector('[data-mention]') as HTMLElement;

    it('steps the caret over a chip in one press, without selecting it', () => {
      const { container } = render(
        <Composer defaultValue='@[Button](component:button)' />
      );
      const editor = editorOf(container);

      // The caret opens after the chip; one press has to land it in front,
      // rather than putting a selection ring on the chip on the way past.
      fireEvent.keyDown(editor, { key: 'ArrowLeft' });

      expect(chipOf(container)).not.toHaveAttribute('data-selected');
      type(editor, 'x');
      expect(editor.textContent).toBe('xButton');
    });

    it('steps back over a chip on the way forward', () => {
      const { container } = render(
        <Composer defaultValue='@[Button](component:button)' />
      );
      const editor = editorOf(container);

      fireEvent.keyDown(editor, { key: 'ArrowLeft' });
      fireEvent.keyDown(editor, { key: 'ArrowRight' });

      expect(chipOf(container)).not.toHaveAttribute('data-selected');
      type(editor, 'x');
      expect(editor.textContent).toBe('Buttonx');
    });

    it('deletes the whole chip on one Backspace', () => {
      const { container } = render(
        <Composer defaultValue='@[Button](component:button)' />
      );
      const editor = editorOf(container);

      fireEvent.keyDown(editor, { key: 'Backspace' });

      expect(container.querySelector('[data-mention]')).toBeNull();
      expect(editor.textContent).toBe('');
    });

    it('deletes the whole chip on one Delete from in front of it', () => {
      const { container } = render(
        <Composer defaultValue='@[Button](component:button)' />
      );
      const editor = editorOf(container);

      fireEvent.keyDown(editor, { key: 'ArrowLeft' });
      fireEvent.keyDown(editor, { key: 'Delete' });

      expect(container.querySelector('[data-mention]')).toBeNull();
      expect(editor.textContent).toBe('');
    });
  });

  describe('Value model', () => {
    it('reports markup that round-trips back into value', () => {
      const onValueChange = vi.fn();
      const { container } = render(<Composer onValueChange={onValueChange} />);

      type(editorOf(container), 'hello');

      expect(onValueChange).toHaveBeenLastCalledWith('hello', {
        text: 'hello',
        mentions: []
      });
    });

    it('reverts a controlled value the parent did not accept', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <Composer value='controlled' onValueChange={onValueChange} />
      );

      type(editorOf(container), '!');

      expect(onValueChange).toHaveBeenCalledWith('controlled!', {
        text: 'controlled!',
        mentions: []
      });
      expect(editorOf(container).textContent).toBe('controlled');
    });

    it('re-parses a controlled value the parent did change', async () => {
      const Controlled = () => {
        const [value, setValue] = useState('plain');
        return (
          <>
            <button
              type='button'
              onClick={() => setValue('see @[Button](component:button)')}
            >
              swap
            </button>
            <Composer value={value} onValueChange={setValue} />
          </>
        );
      };
      const { container } = render(<Controlled />);

      expect(container.querySelector('[data-mention]')).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'swap' }));
      await flush();

      expect(container.querySelector('[data-mention]')).not.toBeNull();
      expect(editorOf(container).textContent).toBe('see Button');
    });

    it('leaves the caret alone when the value it is given matches', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <Composer defaultValue='abc' onValueChange={onValueChange} />
      );

      type(editorOf(container), 'd');
      const callsAfterFirst = onValueChange.mock.calls.length;
      type(editorOf(container), 'e');

      // A serialize-compare no-op would show up as extra change reports.
      expect(onValueChange.mock.calls.length).toBe(callsAfterFirst + 1);
      expect(editorOf(container).textContent).toBe('abcde');
    });

    it('clears when the form is reset from onSubmit', () => {
      const onSubmit = vi.fn(
        (
          _message: PromptInputMessage,
          event: { currentTarget: HTMLFormElement }
        ) => event.currentTarget.reset()
      );
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, 'clear me');
      fireEvent.keyDown(editor, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(editor.textContent).toBe('');
      expect(container.querySelector('[data-placeholder]')).not.toBeNull();
    });
  });

  describe('Emptiness and submission', () => {
    it('submits the trimmed message on Enter', () => {
      const onSubmit = vi.fn();
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, '  hello world  ');
      fireEvent.keyDown(editor, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({
        text: 'hello world',
        markup: 'hello world',
        mentions: []
      });
    });

    it('sends a message that is nothing but a chip', () => {
      const onSubmit = vi.fn();
      const { container } = render(
        <Composer
          defaultValue='@[Button](component:button) '
          onSubmit={onSubmit}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Send message' })
      ).toBeEnabled();

      fireEvent.keyDown(editorOf(container), { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      const message: PromptInputMessage = onSubmit.mock.calls[0][0];
      expect(message.text).toBe('@Button');
      expect(message.markup).toBe('@[Button](component:button)');
      expect(message.mentions).toHaveLength(1);
      expect(message.mentions[0]).toMatchObject({
        id: 'button',
        start: 0,
        end: 7
      });
    });

    it('does not submit whitespace, and marks the frame empty', () => {
      const onSubmit = vi.fn();
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, '   ');
      fireEvent.keyDown(editor, { key: 'Enter' });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(container.querySelector('form')).toHaveAttribute('data-empty');
      expect(
        screen.getByRole('button', { name: 'Send message' })
      ).toBeDisabled();
    });

    it('does not mark the frame empty for a chip-only draft', () => {
      const { container } = render(
        <Composer defaultValue='@[Button](component:button)' />
      );

      expect(container.querySelector('form')).not.toHaveAttribute('data-empty');
    });

    it('inserts a line break on Shift+Enter instead of submitting', () => {
      const onSubmit = vi.fn();
      const onValueChange = vi.fn();
      const { container } = render(
        <Composer onSubmit={onSubmit} onValueChange={onValueChange} />
      );
      const editor = editorOf(container);

      type(editor, 'line one');
      fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true });
      type(editor, 'line two');

      expect(onSubmit).not.toHaveBeenCalled();
      expect(onValueChange).toHaveBeenLastCalledWith('line one\nline two', {
        text: 'line one\nline two',
        mentions: []
      });
    });

    it('does not submit while composing with an IME', () => {
      const onSubmit = vi.fn();
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, 'かな');
      fireEvent.keyDown(editor, { key: 'Enter', isComposing: true });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit while a response is in flight', () => {
      const onSubmit = vi.fn();
      const { container } = render(
        <Composer status='streaming' onSubmit={onSubmit} />
      );
      const editor = editorOf(container);

      type(editor, 'queued');
      fireEvent.keyDown(editor, { key: 'Enter' });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('maxLength', () => {
    it('rejects text past the cap, including pasted text', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <PromptInput onValueChange={onValueChange}>
          <PromptInput.Editor maxLength={5} />
        </PromptInput>
      );
      const editor = editorOf(container);

      type(editor, 'abcde');
      type(editor, 'fgh');

      expect(editor.textContent).toBe('abcde');
      expect(onValueChange).toHaveBeenLastCalledWith('abcde', {
        text: 'abcde',
        mentions: []
      });
    });

    it('counts a chip as its label', () => {
      const { container } = render(
        <PromptInput defaultValue='@[Button](component:button)'>
          <PromptInput.Editor maxLength={7} />
        </PromptInput>
      );
      const editor = editorOf(container);

      // The derived text is "@Button" — exactly 7 characters counting the
      // trigger the chip does not render — so nothing more fits.
      type(editor, '!');
      expect(editor.textContent).toBe('Button');
    });

    it('never rejects the initial value', () => {
      const { container } = render(
        <PromptInput defaultValue='far longer than the cap'>
          <PromptInput.Editor maxLength={5} />
        </PromptInput>
      );

      expect(editorOf(container).textContent).toBe('far longer than the cap');
    });

    it('allows an edit that shrinks an already over-long document', () => {
      // Over the cap from the start — a restored draft, or a lowered cap. The
      // filter has to let it shrink or the composer would be frozen.
      const { container } = render(
        <PromptInput defaultValue='abcdefgh@[Button](component:button)'>
          <PromptInput.Editor maxLength={3} />
        </PromptInput>
      );
      const editor = editorOf(container);
      expect(editor.textContent).toBe('abcdefghButton');

      fireEvent.keyDown(editor, { key: 'Backspace' });

      expect(editor.textContent).toBe('abcdefgh');
    });
  });

  describe('Disabled', () => {
    it('makes the host non-editable and marks it', () => {
      const { container } = render(<Composer disabled />);
      const editor = editorOf(container);

      expect(editor).toHaveAttribute('contenteditable', 'false');
      expect(editor).toHaveAttribute('data-disabled');
      expect(editor).toHaveAttribute('aria-disabled', 'true');
    });

    it('re-enables when the root does', async () => {
      const Toggle = () => {
        const [disabled, setDisabled] = useState(true);
        return (
          <>
            <button type='button' onClick={() => setDisabled(false)}>
              enable
            </button>
            <Composer disabled={disabled} />
          </>
        );
      };
      const { container } = render(<Toggle />);

      expect(editorOf(container)).toHaveAttribute('contenteditable', 'false');

      fireEvent.click(screen.getByRole('button', { name: 'enable' }));
      await flush();

      expect(editorOf(container)).toHaveAttribute('contenteditable', 'true');
    });
  });

  describe('Click to focus', () => {
    it('focuses the editor when the frame is pressed', () => {
      const { container } = render(<Composer />);
      const form = container.querySelector('form') as HTMLFormElement;

      fireEvent.mouseDown(form);

      expect(editorOf(container)).toHaveFocus();
    });

    it('leaves a press inside the editor to ProseMirror', () => {
      const { container } = render(<Composer defaultValue='hello' />);

      const notCancelled = fireEvent.mouseDown(editorOf(container));

      expect(notCancelled).toBe(true);
    });
  });

  describe('actionsRef', () => {
    it('exposes focus, clear, getValue and insertMention', () => {
      const actionsRef = createRef<PromptInputActions>();
      const { container } = render(
        <PromptInput actionsRef={actionsRef} defaultValue='draft '>
          <PromptInput.Mentions trigger='@' items={[]} />
          <PromptInput.Editor />
        </PromptInput>
      );
      const editor = editorOf(container);

      expect(actionsRef.current).not.toBeNull();

      act(() => actionsRef.current?.focus());
      expect(editor).toHaveFocus();

      expect(actionsRef.current?.getValue()).toEqual({
        markup: 'draft ',
        text: 'draft ',
        mentions: []
      });

      act(() =>
        actionsRef.current?.insertMention({
          id: 'button',
          label: 'Button',
          type: 'component',
          data: { slug: 'zenith' }
        })
      );

      expect(
        container.querySelector('[data-mention-id="button"]')
      ).not.toBeNull();
      const value = actionsRef.current?.getValue();
      expect(value?.markup).toBe('draft @[Button](component:button) ');
      expect(value?.mentions[0].data).toEqual({ slug: 'zenith' });

      act(() => actionsRef.current?.clear());
      expect(editor.textContent).toBe('');
    });

    it('warns when insertMention is used without an Editor', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const actionsRef = createRef<PromptInputActions>();
      render(
        <PromptInput actionsRef={actionsRef}>
          <PromptInput.Textarea />
        </PromptInput>
      );

      act(() => actionsRef.current?.insertMention({ id: 'a', label: 'A' }));

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('insertMention requires')
      );
      warn.mockRestore();
    });
  });

  describe('Mutually exclusive input parts', () => {
    it('warns in development and keeps the first that mounted', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const { container } = render(
        <PromptInput>
          <PromptInput.Textarea placeholder='Reply…' />
          <PromptInput.Editor />
        </PromptInput>
      );

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('mutually exclusive')
      );

      fireEvent.mouseDown(container.querySelector('form') as HTMLFormElement);
      expect(screen.getByPlaceholderText('Reply…')).toHaveFocus();
      warn.mockRestore();
    });
  });
});
