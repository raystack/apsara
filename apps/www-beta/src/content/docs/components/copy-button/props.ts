export interface CopyButtonProps {
  /**
   * The text to be copied to the clipboard.
   */
  text: string;

  /**
   * Time in milliseconds before reverting to the default icon.
   * @default 1000
   */
  resetTimeout?: number;

  /**
   * Whether to reset to the default icon after copying.
   * @default true
   */
  resetIcon?: boolean;
}
