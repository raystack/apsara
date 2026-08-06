import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../prompt-input';
import type { PromptInputMessage } from '../prompt-input-context';
import type { PromptInputMentionItem } from '../prompt-input-mention-registry';

function editorOf(container: HTMLElement): HTMLElement {
  const node = container.querySelector('[role="textbox"]');
  if (!node) throw new Error('editor not found');
  return node as HTMLElement;
}

/** Stands in for typing; see the note in prompt-input-editor.test.tsx. */
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

const ITEMS: PromptInputMentionItem[] = [
  { id: 'button', label: 'Button', type: 'component', group: 'Components' },
  {
    id: 'data-table',
    label: 'DataTable',
    type: 'component',
    group: 'Components'
  },
  {
    id: 'dialog',
    label: 'Dialog',
    type: 'component',
    group: 'Components',
    disabled: true
  },
  { id: 'u1', label: 'Maya Chen', type: 'user', group: 'Users' },
  { id: 'u2', label: 'Dana Whitfield', type: 'user', group: 'Users' }
];

const Composer = ({
  mentions,
  ...props
}: Partial<Parameters<typeof PromptInput>[0]> & {
  mentions?: Partial<Parameters<typeof PromptInput.Mentions>[0]>;
}) => (
  <PromptInput {...props}>
    <PromptInput.Mentions items={ITEMS} {...mentions} />
    <PromptInput.Editor placeholder='Reply…' />
    <PromptInput.Footer>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
);

