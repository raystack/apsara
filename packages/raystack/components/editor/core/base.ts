import type { Node as PMNode } from 'prosemirror-model';
import { type Command, Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import styles from './editor-core.module.css';

/** Marks transactions that came from outside the editor, so they are not reported back. */
export const EXTERNAL = 'apsara-editor-external';

export const insertHardBreak: Command = (state, dispatch) => {
  const type = state.schema.nodes.hardBreak;
  if (!type) return false;
  dispatch?.(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
  return true;
};

/**
 * Shows `getText()` on the first block while `isEmpty(doc)` holds. A
 * ProseMirror paragraph with no text still holds a `<br>`, so CSS `:empty`
 * cannot do this.
 */
export function placeholderPlugin(
  getText: () => string | undefined,
  isEmpty: (doc: PMNode) => boolean
): Plugin {
  return new Plugin({
    props: {
      decorations: state => {
        const text = getText();
        const first = state.doc.firstChild;
        if (!text || !first || !isEmpty(state.doc)) return null;
        return DecorationSet.create(state.doc, [
          Decoration.node(0, first.nodeSize, {
            class: styles.placeholder,
            'data-placeholder': text
          })
        ]);
      }
    }
  });
}
