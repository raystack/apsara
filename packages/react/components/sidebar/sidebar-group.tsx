'use client';

import { Accordion as AccordionPrimitive, mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode, useCallback, useState } from 'react';
import { ChevronDownIcon } from '~/icons';
import { Flex } from '../flex';
import styles from './sidebar.module.css';
import { SidebarLeadingVisual } from './sidebar-leading-visual';
import { useSidebarSafe } from './sidebar-root';
import { SidebarTrailingVisual } from './sidebar-trailing-visual';

export interface SidebarGroupProps extends ComponentProps<'section'> {
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
  /** Props for the inner parts. */
  slotProps?: {
    header?: ComponentProps<'div'>;
    items?: ComponentProps<'div'>;
    label?: ComponentProps<'span'>;
    icon?: ComponentProps<'span'>;
    trigger?: ComponentProps<'button'>;
    chevron?: ComponentProps<'svg'>;
    trailingIcon?: ComponentProps<'span'>;
  };
  /** @deprecated Use `slotProps` instead. */
  classNames?: {
    /** @deprecated Use `slotProps.header` instead. */
    header?: string;
    /** @deprecated Use `slotProps.items` instead. */
    items?: string;
    /** @deprecated Use `slotProps.label` instead. */
    label?: string;
    /** @deprecated Use `slotProps.icon` instead. */
    icon?: string;
    /** @deprecated Use `slotProps.trigger` instead. */
    trigger?: string;
    /** @deprecated Use `slotProps.chevron` instead. */
    chevron?: string;
    /** @deprecated Use `slotProps.trailingIcon` instead. */
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
  slotProps,
  classNames,
  children,
  ...props
}: SidebarGroupProps) {
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
        slotProps={slotProps?.icon}
        render={<span />}
      />
      <span
        data-slot='sidebar-group-label'
        {...mergeProps<'span'>(
          { className: cx(styles['nav-group-label'], classNames?.label) },
          slotProps?.label
        )}
      >
        {label}
      </span>
    </>
  );

  const items = (
    <Flex
      direction='column'
      role='list'
      data-slot='sidebar-group-items'
      {...mergeProps<'div'>(
        { className: cx(styles['nav-group-items'], classNames?.items) },
        slotProps?.items
      )}
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
              data-slot='sidebar-group-header'
              {...mergeProps<'h3'>(
                {
                  className: cx(styles['nav-group-header'], classNames?.header)
                },
                slotProps?.header as ComponentProps<'h3'>
              )}
            >
              <AccordionPrimitive.Trigger
                data-slot='sidebar-group-trigger'
                {...mergeProps<'button'>(
                  {
                    className: cx(
                      styles['nav-group-trigger'],
                      classNames?.trigger
                    )
                  },
                  slotProps?.trigger
                )}
              >
                {labelContent}
                <ChevronDownIcon
                  aria-hidden='true'
                  data-slot='sidebar-group-chevron'
                  {...mergeProps<'svg'>(
                    {
                      className: cx(
                        styles['nav-group-chevron'],
                        classNames?.chevron
                      )
                    },
                    slotProps?.chevron
                  )}
                />
              </AccordionPrimitive.Trigger>
              <SidebarTrailingVisual
                trailingIcon={trailingIcon}
                className={classNames?.trailingIcon}
                slotProps={slotProps?.trailingIcon}
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
            data-slot='sidebar-group-header'
            {...mergeProps<'div'>(
              {
                className: cx(
                  styles['nav-group-header'],
                  trailingIcon && styles['nav-group-header-with-trailing'],
                  classNames?.header
                )
              },
              slotProps?.header
            )}
          >
            {labelContent}
            <SidebarTrailingVisual
              trailingIcon={trailingIcon}
              className={classNames?.trailingIcon}
              slotProps={slotProps?.trailingIcon}
            />
          </Flex>
          {items}
        </>
      )}
    </section>
  );
}

SidebarNavigationGroup.displayName = 'Sidebar.Group';
