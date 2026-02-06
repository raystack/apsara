'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './accordion.module.css';

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionPrimitive.Trigger.Props
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

AccordionTrigger.displayName = 'Accordion.Trigger';
