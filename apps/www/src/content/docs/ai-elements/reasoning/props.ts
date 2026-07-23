import type React from 'react';

export interface ReasoningProps {
  /**
   * Whether the reasoning is still being produced. While `true` the default
   * trigger shows a shimmering "Thinking…" label and the panel auto-opens;
   * when it flips back to `false` the panel auto-collapses — unless the user
   * has toggled it themselves.
   * @defaultValue false
   */
  streaming?: boolean;

  /**
   * How long the reasoning took, in seconds. Rendered by the default trigger
   * label as "Worked for N seconds" once `streaming` is over.
   */
  duration?: number;

  /** Whether the panel is open (controlled). */
  open?: boolean;

  /** Whether the panel is initially open. Defaults to `streaming`. */
  defaultOpen?: boolean;

  /** Called when the panel is opened or closed. */
  onOpenChange?: (open: boolean) => void;

  /** Custom CSS class names. */
  className?: string;
}

export interface ReasoningStepProps {
  /** Title row of the step, e.g. "Gathering ticket updates". */
  label?: React.ReactNode;

  /** Indented detail content below the label. */
  children?: React.ReactNode;

  /** Custom CSS class names. */
  className?: string;
}
