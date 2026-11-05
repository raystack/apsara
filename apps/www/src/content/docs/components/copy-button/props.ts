export interface CopyButtonProps {
  /**
   * The text to be copied to the clipboard.
   */
  text: string;

  /**
   * Milliseconds before the check icon changes back. `Infinity` keeps it.
   * @default 1000
   */
  resetTimeout?: number;
}
