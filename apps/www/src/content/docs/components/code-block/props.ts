export type CodeBlockRootProps = {
  /**
   * The code content to display
   */
  children: React.ReactNode;

  /**
   * Programming language for syntax highlighting
   * @defaultValue "javascript"
   */
  language?: string;

  /**
   * Whether to show line numbers
   * @defaultValue true
   */
  showLineNumbers?: boolean;

  /**
   * Maximum height of the code block
   */
  maxHeight?: string | number;

  /**
   * Additional CSS class name
   */
  className?: string;
};

export type CodeBlockHeaderProps = {
  /**
   * Label text displayed in the header
   * @defaultValue "Code"
   */
  label?: string;

  /**
   * Current programming language
   * @defaultValue "javascript"
   */
  language?: string;

  /**
   * Available languages for the language switcher
   * @defaultValue ["javascript", "typescript", "python", "java", "css", "html"]
   */
  availableLanguages?: string[];

  /**
   * Callback when language is changed
   */
  onLanguageChange?: (language: string) => void;

  /**
   * The code content to copy
   */
  codeContent?: string;

  /**
   * Whether to show the line wrap toggle button
   * @defaultValue true
   */
  showLineWrapToggle?: boolean;

  /**
   * Whether to show the copy button
   * @defaultValue true
   */
  showCopyButton?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
};

export type CodeBlockContentProps = {
  /**
   * The code content to display
   */
  children: React.ReactNode;

  /**
   * Programming language for syntax highlighting
   * @defaultValue "javascript"
   */
  language?: string;

  /**
   * Whether to show line numbers
   * @defaultValue true
   */
  showLineNumbers?: boolean;

  /**
   * Maximum height of the code block
   */
  maxHeight?: string | number;

  /**
   * Whether to show the copy button
   * @defaultValue true
   */
  showCopyButton?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
};
