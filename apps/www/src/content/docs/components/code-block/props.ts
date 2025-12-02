import { ReactNode } from 'react';

export interface CodeBlockProps {
  /**
   * The selected value of the code block to be displayed
   */
  value?: string;

  /**
   * Default value of the code block to be displayed
   */
  defaultValue?: string;

  /**
   * Callback when the value changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Whether to hide line numbers
   * @defaultValue false
   */
  hideLineNumbers?: boolean;

  /**
   * Maximum number of lines to display before collapsing
   * If > 0, the code block can be collapsed
   * @defaultValue 0
   */
  maxLines?: number;

  /**
   * Whether the code block is collapsed
   */
  collapsed?: boolean;

  /**
   * Default collapsed state
   * @defaultValue true
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void;

  /**
   * The code content to display
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockCodeProps {
  /**
   * Programming language for syntax highlighting
   */
  language: string;

  /**
   * The unique value of the code block
   * If not provided, the language will be used as the value
   */
  value?: string;

  /**
   * The code content to display
   */
  children: string;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockHeaderProps {
  /**
   * The content to display in the header
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockContentProps {
  /**
   * The content to display
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockLabelProps {
  /**
   * The label text to display
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockLanguageSelectProps {
  /**
   * Available languages for selection
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockLanguageSelectTriggerProps {
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockCopyButtonProps {
  /**
   * Copy button variant
   * @defaultValue "default"
   */
  variant?: 'floating' | 'default';

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface CodeBlockCollapseTriggerProps {
  /**
   * The text to display on the collapse trigger
   * @defaultValue "Show Code"
   */
  children?: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}
