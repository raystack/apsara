'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useCallback, useState } from 'react';
import { ChevronDownIcon } from '~/icons';
import { Flex } from '../flex';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarSafe } from './sidebar-root';
import { SidebarTrailingVisual } from './sidebar-trailing-visual';

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
  /** @deprecated Every key here has an equivalent `[data-slot]` — see the Slots table in the Sidebar docs. */
  classNames?: {
    /** @deprecated Use `[data-slot="sidebar-group-header"]` instead. */
    header?: string;
    /** @deprecated Use `[data-slot="sidebar-group-items"]` instead. */
    items?: string;
    /** @deprecated Use `[data-slot="sidebar-group-label"]` instead. */
    label?: string;
    /** @deprecated Use `[data-slot="sidebar-leading-icon"]` instead. */
    icon?: string;
    /** @deprecated Use `[data-slot="sidebar-group-trigger"]` instead. */
    trigger?: string;
    /** @deprecated Use `[data-slot="sidebar-group-chevron"]` instead. */
    chevron?: string;
    /** @deprecated Use `[data-slot="sidebar-trailing-icon"]` instead. */
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

  const labelContent = (
    <>
      <SidebarLeadingVisual
        leadingIcon={leadingIcon}
        className={classNames?.icon}
        render={<span />}
      />
      <span
        className={cx(styles['nav-group-label'], classNames?.label)}
        data-slot='sidebar-group-label'
      >
        {label}
      </span>
    </>
  );

  const items = (
    <Flex
      direction='column'
      className={cx(styles['nav-group-items'], classNames?.items)}
      role='list'
      data-slot='sidebar-group-items'
    >
      {children}
    </Flex>
  );

  return (
    <section
      className={cx(styles['nav-group'], className)}
      // listitem (not the section's implicit region) so groups are valid
      // children of Sidebar.Main's list, mirroring ul > li > ul nesting.
      role='listitem'
      aria-label={label}
      data-slot='sidebar-group'
      {...props}
    >
      {collapsible ? (
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
              data-slot='sidebar-group-header'
            >
              <AccordionPrimitive.Trigger
                className={cx(styles['nav-group-trigger'], classNames?.trigger)}
                data-slot='sidebar-group-trigger'
              >
                {labelContent}
                <ChevronDownIcon
                  className={cx(
                    styles['nav-group-chevron'],
                    classNames?.chevron
                  )}
                  aria-hidden='true'
                  data-slot='sidebar-group-chevron'
                />
              </AccordionPrimitive.Trigger>
              <SidebarTrailingVisual
                trailingIcon={trailingIcon}
                className={classNames?.trailingIcon}
              />
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Panel
              className={styles['nav-group-panel']}
              data-slot='sidebar-group-panel'
            >
              {items}
            </AccordionPrimitive.Panel>
          </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
      ) : (
        <>
          <Flex
            align='center'
            gap={3}
            className={cx(
              styles['nav-group-header'],
              trailingIcon && styles['nav-group-header-with-trailing'],
              classNames?.header
            )}
            data-slot='sidebar-group-header'
          >
            {labelContent}
            <SidebarTrailingVisual
              trailingIcon={trailingIcon}
              className={classNames?.trailingIcon}
            />
          </Flex>
          {items}
        </>
      )}
    </section>
  );
}

SidebarNavigationGroup.displayName = 'Sidebar.Group';
