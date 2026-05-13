'use client';

import {
  Accordion as AccordionPrimitive,
  type AccordionRootProps
} from '@base-ui/react';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useContext } from 'react';
import { Flex } from '../flex';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { SidebarContext } from './sidebar-root';
import { SidebarTrailingVisual } from './sidebar-trailing-visual';

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

export interface SidebarNavigationGroupProps
  extends ComponentProps<'section'>,
    Pick<
      AccordionRootProps,
      'value' | 'defaultValue' | 'onValueChange' | 'disabled'
    > {
  label: string;
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
  defaultValue,
  onValueChange,
  disabled,
  collapsible = false,
  leadingIcon,
  trailingIcon,
  classNames,
  children,
  ...props
}: SidebarNavigationGroupProps) {
  const { isCollapsed } = useContext(SidebarContext);
  const groupValue = label;

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
      aria-label={label}
      {...props}
    >
      <AccordionPrimitive.Root
        key={isCollapsed ? 'collapsed' : 'expanded'}
        className={styles['nav-group-accordion']}
        multiple
        disabled={disabled}
        {...(value !== undefined
          ? { value, onValueChange }
          : { defaultValue: defaultValue ?? [groupValue] })}
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
