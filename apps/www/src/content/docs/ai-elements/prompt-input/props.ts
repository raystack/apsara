import type React from 'react';

export interface PromptInputProps {
  /** The composed text (controlled). */
  value?: string;

  /**
   * The initial text when uncontrolled.
   * @defaultValue ""
   */
  defaultValue?: string;

  /** Called when the composed text changes. */
  onValueChange?: (value: string) => void;

  /**
   * Called with the trimmed text when the prompt is submitted — Enter in the
   * textarea or a click on `PromptInput.Submit`. Call
   * `event.currentTarget.reset()` to clear the input after sending.
   */
  onSubmit?: (value: string, event: React.FormEvent<HTMLFormElement>) => void;

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

  /** Custom CSS class names. */
  className?: string;
}

export interface PromptInputTextareaProps {
  /** Placeholder shown while empty. @defaultValue "Write a message…" */
  placeholder?: string;

  /** Disables just the textarea. Inherits the root `disabled` by default. */
  disabled?: boolean;

  /** Custom CSS class names. */
  className?: string;
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
