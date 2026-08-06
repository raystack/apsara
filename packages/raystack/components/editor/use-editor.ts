'use client';

import { baseKeymap } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Slice } from 'prosemirror-model';
import {
  type Command,
  EditorState,
  Plugin,
  Selection,
  TextSelection
} from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './editor.module.css';
import {
  deriveDocDetails,
  docFromMarkup,
  type EditorDocDetails,
  flattenToInlineSlice,
  inlineFragmentFromText,
  isDocEmpty,
  serializeText,
  textFromFragment,
  textLength
} from './markup';
import { type MentionAttrs, mentionKey } from './mention';
import {
  MentionNodeView,
  type MentionPortal,
  type MentionPortalRegistry
} from './mention-node-view';
import { hardBreakType, mentionType } from './schema';
import {
  dismissSuggestion,
  insertMention as insertMentionAt,
  type SuggestionState,
  suggestionPlugin
} from './suggestion-plugin';

/** Marks transactions that came from outside the editor, so they are not echoed back. */
const EXTERNAL = 'apsara-editor-external';

export interface UseEditorOptions {
  /** Markup for the first document. Read once. */
  initialMarkup: string;
  /** Placeholder shown while the document is empty. */
  placeholder?: string;
  disabled?: boolean;
  spellCheck?: boolean;
  /** Cap on the derived plain text — a chip counts as its label. */
  maxLength?: number;
  /** Trigger characters currently registered by a `Mentions` part. */
  getTriggers?: () => string[];
  /** Fires for every document change the user made. */
  onChange?: (details: EditorDocDetails) => void;
  /** Enter with no active menu. */
  onSubmit?: () => void;
  onSuggestionChange?: (state: SuggestionState | null) => void;
  /** Return true to consume the key while a menu is open. */
  onSuggestionKeyDown?: (
    event: KeyboardEvent,
    state: SuggestionState
  ) => boolean;
}

export interface EditorActions {
  focus: () => void;
  /**
   * Replaces the document when `markup` differs from what the document already
   * serializes to. The compare is what keeps a controlled `value` from
   * resetting the caret on every keystroke.
   */
  setMarkup: (markup: string) => void;
  getDetails: () => EditorDocDetails;
  insertMention: (
    attrs: MentionAttrs,
    range?: { from: number; to: number }
  ) => void;
  /** Applies fresh labels from `resolveMentions` without touching history. */
  refreshMentionLabels: (labels: Map<string, string>) => void;
  dismissSuggestion: () => void;
}

export interface UseEditorResult {
  /** Attach to the element that becomes the editing host. */
  hostRef: (node: HTMLDivElement | null) => void;
  /**
   * Server and first-client markup for the host: the derived plain text, so a
   * restored draft is readable before ProseMirror takes the subtree over.
   */
  initialHtml: { __html: string };
  viewRef: React.RefObject<EditorView | null>;
  mentionPortals: MentionPortal[];
  actions: EditorActions;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Backspace/Delete take out the whole chip rather than selecting it first. */
function deleteAdjacentMention(direction: -1 | 1): Command {
  return (state, dispatch) => {
    if (!state.selection.empty) return false;
    const $pos = state.doc.resolve(state.selection.from);
    const node = direction === -1 ? $pos.nodeBefore : $pos.nodeAfter;
    if (!node || node.type !== mentionType) return false;
    if (dispatch) {
      const from = direction === -1 ? $pos.pos - node.nodeSize : $pos.pos;
      dispatch(state.tr.delete(from, from + node.nodeSize));
    }
    return true;
  };
}

/**
 * Arrow keys step over a chip in one press. ProseMirror's default for a
 * selectable inline atom is to make it a NodeSelection first, which puts a
 * selection ring on the chip on the way past it — a stop the user never asked
 * for while moving the caret through a sentence. Clicking a chip still selects
 * it, which is where the ring belongs.
 */
function moveOverMention(direction: -1 | 1): Command {
  return (state, dispatch) => {
    if (!state.selection.empty) return false;
    const $pos = state.doc.resolve(state.selection.from);
    const node = direction === -1 ? $pos.nodeBefore : $pos.nodeAfter;
    if (!node || node.type !== mentionType) return false;
    if (dispatch) {
      const target = $pos.pos + direction * node.nodeSize;
      dispatch(
        state.tr
          .setSelection(TextSelection.create(state.doc, target))
          .scrollIntoView()
      );
    }
    return true;
  };
}

const insertHardBreak: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr.replaceSelectionWith(hardBreakType.create()).scrollIntoView()
    );
  }
  return true;
};

