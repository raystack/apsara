export interface SelectTriggerProps {
  /** Defines the size of the trigger. */
  size?: "small" | "medium";

  /** Visual style variant. */
  variant?: "default" | "filter";

  /** Props for the chevron icon. */
  iconProps?: Record<string, any>;

  /** Accessible label. */
  ariaLabel?: string;

  /** ID of element describing the select. */
  ariaDescribedby?: string;

  /** Whether the select is required. */
  ariaRequired?: boolean;

  /** Whether the select has an invalid value. */
  ariaInvalid?: boolean;
}

export interface SelectContentProps {
  /**
   * Position of the content
   * @default "popper"
   */
  position?: "item-aligned" | "popper";

  /** Additional CSS class names. */
  className?: string;
}

export interface SelectItemProps {
  /** The value of the item. */
  value: string;

  /** Props passed to the Text component. */
  textProps?: Record<string, any>;

  /** Additional CSS class names. */
  className?: string;
}
