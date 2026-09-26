import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { redo, redoDepth, undo, undoDepth } from 'prosemirror-history';
import type { Mark, MarkType, Node as PMNode } from 'prosemirror-model';
import { liftListItem, wrapInList } from 'prosemirror-schema-list';
import {
  type Command,
  type EditorState,
  Selection,
  type Transaction
} from 'prosemirror-state';
import { liftTarget } from 'prosemirror-transform';
import { isSafeHref, normalizeHref } from './link';
import type { EditorHeadingLevel, EditorList, EditorMark } from './schema';

export type EditorBlock =
  | 'blockquote'
  | 'codeBlock'
  | EditorList
  | 'horizontalRule';

const LISTS: readonly string[] = ['bulletList', 'orderedList', 'taskList'];

/** Runs `build` on a scratch transaction, so a step that throws reads as "cannot run". */
function tryCommand(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  build: (tr: Transaction) => boolean
): boolean {
  const tr = state.tr;
  try {
    if (!build(tr)) return false;
  } catch {
    return false;
  }
  dispatch?.(tr.scrollIntoView());
  return true;
}

export function isMarkActive(state: EditorState, mark: string): boolean {
  const type = state.schema.marks[mark];
  if (!type) return false;
  const { from, to, empty, $from } = state.selection;
  if (empty) return !!type.isInSet(state.storedMarks ?? $from.marks());
  return state.doc.rangeHasMark(from, to, type);
}

/** The nearest list around the selection start, or null. */
export function activeList(state: EditorState): EditorList | null {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const name = $from.node(depth).type.name;
    if (LISTS.includes(name)) return name as EditorList;
  }
  return null;
}

export function isBlockquoteActive(state: EditorState): boolean {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type.name === 'blockquote') return true;
  }
  return false;
}

/** `'paragraph'`, a heading level, or null for any other text block. */
export function activeTextStyle(
  state: EditorState
): 'paragraph' | EditorHeadingLevel | null {
  const parent = state.selection.$from.parent;
  if (parent.type.name === 'paragraph') return 'paragraph';
  if (parent.type.name === 'heading') {
    return parent.attrs.level as EditorHeadingLevel;
  }
  return null;
}

export function isBlockActive(state: EditorState, block: EditorBlock): boolean {
  if (block === 'blockquote') return isBlockquoteActive(state);
  if (block === 'codeBlock') {
    return state.selection.$from.parent.type.name === 'codeBlock';
  }
  if (block === 'horizontalRule') return false;
  return activeList(state) === block;
}

/** The range of the mark of `type` around `pos`, in the text block that holds it. */
export function markRange(
  doc: PMNode,
  pos: number,
  type: MarkType
): { from: number; to: number; mark: Mark } | null {
  const $pos = doc.resolve(pos);
  const parent = $pos.parent;
  let start = parent.childAfter($pos.parentOffset);
  if (!start.node || !type.isInSet(start.node.marks)) {
    start = parent.childBefore($pos.parentOffset);
  }
  if (!start.node) return null;
  const mark = type.isInSet(start.node.marks);
  if (!mark) return null;

  let startIndex = start.index;
  let from = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let to = from + start.node.nodeSize;
  while (startIndex > 0 && mark.isInSet(parent.child(startIndex - 1).marks)) {
    startIndex -= 1;
    from -= parent.child(startIndex).nodeSize;
  }
  while (
    endIndex < parent.childCount &&
    mark.isInSet(parent.child(endIndex).marks)
  ) {
    to += parent.child(endIndex).nodeSize;
    endIndex += 1;
  }
  return { from, to, mark };
}

/** The `href` of the link at the selection, or null. */
export function activeLink(state: EditorState): string | null {
  const type = state.schema.marks.link;
  if (!type) return null;
  const { from, to, empty } = state.selection;
  if (empty) {
    return (
      (markRange(state.doc, from, type)?.mark.attrs.href as string) ?? null
    );
  }
  let href: string | null = null;
  state.doc.nodesBetween(from, to, node => {
    if (href) return false;
    const mark = type.isInSet(node.marks);
    if (mark) href = mark.attrs.href as string;
    return true;
  });
  return href;
}

export function toggleMarkCommand(mark: EditorMark): Command {
  return (state, dispatch) => {
    const type = state.schema.marks[mark];
    if (!type) return false;
    return toggleMark(type)(state, dispatch);
  };
}

export const setParagraph: Command = (state, dispatch) => {
  const type = state.schema.nodes.paragraph;
  return setBlockType(type)(state, dispatch);
};

export function setHeading(level: EditorHeadingLevel): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes.heading;
    if (!type) return false;
    return setBlockType(type, { level })(state, dispatch);
  };
}

