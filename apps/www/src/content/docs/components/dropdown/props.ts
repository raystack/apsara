export interface DropdownMenuTriggerProps {
  /** Boolean to merge props onto child element */
  asChild?: boolean;
}

export interface DropdownMenuContentProps {
  /** Alignment of the dropdown */
  align?: "start" | "center" | "end";

  /**
   * Offset from the trigger
   * @default 4
   */
  sideOffset?: number;

  /** Additional CSS class names */
  className?: string;
}

export interface DropdownMenuItemProps {
  /** Icon element to display before item text */
  leadingIcon?: React.ReactNode;

  /** Icon element to display after item text */
  trailingIcon?: React.ReactNode;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Additional CSS class names */
  className?: string;
}

export interface DropdownMenuGroupProps {
  /** Additional CSS class names */
  className?: string;
}

export interface DropdownMenuLabelProps {
  /** Additional CSS class names */
  className?: string;
}

export interface DropdownMenuSeparatorProps {
  /** Additional CSS class names */
  className?: string;
}

export interface DropdownMenuEmptyStateProps {
  /** React nodes to render in empty state */
  children?: React.ReactNode;

  /** Additional CSS class names */
  className?: string;
}
