'use client';

import { cx } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, ReactNode, forwardRef } from 'react';
import styles from './accordion.module.css';

export interface AccordionContentProps
  extends AccordionPrimitive.AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export const AccordionContent = forwardRef<
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

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
