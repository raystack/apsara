'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './accordion.module.css';

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Panel>,
  AccordionPrimitive.Panel.Props
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Panel
    ref={ref}
    className={styles['accordion-content']}
    {...props}
  >
    <div className={cx(styles['accordion-content-inner'], className)}>
      {children}
    </div>
  </AccordionPrimitive.Panel>
));

AccordionContent.displayName = 'Accordion.Content';
