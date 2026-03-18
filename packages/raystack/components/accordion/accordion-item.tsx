'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './accordion.module.css';

export const AccordionItem = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Item.Props) => (
  <AccordionPrimitive.Item
    className={cx(styles['accordion-item'], className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
);

AccordionItem.displayName = 'Accordion.Item';
