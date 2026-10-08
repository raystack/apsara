'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './accordion.module.css';

type AccordionBaseProps<Value> = Omit<
  AccordionPrimitive.Root.Props<Value>,
  'multiple' | 'value' | 'defaultValue' | 'onValueChange'
>;

type AccordionSingleProps<Value> = AccordionBaseProps<Value> & {
  multiple?: false;
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value | '') => void;
};

type AccordionMultipleProps<Value> = AccordionBaseProps<Value> & {
  multiple: true;
  value?: Value[];
  defaultValue?: Value[];
  onValueChange?: (value: Value[]) => void;
};

export type AccordionRootProps<Value = string> =
  | AccordionSingleProps<Value>
  | AccordionMultipleProps<Value>;

/**
 * Convert the wrapper's `Value | Value[]` API into Base UI's `Value[]` format.
 *
 * Only `undefined` maps to `undefined` (uncontrolled).
 * Empty string and empty array map to `[]` (controlled, nothing open), which prevents the
 * controlled → uncontrolled flip that would otherwise break reopen-after-close.
 */
function toArray<Value>(
  v: Value | Value[] | '' | undefined
): Value[] | undefined {
  if (v === undefined) return undefined;
  if (Array.isArray(v)) return v;
  return v === '' ? [] : [v as Value];
}

// Overloads let `multiple` pick the props shape before `Value` is inferred.
export function AccordionRoot<Value = string>(
  props: AccordionSingleProps<Value>
): React.JSX.Element;
export function AccordionRoot<Value = string>(
  props: AccordionMultipleProps<Value>
): React.JSX.Element;
export function AccordionRoot<Value = string>(
  props: AccordionRootProps<Value>
): React.JSX.Element;
export function AccordionRoot<Value = string>({
  className,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  ...rest
}: AccordionRootProps<Value>) {
  const handleValueChange = (newValue: Value[]) => {
    if (!onValueChange) return;

    if (multiple) {
      (onValueChange as (v: Value[]) => void)(newValue);
    } else {
      (onValueChange as (v: Value | '') => void)(newValue[0] ?? '');
    }
  };

  return (
    <AccordionPrimitive.Root<Value>
      className={cx(styles.accordion, className)}
      multiple={multiple}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={handleValueChange}
      data-slot='accordion'
      {...rest}
    />
  );
}

AccordionRoot.displayName = 'Accordion';
