export interface ComboboxRootProps {
  /** Enables multiple selection.
   * When enabled, value, onValueChange, and defaultValue will be an array of strings.
   * @default false
   */
  multiple?: boolean;

  /** The controlled value of the combobox.
   * For single selection: string
   * For multiple selection: string[]
   */
  value?: string | string[];

  /** The default value of the combobox (uncontrolled).
   * For single selection: string
   * For multiple selection: string[]
   */
  defaultValue?: string | string[];

  /** Callback fired when the value changes.
   * For single selection: (value: string) => void
   * For multiple selection: (value: string[]) => void
   */
  onValueChange?: (value: string | string[]) => void;

  /** The controlled input value of the combobox. */
  inputValue?: string;

  /** The default input value (uncontrolled). */
  defaultInputValue?: string;

  /** Callback fired when the input value changes. */
  onInputValueChange?: (inputValue: string) => void;

  /** Whether the combobox is open.
   * @default false
   */
  open?: boolean;

  /** The default open state (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;

  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Whether the popover should be modal.
   * @default false
   */
  modal?: boolean;

  /**
   * The items to filter. Accepts an array of items or a collection from `Combobox.createItems`.
   * When set, the root filters the items and `Combobox.Content` can render them with a function child.
   *
   * @remarks `unknown[] | ReturnType<typeof Combobox.createItems>`
   */
  items?: unknown[];

  /** The `id` of the input. `Combobox.Label` uses it. */
  id?: string;
}

export interface ComboboxInputProps {
  /**
   * Size variant of the input field.
   * @default "large"
   */
  size?: 'small' | 'large';

  /** Whether the input is disabled. */
  disabled?: boolean;

  /** Icon element to display at the start of input. */
  leadingIcon?: React.ReactNode;

  /** Text or symbol to show before input value. */
  prefix?: string;

  /** Placeholder text for the input field. */
  placeholder?: string;

  /** Custom width for the input field. */
  width?: string | number;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxContentProps {
  /** Alignment of the content relative to the trigger.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';

  /** Distance from the trigger in pixels.
   * @default 4
   */
  sideOffset?: number;

  /** Additional CSS class names. */
  className?: string;

  /**
   * Corner radius for this popup only. Overrides the theme's `radius`.
   * @defaultValue The theme's `radius`
   */
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';

  /**
   * The list content. Pass a function to render each item that matches the input when `items` is set on the root.
   */
  children?:
    | React.ReactNode
    | ((item: unknown, index: number) => React.ReactNode);
}

export interface ComboboxItemProps {
  /** The value of the item. If not provided, the item content will be used as the value. */
  value?: string;

  /** Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;

  /** Leading icon to display before the item text. */
  leadingIcon?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxGroupProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxLabelProps {
  /** Shows `optionalText` after the label when `false`. */
  required?: boolean;

  /**
   * Text shown after the label when `required` is `false`.
   * @default "(optional)"
   */
  optionalText?: string;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxClearProps {
  /**
   * Size of the button.
   * @default 2
   */
  size?: 1 | 2 | 3 | 4;

  /**
   * Accessible name of the button.
   * @default "Clear"
   */
  'aria-label'?: string;

  /**
   * The icon inside the button.
   * @default <ClearIcon />
   */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxEmptyProps {
  /**
   * The text shown when no item matches.
   * @default "No results"
   */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxStatusProps {
  /**
   * The text to announce.
   * @defaultValue The number of matching items, for example "3 results"
   */
  children?: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxGroupLabelProps {
  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}
