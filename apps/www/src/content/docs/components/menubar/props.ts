import { ReactElement } from 'react';

export interface MenubarProps {
  /**
   * Whether the menubar is modal.
   * @defaultValue true
   */
  modal?: boolean;

  /**
   * Whether the whole menubar is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * The orientation of the menubar.
   * @defaultValue "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether to loop keyboard focus back to the first item when the end of the list is reached.
   * @defaultValue true
   */
  loopFocus?: boolean;

  /** Additional CSS class names */
  className?: string;

  /** Replaces the rendered element with a custom one via Base UI's render prop pattern */
  render?: ReactElement;
}
