import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Editor } from '../editor';
import type { EditorApi } from '../editor-types';
import { contentOf, doc, flush, p, paste, select } from './test-utils';

describe('Editor data-slot contract', () => {
  it('renders the root, content and fixed toolbar slots', async () => {
    const { container } = render(
      <Editor defaultValue={doc(p('Hello'))}>
        <Editor.Toolbar>
          <Editor.HistoryButton action='undo' />
          <Editor.HeadingMenu />
          <Editor.ListMenu />
          <Editor.BlockButton block='blockquote' />
          <Editor.MarkButton mark='bold' />
          <Editor.LinkButton />
        </Editor.Toolbar>
        <Editor.Content />
      </Editor>
    );
    expectSlots(container, [
      'editor',
      'editor-content',
      'editor-toolbar',
      'editor-history-button',
      'editor-heading-menu',
      'editor-list-menu',
      'editor-block-button',
      'editor-mark-button',
      'editor-link-button'
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    await flush();
    expectSlots(document.body, ['editor-link-form', 'editor-link-input']);
  });

  it('renders the floating toolbar and menu slots while they are open', async () => {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor actionsRef={actionsRef} defaultValue={doc(p('Hello'))}>
        <Editor.Content />
        <Editor.FloatingToolbar>
          <Editor.MarkButton mark='bold' />
        </Editor.FloatingToolbar>
        <Editor.SlashMenu />
        <Editor.Mentions items={[{ id: 'u1', label: 'Maya Chen' }]} />
      </Editor>
    );
    const content = contentOf(container);
    const view = actionsRef.current?.view;
    if (!view) throw new Error('no view');
    expect(getSlot(document.body, 'editor-floating-toolbar')).toBeNull();
    expect(getSlot(document.body, 'editor-slash-menu')).toBeNull();

    act(() => content.focus());
    fireEvent.focus(content);
    select(view, 1, 6);
    await flush();
    expectSlots(document.body, ['editor-floating-toolbar']);

    select(view, 6, 6);
    paste(content, ' /');
    await flush();
    expectSlots(document.body, ['editor-slash-menu']);
    paste(content, ' @');
    await flush();
    expectSlots(document.body, ['editor-mention-menu']);
  });
});
