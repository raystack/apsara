import { ReactElement, ReactNode } from 'react';

export interface SidebarRootProps {
  /** Controls the expanded/collapsed state. */
  open?: boolean;

  /** Callback when expanded/collapsed state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Default expanded/collapsed state.*/
  defaultOpen?: boolean;

  /** Disable the click to collapse/expand the Sidebar.
   * @default undefined
   */
  collapsible?: boolean;

  /** Position of the Sidebar.
   * @default "left"
   */
  position?: 'left' | 'right';

  /** Hide tooltips on sidebar items when sidebar is collapsed.
   * @default false
   */
  hideCollapsedItemTooltip?: boolean;

  /** Custom message for the collapsible tooltip.
   *  By default, it shows "Click to collapse" when expanded, "Click to expand" when collapsed
   */
  tooltipMessage?: ReactNode;
}

export interface SidebarGroupProps {
  /** String for the group title. */
  label: string;

  /** Optional ReactNode for group icon. */
  leadingIcon?: ReactNode;

  /** ReactNode for the group content. */
  children?: ReactNode;
}

export interface SidebarItemProps {
  /**
   * ReactNode for the item's icon.
   *
   * If not provided, the component will show a fallback avatar only in collapsed state.
   */
  leadingIcon?: ReactNode;

  /** String for the link destination. */
  href?: string;

  /** Boolean to indicate current selection. */
  active?: boolean;

  /** Boolean to disable the item. */
  disabled?: boolean;

  /** ReactNode for the item's label. */
  children?: ReactNode;

  /**
   * Custom element used to render the SidebarItem.
   *
   * All props are forwarded to the specified element.
   *
   * @default "<a />"
   */
  as?: ReactElement;

  /** Optional class names for customizing parts of the item. */
  classNames?: {
    /** Class name for the root element. */
    root?: string;
    /** Class name for the leading icon container. */
    leadingIcon?: string;
    /** Class name for the text element. */
    text?: string;
  };
}
