'use client';

import { type ReactNode, useCallback, useEffect, useRef } from 'react';
import { isTriggerCharacter, type MentionAttrs } from './core/mention';
import type {
  EditorMentionItem,
  EditorMentionRef
} from './core/mention-registry';
import { docMentions } from './core/serializers';
import { SuggestionMenu } from './core/suggestion-menu';
import { useMentionResolution } from './core/use-suggestion-menu';
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

const NO_MENTIONS: MentionAttrs[] = [];

function sameMentions(a: MentionAttrs[], b: MentionAttrs[]): boolean {
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
export function EditorMentions({
  trigger = '@',
  ...props
}: EditorMentionsProps) {
  const store = useEditorStore('Editor.Mentions');
  // `formats` without `mention` builds a schema with no mention node.
  const enabled = store.schema.nodes.mention !== undefined;

  if (
    process.env.NODE_ENV !== 'production' &&
    enabled &&
    !isTriggerCharacter(trigger)
  ) {
    console.warn(
      `[Apsara] Editor.Mentions trigger ${JSON.stringify(trigger)} is not a ` +
        'single punctuation character. Use "@", "#" or similar.'
    );
  }

  useEffect(
    () => (enabled ? store.mentions.register(trigger) : undefined),
    [store, enabled, trigger]
  );

  if (!enabled) return null;
  return (
    <MentionsMenu
      {...props}
      store={store}
      trigger={trigger}
      name='Editor.Mentions'
      maxSpaces={3}
      data-slot='editor-mention-menu'
    />
  );
}

EditorMentions.displayName = 'Editor.Mentions';

export interface MentionsMenuProps extends EditorMentionsProps {
  store: EditorStore;
  trigger: string;
  /** The part named in dev warnings. */
  name: string;
  /** The spaces a query can hold. No limit when not set. */
  maxSpaces?: number;
  /** The popup width in pixels. */
  width?: number;
  /**
   * Applies labels from `resolveMentions`.
   * @default store.refreshMentionLabels
   */
  refreshLabels?: (labels: Map<string, string>) => void;
  'data-slot'?: string;
}

/**
 * The menu behind `Editor.Mentions`. It does not register its trigger with
 * the mention registry, so `PromptInput.Editor` can render one for each
 * trigger that `PromptInput.Mentions` registers.
 */
export function MentionsMenu({
  store,
  trigger,
  items,
  onSearch,
  resolveMentions,
  emptyMessage = 'No results',
  loadingRowCount = 3,
  onOpenChange,
  name,
  maxSpaces,
  width,
  refreshLabels = store.refreshMentionLabels,
  'data-slot': slot
}: MentionsMenuProps) {
  const registry = store.mentions;

  const resolveRef = useRef(resolveMentions);
  resolveRef.current = resolveMentions;
  const getResolver = useCallback(
    (chipTrigger: string) =>
      chipTrigger === trigger ? resolveRef.current : undefined,
    [trigger]
  );

  const { menu, listboxId } = useEditorSuggestion<EditorMentionItem>({
    store,
    trigger,
    maxSpaces,
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
    name
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
  useMentionResolution(registry, mentions, refreshLabels, getResolver);

  return (
    <SuggestionMenu
      data-slot={slot}
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
      width={width}
    />
  );
}
