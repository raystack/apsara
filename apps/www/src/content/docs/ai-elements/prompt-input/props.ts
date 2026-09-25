import type React from 'react';

export interface PromptInputProps {
  /**
   * The draft, controlled. Uses the same string format as `onValueChange`.
   * Most apps are better off leaving this uncontrolled.
   */
  value?: string;

  /**
   * The starting draft when uncontrolled.
   * @defaultValue ""
   */
  defaultValue?: string;

  /**
   * Called on every change. The first argument can be passed straight back
   * into `value` — chips included.
   */
  onValueChange?: (
    markup: string,
    details: { text: string; mentions: PromptInputMention[] }
  ) => void;

  /**
   * Called with the trimmed message when the prompt is submitted — Enter in the
   * input or a click on `PromptInput.Submit`. Call
   * `event.currentTarget.reset()` to clear the composer after sending.
   */
  onSubmit?: (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => void;

  /**
   * Called when `PromptInput.Submit` is pressed while `status` is
   * `"submitted"` or `"streaming"`.
   */
  onStop?: () => void;

  /**
   * The consumer-owned request lifecycle. Drives `PromptInput.Submit`:
   * `"idle"`/`"error"` show a send arrow, `"submitted"` a spinner and
   * `"streaming"` a stop square (both routed to `onStop`).
   * @defaultValue "idle"
   */
  status?: 'idle' | 'submitted' | 'streaming' | 'error';

  /**
   * Disables the whole composer.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * The element the frame focuses when its own padding is clicked.
   * `PromptInput.Textarea` and `PromptInput.Editor` register themselves here on
   * mount; pass a ref of your own when you render a custom input instead.
   * Whichever is set first wins.
   */
  inputRef?: React.RefObject<HTMLElement | null>;

  /**
   * Lets you drive the composer from code — `focus`, `clear`,
   * `insertMention`, `getValue`. `ref` still points at the `<form>`.
   */
  actionsRef?: React.RefObject<PromptInputActions | null>;

  /** Custom CSS class names. */
  className?: string;
}

export interface PromptInputMessage {
  /** The message as plain text, with each chip inlined as `@label`. */
  text: string;

  /** The message as a saveable string — pass it back into `value`. */
  markup: string;

  /** Chips in the order they appear. Offsets point into `text`. */
  mentions: PromptInputMention[];
}

export interface PromptInputMention {
  id: string;
  label: string;
  /** The kind of thing this is — `"user"`, `"component"`, and so on. */
  type: string;
  /** The character that opened the menu. */
  trigger: string;
  /** Whatever `data` the item carried when it was picked. */
  data?: unknown;
  /** Where the chip starts in `text`. */
  start: number;
  /** Where the chip ends in `text`. */
  end: number;
}

export interface PromptInputActions {
  /** Focuses the input, putting the cursor at the end. */
  focus: () => void;

  /** Clears the composer. */
  clear: () => void;

  /**
   * Inserts a chip at the cursor, or at the end if the editor isn't focused,
   * followed by a space. Needs `PromptInput.Editor`.
   */
  insertMention: (
    item: PromptInputMentionItem,
    options?: { trigger?: string }
  ) => void;

  /** The current draft, untrimmed. */
  getValue: () => PromptInputMessage;
}

export interface PromptInputTextareaProps {
  /** Placeholder shown while empty. @defaultValue "Write a message…" */
  placeholder?: string;

  /** Disables just the textarea. Inherits the root `disabled` by default. */
  disabled?: boolean;

  /** Custom CSS class names. */
  className?: string;
}

export interface PromptInputEditorProps {
  /** Shown while the composer is empty. @defaultValue "Write a message…" */
  placeholder?: string;

  /** Disables just the editor. Follows the root `disabled` by default. */
  disabled?: boolean;

  /**
   * Maximum length of the message as plain text, where a chip counts as its
   * label. Applies to pasted and dictated text too, not just typing.
   */
  maxLength?: number;

  /** @defaultValue true */
  spellCheck?: boolean;

  /** Custom CSS class names. */
  className?: string;
}

export interface PromptInputMentionItem {
  id: string;

  label: string;

  /**
   * The kind of thing this is — `"user"`, `"component"`, and so on. Set per
   * item, so one menu can mix kinds.
   * @defaultValue "mention"
   */
  type?: string;

  icon?: React.ReactNode;

  /** Shown at the end of the row — a badge, a shortcut, a timestamp. */
  trailing?: React.ReactNode;

  /** Section heading. Sections appear in the order they first show up. */
  group?: string;

  disabled?: boolean;

  /** Anything you want back on submit. Not saved into the draft string. */
  data?: unknown;
}

export interface PromptInputMentionsProps {
  /** The character that opens the menu. @defaultValue "@" */
  trigger?: string;

  /** A list you already have. Filtered and ranked on the label as you type. */
  items?: PromptInputMentionItem[];

  /**
   * Fetches results as the user types, about 150 ms after they stop. Pass
   * `signal` to `fetch` to cancel outdated requests. Used instead of `items`.
   */
  onSearch?: (
    query: string,
    context: { trigger: string; signal: AbortSignal }
  ) => Promise<PromptInputMentionItem[]>;

  /**
   * Looks up the icon, trailing content and `data` for chips restored from
   * `value` / `defaultValue`, which can't carry them, and refreshes their
   * labels. Calls are batched and cached.
   */
  resolveMentions?: (
    refs: Array<{ type: string; id: string; label: string }>
  ) => Promise<PromptInputMentionItem[]>;

  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** Shown when nothing matches. @defaultValue "No results" */
  emptyMessage?: React.ReactNode;

  /** Loading rows shown while `onSearch` is running. @defaultValue 3 */
  loadingRowCount?: number;
}

export interface PromptInputSubmitProps {
  /**
   * Replaces the status-derived icon (send arrow, spinner or stop square).
   */
  children?: React.ReactNode;

  /**
   * Accessible name. Defaults to "Send message", or "Stop response" while a
   * response is in flight.
   */
  'aria-label'?: string;

  /** Custom CSS class names. */
  className?: string;
}
