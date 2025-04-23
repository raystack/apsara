export interface SidebarRootProps {
  /** Controls the expanded/collapsed state. */
  open?: boolean;

  /** Callback when expanded/collapsed state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Position of the Sidebar.
   * @default "left"
   */
  position?: "left" | "right";

  /** Hide tooltips on sidebar items when sidebar is collapsed.
   * @default false
   */
  hideCollapsedItemTooltip?: boolean;

  /** Optional profile information. */
  profile?: {
    /** Icon element to display. */
    icon?: React.ReactNode;

    /** Text to display. */
    label?: string;

    /** Optional URL the profile links to. */
    href?: string;

    /** Optional callback for icon click. */
    onIconClick?: () => void;
  };
}

export interface SidebarHeaderProps {
  /** ReactNode for the header icon/logo. */
  logo?: React.ReactNode;

  /** String for the header text. */
  title?: string;

  /** Optional callback for logo click. */
  onLogoClick?: () => void;
}

export interface SidebarGroupProps {
  /** String for the group title. */
  name: string;

  /** Optional ReactNode for group icon. */
  icon?: React.ReactNode;

  /** ReactNode for the group content. */
  children?: React.ReactNode;
}

export interface SidebarItemProps {
  /** ReactNode for the item's icon. */
  icon?: React.ReactNode;

  /** String for the link destination. */
  href?: string;

  /** Boolean to indicate current selection. */
  active?: boolean;

  /** Boolean to disable the item. */
  disabled?: boolean;

  /** ReactNode for the item's label. */
  children?: React.ReactNode;
}
