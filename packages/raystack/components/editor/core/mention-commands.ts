import { type Command, TextSelection } from 'prosemirror-state';

/** Backspace/Delete take out the whole chip rather than selecting it first. */
export function deleteAdjacentMention(direction: -1 | 1): Command {
  return (state, dispatch) => {
    if (!state.selection.empty) return false;
    const $pos = state.doc.resolve(state.selection.from);
    const node = direction === -1 ? $pos.nodeBefore : $pos.nodeAfter;
    if (!node || node.type.name !== 'mention') return false;
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
 * selection ring on the chip on the way past it, a stop the user never asked
 * for while moving the caret through a sentence. Clicking a chip still selects
 * it, which is where the ring belongs.
 */
export function moveOverMention(direction: -1 | 1): Command {
  return (state, dispatch) => {
    if (!state.selection.empty) return false;
    const $pos = state.doc.resolve(state.selection.from);
    const node = direction === -1 ? $pos.nodeBefore : $pos.nodeAfter;
    if (!node || node.type.name !== 'mention') return false;
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
