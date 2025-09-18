'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef } from 'react';
import styles from './accordion.module.css';

type AccordionSingleProps = Omit<
  AccordionPrimitive.AccordionSingleProps,
  'type'
> & {
  type?: 'single';
};
type AccordionMultipleProps = Omit<
  AccordionPrimitive.AccordionMultipleProps,
  'type'
> & {
  type: 'multiple';
};
export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps
  extends AccordionPrimitive.AccordionItemProps {
  children: ReactNode;
  className?: string;
}

export interface AccordionTriggerProps
  extends AccordionPrimitive.AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface AccordionContentProps
  extends AccordionPrimitive.AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionRoot = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  AccordionRootProps
>(({ className, type = 'single', ...rest }, ref) => {
  // this is a workaround to properly typecast the union type
  const singleProps = {
    type: 'single',
    collapsible: true,
    ...rest
  } as AccordionPrimitive.AccordionSingleProps;
  const multipleProps = {
    type: 'multiple',
    ...rest
  } as AccordionPrimitive.AccordionMultipleProps;

  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cx(styles.accordion, className)}
      {...(type === 'multiple' ? multipleProps : singleProps)}
    />
  );
});

const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cx(styles['accordion-item'], className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
));

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles['accordion-header']}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cx(styles['accordion-trigger'], className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className={styles['accordion-icon']} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={styles['accordion-content']}
    {...props}
  >
    <div className={cx(styles['accordion-content-inner'], className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));

AccordionRoot.displayName = AccordionPrimitive.Root.displayName;
AccordionItem.displayName = AccordionPrimitive.Item.displayName;
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent
});
