import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Editor } from '../editor';
import styles from '../editor.module.css';
import type { EditorApi } from '../editor-types';
import { contentOf, doc, flush, p, pressKey, select } from './test-utils';

function setup() {
  const actionsRef = createRef<EditorApi>();
  const result = render(
    <Editor actionsRef={actionsRef} defaultValue={doc(p('Hello'))}>
      <Editor.Toolbar>
        <Editor.HeadingMenu />
        <Editor.MarkButton mark='bold' />
        <Editor.LinkButton />
      </Editor.Toolbar>
      <Editor.Content />
    </Editor>
  );
  const api = () => {
    if (!actionsRef.current) throw new Error('no api');
    return actionsRef.current;
  };
  const view = () => {
    const current = api().view;
    if (!current) throw new Error('no view');
    return current;
  };
  return { ...result, api, view };
}

describe('Editor.Toolbar', () => {
  it('toggles a mark, shows it with aria-pressed, and keeps the selection', () => {
    const { api, view } = setup();
    select(view(), 1, 6);
    const bold = screen.getByRole('button', { name: 'Bold' });
    expect(bold).toHaveAttribute('aria-pressed', 'false');
    expect(bold).toHaveClass(styles.control);
    const mouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true
    });
    bold.dispatchEvent(mouseDown);
    expect(mouseDown.defaultPrevented).toBe(true);
    fireEvent.click(bold);
    expect(api().getHTML()).toBe('<p><strong>Hello</strong></p>');
    expect(bold).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets a heading from the menu', async () => {
    const { api, view } = setup();
    select(view(), 1, 1);
    const trigger = screen.getByRole('button', { name: 'Text style' });
    fireEvent.click(trigger);
    await flush();
    // The same element stays the trigger, so the menu keeps its anchor.
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(
      await screen.findByRole('menuitemradio', { name: /Text/ })
    ).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(screen.getByRole('menuitemradio', { name: /Heading 2/ }));
    await flush();
    expect(api().getHTML()).toBe('<h2>Hello</h2>');
  });

  it('applies a link from the link field', async () => {
    const { api, view } = setup();
    select(view(), 1, 6);
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    await flush();
    const input = await screen.findByRole('textbox', { name: 'Link URL' });
    fireEvent.change(input, { target: { value: 'raystack.org' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await flush();
    expect(api().getHTML()).toContain('href="https://raystack.org"');
  });
});

describe('Editor.FloatingToolbar', () => {
  function setupFloating() {
    const actionsRef = createRef<EditorApi>();
    const result = render(
      <div>
        <button type='button'>Outside</button>
        <Editor actionsRef={actionsRef} defaultValue={doc(p('Hello world'))}>
          <Editor.Content />
          <Editor.FloatingToolbar>
            <Editor.MarkButton mark='bold' />
            <Editor.LinkButton />
            <Editor.BlockButton block='codeBlock' />
          </Editor.FloatingToolbar>
        </Editor>
      </div>
    );
    const content = contentOf(result.container);
    const view = () => {
      const current = actionsRef.current?.view;
      if (!current) throw new Error('no view');
      return current;
    };
    // Focuses the text and selects "Hello".
    const selectWord = async () => {
      act(() => content.focus());
      fireEvent.focus(content);
      select(view(), 1, 6);
      await flush();
    };
    const openLink = async () => {
      await selectWord();
      fireEvent.click(screen.getByRole('button', { name: 'Link' }));
      await flush();
      return screen.getByRole('textbox', { name: 'Link URL' });
    };
    return { ...result, content, view, selectWord, openLink };
  }

  it('shows for a text selection and hides when it collapses', async () => {
    const { view, selectWord } = setupFloating();
    expect(screen.queryByRole('toolbar')).toBeNull();
    await selectWord();
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' })
    ).toBeInTheDocument();
    select(view(), 3, 3);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('waits for the pointer to come up', async () => {
    const { content, selectWord } = setupFloating();
    fireEvent.mouseDown(content);
    await selectWord();
    expect(screen.queryByRole('toolbar')).toBeNull();
    fireEvent.mouseUp(document);
    await flush();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('hides on Escape until the selection changes', async () => {
    const { view, content, selectWord } = setupFloating();
    await selectWord();
    fireEvent.keyDown(screen.getByRole('button', { name: 'Bold' }), {
      key: 'Escape'
    });
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(document.activeElement).toBe(content);
    select(view(), 3, 3);
    select(view(), 1, 6);
    await flush();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('takes focus with Alt-F10 and returns it when a command hides the toolbar', async () => {
    const { content, selectWord } = setupFloating();
    await selectWord();
    pressKey(content, 'F10', { altKey: true });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Bold' })
    );
    const codeBlock = screen.getByRole('button', { name: 'Code block' });
    act(() => codeBlock.focus());
    fireEvent.click(codeBlock);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
    expect(document.activeElement).toBe(content);
  });

  it('swaps the buttons for the link field, also with Mod-k', async () => {
    const { content, selectWord, openLink } = setupFloating();
    const input = await openLink();
    expect(screen.queryByRole('toolbar')).toBeNull();
    fireEvent.change(input, { target: { value: 'https://raystack.org' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await flush();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();

    await selectWord();
    pressKey(content, 'k', { ctrlKey: true });
    await flush();
    expect(
      screen.getByRole('textbox', { name: 'Link URL' })
    ).toBeInTheDocument();
  });

  it('closes the link field on a press outside', async () => {
    const { openLink } = setupFloating();
    await openLink();
    const outside = screen.getByRole('button', { name: 'Outside' });
    fireEvent.pointerDown(outside);
    fireEvent.mouseDown(outside);
    act(() => outside.focus());
    fireEvent.click(outside);
    await flush();
    expect(screen.queryByRole('textbox', { name: 'Link URL' })).toBeNull();
  });

  it('closes the link field and returns to the text when Tab leaves it', async () => {
    const { content, openLink } = setupFloating();
    const input = await openLink();
    const guard = Array.from(
      document.querySelectorAll<HTMLElement>('[data-base-ui-focus-guard]')
    ).find(
      element =>
        element.compareDocumentPosition(input) &
        Node.DOCUMENT_POSITION_PRECEDING
    );
    if (!guard) throw new Error('no focus guard after the popup');
    act(() => guard.focus());
    await flush();
    expect(screen.queryByRole('textbox', { name: 'Link URL' })).toBeNull();
    expect(document.activeElement).toBe(content);
  });
});
