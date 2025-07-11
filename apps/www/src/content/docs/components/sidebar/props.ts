import { ReactElement, ReactNode } from 'react';

export interface SidebarRootProps {
  /** Controls the expanded/collapsed state. */
  open?: boolean;

  /** Callback when expanded/collapsed state changes. */
  onOpenChange?: (open: boolean) => void;

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
}

export interface SidebarHeaderIconProps {
  /** Click handler for the icon. */
  onClick?: () => void;

  /** Icon element to display. */
  children: ReactNode;

  /** Use a custom element as the root node.
   * @default false
   */
  asChild?: boolean;
}

export interface SidebarTitleProps {
  /** Title text or element. */
  children: ReactNode;

  /** Use a custom element as the root node.
   * @default false
   */
  asChild?: boolean;
}

export interface SidebarGroupProps {
  /** String for the group title. */
  name: string;

  /** Optional ReactNode for group icon. */
  leadingIcon?: ReactNode;

  /** ReactNode for the group content. */
  children?: ReactNode;
}

export interface SidebarItemProps {
  /** ReactNode for the item's icon. */
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
