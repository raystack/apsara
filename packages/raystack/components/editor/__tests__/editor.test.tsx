import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { EditorJSON } from '../core/json';
import { Editor } from '../editor';
import styles from '../editor.module.css';
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
  describe('Rendering', () => {
    it('renders the root and an editable textbox', () => {
      const { container, content } = setup();
      const root = container.querySelector('[data-slot="editor"]');
      expect(root).toHaveClass(styles.root);
      expect(content).toHaveAttribute('role', 'textbox');
      expect(content).toHaveAttribute('aria-multiline', 'true');
      expect(content).toHaveAttribute('contenteditable', 'true');
      expect(screen.getByRole('textbox', { name: 'Description' })).toBe(
        content
      );
    });

    it('applies className to the root and the content', () => {
      const { container } = render(
        <Editor className='root-class'>
          <Editor.Content className='content-class' />
        </Editor>
      );
      expect(container.querySelector('[data-slot="editor"]')).toHaveClass(
        'root-class'
      );
      expect(contentOf(container)).toHaveClass('content-class');
    });

    it('renders defaultValue', () => {
      const { content } = setup({
        defaultValue: doc(
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Title' }]
          },
          p('Body')
        )
      });
      expect(content.querySelector('h2')).toHaveTextContent('Title');
      expect(content.querySelector('p')).toHaveTextContent('Body');
    });

    it('marks the root as empty until there is text', () => {
      const { container, content } = setup();
      const root = container.querySelector('[data-slot="editor"]');
      expect(root).toHaveAttribute('data-empty');
      paste(content, 'Hello');
      expect(root).not.toHaveAttribute('data-empty');
    });

    it('shows the placeholder on an empty doc', () => {
      const { content } = setup({ placeholder: 'Add description…' });
      expect(
        content.querySelector('[data-placeholder="Add description…"]')
      ).toBeInTheDocument();
      paste(content, 'x');
      expect(content.querySelector('[data-placeholder]')).toBeNull();
    });
  });

  describe('Value', () => {
    it('emits JSON and details on change', () => {
      const { content, onValueChange } = setup();
      paste(content, 'Hello');
      expect(onValueChange).toHaveBeenCalledTimes(1);
      const [value, details] = onValueChange.mock.calls[0];
      expect(value).toEqual(doc(p('Hello')));
      expect(details.empty).toBe(false);
      expect(details.getText()).toBe('Hello');
      expect(details.getHTML()).toBe('<p>Hello</p>');
      expect(details.getMentions()).toEqual([]);
      expect('getMarkdown' in details).toBe(false);
    });

    it('applies a controlled value without reporting it', () => {
      const onValueChange = vi.fn();
      const { container, rerender } = render(
        <Editor value={doc(p('One'))} onValueChange={onValueChange}>
          <Editor.Content />
        </Editor>
      );
      rerender(
        <Editor value={doc(p('Two'))} onValueChange={onValueChange}>
          <Editor.Content />
        </Editor>
      );
      expect(contentOf(container)).toHaveTextContent('Two');
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

    it('loads unknown nodes as text', () => {
      const { api } = setup({
        formats: ['bold'],
        defaultValue: doc(
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'a', marks: [{ type: 'italic' }] }]
          }
        )
      });
      expect(api().getJSON()).toEqual(doc(p('Title'), p('a')));
    });
  });

  describe('Shortcuts', () => {
    it('toggles bold with Mod-b', () => {
      const { content, view, api } = setup({ defaultValue: doc(p('Hello')) });
      select(view(), 1, 6);
      pressKey(content, 'b', { ctrlKey: true });
      expect(api().isActive('bold')).toBe(true);
      expect(api().getHTML()).toBe('<p><strong>Hello</strong></p>');
    });

    it('sets a heading with Mod-Alt-2', () => {
      const { content, view, api } = setup({ defaultValue: doc(p('Hello')) });
      select(view(), 1, 1);
      pressKey(content, '™', { ctrlKey: true, altKey: true, keyCode: 50 });
      expect(api().getHTML()).toBe('<h2>Hello</h2>');
    });

    it('turns a shortcut off with false', () => {
      const { content, view, api } = setup({
        defaultValue: doc(p('Hello')),
        shortcuts: { bold: false }
      });
      select(view(), 1, 6);
      pressKey(content, 'b', { ctrlKey: true });
      expect(api().isActive('bold')).toBe(false);
    });
  });

  describe('Input rules', () => {
    it.each([
      ['# ', '<h1></h1>'],
      ['### ', '<h3></h3>'],
      ['- ', '<ul><li><p></p></li></ul>'],
      ['1. ', '<ol><li><p></p></li></ol>'],
      ['> ', '<blockquote><p></p></blockquote>'],
      ['```', '<p>```</p>']
    ])('turns %j into a block', (input, html) => {
      const { view, api } = setup();
      typeText(view(), input);
      expect(api().getHTML()).toBe(html);
    });

    it('turns "[] " into a checklist', () => {
      const { view, api } = setup();
      typeText(view(), '[] ');
      expect(api().getJSON()).toEqual(
        doc({
          type: 'taskList',
          content: [
            { type: 'taskItem', attrs: { checked: false }, content: [p()] }
          ]
        })
      );
    });

    it.each([
      ['**bold**', '<p><strong>bold</strong></p>'],
      ['_it_', '<p><em>it</em></p>'],
      ['`code`', '<p><code>code</code></p>'],
      ['~~gone~~', '<p><s>gone</s></p>']
    ])('turns %j into a mark', (input, html) => {
      const { view, api } = setup();
      typeText(view(), input);
      expect(api().getHTML()).toBe(html);
    });

    it('skips rules for formats that are not allowed', () => {
      const { view, api } = setup({ formats: ['bold'] });
      typeText(view(), '# ');
      expect(api().getHTML()).toBe('<p># </p>');
    });
  });

  describe('States', () => {
    it('is not editable when disabled', () => {
      const { container, content } = setup({ disabled: true });
      expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute(
        'data-disabled'
      );
      expect(content).toHaveAttribute('contenteditable', 'false');
      expect(content).toHaveAttribute('aria-disabled', 'true');
    });

    it('is not editable when read only', () => {
      const { container, content } = setup({ readOnly: true });
      expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute(
        'data-readonly'
      );
      expect(content).toHaveAttribute('contenteditable', 'false');
      expect(content).toHaveAttribute('aria-readonly', 'true');
    });

    it('tracks focus on the root', () => {
      const { container, content } = setup();
      act(() => content.focus());
      fireEvent.focus(content);
      expect(container.querySelector('[data-slot="editor"]')).toHaveAttribute(
        'data-focused'
      );
    });
  });

  describe('API', () => {
    it('runs commands and dry runs', () => {
      const { api, view } = setup({ defaultValue: doc(p('Item')) });
      select(view(), 1, 1);
      expect(api().can.toggleList('bulletList')).toBe(true);
      expect(api().getHTML()).toBe('<p>Item</p>');
      expect(api().commands.toggleList('bulletList')).toBe(true);
      expect(api().getHTML()).toBe('<ul><li><p>Item</p></li></ul>');
      expect(api().isActive('bulletList')).toBe(true);
      api().commands.toggleList('orderedList');
      expect(api().getHTML()).toBe('<ol><li><p>Item</p></li></ol>');
      api().commands.toggleList('orderedList');
      expect(api().getHTML()).toBe('<p>Item</p>');
    });

    it('sets and removes a link', () => {
      const { api, view } = setup({ defaultValue: doc(p('Apsara')) });
      select(view(), 1, 7);
      expect(api().commands.setLink('raystack.org')).toBe(true);
      expect(api().getHTML()).toBe(
        '<p><a href="https://raystack.org" rel="noopener noreferrer nofollow">Apsara</a></p>'
      );
      expect(api().commands.setLink('javascript:alert(1)')).toBe(false);
      api().commands.unsetLink();
      expect(api().getHTML()).toBe('<p>Apsara</p>');
    });

    it('returns null from getMarkdown without the markdown prop', () => {
      const error = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const { api } = setup();
      expect(api().getMarkdown()).toBeNull();
      expect(error).toHaveBeenCalled();
      error.mockRestore();
    });

    it('sets and clears content, and reports it', () => {
      const { api, onValueChange } = setup();
      act(() => {
        api().commands.setContent(doc(p('New')));
      });
      expect(api().getText()).toBe('New');
      expect(onValueChange).toHaveBeenCalledTimes(1);
      act(() => {
        api().commands.clear();
      });
      expect(api().getJSON()).toEqual(doc(p()));
    });

    it('undoes and redoes', () => {
      const { api, content } = setup();
      paste(content, 'Hello');
      act(() => {
        api().commands.undo();
      });
      expect(api().getText()).toBe('');
      act(() => {
        api().commands.redo();
      });
      expect(api().getText()).toBe('Hello');
    });
  });
});
