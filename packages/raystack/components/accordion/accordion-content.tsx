'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './accordion.module.css';

export const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) => (
  <AccordionPrimitive.Panel
    className={styles['accordion-content']}
    data-slot='accordion-content'
    {...props}
  >
    <div
      className={cx(styles['accordion-content-body'], className)}
      data-slot='accordion-content-body'
    >
      {children}
    </div>
  </AccordionPrimitive.Panel>
);

AccordionContent.displayName = 'Accordion.Content';
