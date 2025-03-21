import * as Collapsible from "@radix-ui/react-collapsible";
import { cva } from "class-variance-authority";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  ReactNode,
  createContext,
  useContext
} from "react";

import { Tooltip, TooltipProvider } from "../tooltip";
import styles from "./sidebar.module.css";
import clsx from "clsx";

interface SidebarContextValue {
  isCollapsed: boolean;
  hideCollapsedItemTooltip?: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({ isCollapsed: false });

const root = cva(styles.root);

interface SidebarProps
  extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: "left" | "right";
  hideCollapsedItemTooltip?: boolean;
}

interface SidebarHeaderProps extends ComponentPropsWithoutRef<"div"> {
  logo: ReactNode;
  title: string;
  onLogoClick?: () => void;
}

interface SidebarItemProps extends ComponentPropsWithoutRef<"a"> {
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  classNames?: {
    root?: string;
    icon?: string;
    text?: string;
  };
}

interface SidebarFooterProps extends ComponentPropsWithoutRef<"div"> {}

interface SidebarNavigationGroupProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  icon?: ReactNode;
}

const SidebarRoot = forwardRef<
  ComponentRef<typeof Collapsible.Root>,
  SidebarProps
>(
  (
    { className, position = "left", open, onOpenChange, hideCollapsedItemTooltip, children, ...props },
    ref
  ) => (
    <SidebarContext.Provider value={{ isCollapsed: !open, hideCollapsedItemTooltip }}>
      <TooltipProvider>
        <Collapsible.Root
          ref={ref}
          className={root({ className })}
          data-position={position}
          data-state={open ? "expanded" : "collapsed"}
          open={open}
          onOpenChange={onOpenChange}
          aria-label="Navigation Sidebar"
          aria-expanded={open}
          role="navigation"
          {...props}
          asChild
        >
          <aside>
            <Tooltip
              message={open ? "Click to collapse" : "Click to expand"}
              side={position === "left" ? "right" : "left"}
              asChild
            >
              <div
                className={styles.resizeHandle}
                onClick={() => onOpenChange?.(!open)}
                role="button"
                tabIndex={0}
                aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenChange?.(!open);
                  }
                }}
              />
            </Tooltip>
            {children}
          </aside>
        </Collapsible.Root>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
);

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, logo, title, onLogoClick, ...props }, ref) => (
    <div ref={ref} className={styles.header} role="banner" {...props}>
      <div
        className={styles.logo}
        onClick={onLogoClick}
        role={onLogoClick ? "button" : undefined}
        tabIndex={onLogoClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onLogoClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onLogoClick();
          }
        }}
        style={{ cursor: onLogoClick ? "pointer" : undefined }}
      >
        {logo}
      </div>
      <div className={styles.title} role="heading" aria-level={1}>
        {title}
      </div>
    </div>
  )
);

const SidebarMain = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={styles.main}
      role="group"
      aria-label="Main navigation"
      {...props}
    >
      {children}
    </div>
  )
);

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={styles.footer}
      role="group"
      aria-label="Footer navigation"
      {...props}
    >
      {children}
    </div>
  )
);

const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ classNames, icon, children, active, disabled, ...props }, ref) => {
    const { isCollapsed, hideCollapsedItemTooltip } = useContext(SidebarContext);// To prevent prop drillng
    
    const itemContent = (
      <a
        ref={ref}
        className={clsx(styles["nav-item"], classNames?.root)}
        data-active={active}
        data-disabled={disabled}
        role="menuitem"
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled}
        {...props}
      >
        <span
          className={clsx(styles["nav-icon"], classNames?.icon)}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className={styles["nav-text"]}>{children}</span>
      </a>
    );

    return (isCollapsed && !hideCollapsedItemTooltip) ? (
      <Tooltip message={children} side="right">
        {itemContent}
      </Tooltip>
    ) : itemContent;
  }
);

const SidebarNavigationGroup = forwardRef<
  HTMLElement,
  SidebarNavigationGroupProps
>(({ className, name, icon, children, ...props }, ref) => (
  <section ref={ref} className={className} aria-label={name} {...props}>
    <div className={styles["nav-group-header"]}>
      {icon && <span className={styles["nav-icon"]}>{icon}</span>}
      <span className={styles["nav-group-name"]}>{name}</span>
    </div>
    <div className={styles["nav-group-items"]} role="list">
      {children}
    </div>
  </section>
));

SidebarRoot.displayName = "Sidebar.Root";
SidebarHeader.displayName = "Sidebar.Header";
SidebarMain.displayName = "Sidebar.Main";
SidebarFooter.displayName = "Sidebar.Footer";
SidebarItem.displayName = "Sidebar.Item";
SidebarNavigationGroup.displayName = "Sidebar.Group";

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Main: SidebarMain,
  Footer: SidebarFooter,
  Item: SidebarItem,
  Group: SidebarNavigationGroup,
});
