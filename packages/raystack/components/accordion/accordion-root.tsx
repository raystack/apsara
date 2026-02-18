'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
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

export const AccordionRoot = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  AccordionRootProps
>(
  (
    {
      className,
      multiple = false,
      value,
      defaultValue,
      onValueChange,
      ...rest
    },
    ref
  ) => {
    // Convert value to array format for Base UI
    const baseValue = value
      ? Array.isArray(value)
        ? value
        : [value]
      : undefined;

    const baseDefaultValue = defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : undefined;

    const handleValueChange = (
      newValue: string[],
      eventDetails: AccordionPrimitive.Root.ChangeEventDetails
    ) => {
      if (onValueChange) {
        if (multiple) {
          (onValueChange as (value: string[]) => void)(newValue);
        } else {
          (onValueChange as (value: string | undefined) => void)(
            newValue[0] || undefined
          );
        }
      }
    };

    return (
      <AccordionPrimitive.Root
        ref={ref}
        className={cx(styles.accordion, className)}
        multiple={multiple}
        value={baseValue}
        defaultValue={baseDefaultValue}
        onValueChange={handleValueChange}
        {...rest}
      />
    );
  }
);

AccordionRoot.displayName = 'Accordion.Root';
