'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ChevronDownIcon } from '~/icons';
import styles from './accordion.module.css';

export const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) => (
  <AccordionPrimitive.Header
    className={styles['accordion-header']}
    data-slot='accordion-header'
  >
    <AccordionPrimitive.Trigger
      className={cx(styles['accordion-trigger'], className)}
      data-slot='accordion-trigger'
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={styles['accordion-icon']}
        data-slot='accordion-trigger-icon'
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

AccordionTrigger.displayName = 'Accordion.Trigger';
