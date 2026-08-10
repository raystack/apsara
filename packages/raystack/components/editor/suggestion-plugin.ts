import {
  type EditorState,
  Plugin,
  PluginKey,
  TextSelection
} from 'prosemirror-state';
import { Decoration, DecorationSet, type EditorView } from 'prosemirror-view';
import styles from './editor.module.css';
import type { MentionAttrs } from './mention';
import { editorSchema, mentionType } from './schema';

/** The active trigger and the query the user is typing after it. */
export interface SuggestionState {
  trigger: string;
  /** Text between the trigger and the caret. May contain spaces. */
  query: string;
  /** Document position of the trigger character. */
  from: number;
  /** Document position of the caret — the end of the query. */
  to: number;
}

interface SuggestionPluginState {
  active: SuggestionState | null;
  /**
   * A range the user dismissed with Escape or the space-cancel rule. Blocks
   * re-detection until the query changes, so the menu does not spring back.
   */
  dismissed: { from: number; query: string } | null;
}

export interface SuggestionPluginOptions {
  /** Trigger characters that are currently registered. */
  getTriggers: () => string[];
  /** Notified whenever the active query changes. */
  onStateChange: (state: SuggestionState | null) => void;
  /**
   * Called for every keydown while a query is active. Return true to consume
   * the key — the handler owns `preventDefault` and `stopPropagation`.
   */
  onKeyDown: (event: KeyboardEvent, state: SuggestionState) => boolean;
}

export const suggestionPluginKey = new PluginKey<SuggestionPluginState>(
  'apsara-suggestion'
);

/**
 * Stands in for atoms and hard breaks while scanning text, so a chip or a line
 * break reads as one non-word character and ends a query.
 */
const OBJECT = '￼';

/** Nothing plausible is a mention query past this many characters. */
const MAX_QUERY_LENGTH = 120;

function isBoundary(char: string): boolean {
  return char === '' || char === OBJECT || /\s/.test(char);
}

/**
 * Looks backwards from the caret for a trigger at a word boundary. Stops at
 * whitespace, so only a single-word query can *start* a menu — a query that
 * already contains a space is carried forward by the active state instead.
 */
function detect(
  selection: TextSelection,
  triggers: string[]
): SuggestionState | null {
  if (!selection.empty || triggers.length === 0) return null;
  const $from = selection.$from;
  if (!$from.parent.isTextblock) return null;

  const before = $from.parent.textBetween(
    0,
    $from.parentOffset,
    OBJECT,
    OBJECT
  );
  const blockStart = $from.start();
  const stop = Math.max(0, before.length - MAX_QUERY_LENGTH);

  for (let index = before.length - 1; index >= stop; index -= 1) {
    const char = before[index];
    if (char === OBJECT) break;
    if (triggers.includes(char)) {
      if (!isBoundary(index === 0 ? '' : before[index - 1])) continue;
      return {
        trigger: char,
        query: before.slice(index + 1),
        from: blockStart + index,
        to: blockStart + before.length
      };
    }
    if (/\s/.test(char)) break;
  }

  return null;
}

/**
 * Carries an active query across a transaction. Returns null when the query
 * can no longer be extended — the trigger was deleted, the caret left the
 * range, or a chip or line break landed inside it.
 */
function carry(
  active: SuggestionState,
  from: number,
  state: EditorState
): SuggestionState | null {
  if (!state.selection.empty) return null;
  const to = state.selection.from;
  if (from < 0 || from + 1 > state.doc.content.size || to <= from) return null;

  const $from = state.doc.resolve(from);
  const $to = state.doc.resolve(to);
  if (!$from.parent.isTextblock || $from.start() !== $to.start()) return null;
  if (
    state.doc.textBetween(from, from + 1, OBJECT, OBJECT) !== active.trigger
  ) {
    return null;
  }

  const query = state.doc.textBetween(from + 1, to, OBJECT, OBJECT);
  if (query.includes(OBJECT)) return null;

  return { trigger: active.trigger, query, from, to };
}

