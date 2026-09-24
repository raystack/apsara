'use client';

import { activeList, toggleList } from './core/commands';
import type { EditorList } from './core/schema';
import { useEditorStore, useStoreSelector } from './editor-context';
import type { EditorControlBaseProps } from './editor-control';
import { BLOCK_DEFAULTS, LIST_TYPES } from './editor-defaults';
import {
  EditorMenuControl,
  type EditorMenuOption
} from './editor-menu-control';

export interface EditorListMenuProps extends EditorControlBaseProps {
  /**
   * The list types in the menu.
   * @default ['bulletList', 'orderedList', 'taskList']
   */
  types?: EditorList[];
}

/** A menu that turns the selection into a list, or back into text. */
export function EditorListMenu({
  types = LIST_TYPES as EditorList[],
  label = 'List',
  ...props
}: EditorListMenuProps) {
  const store = useEditorStore('Editor.ListMenu');
  const current = useStoreSelector(store, state => activeList(state.state));
  const editable = useStoreSelector(store, state => state.isEditable());
  const can = useStoreSelector(store, state =>
    types.map(type => (toggleList(type)(state.state) ? '1' : '0')).join('')
  );

  const available = types.filter(type => type in store.schema.nodes);
  if (available.length === 0) return null;

  const options: EditorMenuOption[] = available.map(type => {
    const { action, ...rest } = BLOCK_DEFAULTS[type];
    return {
      key: type,
      ...rest,
      shortcut: action && store.shortcuts[action],
      active: current === type,
      disabled: can[types.indexOf(type)] !== '1',
      run: () => store.run(toggleList(type))
    };
  });

  const Icon = BLOCK_DEFAULTS[current ?? 'bulletList'].Icon;

  return (
    <EditorMenuControl
      data-slot='editor-list-menu'
      label={label}
      trigger={<Icon />}
      options={options}
      disabled={!editable}
      {...props}
    />
  );
}

EditorListMenu.displayName = 'Editor.ListMenu';
