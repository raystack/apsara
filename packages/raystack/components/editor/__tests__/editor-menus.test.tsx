import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { EditorMentionItem } from '../core/mention-registry';
import { Editor } from '../editor';
import { defaultSlashItems } from '../editor-slash-items';
import type { EditorApi, EditorSlashItem } from '../editor-types';
import {
  contentOf,
  doc,
  flush,
  p,
  paste,
  pressKey,
  select
} from './test-utils';

const PEOPLE: EditorMentionItem[] = [
  { id: 'u1', label: 'Maya Chen', type: 'user', group: 'People' },
  { id: 'u2', label: 'Arjun Rao', type: 'user', group: 'People' },
  { id: 'i1', label: 'ENG-214', type: 'issue', group: 'Issues' }
];

function setup(
  children: React.ReactNode,
  props: Partial<Parameters<typeof Editor>[0]> = {}
) {
  const actionsRef = createRef<EditorApi>();
  const onValueChange = vi.fn();
  const result = render(
    <Editor actionsRef={actionsRef} onValueChange={onValueChange} {...props}>
      <Editor.Content />
      {children}
    </Editor>
  );
  const api = () => {
    if (!actionsRef.current) throw new Error('no api');
    return actionsRef.current;
  };
  return {
    ...result,
    api,
    onValueChange,
    content: contentOf(result.container)
  };
}

describe('Editor.SlashMenu', () => {
  it('opens on "/", sets combobox attributes and filters on keywords', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    expect(content).toHaveAttribute('aria-autocomplete', 'list');
    paste(content, '/');
    await flush();
    const listbox = screen.getByRole('listbox', { name: 'Commands' });
    expect(screen.getAllByRole('option')).toHaveLength(
      defaultSlashItems.length
    );
    // `role="textbox"` does not allow `aria-expanded`.
    expect(content).not.toHaveAttribute('aria-expanded');
    expect(content).toHaveAttribute('aria-controls', listbox.id);
    expect(content.getAttribute('aria-activedescendant')).toBe(
      screen.getAllByRole('option')[0].id
    );
    paste(content, 'todo');
    await flush();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Checklist');
  });

  it('runs a command on Enter, and one undo brings the query back', async () => {
    const { content, api } = setup(<Editor.SlashMenu />);
    paste(content, '/h1');
    await flush();
    pressKey(content, 'Enter');
    await flush();
    expect(api().getHTML()).toBe('<h1></h1>');
    expect(screen.queryByRole('listbox')).toBeNull();
    act(() => {
      api().commands.undo();
    });
    expect(api().getHTML()).toBe('<p>/h1</p>');
  });

  it('runs a custom item with the editor api and shows its description', async () => {
    const run = vi.fn((editor: EditorApi) => {
      editor.commands.insertText('today');
    });
    const items: EditorSlashItem[] = [
      { id: 'date', label: 'Date', description: 'Insert a dated line', run },
      { id: 'other', label: 'Other', run: () => undefined }
    ];
    const { content, api } = setup(<Editor.SlashMenu items={items} />);
    paste(content, '/dated');
    await flush();
    const option = screen.getByRole('option');
    expect(option).toHaveTextContent('DateInsert a dated line');
    fireEvent.click(option);
    await flush();
    expect(run).toHaveBeenCalledTimes(1);
    expect(api().getText()).toBe('today');
  });

  it('hides built-in commands for formats that are not allowed, for copies too', async () => {
    const { content } = setup(
      <Editor.SlashMenu items={defaultSlashItems.map(item => ({ ...item }))} />,
      { formats: ['bold', 'bulletList'] }
    );
    paste(content, '/');
    await flush();
    expect(
      screen.getAllByRole('option').map(option => option.textContent)
    ).toEqual(['TextCtrlAlt0', 'Bulleted listCtrlShift8']);
  });

  it('disables a command that cannot run at the caret', async () => {
    const { content, api } = setup(<Editor.SlashMenu />, {
      defaultValue: doc({
        type: 'bulletList',
        content: [{ type: 'listItem', content: [p()] }]
      })
    });
    const view = api().view;
    if (!view) throw new Error('no view');
    select(view, 3, 3);
    paste(content, '/h1');
    await flush();
    expect(screen.getByRole('option', { name: /Heading 1/ })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    pressKey(content, 'Enter');
    await flush();
    expect(api().getText()).toContain('/h1');
    expect(api().isActive('heading')).toBe(false);
  });
});

describe('Editor.Mentions', () => {
  it('inserts a mention chip', async () => {
    const { content, api, onValueChange } = setup(
      <Editor.Mentions items={PEOPLE} />
    );
    paste(content, '@ma');
    await flush();
    pressKey(content, 'Enter');
    await flush();
    expect(api().getJSON()).toEqual(
      doc(
        p(
          {
            type: 'mention',
            attrs: { id: 'u1', label: 'Maya Chen', type: 'user', trigger: '@' }
          },
          ' '
        )
      )
    );
    expect(onValueChange.mock.lastCall?.[1].getMentions()).toEqual([
      {
        id: 'u1',
        label: 'Maya Chen',
        type: 'user',
        trigger: '@',
        start: 0,
        end: 10
      }
    ]);
    expect(content.querySelector('[data-mention-id="u1"]')).toHaveTextContent(
      'Maya Chen'
    );
  });

  it('supports one menu per trigger', async () => {
    const { content } = setup(
      <>
        <Editor.Mentions items={PEOPLE.slice(0, 2)} />
        <Editor.Mentions trigger='#' items={PEOPLE.slice(2)} />
      </>
    );
    paste(content, '#');
    await flush();
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('ENG-214');
  });

  it('fills in labels from resolveMentions without reporting a change', async () => {
    const resolveMentions = vi.fn(async () => [
      { id: 'u1', label: 'Maya Chen', type: 'user' }
    ]);
    const { content, onValueChange } = setup(
      <Editor.Mentions resolveMentions={resolveMentions} />,
      {
        defaultValue: doc(
          p({
            type: 'mention',
            attrs: { id: 'u1', label: 'Maya', type: 'user', trigger: '@' }
          })
        )
      }
    );
    await flush();
    expect(resolveMentions).toHaveBeenCalledWith([
      { id: 'u1', label: 'Maya', type: 'user' }
    ]);
    expect(content.querySelector('[data-mention-id="u1"]')).toHaveTextContent(
      'Maya Chen'
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
