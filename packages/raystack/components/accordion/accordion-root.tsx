'use client';

import { cx } from 'class-variance-authority';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ElementRef, forwardRef } from 'react';
import styles from './accordion.module.css';

type AccordionSingleProps = Omit<
  AccordionPrimitive.AccordionSingleProps,
  'type'
> & {
  type?: 'single';
};
type AccordionMultipleProps = Omit<
  AccordionPrimitive.AccordionMultipleProps,
  'type'
> & {
  type: 'multiple';
};
export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

export const AccordionRoot = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  AccordionRootProps
>(({ className, type = 'single', ...rest }, ref) => {
  // this is a workaround to properly typecast the union type
  const singleProps = {
    type: 'single',
    collapsible: true,
    ...rest
  } as AccordionPrimitive.AccordionSingleProps;
  const multipleProps = {
    type: 'multiple',
    ...rest
  } as AccordionPrimitive.AccordionMultipleProps;

  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cx(styles.accordion, className)}
      {...(type === 'multiple' ? multipleProps : singleProps)}
    />
  );
});

AccordionRoot.displayName = AccordionPrimitive.Root.displayName;
