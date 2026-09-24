import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Toolbar } from '../../toolbar';
import { Editor } from '../editor';
import type { EditorApi } from '../editor-types';
import {
  contentOf,
  doc,
  flush,
  p,
  paste,
  pressKey,
  select
} from './test-utils';

function FixedEditor(props: Partial<Parameters<typeof Editor>[0]>) {
  return (
    <Editor {...props}>
      <Editor.Toolbar>
        <Editor.HistoryButton action='undo' />
        <Editor.HistoryButton action='redo' />
        <Toolbar.Separator />
        <Editor.HeadingMenu />
        <Editor.ListMenu />
        <Editor.BlockButton block='blockquote' />
        <Editor.BlockButton block='codeBlock' />
        <Editor.BlockButton block='horizontalRule' />
        <Toolbar.Separator />
        <Editor.MarkButton mark='bold' />
        <Editor.MarkButton mark='italic' />
        <Editor.LinkButton />
      </Editor.Toolbar>
      <Editor.Content />
    </Editor>
  );
}

function setup(props: Partial<Parameters<typeof Editor>[0]> = {}) {
  const actionsRef = createRef<EditorApi>();
  const result = render(
    <FixedEditor
      actionsRef={actionsRef}
      defaultValue={doc(p('Hello'))}
      {...props}
    />
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
  return { ...result, api, view, content: contentOf(result.container) };
}

describe('Editor.Toolbar', () => {
  it('renders a labelled toolbar', () => {
    setup();
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    expect(toolbar).toHaveAttribute('data-slot', 'editor-toolbar');
  });

  it('does not render when read only', () => {
    setup({ readOnly: true });
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('disables every control when disabled', () => {
    setup({ disabled: true });
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Text style' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  describe('MarkButton', () => {
    it('toggles the mark and reflects it with aria-pressed', () => {
      const { api, view } = setup();
      select(view(), 1, 6);
      const bold = screen.getByRole('button', { name: 'Bold' });
      expect(bold).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(bold);
      expect(api().getHTML()).toBe('<p><strong>Hello</strong></p>');
      expect(bold).toHaveAttribute('aria-pressed', 'true');
      expect(bold).toHaveAttribute('data-active');
    });

    it('prevents the mouse down, so the selection stays', () => {
      setup();
      const bold = screen.getByRole('button', { name: 'Bold' });
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true
      });
      bold.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('is disabled inside a code block', () => {
      const { view } = setup({
        defaultValue: doc({
          type: 'codeBlock',
          content: [{ type: 'text', text: 'x' }]
        })
      });
      select(view(), 1, 2);
      expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('renders nothing for a mark outside formats', () => {
      setup({ formats: ['italic'] });
      expect(screen.queryByRole('button', { name: 'Bold' })).toBeNull();
      expect(
        screen.getByRole('button', { name: 'Italic' })
      ).toBeInTheDocument();
    });

    it('shows the label and shortcut in a tooltip', async () => {
      setup();
      const bold = screen.getByRole('button', { name: 'Bold' });
      fireEvent.focus(bold);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
      });
      const tooltip = document.querySelector('[data-slot="tooltip-content"]');
      expect(tooltip).toHaveTextContent('Bold');
      expect(tooltip).toHaveTextContent('CtrlB');
    });
  });

  describe('BlockButton', () => {
    it('toggles a quote', () => {
      const { api, view } = setup();
      select(view(), 1, 1);
      fireEvent.click(screen.getByRole('button', { name: 'Quote' }));
      expect(api().getHTML()).toBe('<blockquote><p>Hello</p></blockquote>');
      expect(screen.getByRole('button', { name: 'Quote' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      fireEvent.click(screen.getByRole('button', { name: 'Quote' }));
      expect(api().getHTML()).toBe('<p>Hello</p>');
    });

    it('toggles a code block', () => {
      const { api, view } = setup();
      select(view(), 1, 1);
      fireEvent.click(screen.getByRole('button', { name: 'Code block' }));
      expect(api().getHTML()).toBe('<pre><code>Hello</code></pre>');
    });

    it('inserts a divider without a pressed state', () => {
      const { api, view } = setup();
      select(view(), 6, 6);
      const divider = screen.getByRole('button', { name: 'Divider' });
      expect(divider).not.toHaveAttribute('aria-pressed');
      fireEvent.click(divider);
      expect(api().getHTML()).toBe('<p>Hello</p><hr><p></p>');
    });
  });

  describe('HistoryButton', () => {
    it('is disabled until there is something to undo', () => {
      const { content } = setup();
      const undo = screen.getByRole('button', { name: 'Undo' });
      expect(undo).toHaveAttribute('aria-disabled', 'true');
      paste(content, '!');
      expect(undo).toHaveAttribute('aria-disabled', 'false');
      fireEvent.click(undo);
      expect(content).toHaveTextContent(/^Hello$/);
      expect(screen.getByRole('button', { name: 'Redo' })).toHaveAttribute(
        'aria-disabled',
        'false'
      );
    });
  });

  describe('HeadingMenu', () => {
    it('sets a heading from the menu', async () => {
      const { api, view } = setup();
      select(view(), 1, 1);
      const trigger = screen.getByRole('button', { name: 'Text style' });
      fireEvent.click(trigger);
      await flush();
      // The same element stays the trigger, so the menu keeps its anchor.
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toBeInTheDocument();
      const item = await screen.findByRole('menuitemradio', {
        name: /Heading 2/
      });
      fireEvent.click(item);
      await flush();
      expect(api().getHTML()).toBe('<h2>Hello</h2>');
    });

    it('marks the current style as checked', async () => {
      const { view } = setup();
      select(view(), 1, 1);
      fireEvent.click(screen.getByRole('button', { name: 'Text style' }));
      await flush();
      expect(
        await screen.findByRole('menuitemradio', { name: /Text/ })
      ).toHaveAttribute('aria-checked', 'true');
      expect(
        screen.getByRole('menuitemradio', { name: /Heading 1/ })
      ).toHaveAttribute('aria-checked', 'false');
    });

    it('lists only the given levels', async () => {
      render(
        <Editor>
          <Editor.Toolbar>
            <Editor.HeadingMenu levels={[1, 2]} />
          </Editor.Toolbar>
          <Editor.Content />
        </Editor>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Text style' }));
      await flush();
      expect(await screen.findAllByRole('menuitemradio')).toHaveLength(3);
    });
  });

  describe('ListMenu', () => {
    it('turns the paragraph into a checklist', async () => {
      const { api, view } = setup();
      select(view(), 1, 1);
      fireEvent.click(screen.getByRole('button', { name: 'List' }));
      await flush();
      fireEvent.click(
        await screen.findByRole('menuitemradio', { name: /Checklist/ })
      );
      await flush();
      expect(api().isActive('taskList')).toBe(true);
    });
  });

  describe('LinkButton', () => {
    it('opens a URL field and applies the link', async () => {
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

    it('opens with Mod-k', async () => {
      const { content, view } = setup();
      select(view(), 1, 6);
      pressKey(content, 'k', { ctrlKey: true });
      await flush();
      expect(
        await screen.findByRole('textbox', { name: 'Link URL' })
      ).toBeInTheDocument();
    });

    it('removes a link', async () => {
      const { api, view } = setup({
        defaultValue: doc({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [{ type: 'link', attrs: { href: 'https://a.b' } }]
            }
          ]
        })
      });
      select(view(), 2, 2);
      fireEvent.click(screen.getByRole('button', { name: 'Link' }));
      await flush();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Remove link' })
      );
      await flush();
      expect(api().getHTML()).toBe('<p>Hello</p>');
    });
  });

  it('moves focus into the toolbar with Alt-F10', () => {
    const { content } = setup();
    pressKey(content, 'F10', { altKey: true });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Text style' })
    );
  });
});

describe('Editor.FloatingToolbar', () => {
  function setupFloating(props: Partial<Parameters<typeof Editor>[0]> = {}) {
    const actionsRef = createRef<EditorApi>();
    const result = render(
      <Editor
        actionsRef={actionsRef}
        defaultValue={doc(p('Hello world'))}
        {...props}
      >
        <Editor.Content />
        <Editor.FloatingToolbar>
          <Editor.MarkButton mark='bold' />
          <Editor.LinkButton />
        </Editor.FloatingToolbar>
      </Editor>
    );
    const content = contentOf(result.container);
    const view = () => {
      const current = actionsRef.current?.view;
      if (!current) throw new Error('no view');
      return current;
    };
    const focus = () => {
      act(() => content.focus());
      fireEvent.focus(content);
    };
    return { ...result, content, view, focus, api: () => actionsRef.current };
  }

  it('shows for a text selection while the editor has focus', async () => {
    const { view, focus } = setupFloating();
    focus();
    expect(screen.queryByRole('toolbar')).toBeNull();
    select(view(), 1, 6);
    await flush();
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    expect(toolbar).toHaveAttribute('data-slot', 'editor-floating-toolbar');
  });

  it('hides when the selection collapses', async () => {
    const { view, focus } = setupFloating();
    focus();
    select(view(), 1, 6);
    await flush();
    select(view(), 3, 3);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('waits for the pointer to come up', async () => {
    const { view, focus, content } = setupFloating();
    focus();
    fireEvent.mouseDown(content);
    select(view(), 1, 6);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
    fireEvent.mouseUp(document);
    await flush();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('toggles a mark from the floating toolbar', async () => {
    const { view, focus, api } = setupFloating();
    focus();
    select(view(), 1, 6);
    await flush();
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(api()?.getHTML()).toBe('<p><strong>Hello</strong> world</p>');
  });

  it('swaps the buttons for the link field', async () => {
    const { view, focus, api } = setupFloating();
    focus();
    select(view(), 1, 6);
    await flush();
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
    const input = screen.getByRole('textbox', { name: 'Link URL' });
    fireEvent.change(input, { target: { value: 'https://raystack.org' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await flush();
    expect(api()?.getHTML()).toContain('href="https://raystack.org"');
  });

  it('does not show inside a code block', async () => {
    const { view, focus } = setupFloating({
      defaultValue: doc({
        type: 'codeBlock',
        content: [{ type: 'text', text: 'const a = 1' }]
      })
    });
    focus();
    select(view(), 1, 6);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('respects shouldShow', async () => {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor actionsRef={actionsRef} defaultValue={doc(p('Hello'))}>
        <Editor.Content />
        <Editor.FloatingToolbar shouldShow={() => false}>
          <Editor.MarkButton mark='bold' />
        </Editor.FloatingToolbar>
      </Editor>
    );
    const content = contentOf(container);
    act(() => content.focus());
    fireEvent.focus(content);
    const view = actionsRef.current?.view;
    if (!view) throw new Error('no view');
    select(view, 1, 6);
    await flush();
    expect(screen.queryByRole('toolbar')).toBeNull();
  });
});
