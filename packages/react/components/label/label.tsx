'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './label.module.css';

export interface LabelProps extends useRender.ComponentProps<'label'> {
  /** Whether the labelled control is required. When `false`, the label shows `optionalText`. */
  required?: boolean;
  /**
   * Text shown next to the label when `required` is `false`.
   * @default "(optional)"
   */
  optionalText?: string;
  /** Text shown next to the label when `required` is `true`. Without it, the label shows no indicator. */
  requiredText?: string;
}

export function Label({
  className,
  required,
  render,
  ref,
  children,
  optionalText = '(optional)',
  requiredText,
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      {required === false && (
        <span className={styles.optional} data-slot='label-indicator'>
          {optionalText}
        </span>
      )}
      {required === true && requiredText && (
        <span className={styles.optional} data-slot='label-indicator'>
          {requiredText}
        </span>
      )}
    </>
  );

  const labelProps = {
    'data-slot': 'label',
    className: cx(styles.label, className),
    children: content
  };

  const element = useRender({
    defaultTagName: 'label',
    ref,
    render,
    props: mergeProps<'label'>(labelProps, props)
  });

  return element;
}

Label.displayName = 'Label';
