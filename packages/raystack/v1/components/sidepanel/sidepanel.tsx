import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from "react";
import * as Collapsible from '@radix-ui/react-collapsible';
import { cva } from "class-variance-authority";
import { Tooltip, TooltipProvider } from "../tooltip";

import styles from "./sidepanel.module.css";

const root = cva(styles.root);

interface SidepanelProps extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: 'left' | 'right';
  account?: {
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
  ({ className, position = 'left', open, onOpenChange, children, account, ...props }, ref) => (
    <TooltipProvider>
      <Collapsible.Root
        ref={ref}
        className={root({ className })}
        data-position={position}
        data-state={open ? 'expanded' : 'collapsed'}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      >
        <Tooltip 
          message={open ? "Click to collapse" : "Click to expand"}
          side={position === 'left' ? 'right' : 'left'}
        >
          <div 
            className={styles.resizeHandle}
            onClick={() => onOpenChange?.(!open)}
          />
        </Tooltip>
        {children}
        {account && (
          <a href={account.href} className={styles.account}>
            <span className={styles['nav-icon']}>{account.icon}</span>
            <span className={styles['nav-text']}>{account.label}</span>
          </a>
        )}
      </Collapsible.Root>
    </TooltipProvider>
  )
);

const SidepanelHeader = forwardRef<ElementRef<"div">, SidepanelHeaderProps>(
  ({ className, logo, title, ...props }, ref) => (
    <div ref={ref} className={styles.header} {...props}>
      <div className={styles.logo}>{logo}</div>
      <div className={styles.title}>{title}</div>
    </div>
  )
);

const SidepanelMain = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={styles.main} {...props}>
      {children}
    </div>
  )
);

const SidepanelFooter = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={styles.footer} {...props}>
      {children}
    </div>
  )
);

const SidepanelItem = forwardRef<ElementRef<"a">, SidepanelItemProps>(
  ({ className, icon, children, active, ...props }, ref) => (
    <a ref={ref} className={styles['nav-item']} data-active={active} {...props}>
      <span className={styles['nav-icon']}>{icon}</span>
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
