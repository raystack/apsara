import { cva, cx } from 'class-variance-authority';
import { Collapsible } from 'radix-ui';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  useContext
} from 'react';
import { Avatar, getAvatarColor } from '../avatar';
import { Flex } from '../flex';
import { Tooltip } from '../tooltip';
import styles from './sidebar.module.css';

interface SidebarContextValue {
  isCollapsed: boolean;
  hideCollapsedItemTooltip?: boolean;
}

const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false
});

const root = cva(styles.root);

interface SidebarProps
  extends ComponentPropsWithoutRef<typeof Collapsible.Root> {
  position?: 'left' | 'right';
  hideCollapsedItemTooltip?: boolean;
  collapsible?: boolean;
}

interface SidebarItemProps extends ComponentPropsWithoutRef<'a'> {
  leadingIcon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  as?: ReactElement;
  classNames?: {
    root?: string;
    leadingIcon?: string;
    text?: string;
  };
}

interface SidebarFooterProps extends ComponentPropsWithoutRef<'div'> {}

interface SidebarNavigationGroupProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  leadingIcon?: ReactNode;
}

const SidebarRoot = forwardRef<
  ComponentRef<typeof Collapsible.Root>,
  SidebarProps
>(
  (
    {
      className,
      position = 'left',
      open,
      onOpenChange,
      hideCollapsedItemTooltip,
      collapsible = true,
      children,
      ...props
    },
    ref
  ) => (
    <SidebarContext.Provider
      value={{ isCollapsed: !open, hideCollapsedItemTooltip }}
    >
      <Tooltip.Provider>
        <Collapsible.Root
          ref={ref}
          className={root({ className })}
          data-position={position}
          data-state={open ? 'expanded' : 'collapsed'}
          data-collapse-disabled={!collapsible}
          open={open}
          onOpenChange={collapsible ? onOpenChange : undefined}
          aria-label='Navigation Sidebar'
          aria-expanded={open}
          role='navigation'
          {...props}
          asChild
        >
          <aside>
            {collapsible && (
              <Tooltip
                message={open ? 'Click to collapse' : 'Click to expand'}
                side={position === 'left' ? 'right' : 'left'}
                asChild
                followCursor
                sideOffset={10}
              >
                <div
                  className={styles.resizeHandle}
                  onClick={() => onOpenChange?.(!open)}
                  role='button'
                  tabIndex={0}
                  aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenChange?.(!open);
                    }
                  }}
                />
              </Tooltip>
            )}
            {children}
          </aside>
        </Collapsible.Root>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  )
);

const SidebarHeader = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => (
  <Flex
    align='center'
    ref={ref}
    className={styles.header}
    role='banner'
    {...props}
  >
    {children}
  </Flex>
));

const SidebarMain = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, children, ...props }, ref) => (
    <Flex
      ref={ref}
      className={styles.main}
      direction='column'
      role='group'
      aria-label='Main navigation'
      {...props}
    >
      {children}
    </Flex>
  )
);

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <Flex
      ref={ref}
      className={styles.footer}
      direction='column'
      role='group'
      aria-label='Footer navigation'
      {...props}
    >
      {children}
    </Flex>
  )
);

const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  (
    {
      classNames,
      leadingIcon,
      children,
      active,
      disabled,
      as = <a />,
      ...props
    },
    ref
  ) => {
    const { isCollapsed, hideCollapsedItemTooltip } =
      useContext(SidebarContext); // To prevent prop drillng

    const content = cloneElement(
      as,
      {
        ref,
        className: cx(styles['nav-item'], classNames?.root),
        'data-active': active,
        'data-disabled': disabled,
        role: 'menuitem',
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': disabled,
        ...props
      },
      <>
        <Flex
          align='center'
          gap={3}
          className={cx(styles['nav-leading-icon'], classNames?.leadingIcon)}
          aria-hidden='true'
        >
          {leadingIcon ||
            (typeof children === 'string' && children.length > 0 ? (
              <Avatar
                size={1}
                variant='soft'
                color={getAvatarColor(children)}
                fallback={children[0].toUpperCase()}
                style={{ cursor: 'pointer' }}
              />
            ) : null)}
        </Flex>
        {!isCollapsed && <span className={styles['nav-text']}>{children}</span>}
      </>
    );

    if (isCollapsed && !hideCollapsedItemTooltip) {
      return (
        <Tooltip message={children} side='right'>
          {content}
        </Tooltip>
      );
    }

    return content;
  }
);

const SidebarNavigationGroup = forwardRef<
  HTMLElement,
  SidebarNavigationGroupProps
>(({ className, label, leadingIcon, children, ...props }, ref) => (
  <section
    ref={ref}
    className={cx(styles['nav-group'], className)}
    aria-label={label}
    {...props}
  >
    <Flex align='center' gap={3} className={styles['nav-group-header']}>
      {leadingIcon && (
        <span className={styles['nav-leading-icon']}>{leadingIcon}</span>
      )}
      <span className={styles['nav-group-label']}>{label}</span>
    </Flex>
    <Flex direction='column' className={styles['nav-group-items']} role='list'>
      {children}
    </Flex>
  </section>
));

SidebarRoot.displayName = 'Sidebar.Root';
SidebarHeader.displayName = 'Sidebar.Header';
SidebarMain.displayName = 'Sidebar.Main';
SidebarFooter.displayName = 'Sidebar.Footer';
SidebarItem.displayName = 'Sidebar.Item';
SidebarNavigationGroup.displayName = 'Sidebar.Group';

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Main: SidebarMain,
  Footer: SidebarFooter,
  Item: SidebarItem,
  Group: SidebarNavigationGroup
});
