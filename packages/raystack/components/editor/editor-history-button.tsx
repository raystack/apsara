'use client';

import { RedoIcon, UndoIcon } from '~/icons';
import { redoCommand, undoCommand } from './core/commands';
import { useEditorStore, useStoreSelector } from './editor-context';
import { EditorControl, type EditorControlBaseProps } from './editor-control';

export interface EditorHistoryButtonProps extends EditorControlBaseProps {
  /** Which way the button steps through history. */
  action: 'undo' | 'redo';
}

/** Undoes or redoes the last change. */
export function EditorHistoryButton({
  action,
  label,
  children,
  onClick,
  ...props
}: EditorHistoryButtonProps) {
  const store = useEditorStore('Editor.HistoryButton');
  const command = action === 'undo' ? undoCommand : redoCommand;
  const enabled = useStoreSelector(
    store,
    current => current.isEditable() && command(current.state)
  );
  const Icon = action === 'undo' ? UndoIcon : RedoIcon;

  return (
    <EditorControl
      data-slot='editor-history-button'
      label={label ?? (action === 'undo' ? 'Undo' : 'Redo')}
      shortcut={store.shortcuts[action]}
      disabled={!enabled}
      onClick={event => {
        store.run(command);
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? <Icon />}
    </EditorControl>
  );
}

EditorHistoryButton.displayName = 'Editor.HistoryButton';
