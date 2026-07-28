import { ReactElement, ReactNode } from 'react';

export interface SidebarRootProps {
  /** Controls the expanded/collapsed state. */
  open?: boolean;

  /** Callback when expanded/collapsed state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Default expanded/collapsed state.
   * @default true
   */
  defaultOpen?: boolean;

  /** Lets the user collapse and expand the whole sidebar.
   *  Not the same as `collapsible` on `Sidebar.Group`, which renders a group as an accordion.
   * @default true
   */
  collapsible?: boolean;

  /** What the collapsed state looks like.
   *  `"icon"` shrinks to an icon rail and pushes content. `"hidden"` disappears
   *  completely and reveals as a floating panel with a backdrop when opened.
   * @default "icon"
   */
  collapseMode?: 'icon' | 'hidden';

  /** Hovering a collapsed sidebar temporarily reveals it as a floating panel,
   *  without changing the real open state. Reverts on mouse leave. Has no
   *  effect when `collapsible` is false, or while the sidebar is open.
   * @default false
   */
  peekOnHover?: boolean;

  /** Position of the Sidebar.
   * @default "left"
   */
  position?: 'left' | 'right';

  /** Visual style variant of the Sidebar.
   * @default "plain"
   */
  variant?: 'plain' | 'floating' | 'inset';

  /** Hide the tooltips the Sidebar adds to items: the label tooltip when
   *  collapsed, and the full-text tooltip on clipped labels when expanded.
   * @default false
   */
  hideCollapsedItemTooltip?: boolean;

  /** Tooltip shown when hovering the collapse/expand handle.
   *  By default, it shows "Click to collapse" when expanded, "Click to expand" when collapsed
   */
  collapseTooltip?: ReactNode;

  /** @deprecated Renamed to `collapseTooltip`. Still works, but will be
   *  removed in the next major version.
   */
  tooltipMessage?: ReactNode;
}

export interface SidebarGroupProps {
  /** String for the group title. */
  label: string;

  /** Renders the group as an accordion whose items can be shown or hidden.
   *  Not the same as `collapsible` on the Sidebar root, which controls the sidebar's own collapse behavior.
   * @default false
   */
  collapsible?: boolean;

  /** Controls the group's expanded/collapsed state. Only applies when `collapsible` is true. */
  open?: boolean;

  /** Default expanded/collapsed state when uncontrolled. Only applies when `collapsible` is true.
   * @default true
   */
  defaultOpen?: boolean;

  /** Callback when the group's expanded/collapsed state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Optional ReactNode for group icon. */
  leadingIcon?: ReactNode;

  /** Optional ReactNode for a trailing action icon in the group header. */
  trailingIcon?: ReactNode;

  /** ReactNode for the group content. */
  children?: ReactNode;

  /** Optional class names for customizing parts of the group. */
  classNames?: {
    /** Class name for the header row. */
    header?: string;
    /** Class name for the items container. */
    items?: string;
    /** Class name for the label text. */
    label?: string;
    /** Class name for the leading icon container. */
    icon?: string;
    /** Class name for the trigger (when `collapsible`). */
    trigger?: string;
    /** Class name for the chevron (when `collapsible`). */
    chevron?: string;
    /** Class name for the trailing icon container. */
    trailingIcon?: string;
  };
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
  render?: ReactElement;

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

export interface SidebarTriggerProps {
  /** Icon rendered inside the trigger.
   * @default "<ViewVerticalIcon />"
   */
  children?: ReactNode;
}

export interface SidebarMoreProps {
  /** String for the more trigger label. */
  label?: string;

  /** Optional ReactNode for the trigger icon. */
  leadingIcon?: ReactNode;

  /** Sidebar items rendered inside the menu content. */
  children?: ReactNode;

  /** Optional class names for customizing parts of the more trigger/menu. */
  classNames?: {
    /** Class name for the trigger root element. */
    root?: string;
    /** Class name for the leading icon container. */
    leadingIcon?: string;
    /** Class name for the text element. */
    text?: string;
    /** Class name for menu content container. */
    menuContent?: string;
  };
}
