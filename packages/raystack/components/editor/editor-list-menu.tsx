'use client';

import { activeList, toggleList } from './core/commands';
import { type EditorList, LIST_TYPES } from './core/schema';
import { useEditorStore, useStoreSelector } from './editor-context';
import type { EditorControlBaseProps } from './editor-control';
import { BLOCK_DEFAULTS } from './editor-defaults';
import {
  EditorMenuControl,
  EditorMenuItems,
  type EditorMenuOption,
  sameFlags
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

  const available = types.filter(type => type in store.schema.nodes);
  if (available.length === 0) return null;

  const Icon = BLOCK_DEFAULTS[current ?? 'bulletList'].Icon;

  return (
    <EditorMenuControl
      data-slot='editor-list-menu'
      label={label}
      trigger={<Icon />}
      disabled={!editable}
      {...props}
    >
      <ListOptions types={available} />
    </EditorMenuControl>
  );
}

EditorListMenu.displayName = 'Editor.ListMenu';

function ListOptions({ types }: { types: EditorList[] }) {
  const store = useEditorStore('Editor.ListMenu');
  const current = useStoreSelector(store, state => activeList(state.state));
  const can = useStoreSelector(
    store,
    state => types.map(type => toggleList(type)(state.state)),
    sameFlags
  );

  const options: EditorMenuOption[] = types.map((type, index) => {
    const { action, ...rest } = BLOCK_DEFAULTS[type];
    return {
      key: type,
      ...rest,
      shortcut: action && store.shortcuts[action],
      active: current === type,
      disabled: !can[index],
      run: () => store.run(toggleList(type))
    };
  });

  return <EditorMenuItems options={options} />;
}
