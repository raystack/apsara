import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { EditorJSON } from '../core/json';
import { Editor } from '../editor';
import styles from '../editor.module.css';
import { useEditor, useEditorState } from '../editor-context';
import type { EditorApi } from '../editor-types';
import {
  contentOf,
  doc,
  p,
  paste,
  pressKey,
  select,
  typeText
} from './test-utils';

function setup(props: Partial<Parameters<typeof Editor>[0]> = {}) {
  const actionsRef = createRef<EditorApi>();
  const onValueChange = vi.fn();
  const result = render(
    <Editor actionsRef={actionsRef} onValueChange={onValueChange} {...props}>
      <Editor.Content aria-label='Description' />
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
  return {
    ...result,
    api,
    view,
    onValueChange,
    content: contentOf(result.container)
  };
}

describe('Editor', () => {
  it('renders an editable textbox that is empty and shows the placeholder', () => {
    const { container, content } = setup({ placeholder: 'Add description…' });
    const root = container.querySelector('[data-slot="editor"]');
    expect(root).toHaveClass(styles.root);
    expect(screen.getByRole('textbox', { name: 'Description' })).toBe(content);
    expect(content).toHaveAttribute('aria-multiline', 'true');
    expect(content).toHaveAttribute('contenteditable', 'true');
    expect(root).toHaveAttribute('data-empty');
    expect(
      content.querySelector('[data-placeholder="Add description…"]')
    ).toBeInTheDocument();
    paste(content, 'Hello');
    expect(root).not.toHaveAttribute('data-empty');
    expect(content.querySelector('[data-placeholder]')).toBeNull();
  });

  it('emits JSON and details on change', () => {
    const { content, onValueChange } = setup();
    paste(content, 'Hello');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [value, details] = onValueChange.mock.calls[0];
    expect(value).toEqual(doc(p('Hello')));
    expect(details.empty).toBe(false);
    expect(details.getText()).toBe('Hello');
    expect(details.getHTML()).toBe('<p>Hello</p>');
    expect('getMarkdown' in details).toBe(false);
  });

  it('applies a controlled value with a new history and does not report it', () => {
    const actionsRef = createRef<EditorApi>();
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <Editor
        value={doc(p('One'))}
        actionsRef={actionsRef}
        onValueChange={onValueChange}
      >
        <Editor.Content />
      </Editor>
    );
    paste(contentOf(container), '!');
    expect(actionsRef.current?.can.undo()).toBe(true);
    onValueChange.mockClear();
    rerender(
      <Editor
        value={doc(p('Two'))}
        actionsRef={actionsRef}
        onValueChange={onValueChange}
      >
        <Editor.Content />
      </Editor>
    );
    expect(actionsRef.current?.getText()).toBe('Two');
    expect(actionsRef.current?.can.undo()).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps the caret when the controlled value is the one it emitted', () => {
    function Controlled() {
      const [value, setValue] = useState<EditorJSON>(doc(p()));
      return (
        <Editor value={value} onValueChange={setValue}>
          <Editor.Content />
        </Editor>
      );
    }
    const { container } = render(<Controlled />);
    const content = contentOf(container);
    paste(content, 'Hello');
    paste(content, ' world');
    expect(content).toHaveTextContent('Hello world');
  });

  it('runs shortcuts, and skips the keys turned off', () => {
    const on = setup({ defaultValue: doc(p('Hello')) });
    select(on.view(), 1, 6);
    pressKey(on.content, 'b', { ctrlKey: true });
    expect(on.api().getHTML()).toBe('<p><strong>Hello</strong></p>');
    act(() => {
      on.api().commands.undo();
    });
    pressKey(on.content, 'y', { ctrlKey: true });
    expect(on.api().isActive('bold')).toBe(true);
    on.unmount();

    const off = setup({
      defaultValue: doc(p('Hello')),
      shortcuts: { bold: false, redo: false }
    });
    select(off.view(), 1, 6);
    pressKey(off.content, 'b', { ctrlKey: true });
    expect(off.api().isActive('bold')).toBe(false);
    act(() => {
      off.api().commands.toggleMark('bold');
      off.api().commands.undo();
    });
    pressKey(off.content, 'y', { ctrlKey: true });
    expect(off.api().isActive('bold')).toBe(false);
  });

  it('applies input rules, and waits for a space after ***', () => {
    const cases = [
      ['# ', '<h1></h1>'],
      ['- ', '<ul><li><p></p></li></ul>'],
      ['*** ', '<hr><p></p>'],
      ['***bold', '<p>***bold</p>'],
      ['**bold**', '<p><strong>bold</strong></p>']
    ];
    for (const [input, html] of cases) {
      const { view, api, unmount } = setup();
      typeText(view(), input);
      expect(api().getHTML(), input).toBe(html);
      unmount();
    }
  });

  it('links the selection when a safe URL is pasted over it', () => {
    const { view, api, content } = setup({ defaultValue: doc(p('Apsara')) });
    select(view(), 1, 7);
    paste(content, 'javascript:alert(1)');
    expect(api().getHTML()).toBe('<p>javascript:alert(1)</p>');
    select(view(), 1, 20);
    paste(content, 'https://raystack.org');
    expect(api().getHTML()).toBe(
      '<p><a href="https://raystack.org" rel="noopener noreferrer nofollow">javascript:alert(1)</a></p>'
    );
  });

  it('follows readOnly and disabled when they change after mount', () => {
    const tasks = doc({
      type: 'taskList',
      content: [
        { type: 'taskItem', attrs: { checked: true }, content: [p('Docs')] }
      ]
    });
    const { container, rerender } = render(
      <Editor defaultValue={tasks}>
        <Editor.Content />
      </Editor>
    );
    const root = container.querySelector('[data-slot="editor"]');
    const content = contentOf(container);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeEnabled();

    rerender(
      <Editor defaultValue={tasks} readOnly>
        <Editor.Content />
      </Editor>
    );
    expect(root).toHaveAttribute('data-readonly');
    expect(content).toHaveAttribute('contenteditable', 'false');
    expect(content).toHaveAttribute('aria-readonly', 'true');
    expect(checkbox).toBeDisabled();

    rerender(
      <Editor defaultValue={tasks} disabled>
        <Editor.Content />
      </Editor>
    );
    expect(root).toHaveAttribute('data-disabled');
    expect(content).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toBeDisabled();

    rerender(
      <Editor defaultValue={tasks}>
        <Editor.Content />
      </Editor>
    );
    expect(content).toHaveAttribute('contenteditable', 'true');
    expect(checkbox).toBeEnabled();
  });

  it('keeps ProseMirror classes when the content class changes', () => {
    const { container, rerender } = render(
      <Editor>
        <Editor.Content className='first' />
      </Editor>
    );
    const content = contentOf(container);
    rerender(
      <Editor>
        <Editor.Content className='second' />
      </Editor>
    );
    expect(content).toHaveClass('ProseMirror', styles.content, 'second');
    expect(content).not.toHaveClass('first');
  });

  it('runs commands and dry runs from the api', () => {
    const { api, view, onValueChange } = setup({
      defaultValue: doc(p('Item'))
    });
    select(view(), 1, 1);
    expect(api().can.toggleList('bulletList')).toBe(true);
    expect(api().getHTML()).toBe('<p>Item</p>');
    expect(api().commands.toggleList('bulletList')).toBe(true);
    expect(api().getHTML()).toBe('<ul><li><p>Item</p></li></ul>');
    expect(api().isActive('bulletList')).toBe(true);
    act(() => {
      api().commands.setContent(doc(p('New')));
    });
    expect(api().getText()).toBe('New');
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it('re-renders a useEditorState reader only when its value changes', () => {
    const renders: string[] = [];
    function Probe() {
      const editor = useEditor();
      const text = useEditorState(state => state.doc.textContent);
      renders.push(text);
      return (
        <button
          type='button'
          onMouseDown={event => event.preventDefault()}
          onClick={() => editor.commands.toggleMark('bold')}
        >
          {text}
        </button>
      );
    }
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor defaultValue={doc(p('ab'))} actionsRef={actionsRef}>
        <Editor.Content />
        <Probe />
      </Editor>
    );
    const view = actionsRef.current?.view;
    if (!view) throw new Error('no view');
    const before = renders.length;
    select(view, 1, 3);
    select(view, 3, 3);
    expect(renders).toHaveLength(before);
    paste(contentOf(container), '!');
    expect(renders[renders.length - 1]).toBe('ab!');
    select(view, 1, 4);
    fireEvent.click(screen.getByRole('button', { name: 'ab!' }));
    expect(actionsRef.current?.getHTML()).toBe('<p><strong>ab!</strong></p>');
  });
});
