'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useCallback, useState } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarSafe } from './sidebar-root';
import { SidebarTrailingVisual } from './sidebar-trailing-visual';

/**
 * Free-form slot at the top of the sidebar — an avatar, a workspace switcher,
 * a search box, whatever the header needs to hold. Because its content is
 * arbitrary, it isn't hidden automatically when the sidebar collapses; add
 * `data-collapse-hidden` to any child that should disappear on collapse
 * (e.g. a title next to a leading icon).
 */
export function SidebarHeader({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex align='center' className={cx(styles.header, className)} {...props} />
  );
}
SidebarHeader.displayName = 'Sidebar.Header';

export function SidebarFooter({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      className={cx(styles.footer, className)}
      direction='column'
      role='list'
      aria-label='Footer navigation'
      {...props}
    />
  );
}
SidebarFooter.displayName = 'Sidebar.Footer';

export interface SidebarNavigationGroupProps extends ComponentProps<'section'> {
  label: string;
  /**
   * Renders the group as an accordion whose items can be shown or hidden.
   * Unlike `collapsible` on the Sidebar root, this does not affect the
   * sidebar's own collapse behavior.
   */
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  classNames?: {
    header?: string;
    items?: string;
    label?: string;
    icon?: string;
    trigger?: string;
    chevron?: string;
    trailingIcon?: string;
  };
}

export function SidebarNavigationGroup({
  className,
  label,
  collapsible = false,
  open: providedOpen,
  defaultOpen = true,
  onOpenChange,
  leadingIcon,
  trailingIcon,
  classNames,
  children,
  ...props
}: SidebarNavigationGroupProps) {
  const { isCollapsed } = useSidebarSafe();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isCollapsed || (providedOpen ?? internalOpen);

  const handleOpenChange = useCallback(
    (value: unknown[]) => {
      if (isCollapsed) return;
      const nextOpen = value.length > 0;
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isCollapsed, onOpenChange]
  );

  if (!collapsible) {
    return (
      <section
        className={cx(styles['nav-group'], className)}
        // listitem (not the section's implicit region) so groups are valid
        // children of Sidebar.Main's list, mirroring ul > li > ul nesting.
        role='listitem'
        aria-label={label}
        {...props}
      >
        <Flex
          align='center'
          gap={3}
          className={cx(
            styles['nav-group-header'],
            trailingIcon && styles['nav-group-header-with-trailing'],
            classNames?.header
          )}
        >
          <SidebarLeadingVisual
            leadingIcon={leadingIcon}
            className={classNames?.icon}
            render={<span />}
          />
          <span className={cx(styles['nav-group-label'], classNames?.label)}>
            {label}
          </span>
          <SidebarTrailingVisual
            trailingIcon={trailingIcon}
            className={classNames?.trailingIcon}
          />
        </Flex>
        <Flex
          direction='column'
          className={cx(styles['nav-group-items'], classNames?.items)}
          role='list'
        >
          {children}
        </Flex>
      </section>
    );
  }

  return (
    <section
      className={cx(styles['nav-group'], className)}
      role='listitem'
      aria-label={label}
      {...props}
    >
      <AccordionPrimitive.Root
        className={styles['nav-group-accordion']}
        multiple
        value={isOpen ? [true] : []}
        onValueChange={handleOpenChange}
      >
        <AccordionPrimitive.Item
          value={true}
          className={styles['nav-group-accordion-item']}
        >
          <AccordionPrimitive.Header
            className={cx(styles['nav-group-header'], classNames?.header)}
          >
            <AccordionPrimitive.Trigger
              className={cx(styles['nav-group-trigger'], classNames?.trigger)}
            >
              <SidebarLeadingVisual
                leadingIcon={leadingIcon}
                className={classNames?.icon}
                render={<span />}
              />
              <span
                className={cx(styles['nav-group-label'], classNames?.label)}
              >
                {label}
              </span>
              <TriangleDownIcon
                className={cx(styles['nav-group-chevron'], classNames?.chevron)}
                aria-hidden='true'
              />
            </AccordionPrimitive.Trigger>
            <SidebarTrailingVisual
              trailingIcon={trailingIcon}
              className={classNames?.trailingIcon}
            />
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Panel className={styles['nav-group-panel']}>
            <Flex
              direction='column'
              className={cx(styles['nav-group-items'], classNames?.items)}
              role='list'
            >
              {children}
            </Flex>
          </AccordionPrimitive.Panel>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    </section>
  );
}

SidebarNavigationGroup.displayName = 'Sidebar.Group';
