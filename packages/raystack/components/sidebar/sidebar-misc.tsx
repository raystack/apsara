'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useContext } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';
import { SidebarContext } from './sidebar-root';

export function SidebarHeader({
  className,
  ...props
}: ComponentProps<typeof Flex>) {
  return (
    <Flex
      align='center'
      className={cx(styles.header, className)}
      role='banner'
      {...props}
    />
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
  value?: string;
  collapsible?: boolean;
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
  value,
  collapsible = false,
  leadingIcon,
  trailingIcon,
  classNames,
  children,
  ...props
}: SidebarNavigationGroupProps) {
  const { isCollapsed } = useContext(SidebarContext);
  const groupValue = value ?? label;

  if (!collapsible) {
    return (
      <section
        className={cx(styles['nav-group'], className)}
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
          {leadingIcon && (
            <span className={cx(styles['nav-leading-icon'], classNames?.icon)}>
              {leadingIcon}
            </span>
          )}
          <span className={cx(styles['nav-group-label'], classNames?.label)}>
            {label}
          </span>
          {trailingIcon ? (
            <span
              className={cx(
                styles['nav-group-trailing-icon'],
                classNames?.trailingIcon
              )}
            >
              {trailingIcon}
            </span>
          ) : null}
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
      aria-label={label}
      {...props}
    >
      <AccordionPrimitive.Root
        key={isCollapsed ? 'collapsed' : 'expanded'}
        className={styles['nav-group-accordion']}
        multiple
        defaultValue={[groupValue]}
      >
        <AccordionPrimitive.Item
          value={groupValue}
          className={styles['nav-group-accordion-item']}
        >
          <AccordionPrimitive.Header
            className={cx(styles['nav-group-header'], classNames?.header)}
          >
            <AccordionPrimitive.Trigger
              className={cx(styles['nav-group-trigger'], classNames?.trigger)}
            >
              {leadingIcon && (
                <span
                  className={cx(styles['nav-leading-icon'], classNames?.icon)}
                >
                  {leadingIcon}
                </span>
              )}
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
            {trailingIcon ? (
              <span
                className={cx(
                  styles['nav-group-trailing-icon'],
                  classNames?.trailingIcon
                )}
              >
                {trailingIcon}
              </span>
            ) : null}
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
