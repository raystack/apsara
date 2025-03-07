export interface SheetProps {
  /** The content to be rendered inside the sheet. */
  children: React.ReactNode;

  /** Accessible label for the sheet trigger. */
  ariaLabel?: string;
}

export interface SheetContentProps {
  /** The direction from which the sheet appears. */
  side?: "top" | "right" | "bottom" | "left";

  /** Whether to show the close button. */
  close?: boolean;

  /** Accessible label for the sheet content. */
  ariaLabel?: string;

  /** Accessible description for the sheet content. */
  ariaDescription?: string;

  /** The content to be rendered inside the sheet. */
  children: React.ReactNode;
}
