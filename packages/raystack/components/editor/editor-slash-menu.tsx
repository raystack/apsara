'use client';

import { rankings } from '@tanstack/match-sorter-utils';
import { type ReactNode, useMemo } from 'react';
import {
  SuggestionMenu,
  type SuggestionMenuItem
} from './core/suggestion-menu';
import { filterItems } from './core/use-suggestion-menu';
import styles from './editor.module.css';
import { useEditorStore, useStoreSelector } from './editor-context';
import { EditorShortcutKeys } from './editor-control';
import { sameFlags } from './editor-menu-control';
import { builtinSlashItem, defaultSlashItems } from './editor-slash-items';
import type { EditorSlashItem } from './editor-types';
import { useEditorSuggestion } from './use-editor-suggestion';

export interface EditorSlashMenuProps {
  /**
   * The commands in the menu.
   * @default defaultSlashItems
   */
  items?: EditorSlashItem[];
  /**
   * The character that opens the menu.
   * @default '/'
   */
  trigger?: string;
  /**
   * Shown when no command matches the query.
   * @default 'No results'
   */
  emptyMessage?: ReactNode;
  /** Observes the menu's open state. */
  onOpenChange?: (open: boolean) => void;
}

const NO_FLAGS: boolean[] = [];

const slashAccessors = [
  (item: EditorSlashItem) => item.label,
  (item: EditorSlashItem) => item.keywords ?? [],
  // A description matches only at the start of a word, so a short query does
  // not match most descriptions.
  {
    accessor: (item: EditorSlashItem) => item.description ?? '',
    threshold: rankings.WORD_STARTS_WITH
  }
];

function filterSlashItems(
  items: EditorSlashItem[],
  query: string
): EditorSlashItem[] {
  return filterItems(items, query, slashAccessors);
}

/** A menu of block commands that opens on `/`. */
export function EditorSlashMenu({
  items = defaultSlashItems,
  trigger = '/',
  emptyMessage = 'No results',
  onOpenChange
}: EditorSlashMenuProps) {
  const store = useEditorStore('Editor.SlashMenu');

  // Built-in commands for formats the schema does not have are left out.
  const available = useMemo(
    () =>
      items.filter(item => {
        const format = builtinSlashItem(item)?.format;
        return (
          !format ||
          format in store.schema.nodes ||
          format in store.schema.marks
        );
      }),
    [items, store]
  );

  // A built-in command that cannot run at the caret is disabled, as a heading
  // is in the first paragraph of a list item. Checked only while the menu is
  // open.
  const blocked = useStoreSelector(
    store,
    current =>
      current.suggestion?.trigger === trigger
        ? available.map(
            item => !(builtinSlashItem(item)?.applies(current.api) ?? true)
          )
        : NO_FLAGS,
    sameFlags
  );
  const menuItems = useMemo(
    () =>
      available.map((item, index) =>
        blocked[index] && !item.disabled ? { ...item, disabled: true } : item
      ),
    [available, blocked]
  );

  const { menu, listboxId } = useEditorSuggestion<EditorSlashItem>({
    store,
    trigger,
    // A space ends the query, the way Linear's slash menu works.
    maxSpaces: 0,
    className: styles['slash-query'],
    items: menuItems,
    filter: filterSlashItems,
    onSelect: (item, state) => {
      store.runAfterDelete(state, () => item.run(store.api));
    },
    onOpenChange,
    name: 'Editor.SlashMenu'
  });

  const groups = menu.groups.map(group => ({
    label: group.label,
    items: group.items.map((item): SuggestionMenuItem => {
      const action = builtinSlashItem(item)?.action;
      const shortcut =
        item.shortcut ?? (action ? store.shortcuts[action] : undefined);
      return {
        id: item.id,
        label: item.label,
        description: item.description,
        icon: item.icon,
        disabled: item.disabled,
        trailing: shortcut ? <EditorShortcutKeys shortcut={shortcut} /> : null
      };
    })
  }));

  return (
    <SuggestionMenu
      data-slot='editor-slash-menu'
      aria-label='Commands'
      open={menu.open}
      anchor={menu.anchor}
      id={listboxId}
      groups={groups}
      highlightedIndex={menu.highlightedIndex}
      onHighlightChange={menu.setHighlightedIndex}
      onSelect={(_, index) => {
        const item = menu.flat[index];
        if (item) menu.select(item);
      }}
      onOpenChange={open => {
        if (!open) menu.close();
      }}
      emptyMessage={emptyMessage}
    />
  );
}

EditorSlashMenu.displayName = 'Editor.SlashMenu';
