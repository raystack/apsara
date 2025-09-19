'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef } from 'react';
import styles from './accordion.module.css';

export interface AccordionTriggerProps
  extends AccordionPrimitive.AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

export const AccordionTrigger = forwardRef<
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

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
