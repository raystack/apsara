'use client';

import { compareItems, rankItem } from '@tanstack/match-sorter-utils';
import type { EditorView } from 'prosemirror-view';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import {
  type EditorActions,
  type SuggestionAnchor,
  type SuggestionGroup,
  type SuggestionState,
  suggestionOptionId
} from '../editor';
import type { PromptInputMention } from './prompt-input-context';
import type {
  PromptInputMentionItem,
  PromptInputMentionRegistry
} from './prompt-input-mention-registry';

/** Long enough that a fast typist makes one request per word, not per letter. */
const SEARCH_DEBOUNCE_MS = 150;

const NO_ITEMS: PromptInputMentionItem[] = [];

/**
 * Re-renders whatever reads the registry when a config or an item lands.
 * `useSyncExternalStore` rather than a subscribe-and-bump effect, because
 * `Mentions` registers its trigger from an effect that runs *before* a later
 * sibling `Editor` gets to subscribe — the store re-reads its snapshot after
 * subscribing, so that first registration is never missed.
 */
export function useMentionRegistryVersion(
  registry: PromptInputMentionRegistry
): void {
  useSyncExternalStore(
    registry.subscribe,
    registry.getRevision,
    registry.getRevision
  );
}

/**
 * Groups render in first-appearance order of `group` within the results, so
 * consumers control section order by ordering their data. Ungrouped items lead
 * in a headerless section, and a group that filters down to nothing disappears.
 */
export function toGroups(items: PromptInputMentionItem[]): SuggestionGroup[] {
  const ungrouped: PromptInputMentionItem[] = [];
  const order: string[] = [];
  const buckets = new Map<string, PromptInputMentionItem[]>();

  for (const item of items) {
    if (!item.group) {
      ungrouped.push(item);
      continue;
    }
    const bucket = buckets.get(item.group);
    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(item.group, [item]);
      order.push(item.group);
    }
  }

  const groups: SuggestionGroup[] = [];
  if (ungrouped.length) groups.push({ items: ungrouped });
  for (const label of order) {
    groups.push({ label, items: buckets.get(label) ?? [] });
  }
  return groups;
}

/** Sync data filtering — match-sorter on the label, best matches first. */
export function filterItems(
  items: PromptInputMentionItem[],
  query: string
): PromptInputMentionItem[] {
  if (!query) return items;
  const ranked = items
    .map(item => ({
      item,
      ranking: rankItem(item, query, {
        accessors: [entry => (entry as PromptInputMentionItem).label]
      })
    }))
    .filter(entry => entry.ranking.passed);
  ranked.sort((a, b) => compareItems(a.ranking, b.ranking));
  return ranked.map(entry => entry.item);
}

function firstEnabled(items: PromptInputMentionItem[]): number {
  const index = items.findIndex(item => !item.disabled);
  return index;
}

function step(
  items: PromptInputMentionItem[],
  from: number,
  direction: 1 | -1
): number {
  if (items.length === 0) return -1;
  let index = from;
  for (let attempt = 0; attempt < items.length; attempt += 1) {
    index = (index + direction + items.length) % items.length;
    if (!items[index]?.disabled) return index;
  }
  return -1;
}

export interface UseMentionMenuOptions {
  viewRef: React.RefObject<EditorView | null>;
  actions: EditorActions;
  registry: PromptInputMentionRegistry;
  suggestion: SuggestionState | null;
  disabled: boolean;
  listboxId: string;
}

export interface UseMentionMenuResult {
  open: boolean;
  anchor: SuggestionAnchor;
  groups: SuggestionGroup[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  loading: boolean;
  loadingRowCount: number;
  emptyMessage: React.ReactNode;
  select: (item: PromptInputMentionItem) => void;
  close: () => void;
  activeOptionId: string | undefined;
  /** Routed from the ProseMirror plugin while a query is active. */
  handleKeyDown: (event: KeyboardEvent, state: SuggestionState) => boolean;
}

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

  const suggestionRef = useRef(suggestion);
  suggestionRef.current = suggestion;

