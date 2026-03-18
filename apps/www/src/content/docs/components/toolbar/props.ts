export interface ToolbarProps {
  /**
   * Whether keyboard navigation loops from the last item back to the first.
   * @defaultValue true
   */
  loopFocus?: boolean;

  /**
   * The orientation of the toolbar layout.
   * @defaultValue "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether the toolbar and all its items are disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface ToolbarButtonProps {
  /**
   * Whether the button remains focusable when disabled.
   * @defaultValue true
   */
  focusableWhenDisabled?: boolean;

  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLElement>) => React.ReactElement);

  /** Additional CSS class names. */
  className?: string;
}

export interface ToolbarGroupProps {
  /**
   * Whether the group and all its items are disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}

export interface ToolbarSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface ToolbarLinkProps {
  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLElement>) => React.ReactElement);

  /** Additional CSS class names. */
  className?: string;
}

export interface ToolbarInputProps {
  /**
   * Whether the input remains focusable when disabled.
   * @defaultValue true
   */
  focusableWhenDisabled?: boolean;

  /**
   * Whether the input is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}