describe('PromptInput.Mentions', () => {
  describe('Opening', () => {
    it('opens on a trigger at the start of the document', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), '@');
      await flush();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(ITEMS.length);
    });

    it('opens on a trigger after whitespace', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), 'ping @');
      await flush();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('stays closed for a trigger inside a word', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), 'name@');
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('stays closed while the composer is disabled', async () => {
      const { container } = render(<Composer defaultValue='@' disabled />);

      fireEvent.keyDown(editorOf(container), { key: 'ArrowDown' });
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not render a menu at all without a Mentions part', async () => {
      const { container } = render(
        <PromptInput>
          <PromptInput.Editor />
        </PromptInput>
      );

      type(editorOf(container), '@');
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(editorOf(container)).not.toHaveAttribute('aria-autocomplete');
    });

    it('marks the trigger and its query as pending while open', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), '@may');
      await flush();

      // The decoration wraps the active range in its own span.
      const decorated = container.querySelector('[role="textbox"] span');
      expect(decorated?.textContent).toBe('@may');
    });

    it('reports open state through onOpenChange', async () => {
      const onOpenChange = vi.fn();
      const { container } = render(<Composer mentions={{ onOpenChange }} />);

      type(editorOf(container), '@');
      await flush();
      expect(onOpenChange).toHaveBeenLastCalledWith(true);

      fireEvent.keyDown(editorOf(container), { key: 'Escape' });
      await flush();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });
  });

  describe('Filtering and grouping', () => {
    it('renders groups in first-appearance order, ungrouped first', async () => {
      const { container } = render(
        <Composer
          mentions={{
            items: [{ id: 'x', label: 'Loose' }, ...ITEMS]
          }}
        />
      );

      type(editorOf(container), '@');
      await flush();

      const options = screen.getAllByRole('option').map(o => o.textContent);
      expect(options[0]).toBe('Loose');
      expect(options).toEqual([
        'Loose',
        'Button',
        'DataTable',
        'Dialog',
        'Maya Chen',
        'Dana Whitfield'
      ]);
    });

    it('filters on the label and drops groups that empty out', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), '@maya');
      await flush();

      const options = screen.getAllByRole('option').map(o => o.textContent);
      expect(options).toEqual(['Maya Chen']);
      expect(screen.queryByText('Components')).not.toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    // Only a single-word query can *open* the menu — the backward scan stops at
    // whitespace — so a multi-word query is carried forward by the active state,
    // exactly as it is when a user types the space.
    it('keeps a multi-word query filterable', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@Maya');
      await flush();
      type(editor, ' Ch');
      await flush();

      expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual([
        'Maya Chen'
      ]);
    });

    it('does not open for a multi-word query pasted in one go', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), '@Maya Chen');
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows the empty state for a single-word query with no matches', async () => {
      const { container } = render(
        <Composer mentions={{ emptyMessage: 'Nothing here' }} />
      );

      type(editorOf(container), '@zzzz');
      await flush();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('cancels once a query containing a space stops matching', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@Maya');
      await flush();
      type(editor, ' Ch');
      await flush();
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      type(editor, ' nope');
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      // The text stays exactly as it was typed.
      expect(editor.textContent).toBe('@Maya Ch nope');
    });

    it('keeps the menu open on a single-word query with no matches', async () => {
      const { container } = render(<Composer />);

      type(editorOf(container), '@zzzz');
      await flush();

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('auto-highlights the first enabled row', async () => {
      const { container } = render(
        <Composer
          mentions={{
            items: [
              { id: 'a', label: 'Off', disabled: true },
              { id: 'b', label: 'On' }
            ]
          }}
        />
      );

      type(editorOf(container), '@');
      await flush();

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'false');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Key routing', () => {
    it('moves the highlight with the arrows and skips disabled rows', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@');
      await flush();

      const selected = () =>
        screen
          .getAllByRole('option')
          .findIndex(o => o.getAttribute('aria-selected') === 'true');

      expect(selected()).toBe(0);

      fireEvent.keyDown(editor, { key: 'ArrowDown' });
      await flush();
      expect(selected()).toBe(1);

      // Index 2 is disabled, so it is skipped.
      fireEvent.keyDown(editor, { key: 'ArrowDown' });
      await flush();
      expect(selected()).toBe(3);

      fireEvent.keyDown(editor, { key: 'ArrowUp' });
      await flush();
      expect(selected()).toBe(1);
    });

    it('wraps around at the ends', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@');
      await flush();
      fireEvent.keyDown(editor, { key: 'ArrowUp' });
      await flush();

      const options = screen.getAllByRole('option');
      expect(options[options.length - 1]).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('tracks the highlight with aria-activedescendant', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@');
      await flush();

      const active = editor.getAttribute('aria-activedescendant');
      expect(active).toBeTruthy();
      expect(screen.getAllByRole('option')[0]).toHaveAttribute('id', active);
      expect(editor).toHaveAttribute('aria-expanded', 'true');
      expect(editor).toHaveAttribute(
        'aria-controls',
        screen.getByRole('listbox').id
      );
    });

    it('inserts on Enter and does not submit', async () => {
      const onSubmit = vi.fn();
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, 'ship @maya');
      await flush();
      fireEvent.keyDown(editor, { key: 'Enter' });
      await flush();

      expect(onSubmit).not.toHaveBeenCalled();
      // The chip renders its label alone; the trigger stays in the payload.
      expect(editor.textContent).toBe('ship Maya Chen ');
      expect(container.querySelector('[data-mention-id="u1"]')).not.toBeNull();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('inserts on Tab', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@maya');
      await flush();
      fireEvent.keyDown(editor, { key: 'Tab' });
      await flush();

      expect(editor.textContent).toBe('Maya Chen ');
    });

    it('closes on Escape, keeps the text literal, and reopens on a change', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@may');
      await flush();
      fireEvent.keyDown(editor, { key: 'Escape' });
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(editor.textContent).toBe('@may');

      type(editor, 'a');
      await flush();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('does not let Escape escape while the menu is open', async () => {
      const onKeyDownOutside = vi.fn();
      const { container } = render(
        <div onKeyDown={onKeyDownOutside}>
          <Composer />
        </div>
      );
      const editor = editorOf(container);

      type(editor, '@');
      await flush();
      fireEvent.keyDown(editor, { key: 'Escape' });

      expect(onKeyDownOutside).not.toHaveBeenCalled();
    });

    it('lets Escape bubble once the menu is closed', async () => {
      const onKeyDownOutside = vi.fn();
      const { container } = render(
        <div onKeyDown={onKeyDownOutside}>
          <Composer />
        </div>
      );

      fireEvent.keyDown(editorOf(container), { key: 'Escape' });

      expect(onKeyDownOutside).toHaveBeenCalled();
    });

    it('submits on Enter when the menu is open on an empty result set', async () => {
      const onSubmit = vi.fn();
      const { container } = render(<Composer onSubmit={onSubmit} />);
      const editor = editorOf(container);

      type(editor, '@zzzz');
      await flush();
      expect(screen.getByText('No results')).toBeInTheDocument();

      fireEvent.keyDown(editor, { key: 'Enter' });
      await flush();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0].text).toBe('@zzzz');
    });
  });

  describe('Pointer selection', () => {
    it('inserts on click without taking focus off the editor', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@maya');
      await flush();

      const option = screen.getByRole('option', { name: 'Maya Chen' });
      const notCancelled = fireEvent.pointerDown(option);
      expect(notCancelled).toBe(false);

      fireEvent.click(option);
      await flush();

      expect(editor.textContent).toBe('Maya Chen ');
    });

    it('dismisses on a press outside the composer, leaving the text literal', async () => {
      const { container } = render(
        <>
          <button type='button'>elsewhere</button>
          <Composer />
        </>
      );
      const editor = editorOf(container);

      type(editor, '@maya');
      await flush();
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'elsewhere' }));
      await flush();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(editor.textContent).toBe('@maya');
    });

    it('ignores a click on a disabled row', async () => {
      const { container } = render(<Composer />);
      const editor = editorOf(container);

      type(editor, '@Dial');
      await flush();

      fireEvent.click(screen.getByRole('option', { name: 'Dialog' }));
      await flush();

      expect(editor.textContent).toBe('@Dial');
    });
  });

  describe('Submit payload', () => {
    it('carries the picked item data and text offsets', async () => {
      const onSubmit = vi.fn();
      const { container } = render(
        <Composer
          onSubmit={onSubmit}
          mentions={{
            items: [
              {
                id: 'data-table',
                label: 'DataTable',
                type: 'component',
                data: { status: 'stable' }
              }
            ]
          }}
        />
      );
      const editor = editorOf(container);

      type(editor, 'ship @data');
      await flush();
      fireEvent.keyDown(editor, { key: 'Enter' });
      await flush();
      fireEvent.keyDown(editor, { key: 'Enter' });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      const message: PromptInputMessage = onSubmit.mock.calls[0][0];
      expect(message.markup).toBe('ship @[DataTable](component:data-table)');
      expect(message.text).toBe('ship @DataTable');
      expect(message.mentions).toEqual([
        {
          id: 'data-table',
          label: 'DataTable',
          type: 'component',
          trigger: '@',
          data: { status: 'stable' },
          start: 5,
          end: 15
        }
      ]);
      expect(message.text.slice(5, 15)).toBe('@DataTable');
    });
  });

  describe('Async search', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounces, shows skeleton rows, then the results', async () => {
      const onSearch = vi.fn(
        async (_query: string): Promise<PromptInputMentionItem[]> => [
          { id: 'data-table', label: 'DataTable', type: 'component' }
        ]
      );
      const { container } = render(
        <Composer
          mentions={{ items: undefined, onSearch, loadingRowCount: 2 }}
        />
      );
      const editor = editorOf(container);

      type(editor, '@d');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });

      expect(onSearch).not.toHaveBeenCalled();
      expect(
        screen.getByRole('listbox').querySelectorAll('[aria-hidden="true"]')
          .length
      ).toBeGreaterThanOrEqual(2);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch.mock.calls[0][0]).toBe('d');
      await waitFor(() =>
        expect(screen.getByRole('option', { name: 'DataTable' })).toBeVisible()
      );
    });

    it('makes one request for a query typed in two bursts', async () => {
      const onSearch = vi.fn(
        async (_query: string): Promise<PromptInputMentionItem[]> => []
      );
      const { container } = render(
        <Composer mentions={{ items: undefined, onSearch }} />
      );
      const editor = editorOf(container);

      type(editor, '@da');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(80);
      });
      type(editor, 'tatable');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch.mock.calls[0][0]).toBe('datatable');
    });

    it('aborts a superseded request and discards its result', async () => {
      const aborted: boolean[] = [];
      let resolveFirst: ((items: PromptInputMentionItem[]) => void) | null =
        null;

      const onSearch = vi.fn(
        (query: string, { signal }: { signal: AbortSignal }) => {
          if (query === 'da') {
            signal.addEventListener('abort', () => aborted.push(true));
            return new Promise<PromptInputMentionItem[]>(resolve => {
              resolveFirst = resolve;
            });
          }
          return Promise.resolve([
            { id: 'data-table', label: 'DataTable', type: 'component' }
          ]);
        }
      );

      const { container } = render(
        <Composer mentions={{ items: undefined, onSearch }} />
      );
      const editor = editorOf(container);

      type(editor, '@da');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      type(editor, 't');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      expect(aborted).toEqual([true]);

      // The stale resolution lands late and must be ignored.
      await act(async () => {
        resolveFirst?.([{ id: 'stale', label: 'Stale', type: 'component' }]);
        await Promise.resolve();
      });

      expect(screen.queryByText('Stale')).not.toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByRole('option', { name: 'DataTable' })).toBeVisible()
      );
    });

    it('falls back to the empty state when the search rejects', async () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const onSearch = vi.fn(
        async (_query: string): Promise<PromptInputMentionItem[]> => {
          throw new Error('offline');
        }
      );
      const { container } = render(
        <Composer mentions={{ items: undefined, onSearch }} />
      );

      type(editorOf(container), '@d');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      await waitFor(() =>
        expect(screen.getByText('No results')).toBeInTheDocument()
      );
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('onSearch rejected'),
        expect.any(Error)
      );
      warn.mockRestore();
    });

    // A re-render rather than a click: a press outside the composer is an
    // outside press, which legitimately dismisses the menu.
    it('does not restart an in-flight search when unrelated props change', async () => {
      const onSearch = vi.fn(
        async (_query: string): Promise<PromptInputMentionItem[]> => []
      );
      const { container, rerender } = render(
        <Composer status='idle' mentions={{ items: undefined, onSearch }} />
      );

      type(editorOf(container), '@d');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(80);
      });
      expect(onSearch).not.toHaveBeenCalled();

      // New inline `mentions` object, same data — the config must not churn.
      rerender(
        <Composer status='error' mentions={{ items: undefined, onSearch }} />
      );
      await act(async () => {
        await vi.advanceTimersByTimeAsync(120);
      });

      // Still the original 150 ms window, not a restarted one.
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch.mock.calls[0][0]).toBe('d');
    });
  });

  describe('Hydration through resolveMentions', () => {
    it('fills in the icon and a fresh label for a parsed chip', async () => {
      const resolveMentions = vi.fn(async () => [
        {
          id: 'data-table',
          label: 'DataTable v2',
          type: 'component',
          icon: <span data-testid='icon'>◆</span>
        }
      ]);
      const { container } = render(
        <Composer
          defaultValue='check @[DataTable](component:data-table)'
          mentions={{ resolveMentions }}
        />
      );

      // Label-only until it resolves — never a skeleton, never an error state.
      expect(container.querySelector('[data-mention]')?.textContent).toBe(
        'DataTable'
      );

      await waitFor(() => expect(screen.getByTestId('icon')).toBeVisible());

      expect(resolveMentions).toHaveBeenCalledWith([
        { type: 'component', id: 'data-table', label: 'DataTable' }
      ]);
      expect(
        container.querySelector('[data-mention]')?.getAttribute('aria-label')
      ).toBe('mention: DataTable v2');
    });

    it('batches every unresolved chip into one call', async () => {
      const resolveMentions = vi.fn(
        async (
          _refs: Array<{ type: string; id: string; label: string }>
        ): Promise<PromptInputMentionItem[]> => []
      );
      render(
        <Composer
          defaultValue='@[A](component:a) and @[B](user:b)'
          mentions={{ resolveMentions }}
        />
      );

      await waitFor(() => expect(resolveMentions).toHaveBeenCalledTimes(1));
      expect(resolveMentions.mock.calls[0][0]).toEqual([
        { type: 'component', id: 'a', label: 'A' },
        { type: 'user', id: 'b', label: 'B' }
      ]);
    });

    it('leaves the chip label-only when resolution rejects', async () => {
      const resolveMentions = vi.fn(async () => {
        throw new Error('nope');
      });
      const { container } = render(
        <Composer
          defaultValue='@[DataTable](component:data-table)'
          mentions={{ resolveMentions }}
        />
      );

      await waitFor(() => expect(resolveMentions).toHaveBeenCalled());
      await flush();

      const chip = container.querySelector('[data-mention]');
      expect(chip).not.toBeNull();
      expect(chip?.textContent).toBe('DataTable');
    });

    it('does not ask twice for the same reference', async () => {
      const resolveMentions = vi.fn(
        async (
          _refs: Array<{ type: string; id: string; label: string }>
        ): Promise<PromptInputMentionItem[]> => []
      );
      const { container } = render(
        <Composer
          defaultValue='@[DataTable](component:data-table) '
          mentions={{ resolveMentions }}
        />
      );

      await waitFor(() => expect(resolveMentions).toHaveBeenCalledTimes(1));

      type(editorOf(container), 'more text');
      await flush();

      expect(resolveMentions).toHaveBeenCalledTimes(1);
    });

    it('skips resolution for a chip already picked from the menu', async () => {
      const resolveMentions = vi.fn(
        async (
          _refs: Array<{ type: string; id: string; label: string }>
        ): Promise<PromptInputMentionItem[]> => []
      );
      const { container } = render(<Composer mentions={{ resolveMentions }} />);
      const editor = editorOf(container);

      type(editor, '@maya');
      await flush();
      fireEvent.keyDown(editor, { key: 'Enter' });
      await flush();

      expect(resolveMentions).not.toHaveBeenCalled();
    });
  });

  describe('Requires an Editor', () => {
    it('does nothing next to a Textarea and warns in development', async () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      render(
        <PromptInput>
          <PromptInput.Mentions items={ITEMS} />
          <PromptInput.Textarea placeholder='Reply…' />
        </PromptInput>
      );

      await flush();

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('requires <PromptInput.Editor>')
      );
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      warn.mockRestore();
    });

    it('stays quiet when an Editor is present', async () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      render(<Composer />);

      await flush();

      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });
});
