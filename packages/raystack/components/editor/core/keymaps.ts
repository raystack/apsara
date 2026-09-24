import {
  chainCommands,
  exitCode,
  newlineInCode,
  setBlockType
} from 'prosemirror-commands';
import { redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import type { Schema } from 'prosemirror-model';
import {
  liftListItem,
  sinkListItem,
  splitListItem
} from 'prosemirror-schema-list';
import type { Command, Plugin } from 'prosemirror-state';
import { deleteAdjacentMention, moveOverMention } from './mention-commands';

const never: Command = () => false;

function either(...commands: Array<Command | null>): Command {
  const present = commands.filter((command): command is Command => !!command);
  return present.length ? chainCommands(...present) : never;
}

const inListItem: Command = state => {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const name = $from.node(depth).type.name;
    if (name === 'listItem' || name === 'taskItem') return true;
  }
  return false;
};

/** Backspace at the start of a list item's first paragraph lifts the item. */
function liftAtItemStart(itemNames: string[]): Command {
  return (state, dispatch) => {
    const { $from, empty } = state.selection;
    if (!empty || $from.parentOffset !== 0 || $from.depth < 2) return false;
    const item = $from.node(-1);
    if (!itemNames.includes(item.type.name) || $from.index(-1) !== 0) {
      return false;
    }
    return liftListItem(item.type)(state, dispatch);
  };
}

/**
 * Backspace at the start of a heading, or in an empty code block, turns it
 * back into a paragraph instead of joining it with the block above.
 */
const resetBlockAtStart: Command = (state, dispatch) => {
  const { $from, empty } = state.selection;
  if (!empty || $from.parentOffset !== 0) return false;
  const parent = $from.parent;
  const reset =
    parent.type.name === 'heading' ||
    (parent.type.name === 'codeBlock' && parent.content.size === 0);
  if (!reset) return false;
  return setBlockType(state.schema.nodes.paragraph)(state, dispatch);
};

const insertHardBreak: Command = (state, dispatch) => {
  const type = state.schema.nodes.hardBreak;
  if (!type) return false;
  dispatch?.(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
  return true;
};

/**
 * Keys for lists, mentions and block edges. Sits after the shortcut keymap
 * and before history and the base keymap.
 */
export function buildEditingKeymap(schema: Schema): Plugin {
  const { listItem, taskItem } = schema.nodes;
  const items = [listItem?.name, taskItem?.name].filter(
    (name): name is string => !!name
  );
  const splitItem = either(
    listItem ? splitListItem(listItem) : null,
    taskItem ? splitListItem(taskItem, { checked: false }) : null
  );
  const sink = either(
    listItem ? sinkListItem(listItem) : null,
    taskItem ? sinkListItem(taskItem) : null
  );
  const lift = either(
    listItem ? liftListItem(listItem) : null,
    taskItem ? liftListItem(taskItem) : null
  );

  return keymap({
    Enter: splitItem,
    'Shift-Enter': chainCommands(newlineInCode, insertHardBreak),
    'Mod-Enter': exitCode,
    // Tab stays in the editor inside a list, and moves focus everywhere else.
    Tab: (state, dispatch) => sink(state, dispatch) || inListItem(state),
    'Shift-Tab': (state, dispatch) =>
      lift(state, dispatch) || inListItem(state),
    Backspace: chainCommands(
      undoInputRule,
      deleteAdjacentMention(-1),
      liftAtItemStart(items),
      resetBlockAtStart
    ),
    Delete: deleteAdjacentMention(1),
    ArrowLeft: moveOverMention(-1),
    ArrowRight: moveOverMention(1),
    'Mod-y': redo
  });
}
