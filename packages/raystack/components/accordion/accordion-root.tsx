'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './accordion.module.css';

type AccordionSingleProps = Omit<
  AccordionPrimitive.Root.Props,
  'multiple' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value?: string) => void;
};

type AccordionMultipleProps = Omit<
  AccordionPrimitive.Root.Props,
  'multiple' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value?: string[]) => void;
};

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

/**
 * Convert the wrapper's `string | string[]` API into Base UI's `string[]` format.
 *
 * Only `undefined` maps to `undefined` (uncontrolled).
 * Empty string and empty array map to `[]` (controlled, nothing open) — this prevents the
 * controlled → uncontrolled flip that would otherwise break reopen-after-close.
 */
const toArray = (v: string | string[] | undefined): string[] | undefined => {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v;
  return v === '' ? [] : [v];
};

export const AccordionRoot = ({
  className,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  ...rest
}: AccordionRootProps) => {
  const handleValueChange = (
    newValue: string[],
    eventDetails: AccordionPrimitive.Root.ChangeEventDetails
  ) => {
    if (!onValueChange) return;

    if (multiple) {
      (onValueChange as (v: string[]) => void)(newValue);
    } else {
      (onValueChange as (v: string) => void)(newValue[0] ?? '');
    }
  };

  return (
    <AccordionPrimitive.Root
      className={cx(styles.accordion, className)}
      multiple={multiple}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={handleValueChange}
      {...rest}
    />
  );
};

AccordionRoot.displayName = 'Accordion';
