import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { EditorMentionItem } from '../core/mention-registry';
import { Editor } from '../editor';
import { defaultSlashItems } from '../editor-slash-items';
import type { EditorApi, EditorSlashItem } from '../editor-types';
import { contentOf, doc, flush, p, paste, pressKey } from './test-utils';

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
  it('opens on "/" with the default commands', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    paste(content, '/');
    await flush();
    expect(screen.getByRole('listbox', { name: 'Commands' })).toHaveAttribute(
      'data-slot',
      'editor-slash-menu'
    );
    expect(screen.getAllByRole('option')).toHaveLength(
      defaultSlashItems.length
    );
  });

  it('sets combobox attributes on the content while open', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    expect(content).toHaveAttribute('aria-expanded', 'false');
    paste(content, '/');
    await flush();
    const listbox = screen.getByRole('listbox');
    expect(content).toHaveAttribute('aria-expanded', 'true');
    expect(content).toHaveAttribute('aria-controls', listbox.id);
    expect(content.getAttribute('aria-activedescendant')).toBe(
      screen.getAllByRole('option')[0].id
    );
  });

  it('filters on labels and keywords', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    paste(content, '/todo');
    await flush();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Checklist');
  });

  it('runs the highlighted command on Enter and removes the query', async () => {
    const { content, api } = setup(<Editor.SlashMenu />);
    paste(content, '/code');
    await flush();
    pressKey(content, 'Enter');
    await flush();
    expect(api().getJSON()).toEqual(
      doc({ type: 'codeBlock', attrs: { language: null } })
    );
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('restores the query with one undo', async () => {
    const { content, api } = setup(<Editor.SlashMenu />);
    paste(content, '/h1');
    await flush();
    pressKey(content, 'Enter');
    await flush();
    expect(api().getHTML()).toBe('<h1></h1>');
    act(() => {
      api().commands.undo();
    });
    expect(api().getHTML()).toBe('<p>/h1</p>');
  });

  it('moves the highlight with the arrow keys', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    paste(content, '/');
    await flush();
    pressKey(content, 'ArrowDown');
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('closes on Escape and leaves the text', async () => {
    const { content, api } = setup(<Editor.SlashMenu />);
    paste(content, '/he');
    await flush();
    pressKey(content, 'Escape');
    await flush();
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(api().getText()).toBe('/he');
  });

  it('closes when the query gets a space', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    paste(content, '/he');
    await flush();
    paste(content, ' ');
    await flush();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not open in the middle of a word', async () => {
    const { content } = setup(<Editor.SlashMenu />);
    paste(content, 'and/or');
    await flush();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not open inside a code block', async () => {
    const { content } = setup(<Editor.SlashMenu />, {
      defaultValue: doc({ type: 'codeBlock' })
    });
    paste(content, '/');
    await flush();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('runs a custom item with the editor api', async () => {
    const run = vi.fn((editor: EditorApi) => {
      editor.commands.insertText('today');
    });
    const items: EditorSlashItem[] = [
      { id: 'date', label: "Today's date", keywords: ['time'], run }
    ];
    const { content, api } = setup(<Editor.SlashMenu items={items} />);
    paste(content, '/time');
    await flush();
    fireEvent.click(screen.getByRole('option', { name: /Today's date/ }));
    await flush();
    expect(run).toHaveBeenCalledTimes(1);
    expect(api().getText()).toBe('today');
  });

  it('hides built-in commands for formats that are not allowed', async () => {
    const { content } = setup(<Editor.SlashMenu />, {
      formats: ['bold', 'bulletList']
    });
    paste(content, '/');
    await flush();
    expect(
      screen.getAllByRole('option').map(option => option.textContent)
    ).toEqual(['TextCtrlAlt0', 'Bulleted listCtrlShift8']);
  });
});

describe('Editor.Mentions', () => {
  it('inserts a mention chip', async () => {
    const { content, api, onValueChange } = setup(
      <Editor.Mentions items={PEOPLE} />
    );
    paste(content, '@ma');
    await flush();
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'data-slot',
      'editor-mention-menu'
    );
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
    const details = onValueChange.mock.lastCall?.[1];
    expect(details.getMentions()).toEqual([
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

  it('groups results', async () => {
    const { content } = setup(<Editor.Mentions items={PEOPLE} />);
    paste(content, '@');
    await flush();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
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

  it('searches asynchronously', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onSearch = vi.fn(async (query: string) =>
      PEOPLE.filter(item => item.label.toLowerCase().includes(query))
    );
    const { content } = setup(<Editor.Mentions onSearch={onSearch} />);
    paste(content, '@ar');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(onSearch).toHaveBeenCalledWith('ar', expect.anything());
    expect(screen.getByRole('option')).toHaveTextContent('Arjun Rao');
    vi.useRealTimers();
  });

  it('renders nothing without the mention format', async () => {
    const { content } = setup(<Editor.Mentions items={PEOPLE} />, {
      formats: ['bold']
    });
    paste(content, '@');
    await flush();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('inserts a mention from the api', () => {
    const { api } = setup(<Editor.Mentions items={PEOPLE} />);
    act(() => {
      api().commands.insertMention(PEOPLE[1]);
    });
    expect(api().getText()).toBe('@Arjun Rao ');
  });
});
