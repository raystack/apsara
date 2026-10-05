'use client';

import { isMarkActive, toggleMarkCommand } from './core/commands';
import type { EditorMark } from './core/schema';
import { useEditorStore, useStoreSelector } from './editor-context';
import { EditorControl, type EditorControlBaseProps } from './editor-control';
import { MARK_DEFAULTS } from './editor-defaults';

export interface EditorMarkButtonProps extends EditorControlBaseProps {
  /** The mark the button toggles. */
  mark: EditorMark;
}

/** Toggles a mark on the selection. */
export function EditorMarkButton({
  mark,
  label,
  children,
  onClick,
  ...props
}: EditorMarkButtonProps) {
  const store = useEditorStore('Editor.MarkButton');
  const active = useStoreSelector(store, current =>
    isMarkActive(current.state, mark)
  );
  const enabled = useStoreSelector(
    store,
    current => current.isEditable() && toggleMarkCommand(mark)(current.state)
  );

  if (!(mark in store.schema.marks)) return null;
  const { label: defaultLabel, Icon, action } = MARK_DEFAULTS[mark];

  return (
    <EditorControl
      data-slot='editor-mark-button'
      label={label ?? defaultLabel}
      shortcut={action && store.shortcuts[action]}
      pressed={active}
      disabled={!enabled}
      onClick={event => {
        store.run(toggleMarkCommand(mark));
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? <Icon />}
    </EditorControl>
  );
}

EditorMarkButton.displayName = 'Editor.MarkButton';
