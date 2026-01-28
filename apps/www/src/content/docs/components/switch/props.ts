export interface SwitchProps {
  /** The controlled checked state of the switch. */
  checked?: boolean;

  /** The default checked state when uncontrolled. */
  defaultChecked?: boolean;

  /** Event handler called when the checked state changes. */
  onCheckedChange?: (checked: boolean, event: Event) => void;

  /** When true, prevents the user from interacting with the switch. */
  disabled?: boolean;

  /** When true, indicates that the user must check the switch. */
  required?: boolean;

  /**
   * The size of the switch.
   * @default "large"
   */
  size?: 'large' | 'small';

  /** A unique identifier for the switch. */
  id?: string;

  /** Identifies the field when a form is submitted. */
  name?: string;

  /** Additional CSS class names. */
  className?: string;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts a `ReactElement` or a function that returns the element to render.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLAttributes<HTMLElement>,
        state: {
          checked: boolean;
          disabled: boolean;
          readOnly: boolean;
          required: boolean;
        }
      ) => React.ReactElement);
}
