export interface AccordionRootProps {
  /**
   * Controls how many accordion items can be open at once.
   * - "single": Only one item can be open at a time
   * - "multiple": Multiple items can be open simultaneously
   * @defaultValue "single"
   */
  type?: 'single' | 'multiple';

  /**
   * The controlled value of the accordion
   */
  value?: string | string[];

  /**
   * The default value of the accordion
   */
  defaultValue?: string | string[];

  /**
   * Event handler called when the value changes
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * Whether the accordion is collapsible when type is single
   * @defaultValue true
   */
  collapsible?: boolean;

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
   * The direction of the accordion
   * @defaultValue "ltr"
   */
  dir?: 'ltr' | 'rtl';

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
   * Whether the content is force mounted
   * @defaultValue false
   */
  forceMount?: boolean;

  /** Custom CSS class names */
  className?: string;
}
