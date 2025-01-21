import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from "react";
import * as Collapsible from '@radix-ui/react-collapsible';
import { cva } from "class-variance-authority";
import { Tooltip, TooltipProvider } from "../tooltip";

import styles from "./sidepanel.module.css";

const root = cva(styles.root);

interface SidepanelProps extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: 'left' | 'right';
  profile?: {
    icon: ReactNode;
    label: string;
    href?: string;
  };
}

interface SidepanelHeaderProps extends ComponentPropsWithoutRef<"div"> {
  logo: ReactNode;
  title: string;
}

interface SidepanelItemProps extends ComponentPropsWithoutRef<"a"> {
  icon: ReactNode;
  active?: boolean;
}

const SidepanelRoot = forwardRef<ElementRef<typeof Collapsible.Root>, SidepanelProps>(
  ({ className, position = 'left', open, onOpenChange, children, profile, ...props }, ref) => (
    <TooltipProvider>
      <Collapsible.Root
        ref={ref}
        className={root({ className })}
        data-position={position}
        data-state={open ? 'expanded' : 'collapsed'}
        open={open}
        onOpenChange={onOpenChange}
        aria-label="Navigation Sidebar"
        aria-expanded={open}
        role="navigation"
        {...props}
      >
        <Tooltip 
          message={open ? "Click to collapse" : "Click to expand"}
          side={position === 'left' ? 'right' : 'left'}
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
          >
            <span className={styles['nav-icon']} aria-hidden="true">{profile.icon}</span>
            <span className={styles['nav-text']}>{profile.label}</span>
          </a>
        )}
      </Collapsible.Root>
    </TooltipProvider>
  )
);

const SidepanelHeader = forwardRef<ElementRef<"div">, SidepanelHeaderProps>(
  ({ className, logo, title, ...props }, ref) => (
    <div 
      ref={ref} 
      className={styles.header} 
      role="banner"
      {...props}
    >
      <div className={styles.logo} aria-hidden="true">{logo}</div>
      <div className={styles.title} role="heading" aria-level={1}>{title}</div>
    </div>
  )
);

const SidepanelMain = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
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

const SidepanelFooter = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
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

const SidepanelItem = forwardRef<ElementRef<"a">, SidepanelItemProps>(
  ({ className, icon, children, active, ...props }, ref) => (
    <a 
      ref={ref} 
      className={styles['nav-item']} 
      data-active={active}
      role="menuitem"
      aria-current={active ? "page" : undefined}
      {...props}
    >
      <span className={styles['nav-icon']} aria-hidden="true">{icon}</span>
      <span className={styles['nav-text']}>{children}</span>
    </a>
  )
);

SidepanelRoot.displayName = "Sidepanel.Root";
SidepanelHeader.displayName = "Sidepanel.Header";
SidepanelMain.displayName = "Sidepanel.Main";
SidepanelFooter.displayName = "Sidepanel.Footer";
SidepanelItem.displayName = "Sidepanel.Item";

export const Sidepanel = {
  Root: SidepanelRoot,
  Header: SidepanelHeader,
  Main: SidepanelMain,
  Footer: SidepanelFooter,
  Item: SidepanelItem,
};
