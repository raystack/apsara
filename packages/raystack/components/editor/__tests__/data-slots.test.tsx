import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getSlot } from '~/test-utils/data-slots';
import { Editor } from '../editor';
import type { EditorApi } from '../editor-types';
import { contentOf, doc, flush, p, paste, select } from './test-utils';

const PEOPLE = [{ id: 'u1', label: 'Maya Chen' }];

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

  it('renders the floating toolbar slot', async () => {
    const actionsRef = createRef<EditorApi>();
    const { container } = render(
      <Editor actionsRef={actionsRef} defaultValue={doc(p('Hello'))}>
        <Editor.Content />
        <Editor.FloatingToolbar>
          <Editor.MarkButton mark='bold' />
        </Editor.FloatingToolbar>
      </Editor>
    );
    const content = contentOf(container);
    act(() => content.focus());
    fireEvent.focus(content);
    const view = actionsRef.current?.view;
    if (!view) throw new Error('no view');
    expect(getSlot(document.body, 'editor-floating-toolbar')).toBeNull();
    select(view, 1, 6);
    await flush();
    expectSlots(document.body, ['editor-floating-toolbar']);
  });

  it('renders the menu slots while they are open', async () => {
    const { container } = render(
      <Editor>
        <Editor.Content />
        <Editor.SlashMenu />
        <Editor.Mentions items={PEOPLE} />
      </Editor>
    );
    const content = contentOf(container);
    expect(getSlot(document.body, 'editor-slash-menu')).toBeNull();
    paste(content, '/');
    await flush();
    expectSlots(document.body, ['editor-slash-menu']);
    paste(content, ' @');
    await flush();
    expectSlots(document.body, ['editor-mention-menu']);
  });
});
