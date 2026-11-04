import { Slice } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';
import { EXTERNAL, insertHardBreak } from '../editor/core/base';
import {
  flattenToInlineSlice,
  inlineFragmentFromText,
  textLength
} from './prompt-input-markup';

export interface PromptInputPluginOptions {
  /** Enter with no open menu. */
  onSubmit: () => void;
  getMaxLength: () => number | undefined;
}

/**
 * What the Editor needs to work as a prompt box. The store runs these after
 * its suggestion plugin, so an open menu still gets Enter first.
 */
export function promptInputPlugins({
  onSubmit,
  getMaxLength
}: PromptInputPluginOptions): Plugin[] {
  let everFocused = false;
  let pointerFocus = false;
  const markPointer = () => {
    pointerFocus = true;
    window.setTimeout(() => {
      pointerFocus = false;
    }, 0);
    return false;
  };

  return [
    new Plugin({
      props: {
        handleKeyDown(view, event) {
          if (event.key !== 'Enter') return false;
          // A composing Enter confirms the composition. It never submits and
          // it never reaches the doc.
          if (event.isComposing || event.keyCode === 229) return true;
          if (event.shiftKey) return insertHardBreak(view.state, view.dispatch);
          onSubmit();
          return true;
        }
      }
    }),

    new Plugin({
      props: {
        transformPasted: slice => flattenToInlineSlice(slice),
        clipboardTextParser: text =>
          new Slice(inlineFragmentFromText(text), 0, 0)
      }
    }),

    // A bare `focus()` on an editing host places no caret. When focus comes
    // from the frame and not from a press in the editor, the caret goes to
    // the end, as a click past the end of a textarea's text does.
    new Plugin({
      props: {
        handleDOMEvents: {
          mousedown: markPointer,
          touchstart: markPointer,
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
    }),

    // The editor is its own scroller, so the caret is brought into view in it
    // only. ProseMirror's own scroll walks every scrollable ancestor, which
    // moves the page under the composer by a pixel or two on an edit.
    new Plugin({
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
    }),

    // A transaction filter, so paste and IME are capped too.
    new Plugin({
      filterTransaction(transaction, current) {
        const max = getMaxLength();
        if (max == null || !transaction.docChanged) return true;
        if (transaction.getMeta(EXTERNAL)) return true;
        const next = textLength(transaction.doc);
        return next <= max || next <= textLength(current.doc);
      }
    })
  ];
}
