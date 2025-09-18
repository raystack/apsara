'use client';

import { cx } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef } from 'react';
import styles from './accordion.module.css';

export interface AccordionItemProps
  extends AccordionPrimitive.AccordionItemProps {
  children: ReactNode;
  className?: string;
}

export const AccordionItem = forwardRef<
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

AccordionItem.displayName = AccordionPrimitive.Item.displayName;
