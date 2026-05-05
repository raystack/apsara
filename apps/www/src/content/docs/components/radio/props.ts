export interface RadioGroupProps {
  /** The value of the radio item that should be checked by default. */
  defaultValue?: unknown;

  /** The controlled value of the radio item that is checked. */
  value?: unknown;

  /** Event handler called when the value changes. */
  onValueChange?: (value: unknown, event: Event) => void;

  /** When true, prevents user interaction with the radio group. */
  disabled?: boolean;

  /**
   * The layout orientation of the radio group.
   * @default "vertical"
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * The default size applied to all radio items in the group. Can be overridden per item.
   * @default "large"
   */
  size?: 'large' | 'small';

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
  value: unknown;

  /** When true, prevents user interaction with this radio item. */
  disabled?: boolean;

  /**
   * The size of the radio button. Overrides the `size` set on `Radio.Group`.
   * If neither is set, defaults to `"large"` via the group.
   */
  size?: 'large' | 'small';

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
