'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ChevronDownIcon } from '~/icons/generated';
import styles from './accordion.module.css';

export const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) => (
  <AccordionPrimitive.Header className={styles['accordion-header']}>
    <AccordionPrimitive.Trigger
      className={cx(styles['accordion-trigger'], className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className={styles['accordion-icon']} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

AccordionTrigger.displayName = 'Accordion.Trigger';
