export interface AccordionRootProps<Value = string> {
  /**
   * Whether multiple  accordion items can be open at the same time.
   * @defaultValue false
   */
  multiple?: boolean;

  /**
   * The controlled value of the accordion. `Value` in single mode, `Value[]` with `multiple`.
   *
   * @remarks `Value | Value[]`
   */
  value?: Value | Value[];

  /**
   * The default value of the accordion. `Value` in single mode, `Value[]` with `multiple`.
   *
   * @remarks `Value | Value[]`
   */
  defaultValue?: Value | Value[];

  /**
   * Event handler called when the value changes. In single mode it receives `''` when every item closes.
   *
   * @remarks `(value: Value | '') => void` in single mode, `(value: Value[]) => void` with `multiple`
   */
  onValueChange?: (value: Value | '' | Value[]) => void;

  /**
   * Whether the accordion is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * The orientation of the accordion
   * @defaultValue "vertical"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether to keep the element in the DOM while the panel is closed
   * @defaultValue false
   */
  keepMounted?: boolean;

  /**
   * Allows the browser's built-in page search to find and expand the panel contents
   * @defaultValue false
   */
  hiddenUntilFound?: boolean;

  /** Custom CSS class names */
  className?: string;
}

export interface AccordionItemProps {
  /**
   * A unique value for the item
   */
  value: string;

  /**
   * Whether the item is disabled
   * @defaultValue false
   */
  disabled?: boolean;

  /** Custom CSS class names */
  className?: string;
}

export interface AccordionTriggerProps {
  /** Custom CSS class names */
  className?: string;
}

export interface AccordionContentProps {
  /**
   * Whether to keep the element in the DOM while the panel is closed
   * @defaultValue false
   */
  keepMounted?: boolean;

  /**
   * Allows the browser's built-in page search to find and expand the panel contents
   * @defaultValue false
   */
  hiddenUntilFound?: boolean;

  /** Custom CSS class names */
  className?: string;
}
