'use client';

import { type ReactNode, useEffect } from 'react';
import type { EditorMention } from './core/mention';
import { isTriggerCharacter } from './core/mention';
import type {
  EditorMentionItem,
  EditorMentionRef
} from './core/mention-registry';
import { docMentions } from './core/serializers';
import { SuggestionMenu } from './core/suggestion-menu';
import {
  useMentionRegistryVersion,
  useMentionResolution
} from './core/use-suggestion-menu';
import { useEditorStore, useStoreSelector } from './editor-context';
import type { EditorStore } from './editor-store';
import { useEditorSuggestion } from './use-editor-suggestion';

export interface EditorMentionsProps {
  /**
   * The character that opens the menu.
   * @default '@'
   */
  trigger?: string;
  /** Sync data, filtered on the label. */
  items?: EditorMentionItem[];
  /** Async data. Debounced, with superseded requests aborted through `signal`. Wins over `items`. */
  onSearch?: (
    query: string,
    context: { trigger: string; signal: AbortSignal }
  ) => Promise<EditorMentionItem[]>;
  /** Fills in the icon, trailing content and label of chips loaded from `value` or `defaultValue`. */
  resolveMentions?: (refs: EditorMentionRef[]) => Promise<EditorMentionItem[]>;
  /**
   * Shown when nothing matches the query.
   * @default 'No results'
   */
  emptyMessage?: ReactNode;
  /**
   * Skeleton rows shown while `onSearch` is in flight.
   * @default 3
   */
  loadingRowCount?: number;
  /** Observes the menu's open state. */
  onOpenChange?: (open: boolean) => void;
}

const NO_MENTIONS: EditorMention[] = [];

function sameMentions(a: EditorMention[], b: EditorMention[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (mention, index) =>
      mention.id === b[index].id &&
      mention.type === b[index].type &&
      mention.trigger === b[index].trigger &&
      mention.label === b[index].label
  );
}

/** A menu that inserts a mention chip. Mount one per trigger. */
export function EditorMentions(props: EditorMentionsProps) {
  const store = useEditorStore('Editor.Mentions');
  // `formats` without `mention` builds a schema with no mention node.
  if (!store.schema.nodes.mention) return null;
  return <MentionsMenu store={store} {...props} />;
}

EditorMentions.displayName = 'Editor.Mentions';

function MentionsMenu({
  store,
  trigger = '@',
  items,
  onSearch,
  resolveMentions,
  emptyMessage = 'No results',
  loadingRowCount = 3,
  onOpenChange
}: EditorMentionsProps & { store: EditorStore }) {
  const registry = store.mentions;
  useMentionRegistryVersion(registry);

  if (process.env.NODE_ENV !== 'production' && !isTriggerCharacter(trigger)) {
    console.warn(
      `[Apsara] Editor.Mentions trigger ${JSON.stringify(trigger)} is not a ` +
        'single punctuation character. Use "@", "#" or similar.'
    );
  }

  useEffect(() => registry.register(trigger), [registry, trigger]);

  // Pushed after every render and compared field by field, so inline props
  // stay live without restarting an in-flight search.
  useEffect(() => {
    registry.setData(trigger, {
      items,
      onSearch,
      resolveMentions,
      onOpenChange,
      emptyMessage,
      loadingRowCount
    });
  });

  const { menu, listboxId } = useEditorSuggestion<EditorMentionItem>({
    store,
    trigger,
    maxSpaces: 3,
    items,
    onSearch,
    onSelect: (item, state) => {
      const type = item.type ?? 'mention';
      registry.remember(state.trigger, { ...item, type });
      store.insertMentionAt(
        { id: item.id, label: item.label, type, trigger: state.trigger },
        { from: state.from, to: state.to }
      );
    },
    onOpenChange,
    name: 'Editor.Mentions'
  });

  const mentions = useStoreSelector(
    store,
    current =>
      resolveMentions
        ? docMentions(current.state.doc).filter(
            mention => mention.trigger === trigger
          )
        : NO_MENTIONS,
    sameMentions
  );
  useMentionResolution(registry, mentions, store.refreshMentionLabels);

  return (
    <SuggestionMenu
      data-slot='editor-mention-menu'
      open={menu.open}
      anchor={menu.anchor}
      id={listboxId}
      groups={menu.groups}
      highlightedIndex={menu.highlightedIndex}
      onHighlightChange={menu.setHighlightedIndex}
      onSelect={item => menu.select(item as EditorMentionItem)}
      onOpenChange={open => {
        if (!open) menu.close();
      }}
      loading={menu.loading}
      loadingRowCount={loadingRowCount}
      emptyMessage={emptyMessage}
    />
  );
}
