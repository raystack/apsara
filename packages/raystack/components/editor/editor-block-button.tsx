'use client';

import type { Command } from 'prosemirror-state';
import {
  type EditorBlock,
  insertHorizontalRule,
  isBlockActive,
  toggleBlock,
  toggleList
} from './core/commands';
import { useEditorStore, useStoreSelector } from './editor-context';
import { EditorControl, type EditorControlBaseProps } from './editor-control';
import { BLOCK_DEFAULTS } from './editor-defaults';

export interface EditorBlockButtonProps extends EditorControlBaseProps {
  /** The block the button toggles. `horizontalRule` inserts a divider. */
  block: EditorBlock;
}

function blockCommand(block: EditorBlock): Command {
  if (block === 'horizontalRule') return insertHorizontalRule;
  if (block === 'blockquote' || block === 'codeBlock')
    return toggleBlock(block);
  return toggleList(block);
}

/** Wraps, lifts or sets a block, or inserts a divider. */
export function EditorBlockButton({
  block,
  label,
  children,
  onClick,
  ...props
}: EditorBlockButtonProps) {
  const store = useEditorStore('Editor.BlockButton');
  const active = useStoreSelector(store, current =>
    isBlockActive(current.state, block)
  );
  const enabled = useStoreSelector(
    store,
    current => current.isEditable() && blockCommand(block)(current.state)
  );

  if (!(block in store.schema.nodes)) return null;
  const { label: defaultLabel, Icon, action } = BLOCK_DEFAULTS[block];

  return (
    <EditorControl
      data-slot='editor-block-button'
      label={label ?? defaultLabel}
      shortcut={action && store.shortcuts[action]}
      pressed={block === 'horizontalRule' ? undefined : active}
      disabled={!enabled}
      onClick={event => {
        store.run(blockCommand(block));
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? <Icon />}
    </EditorControl>
  );
}

EditorBlockButton.displayName = 'Editor.BlockButton';
