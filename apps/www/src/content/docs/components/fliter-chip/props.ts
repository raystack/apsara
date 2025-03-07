export interface FilterChipProps {
  /** Text label for the filter (required) */
  label: string;

  /** Current value of the filter */
  value?: string;

  /** Type of input for the filter (default: "text") */
  columnType?: "select" | "date" | "text";

  /** Array of options for the select type input */
  options?: { label: string; value: string }[];

  /** Callback when the filter value changes */
  onValueChange?: (value: string) => void;

  /** Callback when the filter operation changes */
  onOperationChange?: (operation: string) => void;

  /** Icon element to display before the label */
  leadingIcon?: React.ReactNode;

  /** Callback to remove the filter chip */
  onRemove?: () => void;

  /** Additional CSS class names */
  className?: string;
}
