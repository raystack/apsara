import * as Collapsible from '@radix-ui/react-collapsible';
import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";

import { Tooltip, TooltipProvider } from "../tooltip";
import styles from "./sidebar.module.css";

const root = cva(styles.root);

interface SidebarProps extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: 'left' | 'right';
  profile?: {
    icon: ReactNode;
    label: string;
    href?: string;
    onIconClick?: () => void;
  };
  ref?: ComponentRef<typeof Collapsible.Root>;
}

interface SidebarHeaderProps extends ComponentPropsWithoutRef<"div"> {
  logo: ReactNode;
  title: string;
  onLogoClick?: () => void;
  ref?: ComponentRef<"div">;
}

interface SidebarItemProps extends ComponentPropsWithoutRef<"a"> {
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  ref?: ComponentRef<"a">;
}

interface SidebarFooterProps extends ComponentPropsWithoutRef<"div"> {
  ref?: ComponentRef<"div">;
}

interface SidebarNavigationGroupProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  icon?: ReactNode;
  ref?: ComponentRef<"div">;
}

const SidebarRoot = ({ 
  className, 
  position = 'left', 
  open, 
  onOpenChange, 
  children, 
  profile, 
  ref,
  ...props 
}: SidebarProps) => (
  <TooltipProvider>
    <Collapsible.Root
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className={root({ className })}
      data-position={position}
      data-state={open ? 'expanded' : 'collapsed'}
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
          side={position === 'left' ? 'right' : 'left'}
          asChild
        >
          <div 
            className={styles.resizeHandle}
            onClick={() => onOpenChange?.(!open)}
            role="button"
            tabIndex={0}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenChange?.(!open);
              }
            }}
          />
        </Tooltip>
        {children}
        {profile && (
          <a 
            href={profile.href} 
            className={styles.account}
            role="button"
            aria-label={`Profile: ${profile.label}`}
            onClick={(e) => {
              if (profile.onIconClick) {
                e.preventDefault();
                profile.onIconClick();
              }
            }}
          >
            <span 
              className={styles['nav-icon']} 
              aria-hidden="true"
              style={{ cursor: profile.onIconClick ? 'pointer' : undefined }}
            >
              {profile.icon}
            </span>
            <span className={styles['nav-text']}>{profile.label}</span>
          </a>
        )}
      </aside>
    </Collapsible.Root>
  </TooltipProvider>
);

const SidebarHeader = ({
  className,
  logo,
  title,
  onLogoClick,
  ref,
  ...props
}: SidebarHeaderProps) => (
  <div 
    ref={ref as unknown as React.RefObject<HTMLDivElement>} 
    className={styles.header} 
    role="banner"
    {...props}
  >
    <div 
      className={styles.logo} 
      onClick={onLogoClick}
      role={onLogoClick ? "button" : undefined}
      tabIndex={onLogoClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onLogoClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onLogoClick();
        }
      }}
      style={{ cursor: onLogoClick ? 'pointer' : undefined }}
    >
      {logo}
    </div>
    <div className={styles.title} role="heading" aria-level={1}>{title}</div>
  </div>
);

const SidebarMain = ({
  className,
  children,
  ref,
  ...props
}: ComponentPropsWithoutRef<"div"> & { ref?: ComponentRef<"div"> }) => (
  <div 
    ref={ref as unknown as React.RefObject<HTMLDivElement>} 
    className={styles.main}
    role="group"
    aria-label="Main navigation"
    {...props}
  >
    {children}
  </div>
);

const SidebarFooter = ({
  className,
  children,
  ref,
  ...props
}: SidebarFooterProps) => (
  <div 
    ref={ref as unknown as React.RefObject<HTMLDivElement>} 
    className={styles.footer}
    role="group"
    aria-label="Footer navigation"
    {...props}
  >
    {children}
  </div>
);

const SidebarItem = ({
  className,
  icon,
  children,
  active,
  disabled,
  ref,
  ...props
}: SidebarItemProps) => (
  <a 
    ref={ref as unknown as React.RefObject<HTMLAnchorElement>} 
    className={styles['nav-item']} 
    data-active={active}
    data-disabled={disabled}
    role="menuitem"
    aria-current={active ? "page" : undefined}
    aria-disabled={disabled}
    {...props}
  >
    <span className={styles['nav-icon']} aria-hidden="true">{icon}</span>
    <span className={styles['nav-text']}>{children}</span>
  </a>
);

const SidebarNavigationGroup = ({
  className,
  name,
  icon,
  children,
  ref,
  ...props
}: SidebarNavigationGroupProps) => (
  <section 
    ref={ref as unknown as React.RefObject<HTMLElement>}
    className={className}
    aria-label={name}
    {...props}
  >
    <div className={styles['nav-group-header']}>
      {icon && <span className={styles['nav-icon']}>{icon}</span>}
      <span className={styles['nav-group-name']}>{name}</span>
    </div>
    <div className={styles['nav-group-items']} role="list">
      {children}
    </div>
  </section>
);

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
