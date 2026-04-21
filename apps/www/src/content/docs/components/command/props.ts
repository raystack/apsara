export interface CommandRootProps {
  /**
   * Items to display and filter via Base UI's internal logic.
   * When provided, the built-in auto-search that filters `Command.Item`
   * children is disabled — filtering is delegated to Base UI
   * (or your custom `filter` function).
   */
  items?: readonly unknown[];

  /** Controlled input value. */
  value?: string;

  /** Default input value (uncontrolled). */
  defaultValue?: string;

  /**
   * Callback fired when the input value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Whether the list is rendered inline (without a popup).
   * @defaultValue true
   */
  inline?: boolean;

  /**
   * Whether the list is considered open (items focusable).
   * @defaultValue true
   */
  open?: boolean;

  /**
   * Whether the first matching item is highlighted automatically.
   * - `true`: highlight after the user types
   * - `'always'`: highlight the first item as soon as the list opens
   * @defaultValue "always"
   */
  autoHighlight?: boolean | 'always';

  /**
   * Whether the highlighted item should be preserved when the pointer leaves.
   * @defaultValue true
   */
  keepHighlight?: boolean;

  /**
   * Filter function used to match items against the input query.
   * Only applied when `items` is provided.
   */
  filter?: (itemValue: unknown, query: string) => boolean;
}

export interface CommandPanelProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandInputProps {
  /** Placeholder text for the input. */
  placeholder?: string;

  /** Icon rendered at the start of the input. Defaults to a magnifying glass. */
  leadingIcon?: React.ReactNode;

  /**
   * Auto-focus the input when it mounts (typical command-palette behavior).
   * @defaultValue true
   */
  autoFocus?: boolean;

  /**
   * Size variant of the input field.
   * @defaultValue "large"
   */
  size?: 'small' | 'large';

  /** Additional CSS class names. */
  className?: string;
}

export interface CommandListProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandEmptyProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandItemProps {
  /**
   * A unique value that identifies this item.
   * If omitted and `children` is a string, the string is used as the value.
   */
  value?: unknown;

  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Icon rendered before the item label. */
  leadingIcon?: React.ReactNode;

  /**
   * Click handler fired on pointer click and on keyboard `Enter`
   * when the item is highlighted.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /** Additional CSS class names. */
  className?: string;
}

export interface CommandGroupProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandLabelProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandShortcutProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandFooterProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface CommandDialogProps {
  /** Controlled open state. */
  open?: boolean;

  /**
   * Default open state (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /** Event handler called when the dialog is opened or closed. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the dialog is modal.
   * @defaultValue true
   */
  modal?: boolean;
}

export interface CommandDialogContentProps {
  /** Additional CSS class names applied to the dialog popup. */
  className?: string;

  /** Class name applied to the backdrop. */
  backdropClassName?: string;

  /** Class name applied to the viewport. */
  viewportClassName?: string;
}