function sameState(
  a: SuggestionState | null,
  b: SuggestionState | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.trigger === b.trigger &&
    a.query === b.query &&
    a.from === b.from &&
    a.to === b.to
  );
}

export function suggestionPlugin(options: SuggestionPluginOptions): Plugin {
  // IME state is a view concern, not document state: a composition can span
  // several transactions and must never open the menu part-way through.
  let composing = false;

  return new Plugin<SuggestionPluginState>({
    key: suggestionPluginKey,

    state: {
      init: () => ({ active: null, dismissed: null }),

      apply(tr, previous, _old, next) {
        const meta = tr.getMeta(suggestionPluginKey) as
          | { type: 'dismiss' }
          | undefined;

        let dismissed = previous.dismissed
          ? {
              ...previous.dismissed,
              from: tr.mapping.map(previous.dismissed.from, -1)
            }
          : null;

        if (meta?.type === 'dismiss') {
          return {
            active: null,
            dismissed: previous.active
              ? { from: previous.active.from, query: previous.active.query }
              : dismissed
          };
        }

        if (previous.active) {
          const carried = carry(
            previous.active,
            tr.mapping.map(previous.active.from, -1),
            next
          );
          if (carried) return { active: carried, dismissed };
        }

        if (composing) return { active: null, dismissed };

        const detected =
          next.selection instanceof TextSelection
            ? detect(next.selection, options.getTriggers())
            : null;

        if (
          detected &&
          dismissed &&
          dismissed.from === detected.from &&
          dismissed.query === detected.query
        ) {
          return { active: null, dismissed };
        }

        if (detected) dismissed = null;
        return { active: detected, dismissed };
      }
    },

    props: {
      handleKeyDown(view, event) {
        const active = suggestionPluginKey.getState(view.state)?.active;
        if (!active) return false;
        return options.onKeyDown(event, active);
      },

      handleDOMEvents: {
        compositionstart: () => {
          composing = true;
          return false;
        },
        compositionend: () => {
          composing = false;
          return false;
        }
      },

      // The trigger and its query read as pending rather than as ordinary
      // text while the menu is open.
      decorations(state) {
        const active = suggestionPluginKey.getState(state)?.active;
        if (!active) return null;
        return DecorationSet.create(state.doc, [
          Decoration.inline(active.from, active.to, {
            class: styles.activeSuggestion
          })
        ]);
      }
    },

    view() {
      let last: SuggestionState | null = null;
      return {
        update(view) {
          const active =
            suggestionPluginKey.getState(view.state)?.active ?? null;
          if (sameState(active, last)) return;
          last = active;
          options.onStateChange(active);
        },
        destroy() {
          if (last) options.onStateChange(null);
        }
      };
    }
  });
}

/** Closes the menu and leaves the typed text literal. */
export function dismissSuggestion(view: EditorView): void {
  view.dispatch(
    view.state.tr.setMeta(suggestionPluginKey, { type: 'dismiss' })
  );
}

function isWhitespaceAt(state: EditorState, position: number): boolean {
  if (position >= state.doc.content.size) return false;
  return /\s/.test(
    state.doc.textBetween(position, position + 1, OBJECT, OBJECT)
  );
}

/**
 * Replaces `range` with a chip followed by a single space, caret after it.
 * With no range the chip lands at the caret.
 */
export function insertMention(
  view: EditorView,
  attrs: MentionAttrs,
  range?: { from: number; to: number }
): void {
  const { state } = view;
  const target = range ?? {
    from: state.selection.from,
    to: state.selection.to
  };

  const tr = state.tr;
  const nodes = [mentionType.create(attrs)];
  // Skip the trailing space when the caret already sits in front of one, so
  // picking a mention mid-sentence does not leave a gap.
  const spaced = isWhitespaceAt(state, target.to);
  if (!spaced) nodes.push(editorSchema.text(' '));

  tr.replaceWith(target.from, target.to, nodes);
  const caret = Math.min(target.from + (spaced ? 1 : 2), tr.doc.content.size);
  tr.setSelection(TextSelection.create(tr.doc, caret));
  tr.scrollIntoView();
  view.dispatch(tr);
}
