'use client';

import type { ReactNode } from 'react';
import { mentionKey } from '../editor/mention';

export interface PromptInputMentionItem {
  id: string;
  label: string;
  /**
   * Entity kind, serialized into the markup. A single `@` menu legitimately
   * returns several kinds, which is why this is per item and not per trigger.
   * @defaultValue "mention"
   */
  type?: string;
  icon?: ReactNode;
  /** Trailing metadata — a badge, a shortcut, a timestamp. */
  trailing?: ReactNode;
  /** Section heading. Groups render in first-appearance order. */
  group?: string;
  disabled?: boolean;
  /** Opaque; handed back on submit. Never serialized. */
  data?: unknown;
}

/** A reference parsed out of markup, before it has been resolved. */
export interface PromptInputMentionRef {
  type: string;
  id: string;
  label: string;
}

/** Everything `PromptInput.Mentions` contributes for one trigger. */
export interface PromptInputMentionsData {
  items?: PromptInputMentionItem[];
  onSearch?: (
    query: string,
    context: { trigger: string; signal: AbortSignal }
  ) => Promise<PromptInputMentionItem[]>;
  resolveMentions?: (
    refs: PromptInputMentionRef[]
  ) => Promise<PromptInputMentionItem[]>;
  onOpenChange?: (open: boolean) => void;
  emptyMessage?: ReactNode;
  loadingRowCount?: number;
}

export interface PromptInputMentionsConfig extends PromptInputMentionsData {
  trigger: string;
}

function sameData(
  a: PromptInputMentionsData,
  b: PromptInputMentionsData
): boolean {
  return (
    a.items === b.items &&
    a.onSearch === b.onSearch &&
    a.resolveMentions === b.resolveMentions &&
    a.onOpenChange === b.onOpenChange &&
    a.emptyMessage === b.emptyMessage &&
    a.loadingRowCount === b.loadingRowCount
  );
}

/**
 * Shared between `Mentions` (which writes the config), `Editor` (which reads
 * triggers, drives the menu and decorates chips) and Root (which reads `data`
 * back when assembling a message).
 *
 * `icon`, `trailing` and `data` cannot survive serialization, so they live here
 * rather than on the document — keyed by `trigger|type|id`, filled in when an
 * item is picked from the menu or returned by `resolveMentions`.
 *
 * Registration is split from data on purpose. The trigger is established once,
 * while the data is pushed after every `Mentions` render and compared field by
 * field — so an inline `items` array stays live without a config object whose
 * identity churns and restarts an in-flight search.
 */
export class PromptInputMentionRegistry {
  private configs = new Map<string, PromptInputMentionsConfig>();
  private items = new Map<string, PromptInputMentionItem>();
  private listeners = new Set<() => void>();
  private revision = 0;

  register(trigger: string): () => void {
    if (!this.configs.has(trigger)) {
      this.configs.set(trigger, { trigger });
      this.emit();
    }
    return () => {
      if (this.configs.delete(trigger)) this.emit();
    };
  }

  setData(trigger: string, data: PromptInputMentionsData): void {
    const current = this.configs.get(trigger);
    if (!current || sameData(current, data)) return;
    this.configs.set(trigger, { trigger, ...data });
    this.emit();
  }

  get(trigger: string): PromptInputMentionsConfig | undefined {
    return this.configs.get(trigger);
  }

  triggers(): string[] {
    return [...this.configs.keys()];
  }

  remember(trigger: string, item: PromptInputMentionItem): void {
    this.rememberAll(trigger, [item]);
  }

  rememberAll(trigger: string, items: PromptInputMentionItem[]): void {
    if (items.length === 0) return;
    for (const item of items) {
      const type = item.type ?? 'mention';
      this.items.set(mentionKey(trigger, type, item.id), { ...item, type });
    }
    this.emit();
  }

  lookup(
    trigger: string,
    type: string,
    id: string
  ): PromptInputMentionItem | undefined {
    return this.items.get(mentionKey(trigger, type, id));
  }

  has(trigger: string, type: string, id: string): boolean {
    return this.items.has(mentionKey(trigger, type, id));
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Bumped by every mutation. Read as a `useSyncExternalStore` snapshot, so a
   * reader that mounts after a writer has already emitted still sees the
   * change — `Mentions` registers its trigger in an effect that runs before a
   * later sibling `Editor` has subscribed.
   */
  getRevision = (): number => this.revision;

  private emit() {
    this.revision += 1;
    for (const listener of this.listeners) listener();
  }
}
