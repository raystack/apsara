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
}

export interface ComboboxInputProps {
  /**
   * Size variant of the input field
   * @default "large"
   */
  size?: 'small' | 'large';

  /** Text label above the input */
  label?: string;

  /** Helper text below the input */
  helperText?: string;

  /** Error message to display below the input */
  error?: string;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Icon element to display at the start of input */
  leadingIcon?: React.ReactNode;

  /** Shows "(Optional)" text next to label */
  optional?: boolean;

  /** Text or symbol to show before input value */
  prefix?: string;

  /** Placeholder text for the input field. */
  placeholder?: string;

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
  /** Additional CSS class names. */
  className?: string;
}

export interface ComboboxSeparatorProps {
  /** Additional CSS class names. */
  className?: string;
}