export function useEditor(options: UseEditorOptions): UseEditorResult {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const viewRef = useRef<EditorView | null>(null);
  const hostNodeRef = useRef<HTMLDivElement | null>(null);
  const [mentionPortals, setMentionPortals] = useState<MentionPortal[]>([]);

  // Read once: after mount the document is the source of truth and incoming
  // markup arrives through `setMarkup`.
  const initialMarkupRef = useRef(options.initialMarkup);
  const initialHtml = useMemo(
    () => ({
      __html: escapeHtml(serializeText(docFromMarkup(initialMarkupRef.current)))
    }),
    []
  );

  const registry = useMemo<MentionPortalRegistry>(
    () => ({
      add: portal => setMentionPortals(current => [...current, portal]),
      update: (id, attrs) =>
        setMentionPortals(current =>
          current.map(portal =>
            portal.id === id ? { ...portal, attrs } : portal
          )
        ),
      remove: id =>
        setMentionPortals(current => current.filter(portal => portal.id !== id))
    }),
    []
  );

  const hostRef = useCallback((node: HTMLDivElement | null) => {
    hostNodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const host = hostNodeRef.current;
    if (!host) return;

    // ProseMirror owns this subtree from here on; the first-paint text is
    // dropped so the view starts from a clean slate.
    host.replaceChildren();

    let everFocused = false;
    let pointerFocus = false;

    const keysPlugin = new Plugin({
      props: {
        handleKeyDown(view, event) {
          if (event.key !== 'Enter') return false;
          // A composing Enter confirms the composition; it never submits and it
          // never reaches the document.
          if (event.isComposing || event.keyCode === 229) return true;
          if (event.shiftKey) return insertHardBreak(view.state, view.dispatch);
          optionsRef.current.onSubmit?.();
          return true;
        }
      }
    });

    const placeholderPlugin = new Plugin({
      props: {
        decorations(state) {
          const text = optionsRef.current.placeholder;
          if (!text || !isDocEmpty(state.doc)) return null;
          return DecorationSet.create(state.doc, [
            Decoration.node(0, state.doc.content.size, {
              class: styles.placeholder,
              'data-placeholder': text
            })
          ]);
        }
      }
    });

    const clipboardPlugin = new Plugin({
      props: {
        transformPasted: slice => flattenToInlineSlice(slice),
        clipboardTextParser: text =>
          new Slice(inlineFragmentFromText(text), 0, 0),
        clipboardTextSerializer: slice => textFromFragment(slice.content)
      }
    });

    // A bare `focus()` on an editing host places no caret. When focus arrives
    // from the frame rather than from a press inside the editor, drop the caret
    // at the end — the way clicking past the end of a textarea's text behaves.
    const focusPlugin = new Plugin({
      props: {
        handleDOMEvents: {
          mousedown: () => {
            pointerFocus = true;
            window.setTimeout(() => {
              pointerFocus = false;
            }, 0);
            return false;
          },
          touchstart: () => {
            pointerFocus = true;
            window.setTimeout(() => {
              pointerFocus = false;
            }, 0);
            return false;
          },
          focus: view => {
            const first = !everFocused;
            everFocused = true;
            if (!first || pointerFocus) return false;
            view.dispatch(
              view.state.tr
                .setSelection(Selection.atEnd(view.state.doc))
                .setMeta(EXTERNAL, true)
            );
            return false;
          }
        }
      }
    });

    // The composer is its own scroller, so the caret only ever has to be
    // brought into *it*. ProseMirror's own scroll-into-view walks every
    // scrollable ancestor up to the document, which nudges the page under the
    // composer by a pixel or two on any edit that changes the caret's position.
    const scrollPlugin = new Plugin({
      props: {
        handleScrollToSelection(view) {
          const host = view.dom as HTMLElement;
          let coords: { top: number; bottom: number };
          try {
            coords = view.coordsAtPos(view.state.selection.head);
          } catch {
            return true;
          }
          const box = host.getBoundingClientRect();
          if (coords.top < box.top) {
            host.scrollTop -= box.top - coords.top;
          } else if (coords.bottom > box.bottom) {
            host.scrollTop += coords.bottom - box.bottom;
          }
          return true;
        }
      }
    });

    // A cap on the derived text, enforced as a transaction filter so paste and
    // IME are covered and not just keystrokes.
    const maxLengthPlugin = new Plugin({
      filterTransaction(transaction, current) {
        const max = optionsRef.current.maxLength;
        if (max == null || !transaction.docChanged) return true;
        if (transaction.getMeta(EXTERNAL)) return true;
        const next = textLength(transaction.doc);
        return next <= max || next <= textLength(current.doc);
      }
    });

    const initialDoc = docFromMarkup(initialMarkupRef.current);

    const state = EditorState.create({
      doc: initialDoc,
      // A restored draft opens with the caret after it, the way reopening a
      // half-written message in any composer behaves.
      selection: Selection.atEnd(initialDoc),
      plugins: [
        // First in the list, so an open menu wins ↑ ↓ Enter Tab Escape.
        suggestionPlugin({
          getTriggers: () => optionsRef.current.getTriggers?.() ?? [],
          onStateChange: next => optionsRef.current.onSuggestionChange?.(next),
          onKeyDown: (event, suggestion) =>
            optionsRef.current.onSuggestionKeyDown?.(event, suggestion) ?? false
        }),
        keysPlugin,
        keymap({
          Backspace: deleteAdjacentMention(-1),
          Delete: deleteAdjacentMention(1),
          ArrowLeft: moveOverMention(-1),
          ArrowRight: moveOverMention(1),
          'Mod-z': undo,
          'Mod-y': redo,
          'Shift-Mod-z': redo
        }),
        history(),
        keymap(baseKeymap),
        maxLengthPlugin,
        scrollPlugin,
        placeholderPlugin,
        clipboardPlugin,
        focusPlugin
      ]
    });

    let editorView: EditorView | null = null;

    const view = new EditorView(
      { mount: host },
      {
        state,
        editable: () => !optionsRef.current.disabled,
        nodeViews: {
          mention: node => new MentionNodeView(node, registry)
        },
        dispatchTransaction(transaction) {
          if (!editorView) return;
          const next = editorView.state.apply(transaction);
          editorView.updateState(next);
          if (!transaction.docChanged) return;
          if (transaction.getMeta(EXTERNAL)) return;
          optionsRef.current.onChange?.(deriveDocDetails(next.doc));
        }
      }
    );

    editorView = view;
    viewRef.current = view;

    return () => {
      viewRef.current = null;
      view.destroy();
    };
  }, [registry]);

  // `editable` is read through a prop function, so ProseMirror needs a nudge to
  // re-read it when the composer is disabled or re-enabled.
  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.setProps({ editable: () => !options.disabled });
  }, [options.disabled]);

  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dom.spellcheck = options.spellCheck ?? true;
  }, [options.spellCheck]);

  // The placeholder is a decoration read from the options ref, so a changed
  // string needs a state update to redraw it. An empty transaction changes no
  // document, so it is never reported as a value change.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the dependency is the trigger, not a value the body reads
  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch(view.state.tr.setMeta(EXTERNAL, true));
  }, [options.placeholder]);

  const actions = useMemo<EditorActions>(
    () => ({
      focus: () => viewRef.current?.focus(),

      setMarkup: markup => {
        const view = viewRef.current;
        if (!view) return;
        if (deriveDocDetails(view.state.doc).markup === markup) return;
        const replacement = docFromMarkup(markup);
        const tr = view.state.tr;
        tr.replace(
          0,
          view.state.doc.content.size,
          new Slice(replacement.content, 0, 0)
        );
        tr.setSelection(Selection.atEnd(tr.doc));
        tr.setMeta(EXTERNAL, true);
        tr.setMeta('addToHistory', false);
        view.dispatch(tr);
      },

      getDetails: () => {
        const view = viewRef.current;
        if (!view) {
          return deriveDocDetails(docFromMarkup(initialMarkupRef.current));
        }
        return deriveDocDetails(view.state.doc);
      },

      insertMention: (attrs, range) => {
        const view = viewRef.current;
        if (!view) return;
        if (!range && !view.hasFocus()) {
          // Not focused: the chip belongs at the end of the draft.
          const end = Selection.atEnd(view.state.doc).from;
          insertMentionAt(view, attrs, { from: end, to: end });
        } else {
          insertMentionAt(view, attrs, range);
        }
        view.focus();
      },

      refreshMentionLabels: labels => {
        const view = viewRef.current;
        if (!view || labels.size === 0) return;
        const tr = view.state.tr;
        let changed = false;
        view.state.doc.descendants((node, pos) => {
          if (node.type !== mentionType) return;
          const attrs = node.attrs as MentionAttrs;
          const fresh = labels.get(
            mentionKey(attrs.trigger, attrs.type, attrs.id)
          );
          if (fresh && fresh !== attrs.label) {
            tr.setNodeMarkup(pos, undefined, { ...attrs, label: fresh });
            changed = true;
          }
        });
        if (!changed) return;
        tr.setMeta('addToHistory', false);
        view.dispatch(tr);
      },

      dismissSuggestion: () => {
        const view = viewRef.current;
        if (view) dismissSuggestion(view);
      }
    }),
    []
  );

  return { hostRef, initialHtml, viewRef, mentionPortals, actions };
}
