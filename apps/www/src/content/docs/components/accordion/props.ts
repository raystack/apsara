export interface AccordionRootProps {
  /**
   * Whether multiple  accordion items can be open at the same time.
   * @defaultValue false
   */
  multiple?: boolean;

  /**
   * The controlled value of the accordion.
   * For single mode: string | undefined
   * For multiple mode: string[]
   */
  value?: string | string[];

  /**
   * The default value of the accordion.
   * For single mode: string | undefined
   * For multiple mode: string[]
   */
  defaultValue?: string | string[];

  /**
   * Event handler called when the value changes.
   * For single mode: (value?: string) => void
   * For multiple mode: (value?: string[]) => void
   */
  onValueChange?: (value?: string | string[]) => void;

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
   * Whether to loop keyboard focus back to the first item when the end is reached
   * @defaultValue true
   */
  loopFocus?: boolean;

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
