'use client';

import type { EditorState } from 'prosemirror-state';
import { createContext, useContext, useRef, useSyncExternalStore } from 'react';
import type { RichEditorStore } from './editor-rich-store';
import type { EditorStore } from './editor-store';
import type { EditorApi } from './editor-types';

export const EditorContext = createContext<RichEditorStore | null>(null);

export function useEditorStore(part: string): RichEditorStore {
  const store = useContext(EditorContext);
  if (!store) throw new Error(`${part} must be used within <Editor>`);
  return store;
}

/**
 * Reads a value off the store and re-renders only when it changes. A new
 * selector each render is fine: `isEqual` keeps the previous value when the
 * result is the same.
 */
export function useStoreSelector<S extends EditorStore, T>(
  store: S,
  selector: (store: S) => T,
  isEqual: (a: T, b: T) => boolean = Object.is
): T {
  const cache = useRef<{
    revision: number;
    selector: (store: S) => T;
    value: T;
  } | null>(null);

  const getSnapshot = () => {
    const cached = cache.current;
    if (
      cached &&
      cached.revision === store.revision &&
      cached.selector === selector
    ) {
      return cached.value;
    }
    const next = selector(store);
    const value = cached && isEqual(cached.value, next) ? cached.value : next;
    cache.current = { revision: store.revision, selector, value };
    return value;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

/** The editor's API: commands, dry runs and serializers. */
export function useEditor(): EditorApi {
  return useEditorStore('useEditor').api;
}

/** Selects a value from the editor state. Re-renders only when it changes. */
export function useEditorState<T>(
  selector: (state: EditorState) => T,
  isEqual?: (a: T, b: T) => boolean
): T {
  const store = useEditorStore('useEditorState');
  return useStoreSelector(store, current => selector(current.state), isEqual);
}
