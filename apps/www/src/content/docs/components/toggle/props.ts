export interface ToggleProps {
  /** Unique identifier for the toggle when used inside a `Toggle.Group`. */
  value?: string;

  /**
   * The default pressed state (uncontrolled).
   * @defaultValue false
   */
  defaultPressed?: boolean;

  /** The controlled pressed state. */
  pressed?: boolean;

  /** Event handler called when the pressed state changes. */
  onPressedChange?: (pressed: boolean, event: Event) => void;

  /**
   * The size of the toggle.
   * @defaultValue 3
   */
  size?: 1 | 2 | 3 | 4;

  /**
   * When true, prevents the user from interacting with the toggle.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: { pressed: boolean; disabled: boolean }
      ) => React.ReactElement);
}

export interface ToggleGroupProps {
  /** The default pressed values (uncontrolled). */
  defaultValue?: string[];

  /** The controlled pressed values. */
  value?: string[];

  /** Event handler called when the pressed values change. */
  onValueChange?: (value: string[], event: Event) => void;

  /**
   * When true, multiple toggles can be pressed at the same time.
   * @defaultValue false
   */
  multiple?: boolean;

  /**
   * When true, prevents user interaction with all toggles in the group.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * The orientation of the toggle group.
   * @defaultValue "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * When true, keyboard focus wraps from the last item to the first.
   * @defaultValue true
   */
  loopFocus?: boolean;

  /** Additional CSS class names. */
  className?: string;
}
