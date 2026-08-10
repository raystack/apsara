'use client';

import { cx } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';
import { Cell } from '../menu/cell';
import { Popover } from '../popover';
import { Skeleton } from '../skeleton';
import styles from './editor.module.css';

export interface SuggestionMenuItem {
  id: string;
  label: string;
  type?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  group?: string;
  disabled?: boolean;
  data?: unknown;
}

/** Rendered in first-appearance order; the leading group has no label. */
export interface SuggestionGroup {
  label?: string;
  items: SuggestionMenuItem[];
}

/** A zero-width caret rect, re-measured by the positioner as the caret moves. */
export interface SuggestionAnchor {
  getBoundingClientRect: () => DOMRect;
  /**
   * The editing host. A virtual element has nothing for the positioner to
   * observe on its own, so without this the menu would not follow the trigger
   * when the composer grows a line or its scroll ancestors move.
   */
  contextElement?: Element;
}

export interface SuggestionMenuProps {
  open: boolean;
  anchor: SuggestionAnchor | null;
  /** Listbox id, referenced by the editor's `aria-controls`. */
  id: string;
  groups: SuggestionGroup[];
  /** Index into the flattened item list, or -1. */
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
  onSelect: (item: SuggestionMenuItem, index: number) => void;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  /** @defaultValue 3 */
  loadingRowCount?: number;
  /** @defaultValue "No results" */
  emptyMessage?: ReactNode;
  /** Width the popup takes, in pixels — the composer frame's width. */
  width?: number;
  'aria-label'?: string;
}

/** Row ids are derived, so the editor can name the highlighted one. */
export function suggestionOptionId(listId: string, index: number): string {
  return `${listId}-option-${index}`;
}

export function SuggestionMenu({
  open,
  anchor,
  id,
  groups,
  highlightedIndex,
  onHighlightChange,
  onSelect,
  onOpenChange,
  loading = false,
  loadingRowCount = 3,
  emptyMessage = 'No results',
  width,
  'aria-label': ariaLabel = 'Suggestions'
}: SuggestionMenuProps) {
  const total = groups.reduce((count, group) => count + group.items.length, 0);
  let cursor = -1;

  return (
    <Popover open={open && anchor !== null} onOpenChange={onOpenChange}>
      <Popover.Content
        anchor={anchor ?? undefined}
        align='start'
        side='bottom'
        sideOffset={6}
        // Focus never leaves the editor — the query lives in the document
        // because it is the text the chip replaces.
        initialFocus={false}
        finalFocus={false}
        className={styles.suggestionMenu}
        style={
          {
            '--suggestion-menu-width': width ? `${width}px` : undefined
          } as CSSProperties
        }
      >
        <div id={id} role='listbox' aria-label={ariaLabel}>
          {loading && total === 0
            ? Array.from({ length: loadingRowCount }).map((_, index) => (
                <div
                  key={index}
                  className={styles.suggestionLoadingRow}
                  aria-hidden='true'
                >
                  <Skeleton height='var(--rs-space-4)' />
                </div>
              ))
            : null}

          {!loading && total === 0 ? (
            <div className={styles.suggestionEmpty}>{emptyMessage}</div>
          ) : null}

          {groups.map(group => (
            <div
              key={group.label ?? '__ungrouped__'}
              className={styles.suggestionGroup}
              role='presentation'
            >
              {group.label ? (
                <div
                  className={styles.suggestionGroupLabel}
                  role='presentation'
                >
                  {group.label}
                </div>
              ) : null}
              {group.items.map(item => {
                cursor += 1;
                const index = cursor;
                const highlighted = index === highlightedIndex;
                return (
                  <Cell
                    key={`${item.type ?? ''}:${item.id}`}
                    id={suggestionOptionId(id, index)}
                    role='option'
                    aria-selected={highlighted}
                    aria-disabled={item.disabled || undefined}
                    data-highlighted={highlighted ? '' : undefined}
                    className={cx(styles.suggestionRow)}
                    leadingIcon={item.icon}
                    trailingIcon={item.trailing}
                    onPointerMove={() => {
                      if (!item.disabled) onHighlightChange(index);
                    }}
                    // Keep the caret: a press inside the menu must not move
                    // focus out of the editor.
                    onPointerDown={event => event.preventDefault()}
                    onClick={() => {
                      if (!item.disabled) onSelect(item, index);
                    }}
                  >
                    {item.label}
                  </Cell>
                );
              })}
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  );
}

SuggestionMenu.displayName = 'SuggestionMenu';
