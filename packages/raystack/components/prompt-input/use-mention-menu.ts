'use client';

import type { EditorView } from 'prosemirror-view';
import { useCallback } from 'react';
import {
  type ComposerEditorActions,
  type SuggestionState,
  type UseSuggestionMenuResult,
  useMentionRegistryVersion,
  useSuggestionMenu
} from '../editor/core';
import type {
  PromptInputMentionItem,
  PromptInputMentionRegistry
} from './prompt-input-mention-registry';

export interface UseMentionMenuOptions {
  viewRef: React.RefObject<EditorView | null>;
  actions: ComposerEditorActions;
  registry: PromptInputMentionRegistry;
  suggestion: SuggestionState | null;
  disabled: boolean;
  listboxId: string;
}

export interface UseMentionMenuResult
  extends UseSuggestionMenuResult<PromptInputMentionItem> {
  loadingRowCount: number;
  emptyMessage: React.ReactNode;
}

/** One menu for every registered trigger, driven by that trigger's config. */
export function useMentionMenu({
  viewRef,
  actions,
  registry,
  suggestion,
  disabled,
  listboxId
}: UseMentionMenuOptions): UseMentionMenuResult {
  useMentionRegistryVersion(registry);

  const config = suggestion ? registry.get(suggestion.trigger) : undefined;
  const open = !disabled && suggestion !== null && config !== undefined;

  const select = useCallback(
    (item: PromptInputMentionItem, state: SuggestionState) => {
      const type = item.type ?? 'mention';
      registry.remember(state.trigger, { ...item, type });
      actions.insertMention(
        {
          id: item.id,
          label: item.label,
          type,
          trigger: state.trigger
        },
        { from: state.from, to: state.to }
      );
    },
    [actions, registry]
  );

  const menu = useSuggestionMenu<PromptInputMentionItem>({
    getView: () => viewRef.current,
    suggestion,
    open,
    items: config?.items,
    onSearch: config?.onSearch,
    onSelect: select,
    dismiss: actions.dismissSuggestion,
    onOpenChange: config?.onOpenChange,
    listboxId,
    name: 'PromptInput.Mentions'
  });

  return {
    ...menu,
    loadingRowCount: config?.loadingRowCount ?? 3,
    emptyMessage: config?.emptyMessage ?? 'No results'
  };
}
