'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef } from 'react';

import { TriangleRightIcon } from '~/icons';
import styles from './accordion.module.css';

const root = cva(styles.accordion);
const item = cva(styles['accordion-item']);
const trigger = cva(styles['accordion-trigger'], {
  variants: {
    size: {
      small: styles['accordion-trigger-small'],
      medium: styles['accordion-trigger-medium'],
      large: styles['accordion-trigger-large']
    }
  },
  defaultVariants: {
    size: 'medium'
  }
});
const content = cva(styles['accordion-content']);

interface CommonAccordionProps {
  children: ReactNode;
  className?: string;
}

interface SingleAccordionProps extends Omit<CommonAccordionProps, 'type'> {
  type: 'single';
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface MultipleAccordionProps extends Omit<CommonAccordionProps, 'type'> {
  type: 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionRootProps = SingleAccordionProps | MultipleAccordionProps;

export interface AccordionItemProps
  extends AccordionPrimitive.AccordionItemProps {
  children: ReactNode;
  className?: string;
}

export interface AccordionTriggerProps
  extends AccordionPrimitive.AccordionTriggerProps,
    VariantProps<typeof trigger> {
  children: ReactNode;
  className?: string;
}

export interface AccordionContentProps
  extends AccordionPrimitive.AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionRootWithRef = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  AccordionRootProps
>((props, ref) => {
  const { className, children, type = 'single', ...restProps } = props;

  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={root({ className })}
      data-slot='accordion'
      type={type}
      {...restProps}
    >
      {children}
    </AccordionPrimitive.Root>
  );
});

const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={item({ className })}
    data-slot='accordion-item'
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
));

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, size, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles['accordion-header']}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={trigger({ size, className })}
      data-slot='accordion-trigger'
      {...props}
    >
      {children}
      <TriangleRightIcon className={styles['accordion-icon']} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={content({ className })}
    data-slot='accordion-content'
    {...props}
  >
    <div className={styles['accordion-content-inner']}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionRootWithRef.displayName = AccordionPrimitive.Root.displayName;
AccordionItem.displayName = AccordionPrimitive.Item.displayName;
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export const Accordion = Object.assign(AccordionRootWithRef, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
});
