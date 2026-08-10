'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { isTriggerCharacter } from '../editor/mention';
import { usePromptInputContext } from './prompt-input-context';
import type {
  PromptInputMentionItem,
  PromptInputMentionRef
} from './prompt-input-mention-registry';

export interface PromptInputMentionsProps {
  /**
   * The character that opens the menu.
   * @defaultValue "@"
   */
  trigger?: string;
  /** Sync data — filtered internally with match-sorter on the label. */
  items?: PromptInputMentionItem[];
  /**
   * Async data — debounced ~150 ms, superseded requests aborted through
   * `signal`, stale resolutions discarded. Wins over `items`.
   */
  onSearch?: (
    query: string,
    context: { trigger: string; signal: AbortSignal }
  ) => Promise<PromptInputMentionItem[]>;
  /**
   * Fills in the icon, trailing content, `data` and a fresh label for chips
   * parsed out of `value` / `defaultValue`, which cannot carry them. Batched
   * into one call per trigger and cached by `trigger|type|id`.
   */
  resolveMentions?: (
    refs: PromptInputMentionRef[]
  ) => Promise<PromptInputMentionItem[]>;
  /** Observes the menu's open state. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Empty-state content.
   * @defaultValue "No results"
   */
  emptyMessage?: ReactNode;
  /**
   * Skeleton rows shown while `onSearch` is in flight.
   * @defaultValue 3
   */
  loadingRowCount?: number;
}

/**
 * Declares a trigger and supplies its data. Renders nothing itself — the
 * caret-anchored menu belongs to `PromptInput.Editor`, which owns the document
 * the query lives in, because the query is the text the chip replaces.
 *
 * Requires `PromptInput.Editor`: next to a `Textarea` it no-ops and warns in
 * development, since a native textarea cannot host inline chips.
 */
export function PromptInputMentions({
  trigger = '@',
  items,
  onSearch,
  resolveMentions,
  onOpenChange,
  emptyMessage,
  loadingRowCount
}: PromptInputMentionsProps) {
  const context = usePromptInputContext('Mentions');
  const registry = context.mentions;
  const editorMounted = context.editorMounted;

  if (process.env.NODE_ENV !== 'production' && !isTriggerCharacter(trigger)) {
    console.warn(
      `[Apsara] PromptInput.Mentions trigger ${JSON.stringify(trigger)} is not ` +
        'a single punctuation character, so a chip picked from it cannot ' +
        'round-trip through the markup dialect. Use "@", "/", "#" or similar.'
    );
  }

  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      registry.triggers().length > 0 &&
      !registry.get(trigger)
    ) {
      console.warn(
        '[Apsara] PromptInput accepts one <PromptInput.Mentions> in this ' +
          'release. Additional triggers register and work, but only the first ' +
          'is covered by the test suite.'
      );
    }

    return registry.register(trigger);
  }, [registry, trigger]);

  // `Editor` registers itself during the commit that mounts it, which can land
  // after this effect — so the check waits for the tree to settle, and the
  // cleanup cancels it the moment an editor does show up.
  const sawEditorRef = useRef(false);
  useEffect(() => {
    if (editorMounted) {
      sawEditorRef.current = true;
      return;
    }
    if (process.env.NODE_ENV === 'production' || sawEditorRef.current) return;
    const timer = setTimeout(() => {
      if (sawEditorRef.current) return;
      console.warn(
        '[Apsara] PromptInput.Mentions requires <PromptInput.Editor>; a ' +
          'native <textarea> cannot host inline chips, so it does nothing ' +
          'next to <PromptInput.Textarea>.'
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [editorMounted]);

  // Pushed after every render and compared field by field, so an inline `items`
  // array or an inline `onSearch` stays live without churning the config
  // identity — which would restart an in-flight debounce on every keystroke.
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

  return null;
}

PromptInputMentions.displayName = 'PromptInput.Mentions';
