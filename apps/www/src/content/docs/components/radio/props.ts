export interface RadioGroupProps {
  /** The value of the radio item that should be checked by default. */
  defaultValue?: any;

  /** The controlled value of the radio item that is checked. */
  value?: any;

  /** Event handler called when the value changes. */
  onValueChange?: (value: any, event: Event) => void;

  /** When true, prevents user interaction with the radio group. */
  disabled?: boolean;

  /** The name of the radio group when submitted as a form field. */
  name?: string;

  /** Additional CSS class name. */
  className?: string;

  /**
   * Allows you to replace the component's HTML element with a different tag, or compose it with another component.
   * Accepts a `ReactElement` or a function that returns the element to render.
   *
   * @remarks `ReactElement | function`
   */
  render?:
    | React.ReactElement
    | ((props: React.HTMLAttributes<HTMLElement>) => React.ReactElement);
}

export interface RadioProps {
  /** The unique value of the radio item. */
  value: any;

  /** When true, prevents user interaction with this radio item. */
  disabled?: boolean;

  /** The unique identifier for the radio item. */
  id?: string;

  /** Additional CSS class name. */
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
        state: { checked: boolean }
      ) => React.ReactElement);
}