  const [results, setResults] = useState<PromptInputMentionItem[]>(NO_ITEMS);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const trigger = suggestion?.trigger;
  const query = suggestion?.query ?? '';
  // Depended on individually rather than through `config`, so a changed
  // `emptyMessage` cannot restart an in-flight search.
  const search = config?.onSearch;
  const syncItems = config?.items;

  // Async results: debounced, aborted on supersede, and guarded by a sequence
  // number so a slow response for an old query can never land.
  const sequenceRef = useRef(0);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!open || trigger === undefined) {
      setResults(NO_ITEMS);
      setLoading(false);
      return;
    }

    if (!search) {
      setLoading(false);
      setResults(filterItems(syncItems ?? NO_ITEMS, query));
      return;
    }

    const sequence = (sequenceRef.current += 1);
    const controller = new AbortController();
    setLoading(true);

    const timer = window.setTimeout(() => {
      search(query, { trigger, signal: controller.signal })
        .then(items => {
          if (sequence !== sequenceRef.current) return;
          setResults(items);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (sequence !== sequenceRef.current) return;
          setLoading(false);
          setResults(NO_ITEMS);
          const aborted =
            controller.signal.aborted ||
            (error instanceof Error && error.name === 'AbortError');
          if (
            !aborted &&
            !warnedRef.current &&
            process.env.NODE_ENV !== 'production'
          ) {
            warnedRef.current = true;
            console.warn(
              '[Apsara] PromptInput.Mentions onSearch rejected; the menu falls ' +
                'back to its empty state.',
              error
            );
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, trigger, query, search, syncItems]);

  const groups = useMemo(() => toGroups(results), [results]);
  const flat = useMemo(() => groups.flatMap(group => group.items), [groups]);
  const flatRef = useRef(flat);
  flatRef.current = flat;

  // The first enabled row is auto-highlighted whenever the result set changes.
  // Keyed on what the rows *are* rather than on the array's identity: an inline
  // `items={[…]}` prop is a fresh array on every consumer render, and resetting
  // on identity would throw away the user's arrow-key position whenever
  // something unrelated re-rendered above the composer.
  const rowSignature = useMemo(
    () =>
      flat
        .map(item => `${item.type ?? ''}:${item.id}:${item.disabled ? 1 : 0}`)
        .join('\0'),
    [flat]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: the signature is the trigger; the rows are read through a ref
  useEffect(() => {
    setHighlightedIndex(firstEnabled(flatRef.current));
  }, [rowSignature]);

  // Held past the config that supplied it: closing clears the active trigger,
  // so reading the callback off the live config would swallow the `false`.
  const onOpenChangeRef = useRef<((open: boolean) => void) | undefined>(
    undefined
  );
  if (config?.onOpenChange) onOpenChangeRef.current = config.onOpenChange;
  const lastOpenRef = useRef(false);
  useEffect(() => {
    if (lastOpenRef.current === open) return;
    lastOpenRef.current = open;
    onOpenChangeRef.current?.(open);
  }, [open]);

  const close = useCallback(() => {
    actions.dismissSuggestion();
  }, [actions]);

  // Spaces are allowed while results are non-empty, so multi-word entities stay
  // filterable. The first keystroke that empties the results while the query
  // already contains a space gives up and leaves the text literal.
  useEffect(() => {
    if (!open || loading) return;
    if (results.length > 0) return;
    if (!query.includes(' ')) return;
    close();
  }, [open, loading, results.length, query, close]);

  const select = useCallback(
    (item: PromptInputMentionItem) => {
      const state = suggestionRef.current;
      if (!state) return;
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

  // The last rect the caret actually had. Selecting an item takes the query
  // range out of the document in the same breath as it closes the menu, but the
  // popup is still animating out and the positioner keeps measuring — without
  // something to hand back, it would read a zero rect and the closing menu
  // would jump to the top-left corner of the viewport and flicker there.
  const lastRectRef = useRef<DOMRect | null>(null);

  const anchor = useMemo<SuggestionAnchor>(
    () => ({
      get contextElement() {
        return viewRef.current?.dom;
      },
      getBoundingClientRect: () => {
        const view = viewRef.current;
        const state = suggestionRef.current;
        if (view && state) {
          try {
            const coords = view.coordsAtPos(state.from);
            const rect = new DOMRect(
              coords.left,
              coords.top,
              0,
              Math.max(0, coords.bottom - coords.top)
            );
            lastRectRef.current = rect;
            return rect;
          } catch {
            // The range is gone, or the browser is mid-relayout.
          }
        }
        // jsdom has no geometry to give either, and no animation to cover.
        return lastRectRef.current ?? new DOMRect(0, 0, 0, 0);
      }
    }),
    [viewRef]
  );

  const highlightedRef = useRef(highlightedIndex);
  highlightedRef.current = highlightedIndex;
  const openRef = useRef(open);
  openRef.current = open;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!openRef.current) return false;

      const items = flatRef.current;
      const current = highlightedRef.current;

      const consume = () => {
        event.preventDefault();
        // Enter must not reach the form and Escape must not reach ChatPanel,
        // Dialog or Drawer — either would destroy the draft.
        event.stopPropagation();
      };

      switch (event.key) {
        case 'ArrowDown':
          consume();
          setHighlightedIndex(step(items, current, 1));
          return true;
        case 'ArrowUp':
          consume();
          setHighlightedIndex(step(items, current, -1));
          return true;
        case 'Escape':
          consume();
          close();
          return true;
        case 'Enter':
        case 'Tab': {
          const item = items[current];
          if (!item || item.disabled) {
            // Nothing to pick: leave the text literal and let the key through
            // to submit or to move focus.
            close();
            return false;
          }
          consume();
          select(item);
          return true;
        }
        default:
          return false;
      }
    },
    [close, select]
  );

  return {
    open,
    anchor,
    groups,
    highlightedIndex,
    setHighlightedIndex,
    loading,
    loadingRowCount: config?.loadingRowCount ?? 3,
    emptyMessage: config?.emptyMessage ?? 'No results',
    select,
    close,
    activeOptionId:
      open && highlightedIndex >= 0
        ? suggestionOptionId(listboxId, highlightedIndex)
        : undefined,
    handleKeyDown
  };
}

/**
 * `icon`, `trailing` and `data` cannot survive serialization, so a chip parsed
 * from `defaultValue` starts label-only and fills in when the consumer's
 * `resolveMentions` resolves — the same progressive enhancement `Select.Value`
 * uses when it falls back to the raw value until an item registers. A rejection
 * or a missing item leaves the chip label-only; it is never an error state and
 * the chip is never removed.
 */
export function useMentionResolution(
  registry: PromptInputMentionRegistry,
  mentions: PromptInputMention[],
  actions: EditorActions
): void {
  const requestedRef = useRef(new Set<string>());
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    if (mentions.length === 0) return;

    const byTrigger = new Map<
      string,
      Array<{ type: string; id: string; label: string }>
    >();

    for (const mention of mentions) {
      const key = `${mention.trigger}|${mention.type}|${mention.id}`;
      if (requestedRef.current.has(key)) continue;
      if (registry.has(mention.trigger, mention.type, mention.id)) continue;
      const config = registry.get(mention.trigger);
      if (!config?.resolveMentions) continue;
      requestedRef.current.add(key);
      const bucket = byTrigger.get(mention.trigger);
      const ref = {
        type: mention.type,
        id: mention.id,
        label: mention.label
      };
      if (bucket) bucket.push(ref);
      else byTrigger.set(mention.trigger, [ref]);
    }

    if (byTrigger.size === 0) return;

    for (const [trigger, refs] of byTrigger) {
      const resolve = registry.get(trigger)?.resolveMentions;
      if (!resolve) continue;
      resolve(refs)
        .then(items => {
          if (items.length === 0) return;
          registry.rememberAll(trigger, items);
          const labels = new Map<string, string>();
          for (const item of items) {
            labels.set(
              `${trigger}|${item.type ?? 'mention'}|${item.id}`,
              item.label
            );
          }
          actionsRef.current.refreshMentionLabels(labels);
        })
        .catch(() => {
          // Label-only is the fallback, so there is nothing to recover.
        });
    }
  }, [registry, mentions]);
}
