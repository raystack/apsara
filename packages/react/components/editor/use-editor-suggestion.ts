'use client';

import { useId, useLayoutEffect, useRef } from 'react';
import type { SuggestionState } from './core/suggestion-plugin';
import {
  type SuggestionItem,
  type UseSuggestionMenuOptions,
  type UseSuggestionMenuResult,
  useSuggestionMenu
} from './core/use-suggestion-menu';
import { useStoreSelector } from './editor-context';
import type { EditorStore } from './editor-store';

interface UseEditorSuggestionOptions<Item extends SuggestionItem>
  extends Omit<
    UseSuggestionMenuOptions<Item>,
    'getView' | 'suggestion' | 'open' | 'dismiss' | 'listboxId'
  > {
  store: EditorStore;
  trigger: string;
  maxSpaces?: number;
  className?: string;
}

/**
 * Registers a trigger with the editor and drives its menu. The editor routes
 * keys to the menu while its query is active.
 */
export function useEditorSuggestion<Item extends SuggestionItem>({
  store,
  trigger,
  maxSpaces,
  className,
  ...options
}: UseEditorSuggestionOptions<Item>): {
  menu: UseSuggestionMenuResult<Item>;
  listboxId: string;
} {
  const listboxId = useId();
  const keyDownRef = useRef<
    ((event: KeyboardEvent, state: SuggestionState) => boolean) | null
  >(null);

  useLayoutEffect(
    () =>
      store.registerTrigger({
        char: trigger,
        maxSpaces,
        className,
        onKeyDown: (event, state) => keyDownRef.current?.(event, state) ?? false
      }),
    [store, trigger, maxSpaces, className]
  );

  const suggestion = useStoreSelector(store, current =>
    current.suggestion?.trigger === trigger ? current.suggestion : null
  );
  const editable = useStoreSelector(store, current => current.isEditable());

  const menu = useSuggestionMenu<Item>({
    ...options,
    getView: () => store.view,
    suggestion,
    open: editable && suggestion !== null,
    dismiss: store.dismissSuggestion,
    listboxId
  });
  keyDownRef.current = menu.handleKeyDown;

  useLayoutEffect(() => {
    store.setMenu(
      trigger,
      menu.open ? { listboxId, activeOptionId: menu.activeOptionId } : null
    );
  }, [store, trigger, listboxId, menu.open, menu.activeOptionId]);

  return { menu, listboxId };
}
