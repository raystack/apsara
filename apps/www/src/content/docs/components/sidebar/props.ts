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

  /** Whether the user can collapse the sidebar, and what the collapsed state
   *  looks like. `"icon"` collapses to an icon rail. `"hidden"` collapses to
   *  a thin strip with no visible content. `"none"` prevents collapsing and
   *  hides the resize handle. Expanding always works the same: the sidebar
   *  opens in place and pushes content.
   *  Not the same as `collapsible` on `Sidebar.Group`, which renders a group as an accordion.
   * @default "icon"
   */
  collapsible?: 'icon' | 'hidden' | 'none';

  /** Hovering a collapsed sidebar temporarily reveals it as an overlay above
   *  the content, without changing the real open state. Reverts on mouse
   *  leave. Has no effect when `collapsible` is `"none"`, or while the
   *  sidebar is open.
   * @default false
   */
  peekOnHover?: boolean;

  /** Delay in milliseconds before a hover starts a peek. Only applies when
   *  `peekOnHover` is set.
   * @default 100
   */
  peekDelay?: number;

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
  hideItemTooltips?: boolean;

  /** Tooltip shown when hovering the collapse/expand handle.
   *  By default, it shows "Click to collapse" when expanded, "Click to expand" when collapsed
   */
  collapseTooltip?: ReactNode;
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
}

export interface SidebarTriggerProps {
  /** Icon rendered inside the trigger.
   * @default "<PanelLeftIcon />"
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
    /**
     * Class name for menu content container. Not deprecated: `Menu.Content`
     * portals to `document.body`, so a `[data-slot="menu-content"]` selector
     * can't be scoped to just this instance's dropdown.
     */
    menuContent?: string;
  };
}