export function toggleBlock(block: 'blockquote' | 'codeBlock'): Command {
  return (state, dispatch) => {
    const type = state.schema.nodes[block];
    if (!type) return false;

    if (block === 'codeBlock') {
      if (state.selection.$from.parent.type === type) {
        return setParagraph(state, dispatch);
      }
      return setBlockType(type)(state, dispatch);
    }

    if (isBlockquoteActive(state)) {
      const { $from, $to } = state.selection;
      const range = $from.blockRange($to, node => node.type === type);
      const target = range ? liftTarget(range) : null;
      if (!range || target == null) return false;
      dispatch?.(state.tr.lift(range, target).scrollIntoView());
      return true;
    }
    return wrapIn(type)(state, dispatch);
  };
}

export function toggleList(list: EditorList): Command {
  return (state, dispatch) => {
    const listType = state.schema.nodes[list];
    const itemType =
      state.schema.nodes[list === 'taskList' ? 'taskItem' : 'listItem'];
    if (!listType || !itemType) return false;

    const { $from, $to } = state.selection;
    const range = $from.blockRange($to, node => LISTS.includes(node.type.name));

    if (!range) return wrapInList(listType)(state, dispatch);

    const current = range.parent;
    if (current.type === listType)
      return liftListItem(itemType)(state, dispatch);

    // A different kind of list: rebuild it in place. The items keep their
    // content and size, so every position inside stays valid.
    return tryCommand(state, dispatch, tr => {
      const pos = range.$from.before(range.depth);
      const items: PMNode[] = [];
      current.forEach(item => {
        items.push(
          item.type === itemType
            ? item
            : itemType.create(
                list === 'taskList' ? { checked: false } : null,
                item.content
              )
        );
      });
      tr.replaceWith(pos, pos + current.nodeSize, listType.create(null, items));
      tr.setSelection(Selection.fromJSON(tr.doc, state.selection.toJSON()));
      return true;
    });
  };
}

export function setLink(href: string): Command {
  return (state, dispatch) => {
    const type = state.schema.marks.link;
    if (!type) return false;
    const normalized = normalizeHref(href);
    if (!normalized || !isSafeHref(normalized)) return false;
    const { from, to, empty, $from } = state.selection;
    if (!$from.parent.type.allowsMarkType(type)) return false;

    return tryCommand(state, dispatch, tr => {
      const mark = type.create({ href: normalized });
      if (!empty) {
        tr.removeMark(from, to, type).addMark(from, to, mark);
        return true;
      }
      const range = markRange(state.doc, from, type);
      if (range) {
        tr.removeMark(range.from, range.to, type).addMark(
          range.from,
          range.to,
          mark
        );
        return true;
      }
      tr.insertText(normalized, from);
      tr.addMark(from, from + normalized.length, mark);
      return true;
    });
  };
}

export const unsetLink: Command = (state, dispatch) => {
  const type = state.schema.marks.link;
  if (!type) return false;
  const { from, to, empty } = state.selection;
  if (!empty) {
    if (!state.doc.rangeHasMark(from, to, type)) return false;
    dispatch?.(state.tr.removeMark(from, to, type));
    return true;
  }
  const range = markRange(state.doc, from, type);
  if (!range) return false;
  dispatch?.(state.tr.removeMark(range.from, range.to, type));
  return true;
};

export const insertHorizontalRule: Command = (state, dispatch) => {
  const type = state.schema.nodes.horizontalRule;
  if (!type) return false;
  const paragraph = state.schema.nodes.paragraph;

  return tryCommand(state, dispatch, tr => {
    tr.deleteSelection();
    const $pos = tr.doc.resolve(tr.selection.from);
    if (!$pos.parent.isTextblock) return false;
    const rule = type.create();

    if ($pos.parent.content.size === 0 || $pos.parentOffset === 0) {
      tr.insert($pos.before(), rule);
      return true;
    }
    if ($pos.parentOffset === $pos.parent.content.size) {
      const after = $pos.after();
      tr.insert(after, [rule, paragraph.create()]);
      tr.setSelection(
        Selection.near(tr.doc.resolve(after + rule.nodeSize + 1))
      );
      return true;
    }
    tr.split($pos.pos);
    tr.insert($pos.pos + 1, rule);
    return true;
  });
};

export function insertText(text: string): Command {
  return (state, dispatch) => {
    dispatch?.(state.tr.insertText(text).scrollIntoView());
    return true;
  };
}

export const clearFormatting: Command = (state, dispatch) => {
  const { from, to, empty, $from } = state.selection;
  if (empty) {
    const marks = state.storedMarks ?? $from.marks();
    if (marks.length === 0) return false;
    dispatch?.(state.tr.setStoredMarks([]));
    return true;
  }
  let hasMarks = false;
  state.doc.nodesBetween(from, to, node => {
    if (node.marks.length) hasMarks = true;
    return !hasMarks;
  });
  if (!hasMarks) return false;
  dispatch?.(state.tr.removeMark(from, to));
  return true;
};

export const undoCommand: Command = (state, dispatch) =>
  undoDepth(state) > 0 && undo(state, dispatch);

export const redoCommand: Command = (state, dispatch) =>
  redoDepth(state) > 0 && redo(state, dispatch);
