'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './accordion.module.css';

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  AccordionPrimitive.Item.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cx(styles['accordion-item'], className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
));

AccordionItem.displayName = 'Accordion.Item';
